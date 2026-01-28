const BaseScraper = require('./baseScraper');
const config = require('../config');

class ExploreScraper extends BaseScraper {
  async scrape(page = 1, category = '') {
    let url = `${config.baseUrl}`;
    if (category) {
      url = `${config.baseUrl}/category/${category}`;
    }
    if (page > 1) {
      url += `/page/${page}`;
    }

    const $ = await this.getCheerio(url);
    const results = [];

    const items = $('.eropost').length > 0 ? $('.eropost') : $('.result li');
    items.each((i, el) => {
      const title = $(el).find('h2 a').text().trim() || $(el).find('h3 a').text().trim();
      const postUrl = $(el).find('a').first().attr('href');
      const thumbnail = $(el).find('img').attr('src');
      const categoryTag = $(el).find('.category').text().trim() || '';
      const uploadDate = $(el).find('.date').text().trim() || '';

      if (title && postUrl) {
        results.push({
          title,
          url: postUrl,
          thumbnail,
          category: categoryTag,
          uploadDate
        });
      }
    });

    const hasNext = $('.pagination .next').length > 0;
    
    return {
      page: parseInt(page),
      hasNext,
      results
    };
  }
}

module.exports = new ExploreScraper();
