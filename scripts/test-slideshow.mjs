import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome'});
const base=process.env.TEST_SITE_URL || 'http://127.0.0.1:4173/cmm-website/';
for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install();await page.goto(base);
  await page.locator('.hero-slide').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.hero button,.slideshow-controls,.slideshow-position')).toHaveCount(0);
  const title=await page.locator('.hero h1').boundingBox();
  await page.locator('.hero').hover();
  for(const index of [1,2,0]){
    await page.clock.runFor(5100);
    await expect(page.locator('.hero-slide').nth(index)).toHaveClass(/is-current/);
    await expect(page.locator('.hero-slide.is-current')).toHaveCSS('opacity','1');
    await expect(page.locator('.hero-slide:not([aria-hidden])')).toHaveCount(1);
    assert.deepEqual(await page.locator('.hero h1').boundingBox(),title,'Title moved during rotation');
  }
  const hero=await page.locator('.hero').boundingBox(),text=await page.locator('.hero .lead').boundingBox();
  assert.ok(text.y+text.height<hero.y+hero.height);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`.cache/slideshow-${width}.png`});
  assert.deepEqual(errors,[]);await page.close();
  console.log(`Automatic rotation without controls, hover behavior and layout verified at ${width}px.`);
}
const reduced=await browser.newPage({reducedMotion:'reduce'});
await reduced.clock.install();await reduced.goto(base);await reduced.clock.runFor(16000);
await expect(reduced.locator('.hero-slide').first()).toHaveClass(/is-current/);
assert.equal(await reduced.locator('.hero-slide').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
await reduced.close();
const noScript=await browser.newPage({javaScriptEnabled:false});await noScript.goto(base);
assert.equal(await noScript.locator('.hero-slide').first().evaluate(e=>getComputedStyle(e).opacity),'1');
await noScript.close();
const failure=await browser.newPage({reducedMotion:'no-preference'});
await failure.clock.install();await failure.route('**/*cab1a08c*',route=>route.abort());await failure.goto(base);
await failure.clock.runFor(5100);await expect(failure.locator('.hero-slide').nth(1)).toHaveClass(/is-current/);
await failure.clock.runFor(5100);await expect(failure.locator('.hero-slide').first()).toHaveClass(/is-current/);
await failure.close();
await browser.close();console.log('Reduced motion, JavaScript-disabled fallback and automatic skipping of failed images verified.');
