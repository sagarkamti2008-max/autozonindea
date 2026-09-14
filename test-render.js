import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Since this is a Vite project, we can just look at the dev server response? No, it's CSR.
// Let's use playwright to open the page and print the error.
import { execSync } from 'child_process';
try {
  execSync('npm install puppeteer --no-save', { stdio: 'inherit' });
} catch (e) {
  console.log('Puppeteer install failed');
}

const puppeteer = await import('puppeteer');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

const content = await page.content();
if (content.includes('React Error!')) {
  console.log('FOUND REACT ERROR BOUNDARY');
  const errorText = await page.$eval('div[style*="red"]', el => el.innerText);
  console.log(errorText);
} else {
  console.log('No error boundary found on page.');
}

await browser.close();
