// Read-only comparison of rendered text and images on the original and migrated sites.
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const site = JSON.parse(await fs.readFile('content/site.json', 'utf8'));
const browser = await chromium.launch({ channel: 'chrome' });
const records = [];
const refreshOriginals = process.argv.includes('--refresh-originals');
await fs.mkdir('.cache/typography', { recursive: true });
async function inspect(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('main').waitFor({ timeout: 45000 });
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 4000))]));
  return page.locator('main').evaluate(main => {
    const texts = [];
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.replace(/[\s\u200b]+/g, ' ').trim();
      if (!text || node.parentElement.closest('script,style')) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      const bounds = range.getBoundingClientRect();
      const style = getComputedStyle(node.parentElement);
      if (!bounds.width || !bounds.height || style.visibility === 'hidden') continue;
      const block = node.parentElement.closest('h1,h2,h3,h4,h5,h6,p,li,td,th,a,figcaption');
      texts.push({ text, tag: block?.tagName || node.parentElement.tagName,
        block: block?.textContent.replace(/[\s\u200b]+/g, ' ').trim(),
        size: parseFloat(style.fontSize), family: style.fontFamily,
        weight: style.fontWeight, lineHeight: style.lineHeight,
        color: style.color, top: Math.round(bounds.top + scrollY),
      });
    }
    const images = [...main.querySelectorAll('img')].map(img => ({
      alt: img.alt, src: img.currentSrc || img.src,
      width: Math.round(img.getBoundingClientRect().width),
      height: Math.round(img.getBoundingClientRect().height),
    }));
    return { texts, images };
  });
}
let next = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  while (next < site.pages.length) {
    const item = site.pages[next++];
    const key = item.slug.replaceAll('/', '__') || 'home';
    const file = `.cache/typography/${key}.json`;
    let original;
    if (!refreshOriginals) try { original = JSON.parse(await fs.readFile(file, 'utf8')).original; } catch {}
    if (!original) original = await inspect(page, item.source);
    const current = await inspect(page, `http://127.0.0.1:4173/cmm-website/${item.slug ? item.slug + '/' : ''}`);
    const record = { slug: item.slug, original, current };
    await fs.writeFile(file, JSON.stringify(record, null, 2));
    records.push(record);
    console.log(`Compared ${item.slug || 'home'}: ${original.texts.length} original / ${current.texts.length} current text runs`);
  }
  await page.close();
}));
await browser.close();
await fs.writeFile('.cache/typography-audit.json', JSON.stringify(records.sort((a,b)=>a.slug.localeCompare(b.slug)), null, 2));
console.log(`Compared all ${records.length} pages.`);
