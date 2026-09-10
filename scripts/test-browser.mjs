import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const site=JSON.parse(await fs.readFile('content/site.json','utf8'));
const browser=await chromium.launch({channel:'chrome'});
const errors=[];
for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const p of site.pages){
    await page.goto(`http://127.0.0.1:4173/cmm-website/${p.slug?p.slug+'/':''}`);
    await page.locator('img').evaluateAll(async es=>{es.forEach(e=>e.loading='eager');await Promise.all(es.map(e=>e.decode()));});
    assert.ok(await page.locator('h1').isVisible(),`${p.slug} heading hidden`);
    const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    assert.ok(sizes.scroll<=sizes.width+1,`${p.slug} at ${width}px: horizontal overflow ${sizes.scroll}`);
    const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>e.complete&&!e.naturalWidth).map(e=>e.src));
    assert.deepEqual(broken,[],`${p.slug}: broken images`);
  }
  await page.goto('http://127.0.0.1:4173/cmm-website/');
  if(width<1080)await page.getByRole('button',{name:/Menu/}).click();
  await page.locator('nav summary').filter({hasText:'Past competitions'}).click();
  await page.locator('nav').getByRole('link',{name:'Problems',exact:true}).click();
  await page.waitForURL('**/problems/');
  await page.goto('http://127.0.0.1:4173/cmm-website/');
  await page.locator('img').evaluateAll(async es=>{es.forEach(e=>e.loading='eager');await Promise.all(es.map(e=>e.decode()));});
  await page.screenshot({path:`.cache/home-${width}.png`,fullPage:true});
  if(width===1440)for(const slug of ['payment-instructions','problems/cmm-2026-problems','results','sponsors','registration','resources']){
    await page.goto(`http://127.0.0.1:4173/cmm-website/${slug}/`);
    await page.locator('img').evaluateAll(async es=>{es.forEach(e=>e.loading='eager');await Promise.all(es.map(e=>e.decode()));});
    await page.screenshot({path:`.cache/${slug.replaceAll('/','__')}.png`,fullPage:true});
  }
  await page.close();
  console.log(`Checked all ${site.pages.length} pages at ${width}px and tested navigation.`);
}
assert.deepEqual(errors,[]);
await browser.close();
