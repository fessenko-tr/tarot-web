import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/WRATH/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js');

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 600;
for (let y = 0; y <= pageHeight; y += step) {
  await page.evaluate(py => window.scrollTo(0, py), y);
  await new Promise(r => setTimeout(r, 120));
}

const pricingY = await page.evaluate(() => {
  const headings = Array.from(document.querySelectorAll('h3'));
  const el = headings.find(h => h.textContent.trim() === 'Прайс');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.top + window.scrollY - 40;
});

if (pricingY !== null) {
  await page.evaluate(y => window.scrollTo(0, y), pricingY);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/WRATH/Desktop/tarot-web/temporary screenshots/pricing-only.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Done, scrollY=' + pricingY);
}
await browser.close();
