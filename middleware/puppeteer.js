const express = require('express');
const puppeteer = require('puppeteer');

async function readPDFWithPuppeteer(pdfURL) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    await page.setDefaultNavigationTimeout(0); // Set to 0 for no timeout, or adjust as needed

    // Navigate to the PDF URL
    await page.goto(pdfURL, { waitUntil: 'networkidle0' });

    // Get the PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error reading PDF with Puppeteer:', error);
    await browser.close();
    throw error;
  }
}

module.exports = readPDFWithPuppeteer
// // Usage
// const pdfURL = 'https://example.com/your-pdf-url.pdf'; // Replace with your PDF URL
// readPDFWithPuppeteer(pdfURL)
//   .then((pdfBuffer) => {
//     // You have the PDF buffer, you can perform further processing here
//     console.log('PDF buffer:', pdfBuffer);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
