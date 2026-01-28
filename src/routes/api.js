const express = require('express');
const router = express.Router();
const exploreScraper = require('../scrapers/exploreScraper');
const searchScraper = require('../scrapers/searchScraper');
const detailScraper = require('../scrapers/detailScraper');
const episodeScraper = require('../scrapers/episodeScraper');
const { request } = require('../utils/httpClient');

router.get('/explore', async (req, res) => {
  try {
    const { page, cat } = req.query;
    const data = await exploreScraper.scrape(page, cat);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { keyword, page } = req.query;
    if (!keyword) return res.status(400).json({ success: false, message: 'Keyword is required' });
    const data = await searchScraper.scrape(keyword, page);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/detail', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });
    const data = await detailScraper.scrape(url);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/episode', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });
    const data = await episodeScraper.scrape(url);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/proxy/thumbnail', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL is required');
    
    const response = await request(url, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
