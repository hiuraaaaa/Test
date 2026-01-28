const NodeCache = require('node-cache');
const config = require('../config');

const cache = new NodeCache({ stdTTL: config.cacheTTL });

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value) => cache.set(key, value),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll()
};
