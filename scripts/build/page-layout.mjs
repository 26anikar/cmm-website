// Keep editable page content separate from the shared presentation.
export function applyPageLayout($, slug) {
  if (!slug || slug === 'registration') return;

  const heading = $('h1').first().remove();
  const title = $('<header class="page-title"></header>').append(heading);

  if (slug === 'payment-instructions') title.append($('.payment-intro').remove());

  if (slug === 'rules') {
    const photo = $('figure').first();
    photo.find('img').attr({alt: 'The Ronald and Maxine Linde Hall of Mathematics and Physics at Caltech', loading: 'eager'});
    title.addClass('page-title-photo').prepend(photo.find('img').remove());
    photo.remove();
    const introduction = $('.text-block').filter((_, e) => $(e).find('p').length > 0).first();
    title.append(introduction.remove().addClass('page-title-lead'));
    const credit = $('.text-block').filter((_, e) => $(e).text().includes('Source: Randall Howard')).first();
    title.append(credit.remove().addClass('page-photo-credit'));
  }

  if (slug === 'sponsors') groupSponsors($);

  // Remove only empty wrappers left behind when the title/photo is moved.
  $('.text-block').filter((_, e) => !$(e).text().trim() && !$(e).children().length).remove();
  const body = $('<div class="page-body"></div>').append($.root().contents());
  $.root().append(title, body);

  $('.table-scroll').each((_, e) => {
    const table = $(e);
    const precedingHeading = table.prevAll().find('h2').add(table.prevAll('h2')).last().text();
    table.attr({tabindex: '0', role: 'region', 'aria-label': `${precedingHeading || heading.text()} table`});
  });
}

function groupSponsors($) {
  const names = {
    'www.jumptrading.com': 'Jump Trading', 'www.janestreet.com': 'Jane Street',
    'fiverings.com': 'Five Rings', 'www.citadelsecurities.com': 'Citadel Securities',
    'www.hudsonrivertrading.com': 'Hudson River Trading', 'www.ams.org': 'American Mathematical Society',
    'www.deshaw.com': 'D. E. Shaw', 'sig.com': 'Susquehanna International Group',
    'www.cmcmath.org': 'California Mathematics Council',
  };
  const descriptionFirst = new Set(['www.jumptrading.com', 'fiverings.com', 'www.deshaw.com', 'www.cmcmath.org']);
  $('a.image-link').each((_, e) => {
    const logo = $(e);
    const host = new URL(logo.attr('href')).hostname;
    const description = descriptionFirst.has(host) ? logo.prev('.text-block') : logo.next('.text-block');
    if (!description.length || description.find('h2,h3').length) return;
    const card = $('<article class="sponsor-card"></article>');
    logo.before(card);
    logo.attr('aria-label', names[host]);
    logo.find('img').attr('alt', `${names[host]} logo`);
    card.append(logo.remove(), description.remove());
  });
  let grid;
  $.root().children().toArray().forEach(e => {
    const element = $(e);
    if (!element.hasClass('sponsor-card')) { grid = null; return; }
    if (!grid) { grid = $('<div class="sponsor-grid"></div>'); element.before(grid); }
    grid.append(element.remove());
  });
}
