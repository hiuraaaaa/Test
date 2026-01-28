const cheerio = require('cheerio');
const { request } = require('../utils/httpClient');
const { getBrowserContent } = require('../utils/browserFallback');
const cache = require('../utils/cache');
const logger = require('../utils/logger');
const PQueue = require('p-queue').default;
const config = require('../config');

const queue = new PQueue(config.queueOptions);

class BaseScraper {
  async getCheerio(url) {
    const cached = cache.get(url);
    if (cached) {
      logger.info(`Cache hit: ${url}`);
      return cheerio.load(cached);
    }

    return queue.add(async () => {
      try {
        logger.info(`Fetching: ${url}`);
        const response = await request(url);
        
        // Check if blocked by Cloudflare (including Error 1005)
        if (response.data.includes('cf-browser-verification') || 
            response.data.includes('Just a moment...') || 
            response.data.includes('Error 1005') ||
            response.data.includes('Access denied')) {
          throw new Error('Cloudflare detected (Access Denied/1005)');
        }

        cache.set(url, response.data);
        return cheerio.load(response.data);
      } catch (error) {
        logger.warn(`HTTP failed or blocked, trying browser fallback: ${error.message}`);
        try {
          const content = await getBrowserContent(url);
          cache.set(url, content);
          // Add a small random delay after browser success to avoid rapid fire
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
          return cheerio.load(content);
        } catch (browserError) {
          logger.error(`All methods failed for ${url}: ${browserError.message}`);
          throw browserError;
        }
      }
    });
  }
}

module.exports = BaseScraper;
