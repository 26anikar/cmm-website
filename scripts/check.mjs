import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
const site=JSON.parse(await fs.readFile('content/site.json','utf8'));
const assets=JSON.parse(await fs.readFile('content/asset-manifest.json','utf8'));
const base=(process.env.BASE_PATH??'/cmm-website').replace(/\/$/,'');
let linkCount=0,pdfs=0;
for(const p of site.pages){
  const html=await fs.readFile(path.join('dist',p.slug,'index.html'),'utf8');
  const $=load(html);
  assert.equal($('h1').length,1,`${p.slug}: expected one main heading`);
  assert.ok($('main').text().trim().length>10,`${p.slug}: missing content`);
  assert.equal($('script[src*="wix"],iframe[src*="wix"]').length,0);
  for(const e of $('[href],[src]').toArray()) for(const attr of ['href','src']){
    const value=$(e).attr(attr);if(!value||!value.startsWith('/')||value.startsWith('//'))continue;
    assert.ok(value.startsWith(base+'/'),`${p.slug}: outside project path: ${value}`);
    const pathname=decodeURIComponent(value.slice(base.length).split(/[?#]/)[0]);
    const file=path.join('dist',pathname,pathname.endsWith('/')?'index.html':'');
    assert.ok((await fs.stat(file)).isFile(),`${p.slug}: missing ${value}`);linkCount++;
  }
}
for(const file of new Set(Object.values(assets))){
  const data=await fs.readFile(path.join('dist',file));
  assert.ok(data.length>0,`${file}: empty file`);
  if(file.endsWith('.pdf')){assert.equal(data.subarray(0,5).toString(),'%PDF-',`${file}: invalid PDF`);pdfs++;}
  assert.ok(data.length<100*1024*1024,`${file}: exceeds GitHub file limit`);
}
console.log(`Checked ${site.pages.length} pages, ${linkCount} local references, and ${pdfs} PDF files. All passed.`);
