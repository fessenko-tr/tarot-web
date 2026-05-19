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

const info = await page.evaluate(() => {
  const headings = Array.from(document.querySelectorAll('h3'));
  const h = headings.find(el => el.textContent.includes('Прайс'));
  if (!h) return null;
  const r = h.getBoundingClientRect();
  return { absTop: r.top + window.scrollY, height: h.offsetHeight };
});
console.log('h3 Прайс at:', JSON.stringify(info));
await browser.close();
