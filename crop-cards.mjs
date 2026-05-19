import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/WRATH/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200 });
await page.goto("http://localhost:3000", { waitUntil: 'networkidle2', timeout: 30000 });

// Scroll through page to trigger reveals
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= pageHeight; y += 600) {
  await page.evaluate(py => window.scrollTo(0, py), y);
  await new Promise(r => setTimeout(r, 100));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 300));

// Log the spreads position
const info = await page.evaluate(() => {
  const el = document.getElementById("spreads");
  const rect = el?.getBoundingClientRect();
  return {
    offsetTop: el?.offsetTop,
    scrollY: window.scrollY,
    rectTop: rect?.top,
    pageH: document.body.scrollHeight
  };
});
console.log("Spreads info:", JSON.stringify(info));

const outPath = path.join(__dirname, "temporary screenshots", "cards-close.png");
// Take full page screenshot, cropped to the spreads section
// Scroll to spreads position first, then screenshot viewport
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), info.offsetTop + 100);
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: outPath });
await browser.close();
console.log("Saved:", outPath);
