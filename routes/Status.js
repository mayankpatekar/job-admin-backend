const express= require('express');
// const {Application} = require("../models/models.js");
// const readPDFWithPuppeteer = require('../middleware/puppeteer.js');
const puppeteer = require('puppeteer');

const router = express.Router();

async function readPDFWithPuppeteer(pdfURL) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
      
    //   await page.setDefaultNavigationTimeout(0); // Set to 0 for no timeout, or adjust as needed
      // Navigate to the PDF URL
      await page.goto(pdfURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(5000);
      

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

router.get('/',async(req,res)=>{
    try {
        const pdfURL = 'https://res.cloudinary.com/dfwb7p3dy/image/upload/v1702220296/e3kyvuruz4raxwnpovj0.pdf';
        console.log("status hit")
        const pdfBuffer = await readPDFWithPuppeteer(pdfURL);
        console.log(pdfBuffer);
        
        console.log('PDF buffer:', pdfBuffer); // Log the buffer to check if it's being fetched correctly
    
        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch PDF' });
      }
})

module.exports = router