const express = require('express');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes/api');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'Nekopoi Scraper API',
    version: '1.0.0',
    endpoints: [
      '/api/explore',
      '/api/search',
      '/api/detail',
      '/api/episode',
      '/api/proxy/thumbnail'
    ]
  });
});

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
