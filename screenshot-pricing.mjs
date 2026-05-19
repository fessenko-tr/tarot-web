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

const rect = await page.evaluate(() => {
  const el = document.querySelector('#spreads');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1440, height: r.height };
});

if (rect) {
  await page.evaluate(y => window.scrollTo(0, y - 50), rect.y);
  await new Promise(r => setTimeout(r, 400));
  const r2 = await page.evaluate(() => {
    const el = document.querySelector('#spreads');
    const r = el.getBoundingClientRect();
    return { x: 0, y: r.top, width: 1440, height: r.height };
  });
  await page.screenshot({ path: 'C:/Users/WRATH/Desktop/tarot-web/temporary screenshots/pricing-section.png', clip: { x: r2.x, y: r2.y, width: r2.width, height: r2.height } });
  console.log('Done');
}
await browser.close();
