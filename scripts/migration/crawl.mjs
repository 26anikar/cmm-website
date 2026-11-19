import fs from 'node:fs/promises';
import { load } from 'cheerio';
import { execFileSync } from 'node:child_process';

const origin = 'https://www.caltechmathmeet.org';
await fs.mkdir('.cache/pages', { recursive: true });
const sitemap = await (await fetch(`${origin}/pages-sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const pages = [];
for (let i = 0; i < urls.length; i += 5) {
  await Promise.all(urls.slice(i, i + 5).map(async url => {
    const slug = new URL(url).pathname.replace(/^\/|\/$/g, '');
    const file = `.cache/pages/${slug.replaceAll('/', '__') || 'home'}.html`;
    let html;
    try { html = await fs.readFile(file, 'utf8'); } catch {
      execFileSync('curl.exe', ['-L', '--fail', '--silent', '--retry', '3', '--max-time', '60', url, '-o', file]);
      html = await fs.readFile(file, 'utf8');
    }
    const $ = load(html);
    const main = $('main');
    pages.push({ slug, url, title: $('title').text(),
      text: main.find('.wixui-rich-text').map((_, e) => $(e).text()).get(),
      links: main.find('a[href]').map((_, e) => ({text: $(e).text(), href: $(e).attr('href')})).get(),
      images: main.find('img').map((_, e) => ({alt: $(e).attr('alt'), src: $(e).attr('src')})).get(),
      iframes: main.find('iframe').map((_, e) => $(e).attr('src')).get(),
      embeds: main.find('[data-testid="htmlComponent"]').length,
    });
    console.log(`Read ${slug || 'home'}`);
  }));
}
pages.sort((a,b) => a.slug.localeCompare(b.slug));
await fs.writeFile('.cache/inventory.json', JSON.stringify(pages, null, 2));
console.log(`${pages.length} pages inventoried.`);
