import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR: ' + msg.text());
    }
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR STACK: ' + error.stack);
  });
  
  try {
    await page.goto('https://autozonindia.vercel.app', { waitUntil: 'networkidle2' });
    console.log('Homepage loaded.');
    await page.waitForSelector('h3.font-bold');
    await page.click('h3.font-bold');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Clicked product.');
  } catch (e) {
    console.log('Script failed:', e.message);
  }
  
  await browser.close();
})();
