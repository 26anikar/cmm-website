const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
const groups = [...document.querySelectorAll('.nav-group')];
groups.forEach(group => group.addEventListener('toggle', () => {
  if (group.open) groups.filter(other=>other!==group).forEach(other=>other.open=false);
}));
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) groups.forEach(group=>group.open=false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const open = groups.find(group=>group.open);
    if (open) {open.open=false;open.querySelector('summary').focus();}
    else if (toggle.getAttribute('aria-expanded')==='true') {toggle.click();toggle.focus();}
  }
});

const hero = document.querySelector('.hero');
if (hero) {
  const slides = [...hero.querySelectorAll('.hero-slide')];
  if (slides.length > 1) {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let visible = true;
    let timer;
    let request = 0;

    function schedule() {
      clearTimeout(timer);
      request++;
      if (!reducedMotion.matches && visible && !document.hidden) {
        timer = setTimeout(async () => {
          await advance();
          schedule();
        }, 5000);
      }
    }

    async function advance() {
      const ticket = request;
      // Skip unavailable photos and keep the current photo until the next is ready.
      for (let offset = 1; offset < slides.length; offset++) {
        const next = (current + offset) % slides.length;
        try { await slides[next].decode(); } catch { continue; }
        if (ticket !== request) return;
        slides[current].classList.remove('is-current');
        slides[current].setAttribute('aria-hidden', 'true');
        slides[next].classList.add('is-current');
        slides[next].removeAttribute('aria-hidden');
        current = next;
        return;
      }
    }

    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', schedule);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(hero);
    schedule();
  }
}
