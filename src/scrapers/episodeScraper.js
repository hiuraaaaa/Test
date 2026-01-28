const BaseScraper = require('./baseScraper');

class EpisodeScraper extends BaseScraper {
  async scrape(url) {
    const $ = await this.getCheerio(url);
    
    const title = $('.entry-title').text().trim();
    const chapterUrl = $('.list-episode a').attr('href');
    
    const download = {};
    $('.dl-box').each((i, el) => {
      const resolution = $(el).find('.res').text().trim();
      const links = {};
      $(el).find('a').each((j, linkEl) => {
        const host = $(linkEl).text().trim();
        const href = $(linkEl).attr('href');
        links[host] = href;
      });
      download[resolution] = links;
    });

    const stream = [];
    // Nekopoi often uses iframe or specific stream buttons
    $('#stream-list li, .stream-button').each((i, el) => {
      const name = $(el).text().trim() || `Stream ${i+1}`;
      const id = $(el).attr('data-id') || $(el).attr('data-video');
      const url = $(el).find('a').attr('href') || '';
      stream.push({ name, id, url });
    });

    // Fallback: look for iframes
    if (stream.length === 0) {
      $('iframe').each((i, el) => {
        const src = $(el).attr('src');
        if (src && (src.includes('stream') || src.includes('embed'))) {
          stream.push({ name: `Embed ${i+1}`, url: src });
        }
      });
    }

    return {
      title,
      url,
      chapterUrl,
      download,
      stream
    };
  }
}

module.exports = new EpisodeScraper();
