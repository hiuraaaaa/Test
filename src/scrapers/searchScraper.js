const BaseScraper = require('./baseScraper');
const config = require('../config');

class SearchScraper extends BaseScraper {
  async scrape(keyword, page = 1) {
    let url = `${config.baseUrl}/?s=${encodeURIComponent(keyword)}&post_type=anime`;
    if (page > 1) {
      url = `${config.baseUrl}/page/${page}/?s=${encodeURIComponent(keyword)}&post_type=anime`;
    }

    const $ = await this.getCheerio(url);
    const results = [];

    $('.result li').each((i, el) => {
      const title = $(el).find('h2 a').text().trim();
      const postUrl = $(el).find('h2 a').attr('href');
      const thumbnail = $(el).find('img').attr('src');
      
      results.push({
        title,
        url: postUrl,
        thumbnail
      });
    });

    const hasNext = $('.pagination .next').length > 0;

    return {
      keyword,
      page: parseInt(page),
      hasNext,
      results
    };
  }
}

module.exports = new SearchScraper();
