import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE ERROR: ' + msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push('PAGE ERROR: ' + error.message);
  });
  
  try {
    await page.goto('https://autozonindia.vercel.app', { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Click on a product to navigate to the product detail view
    await page.waitForSelector('h3.font-bold');
    await page.click('h3.font-bold');
    
    // Wait a few seconds for the new view to render
    await new Promise(r => setTimeout(r, 3000));
    
    const content = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('BODY AFTER CLICK:', content);
    
    const rootHTML = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML.trim() : 'NO ROOT ELEMENT';
    });
    console.log('ROOT HTML LENGTH AFTER CLICK:', rootHTML.length);
    if (rootHTML.length === 0) {
      console.log('ROOT IS EMPTY - WHITE SCREEN OF DEATH AFTER CLICK');
    }
  } catch (e) {
    console.log('Script failed:', e.message);
  }
  
  if (errors.length > 0) {
    console.log('--- ERRORS FOUND ---');
    errors.forEach(e => console.log(e));
  } else {
    console.log('No JS errors caught on product click.');
  }
  
  await browser.close();
})();
