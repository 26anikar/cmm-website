// One-time migration. Normal editing and builds never contact Wix.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { load } from 'cheerio';
const exec = promisify(execFile);
const pages = JSON.parse(await fs.readFile('.cache/inventory.json', 'utf8'));
const assets = new Map();
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const normalizeImage = url => url?.split('/v1/')[0];
function asset(url) {
  const u = new URL(url);
  const local = u.pathname.startsWith('/_files/') ? u.pathname.slice(1) : `assets/images/${decodeURIComponent(path.basename(u.pathname))}`;
  assets.set(url, local);
  return `/${local}`;
}
function link(url) {
  if (url.includes('/_files/')) return asset(url);
  const u = new URL(url, 'https://www.caltechmathmeet.org');
  if (['www.caltechmathmeet.org','caltechmathmeet.org'].includes(u.hostname)) return `${u.pathname.replace(/\/$/,'')}/${u.search}${u.hash}`;
  return url;
}
function clean(fragment) {
  const $ = load(fragment, null, false);
  $('script,style,svg').remove();
  // Preserve emphasis before removing Wix's presentational spans. Heading
  // weights come from the new theme; body emphasis carries content meaning.
  $('[style]').get().reverse().forEach(e => {
    const el = $(e), style = el.attr('style') || '';
    const heading = el.closest('h1,h2,h3,h4,h5,h6');
    if (heading.length && !heading.text().startsWith('This year, CMM is implementing a guts round.')) return;
    if (!el.text().replace(/[\s\u200b]/g, '')) return;
    if (/font-weight\s*:\s*(bold|[6-9]00)\b/i.test(style)) el.wrapInner('<strong></strong>');
    if (/font-style\s*:\s*italic\b/i.test(style)) el.wrapInner('<em></em>');
    if (/text-decoration\s*:\s*underline\b/i.test(style) && !el.find('a').length && !el.closest('a').length) el.wrapInner('<u></u>');
  });
  $('*').each((_, e) => {
    for (const name of Object.keys(e.attribs)) if (!['href','src','alt','colspan','rowspan','scope'].includes(name)) $(e).removeAttr(name);
    if (e.tagName === 'a' && $(e).attr('href')) $(e).attr('href', link($(e).attr('href')));
  });
  $('span,div').get().reverse().forEach(e=>$(e).replaceWith($(e).contents()));
  $('p').each((_,e)=>{ if (!$(e).text().replace(/[\s\u200b\u00a0]/g,'')) $(e).remove(); });
  return $.html().replaceAll('\u200b','').trim();
}
function imageHtml(e, $) {
  const src = normalizeImage($(e).attr('src'));
  if (!src || src.startsWith('data:')) return '';
  return `<figure><img src="${asset(src)}" alt="${escape($(e).attr('alt') || '')}" loading="lazy"></figure>`;
}
function extract($, e) {
  if (e.type !== 'tag') return '';
  const el = $(e);
  if (el.is('.wixui-rich-text')) return `<div class="text-block">${clean(el.html())}</div>\n`;
  if (el.is('table')) return `<div class="table-scroll" tabindex="0" role="region" aria-label="${escape(el.closest('section').find('.wixui-rich-text').first().text() || 'Data table')}">${clean($.html(e))}</div>\n`;
  if (el.is('img')) return imageHtml(e, $);
  if (el.is('a[href]')) {
    const imgs = el.find('img').map((_,img)=>imageHtml(img,$)).get().join('');
    const text = el.text().trim();
    if (!text && !imgs) return '';
    return `<a class="${imgs ? 'image-link' : 'button'}" href="${escape(link(el.attr('href')))}">${imgs || escape(text)}</a>\n`;
  }
  if (el.is('button') && el.text().includes('Payment Form')) return '<p class="notice">For the credit-card payment link, please <a href="mailto:cmm-help@caltech.edu?subject=CMM%20payment%20link">email the CMM organizers</a>.</p>';
  if (el.is('script,style,svg')) return '';
  return el.children().map((_,c)=>extract($,c)).get().join('');
}
function archive(page,$) {
  const rounds = new Map(), extras = [], bee = [];
  for (const l of page.links) {
    const label = l.text.trim();
    if (['Problems','Solutions'].includes(label)) { bee.push(l); continue; }
    if (/Ceremony|All Answers/.test(label)) {extras.push(l);continue;}
    if (!rounds.has(label)) rounds.set(label,[]);
    rounds.get(label).push(l);
  }
  const a = (l,label) => `<a href="${escape(link(l.href))}">${escape(label || l.text.trim())}</a>`;
  // The 2019 solution document covers both rounds.
  const combined = rounds.get('Team & Individual Rounds');
  if (combined) rounds.delete('Team & Individual Rounds');
  let out = `<h1>${escape(page.text[0])}</h1><p><a href="/problems/">← All competitions</a></p><div class="table-scroll"><table class="problem-table"><thead><tr><th scope="col">Round</th><th scope="col">Tests</th><th scope="col">Solutions</th></tr></thead><tbody>`;
  for (const [label,links] of rounds) out += `<tr><th scope="row">${escape(label)}</th><td>${a(links[0],'Download PDF')}</td><td>${links[1] ? a(links[1],'Download PDF') : combined && /Team|Individual/.test(label) ? a(combined[0],'Combined solutions') : '—'}</td></tr>`;
  out += '</tbody></table></div>';
  if (bee.length) {
    out += '<h2>Integration Bee</h2><div class="card-grid">';
    let round = -1;
    for (const l of bee) {
      if (l.text.trim() === 'Problems') { if (round >= 0) out += '</section>'; round++; out += `<section class="card"><h3>${round === 0 ? 'Qualifying Test' : 'Finals'}</h3>`; }
      out += `<p>${a(l)}</p>`;
    }
    out += '</section></div>';
  }
  if (extras.length) out += `<h2>${extras.some(l=>/Ceremony/.test(l.text)) ? 'Ceremonies' : 'Solutions'}</h2><ul>${extras.map(l=>`<li>${a(l)}</li>`).join('')}</ul>`;
  $('.wixui-rich-text').each((_,e)=>{ if ($(e).text().includes('Presented by:')) out += `<section class="credits">${clean($(e).html())}</section>`; });
  return out;
}
await fs.mkdir('content/pages',{recursive:true});
const manifest = [];
for (const page of pages) {
  const $ = load(await fs.readFile(`.cache/pages/${page.slug.replaceAll('/','__') || 'home'}.html`,'utf8'));
  if (!$('main').length) throw new Error(`Missing content: ${page.slug}`);
  let html = page.slug.startsWith('problems/') ? archive(page,$) : extract($,$('main')[0]);
  if (page.slug === '') {
    const intro = page.text[1].replaceAll('\u200b','').trim();
    const destinations = ['registration','problems','results','scheduling','sponsors'];
    html = `<section class="hero"><div><p class="eyebrow">Student organized. Community driven.</p><h1>Caltech<br>Math Meet</h1><p class="lead">${escape(intro)}</p><a class="button" href="/registration/">Registration →</a><a class="text-link" href="/problems/">Explore past problems</a></div><img src="${asset(normalizeImage(page.images[0].src))}" alt="Caltech Math Meet competitors gathered for an event" fetchpriority="high"></section><section class="home-section"><p class="eyebrow">Get ready for the meet</p><h2>Your next mathematical adventure.</h2><div class="card-grid home-cards">${destinations.map((slug,i)=>`<a class="card" href="/${slug}/"><img src="${asset(normalizeImage(page.images[i+1].src))}" alt="${escape(page.images[i+1].alt)}" loading="lazy"><div><h3>${escape(page.text[2+i*2])} <span aria-hidden="true">↗</span></h3><p>${escape(page.text[3+i*2])}</p></div></a>`).join('')}</div></section>`;
  }
  if (page.slug === 'problems') {
    html = `<h1>CMM Problem Archive</h1><p class="lead">Explore tests and solutions from Caltech Math Meet and CHMMC.</p><div class="card-grid archive-grid">${page.links.map(l=>`<a class="card" href="${link(l.href)}"><h2>${escape(l.text.trim())}</h2><span>Tests &amp; solutions →</span></a>`).join('')}</div>`;
  }
  const dom = load(html,null,false);
  const firstHeading = dom('h1,h2,h3,h4,h5,h6').first();
  if (page.slug && firstHeading.length) {
    dom('h1').each((_,e)=>{e.tagName='h2';});
    firstHeading[0].tagName = 'h1';
  }
  if (page.slug && !firstHeading.length) dom.root().prepend(`<h1>${escape(page.title.split('|')[0].trim())}</h1>`);
  if (page.slug === 'resources') {
    dom('h1').replaceWith('<h2>Directions to Caltech</h2>');
    dom('h2,h3').filter((_,e)=>dom(e).text().trim()==='Resources').remove();
    dom.root().prepend('<h1>Resources</h1>');
    const other = dom('h3').filter((_,e)=>dom(e).text().trim()==='Other materials');
    const para = dom('p').filter((_,e)=>dom(e).text().includes('Most college math competition'));
    if (other.length && para.length) other.insertBefore(para);
    dom('h2').first().after('<p><a href="https://www.caltech.edu/about/visit/directions">Caltech campus directions and visitor information</a></p>');
    dom('h3').each((_,e)=>{e.tagName='h2';});
    dom('br').replaceWith(' ');
    dom('li').filter((_,e)=>dom(e).text().trim()==='Complex Numbers').html('<p><a href="/_files/ugd/006423_ef3f3111ea2348a0bd867090eca25783.pdf">Complex Numbers</a></p>');
  }
  if (page.slug === 'payment-instructions') {
    const check=dom('figure').first();
    const payee=check.next(),memo=payee.next();
    check.after(`<dl class="check-details"><dt>Pay to the order of</dt><dd>${payee.html()}</dd><dt>Memo</dt><dd>${memo.html()}</dd></dl>`);
    payee.remove();memo.remove();
    const envelope=dom('figure').last();
    const sender=envelope.next(),recipient=sender.next();
    envelope.after(`<dl class="check-details"><dt>Return address</dt><dd>${sender.html()}</dd><dt>Mail to</dt><dd>${recipient.html()}</dd></dl>`);
    sender.remove();recipient.remove();
  }
  if (page.slug === 'registration') {
    const title=dom('h1').parent();title.prependTo(dom.root());
    dom('a.button').clone().insertAfter(title.next().next());
    dom('figure img').attr('alt','Beckman Auditorium at Caltech');
  }
  if (page.slug === 'sponsors') {
    dom('h4').each((_,e)=>{const t=dom(e).text().trim();if(!t)dom(e).remove();else e.tagName=t.startsWith('Tier')?'h3':'p';});
  }
  // Wix used heading tags to style these body passages. Restore their meaning
  // so an import cannot reintroduce oversized text or spurious navigation items.
  if (page.slug === 'rules') dom('h2').filter((_,e)=>dom(e).text().startsWith('This year, CMM is implementing a guts round.')).each((_,e)=>{e.tagName='p';});
  if (page.slug === 'puzzle-hunt') dom('h5').filter((_,e)=>dom(e).text().startsWith('Held at CMM')).each((_,e)=>{e.tagName='p';});
  if (page.slug === 'tcs-round') {
    const heading=dom('h1');
    const parts=heading.html().split(/<br\s*\/?\s*>/i);
    if (parts.length===2) {heading.html(parts[0].trim());heading.after(`<p>${parts[1].trim()}</p>`);}
  }
  if (page.slug === 'tcs-round') dom('p').filter((_,e)=>['Structure','TCS Round Registration','Resources'].includes(dom(e).text().trim())).each((_,e)=>{e.tagName='h2';});
  if (page.slug === 'integration-bee') dom('figure').each((i,e)=>{dom(e).addClass('math-example');dom(e).find('img').attr('alt',`${['Easy','Medium','Hard'][i]} example integral`);const label=dom(e).next();dom(e).prepend(`<figcaption>${escape(label.text().trim())}</figcaption>`);label.remove();});
  // Some original section labels were paragraphs styled larger than body text.
  const sectionLabels = {
    'admissions-events': ['Information Session + Campus Tours'],
    discord: ['Students join here', 'Coaches join here'],
    scheduling: ['Friday, January 23:', 'Saturday, January 24:'],
  };
  dom('p').filter((_,e)=>(sectionLabels[page.slug] || []).includes(dom(e).text().trim())).each((_,e)=>{e.tagName='h2';});
  if (page.slug === 'resources') dom('p').filter((_,e)=>dom(e).text().trim()==='Supplementary Material').each((_,e)=>{e.tagName='h3';dom(e).text('Supplementary Material');});
  if (page.slug === 'registration') dom('p').filter((_,e)=>/^Caltech Math Meet 2027 will take place|^Registration is open from now/.test(dom(e).text().trim())).addClass('event-summary');
  if (page.slug === 'sponsors') {
    dom('h1')[0].tagName='h2';
    dom.root().prepend('<h1>Sponsors</h1>');
  }
  if (page.slug === 'scheduling') dom('.table-scroll').each((_,e)=>dom(e).attr('aria-label',dom(e).prev().text().trim()));
  dom('.text-block').filter((_,e)=>!dom(e).text().trim()).remove();
  // Keep table headers meaningful after removing Wix presentation markup.
  dom('thead td').each((_,e)=>{e.tagName='th';dom(e).attr('scope','col');});
  html = dom.html().replace(/[ \t]+$/gm,'').trim();
  await fs.writeFile(`content/pages/${page.slug.replaceAll('/','__') || 'home'}.html`,html+'\n');
  manifest.push({slug:page.slug,title:page.title || `${page.text[0]} | Caltech Math Meet`,source:page.url});
}
// Preserve the original logo and favicon locally, too.
const home = load(await fs.readFile('.cache/pages/home.html','utf8'));
const logo = asset(normalizeImage(home('header img').first().attr('src')));
const favicon = asset(normalizeImage(home('link[rel="icon"]').first().attr('href')));
await fs.writeFile('content/site.json',JSON.stringify({name:'Caltech Math Meet',url:'https://26anikar.github.io/cmm-website',logo,favicon,pages:manifest},null,2)+'\n');
const entries = [...assets];
let downloaded = 0;
for (let i=0;i<entries.length;i+=8) {
  await Promise.all(entries.slice(i,i+8).map(async ([url,file])=>{
    const dest = `public/${file}`;
    await fs.mkdir(path.dirname(dest),{recursive:true});
    try {if ((await fs.stat(dest)).size > 0) return;} catch {}
    await exec('curl.exe',['-L','--fail','--silent','--retry','3','--max-time','90',url,'-o',dest]);
    downloaded++;
  }));
  console.log(`Assets ${Math.min(i+8,entries.length)}/${entries.length}`);
}
await fs.writeFile('content/asset-manifest.json',JSON.stringify(Object.fromEntries(assets),null,2)+'\n');
console.log(`Imported ${pages.length} pages and ${entries.length} assets (${downloaded} downloaded).`);
