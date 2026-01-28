const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const config = require('../config');
const logger = require('./logger');

async function request(url, options = {}) {
  const ua = config.userAgents[Math.floor(Math.random() * config.userAgents.length)];
  const proxy = config.proxies.length > 0 ? config.proxies[Math.floor(Math.random() * config.proxies.length)] : null;
  
  const axiosConfig = {
    url,
    method: options.method || 'GET',
    headers: {
      'User-Agent': ua,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      ...options.headers
    },
    timeout: 15000,
    ...options
  };

  if (proxy) {
    axiosConfig.httpsAgent = new HttpsProxyAgent(proxy);
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await axios(axiosConfig);
      return response;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      const delay = (3 - retries) * 2000;
      logger.warn(`Request failed, retrying in ${delay}ms... (${error.message})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = { request };
