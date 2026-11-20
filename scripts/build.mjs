import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { addHomeSlideshow } from './build/home-slideshow.mjs';
import { addPaymentDiagrams } from './build/payment-diagrams.mjs';
import { applyPageLayout } from './build/page-layout.mjs';
import { eventValues, renderEventContent } from './build/event-content.mjs';
const settings = JSON.parse(await fs.readFile('content/event.json', 'utf8'));
const event = eventValues(settings);
const embedUrl = settings.mailingListFormUrl;
if (embedUrl && !/^https:\/\/docs\.google\.com\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform(?:\?[^#]*)?$/.test(embedUrl)) {
  throw new Error('content/event.json: mailingListFormUrl must be a Google Forms embed URL or blank.');
}
const site = JSON.parse(await fs.readFile('content/site.json','utf8'));
const base = (process.env.BASE_PATH ?? '/cmm-website').replace(/\/$/,'');
const siteUrl = process.env.SITE_URL || site.url;
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const url = p => `${base}${p}`;
const styleVersion=createHash('sha256').update(await fs.readFile('public/assets/site.css')).digest('hex').slice(0,10);
const pageStyleVersion=createHash('sha256').update(await fs.readFile('public/assets/pages.css')).digest('hex').slice(0,10);
const scriptVersion=createHash('sha256').update(await fs.readFile('public/assets/site.js')).digest('hex').slice(0,10);
const groups = [
  ['Registration',[['registration','Registration'],['payment-instructions','Payment Instructions']]],
  ['Past Competitions',[['problems','Problems'],['results','Results']]],
  ['Events',[['friday-night-event','Friday Night Event'],['integration-bee','Integration Bee'],['guest-speaker','Guest Speaker'],['faculty-lecture','Faculty Lecture']]],
  ['Information',[['rules','Rules'],['scheduling','Schedule'],['resources','Resources'],['sponsors','Sponsors'],['contact','Contact']]],
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
  let fragment = page.slug === '404' ? '<h1>Page not found</h1><p>The page may have moved. Explore the competition archive or return home.</p><p><a class="button" href="/">Return home</a> <a href="/problems/">Problem archive</a></p>' : await fs.readFile(`content/pages/${page.slug || 'home'}.html`,'utf8');
  const $ = load(renderEventContent(fragment, event),null,false);
  $('[data-registration-open], [data-registration-closed]').each((_, element) => {
    const message = $(element);
    const showWhenOpen = message.attr('data-registration-open') !== undefined;
    if (showWhenOpen === settings.registrationOpen) {
      message.removeAttr('data-registration-open data-registration-closed');
    } else {
      message.remove();
    }
  });
  if (!page.slug) {
    addHomeSlideshow($);
    if (embedUrl) {
      const googleUrl = new URL(embedUrl);
      googleUrl.searchParams.set('embedded', 'true');
      const frame = $('<iframe title="CMM mailing list Google Form" loading="lazy"></iframe>').attr('src', googleUrl.href);
      googleUrl.searchParams.delete('embedded');
      const link = $('<a target="_blank" rel="noopener noreferrer">Open the Google Form in a new tab</a>').attr('href', googleUrl.href);
      $('#mailing-list-embed').empty().append(frame, $('<p></p>').append(link));
    }
  }
  if (page.slug === 'payment-instructions') {
    if (event.paymentUrl) {
      $('#card-payment-link').replaceWith(
        $('<p class="payment-form-action"></p>').append($('<a class="button">Payment Form</a>').attr('href', event.paymentUrl)),
      );
    } else {
      $('#card-payment-link').removeAttr('id');
    }
    addPaymentDiagrams($);
  }
  $('img').each((_,e)=>{const result=optimized.get($(e).attr('src'));if(result)$(e).attr({src:result.url,width:result.width,height:result.height});});
  $('[href],[src]').each((_,e)=>{for (const attr of ['href','src']) {const value=$(e).attr(attr);if(value?.startsWith('/')&&!value.startsWith('//')) $(e).attr(attr,url(value));}});
  if (page.slug) $('h2,h3').each((index, heading) => {
    if ($(heading).text().trim()) $(heading).attr('id', `section-${index + 1}`);
  });
  const description = $('p').map((_,e)=>$(e).text().trim()).get().find(t=>t.length>70)?.slice(0,200) || `${page.title.split('|')[0].trim()} — Caltech Math Meet, a team mathematics competition organized by Caltech students.`;
  const current = slug => {
    if (page.slug === slug) return ' aria-current="page"';
    if (slug && page.slug.startsWith(`${slug}/`)) return ' aria-current="location"';
    return '';
  };
  const nav = groups.map(([label,items])=>`<details class="nav-group"><summary>${label}</summary><div>${items.map(([slug,title])=>`<a href="${url('/'+slug+'/')}"${current(slug)}>${title}</a>`).join('')}</div></details>`).join('');
  const canonical = `${siteUrl}${page.slug?'/'+page.slug:''}/`;
  applyPageLayout($, page.slug);
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(page.title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta name="theme-color" content="#800d00"><link rel="icon" href="${url(site.favicon)}"><link rel="stylesheet" href="${url('/assets/site.css')}?v=${styleVersion}"><link rel="stylesheet" href="${url('/assets/pages.css')}?v=${pageStyleVersion}"><script src="${url('/assets/site.js')}?v=${scriptVersion}" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="${url('/')}" aria-label="Caltech Math Meet home"><img src="${url(optimized.get(site.logo)?.url || site.logo)}" alt="Caltech Math Meet" width="115" height="46"></a><button class="menu-toggle" aria-controls="navigation" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Main navigation"><a class="home-link" href="${url('/')}"${current('')}>Home</a>${nav}</nav></div></header>
<main id="main" class="${page.slug?'page-content':'home-content'}" data-page="${esc(page.slug || 'home')}" tabindex="-1">${$.html()}</main>
<footer class="site-footer"><div class="footer-contact-details"><a class="footer-brand" href="${url('/')}" aria-label="Caltech Math Meet home"><img src="${url(optimized.get(site.logo)?.url || site.logo)}" alt="Caltech Math Meet" width="130" height="52" loading="lazy"></a><a href="${url('/contact/')}">Questions? Contact Us</a><a href="mailto:${esc(event.contactEmail)}">${esc(event.contactEmail)}</a></div>${page.slug === '' ? '<a class="footer-mailing" href="#mailing-list">Subscribe to our Mailing List!</a>' : ''}</footer></body></html>`;
  const file = page.slug==='404'?'dist/404.html':path.join('dist',page.slug,'index.html');
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);
}
await fs.writeFile('dist/.nojekyll','');
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site.pages.map(p=>`<url><loc>${siteUrl}${p.slug?'/'+p.slug:''}/</loc></url>`).join('')}</urlset>`);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Built ${site.pages.length} pages for ${base || '/'}.`);
