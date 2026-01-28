const BaseScraper = require('./baseScraper');

class DetailScraper extends BaseScraper {
  async scrape(url) {
    const $ = await this.getCheerio(url);
    
    const title = $('.anime-title').text().trim() || $('.entry-title').text().trim() || $('h1').first().text().trim();
    const thumbnail = $('.thumb img').attr('src') || $('.img-eropost img').attr('src');
    const sinopsis = $('.sinopsis p').text().trim() || $('.entry-content p').first().text().trim() || $('.desc').text().trim();
    
    const info = {};
    $('.info-anime .info-content .info-item').each((i, el) => {
      const key = $(el).find('b').text().replace(':', '').trim().toLowerCase();
      const value = $(el).find('span').text().trim();
      info[key] = value;
    });

    const genres = [];
    $('.genre-info a').each((i, el) => {
      genres.push($(el).text().trim());
    });

    const episodes = [];
    $('.episodelist ul li').each((i, el) => {
      const epTitle = $(el).find('a').text().trim();
      const epUrl = $(el).find('a').attr('href');
      const epDate = $(el).find('.date').text().trim();
      episodes.push({ title: epTitle, url: epUrl, date: epDate });
    });

    return {
      title,
      url,
      thumbnail,
      sinopsis,
      genres,
      producers: info['producers'] || info['produser'] || '',
      duration: info['duration'] || info['durasi'] || '',
      uploadDate: info['released'] || info['rilis'] || '',
      episodes
    };
  }
}

module.exports = new DetailScraper();
