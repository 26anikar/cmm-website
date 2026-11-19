import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch({channel:'chrome'});
for (const slug of ['contact', 'problems/2012-fall', 'problems/2013-fall', '']) {
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(`https://www.caltechmathmeet.org/${slug}`, {waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('main').waitFor({timeout:60000});
  if (!slug) {
    await page.getByRole('button', {name:'Subscribe to our Mailing List!'}).click();
    await page.waitForTimeout(12000);
    console.log('POPUP', (await page.locator('body').innerText()).slice(-7000));
    console.log('IFRAMES', await page.locator('iframe').evaluateAll(es=>es.map(e=>e.src)));
    await fs.writeFile('.cache/popup.html', await page.content());
  } else {
    await fs.writeFile(`.cache/pages/${slug.replaceAll('/','__')}.html`, await page.content());
    console.log(slug, await page.locator('main').innerText());
  }
  await page.close();
}
await browser.close();
