import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
const site = JSON.parse(await fs.readFile('content/site.json','utf8'));
const base = (process.env.BASE_PATH ?? '/cmm-website').replace(/\/$/,'');
const siteUrl = process.env.SITE_URL || site.url;
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const url = p => `${base}${p}`;
const styleVersion=createHash('sha256').update(await fs.readFile('public/assets/site.css')).digest('hex').slice(0,10);
const groups = [
  ['Registration',[['registration','Registration'],['payment-instructions','Payment instructions']]],
  ['Past Competitions',[['problems','Problems'],['results','Results']]],
  ['Events',[['scheduling','Schedule'],['friday-night-event','Friday night event'],['integration-bee','Integration Bee'],['guest-speaker','Guest speaker'],['faculty-lecture','Faculty lecture'],['admissions-events','Admissions events']]],
  ['Information',[['rules','Rules'],['resources','Resources'],['sponsors','Sponsors'],['contact','Contact'],['discord','Discord']]],
  ['Archive',[['tcs-round','TCS Round'],['puzzle-hunt','Puzzle hunt']]],
];
await fs.mkdir('dist',{recursive:true});
await fs.cp('public','dist',{recursive:true});
// Keep the original assets in the archive, but serve small WebP derivatives.
const optimized=new Map();
for(const file of await fs.readdir('public/assets/images')) {
  if(!/\.(jpg|png|gif)$/i.test(file))continue;
  const source=`/assets/images/${file}`;
  const dest=source.replace(/\.[^.]+$/,'.webp');
  const info=await sharp(`public${source}`).resize({width:source===site.logo?240:1600,withoutEnlargement:true}).webp({quality:82}).toFile(`dist${dest}`);
  optimized.set(source,{url:dest,width:info.width,height:info.height});
}
for (const page of [...site.pages,{slug:'404',title:'Page not found | Caltech Math Meet'}]) {
  let fragment = page.slug === '404' ? '<h1>Page not found</h1><p>The page may have moved. Explore the competition archive or return home.</p><p><a class="button" href="/">Return home</a> <a href="/problems/">Problem archive</a></p>' : await fs.readFile(`content/pages/${page.slug.replaceAll('/','__')||'home'}.html`,'utf8');
  const $ = load(fragment,null,false);
  $('img').each((_,e)=>{const result=optimized.get($(e).attr('src'));if(result)$(e).attr({src:result.url,width:result.width,height:result.height});});
  $('[href],[src]').each((_,e)=>{for (const attr of ['href','src']) {const value=$(e).attr(attr);if(value?.startsWith('/')&&!value.startsWith('//')) $(e).attr(attr,url(value));}});
  const headings=[];
  if(page.slug) $('h2,h3').each((i,e)=>{const title=$(e).text().trim();if(title){$(e).attr('id',`section-${i+1}`);headings.push({title,id:`section-${i+1}`});}});
  const description = $('p').map((_,e)=>$(e).text().trim()).get().find(t=>t.length>70)?.slice(0,200) || `${page.title.split('|')[0].trim()} — Caltech Math Meet, a team mathematics competition organized by Caltech students.`;
  const current = slug => page.slug===slug?' aria-current="page"':'';
  const nav = groups.map(([label,items])=>`<details class="nav-group"><summary>${label}</summary><div>${items.map(([slug,title])=>`<a href="${url('/'+slug+'/')}"${current(slug)}>${title}</a>`).join('')}</div></details>`).join('');
  const toc = headings.length>=4 && page.slug !== 'problems' ? `<details class="on-this-page"><summary>On this page</summary><ul>${headings.map(h=>`<li><a href="#${h.id}">${esc(h.title)}</a></li>`).join('')}</ul></details>`:'';
  const canonical = `${siteUrl}${page.slug?'/'+page.slug:''}/`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(page.title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta name="theme-color" content="#800d00"><link rel="icon" href="${url(site.favicon)}"><link rel="stylesheet" href="${url('/assets/site.css')}?v=${styleVersion}"><script src="${url('/assets/site.js')}" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="${url('/')}" aria-label="Caltech Math Meet home"><img src="${url(optimized.get(site.logo)?.url || site.logo)}" alt="Caltech Math Meet" width="115" height="46"></a><button class="menu-toggle" aria-controls="navigation" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Main navigation"><a class="home-link" href="${url('/')}"${current('')}>Home</a>${nav}</nav></div></header>
<main id="main" class="${page.slug?'page-content':'home-content'}" data-page="${esc(page.slug || 'home')}" tabindex="-1">${page.slug?`<div class="breadcrumbs"><a href="${url('/')}">Home</a><span aria-hidden="true"> / </span>${esc(page.title.split('|')[0].trim())}</div>`:''}${toc}${$.html()}</main>
<aside class="stay-connected"><div><p class="eyebrow">Stay connected</p><h2>See you at the next meet.</h2><p>For mailing-list updates, contact the CMM organizers.</p></div><a class="button button-light" href="mailto:cmm-help@caltech.edu?subject=CMM%20mailing%20list">Ask to join the mailing list ↗</a></aside>
<footer class="site-footer"><a class="footer-name" href="${url('/')}">Caltech Math Meet</a><p>Organized by students from Caltech.</p><a href="mailto:cmm-help@caltech.edu">cmm-help@caltech.edu</a><div class="footer-links"><a href="${url('/contact/')}">Contact</a><a href="${url('/discord/')}">Discord</a><a href="${url('/sponsors/')}">Our sponsors</a></div></footer></body></html>`;
  const file = page.slug==='404'?'dist/404.html':path.join('dist',page.slug,'index.html');
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);
}
await fs.writeFile('dist/.nojekyll','');
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site.pages.map(p=>`<url><loc>${siteUrl}${p.slug?'/'+p.slug:''}/</loc></url>`).join('')}</urlset>`);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Built ${site.pages.length} pages for ${base || '/'}.`);
