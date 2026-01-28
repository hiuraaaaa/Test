const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const logger = require('./logger');

chromium.use(stealth);

async function getBrowserContent(url) {
  let browser;
  try {
    logger.info(`Launching browser for: ${url}`);
    browser = await chromium.launch({ 
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--disable-dev-shm-usage'
      ]
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      hasTouch: false,
      javaScriptEnabled: true,
    });
    const page = await context.newPage();
    
    // Mask webdriver
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    logger.info(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for Cloudflare challenge to pass if any
    try {
      await page.waitForSelector('.eropost, .anime-title, .entry-title', { timeout: 15000 });
    } catch (e) {
      logger.warn('Timeout waiting for specific selectors, taking whatever content is available.');
      // If blocked, wait a bit more for manual solving or slow load
      await page.waitForTimeout(5000);
    }
    
    const content = await page.content();
    await browser.close();
    return content;
  } catch (error) {
    logger.error(`Browser fallback error: ${error.message}`);
    if (browser) await browser.close();
    throw error;
  }
}

module.exports = { getBrowserContent };
