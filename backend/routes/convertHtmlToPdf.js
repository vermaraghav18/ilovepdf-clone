const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', async (req, res) => {
  const { html } = req.body;

  if (!html || typeof html !== 'string') {
    return res.status(400).send('Invalid HTML or URL input.');
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();

    if (/^https?:\/\//i.test(html.trim())) {
      await page.goto(html, { waitUntil: 'networkidle2' });
    } else {
      await page.setContent(html);
    }

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const outputPath = path.join(__dirname, '../uploads', `html_${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, pdfBuffer);
    res.download(outputPath);
  } catch (error) {
    res.status(500).send('Failed to convert HTML to PDF');
  }
});

module.exports = router;
