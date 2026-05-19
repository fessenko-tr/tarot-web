import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/WRATH/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js');

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= pageHeight; y += 600) {
  await page.evaluate(py => window.scrollTo(0, py), y);
  await new Promise(r => setTimeout(r, 100));
}

await page.evaluate(() => window.scrollTo(0, 3372));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'C:/Users/WRATH/Desktop/tarot-web/temporary screenshots/pricing-final.png' });
console.log('Done');
await browser.close();
