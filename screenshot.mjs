import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const artifactDir = 'C:\\Users\\suraj\\.gemini\\antigravity\\brain\\267a4309-7a52-45ab-aa5a-b958ee65cf06\\scratch';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR: ' + msg.text());
    }
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR: ' + error.message);
  });
  
  try {
    console.log('Loading homepage...');
    await page.goto('https://autozonindia.vercel.app', { waitUntil: 'networkidle0', timeout: 30000 });
    
    await page.screenshot({ path: path.join(artifactDir, 'homepage.png') });
    console.log('Homepage screenshot saved.');

    // Try to click the first product
    console.log('Clicking product...');
    const productClicked = await page.evaluate(() => {
      const el = document.querySelector('h3.font-bold');
      if (el) {
        el.click();
        return true;
      }
      return false;
    });

    if (productClicked) {
      await new Promise(r => setTimeout(r, 4000));
      await page.screenshot({ path: path.join(artifactDir, 'productpage.png') });
      console.log('Product page screenshot saved.');
    } else {
      console.log('Could not find product to click.');
    }

  } catch (e) {
    console.log('Script failed:', e.message);
  }
  
  await browser.close();
})();
