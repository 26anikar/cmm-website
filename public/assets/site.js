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
  const controls = hero.querySelector('.slideshow-controls');
  if (slides.length > 1 && controls) {
    const rotation = controls.querySelector('.slideshow-toggle');
    const position = controls.querySelector('.slideshow-position');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let paused = reducedMotion.matches;
    let hovered = false;
    let visible = true;
    let timer;
    let request = 0;

    function schedule() {
      clearTimeout(timer);
      if (!paused && !hovered && visible && !document.hidden) {
        timer = setTimeout(async () => {
          await show(current + 1);
          schedule();
        }, 5000);
      }
    }

    function setPaused(value) {
      paused = value;
      if (paused) request++;
      rotation.textContent = paused ? 'Play' : 'Pause';
      rotation.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} banner slideshow`);
      schedule();
    }

    async function show(index) {
      const ticket = ++request;
      const next = (index + slides.length) % slides.length;
      // Keep the current photo visible until its replacement is ready.
      try { await slides[next].decode(); } catch { return; }
      if (ticket !== request) return;
      slides[current].classList.remove('is-current');
      slides[current].setAttribute('aria-hidden', 'true');
      slides[next].classList.add('is-current');
      slides[next].removeAttribute('aria-hidden');
      current = next;
      position.textContent = `${current + 1} / ${slides.length}`;
    }

    controls.hidden = false;
    rotation.addEventListener('click', () => setPaused(!paused));
    controls.querySelectorAll('[data-slide]').forEach(button => {
      button.addEventListener('click', () => {
        setPaused(true);
        show(current + (button.dataset.slide === 'next' ? 1 : -1));
      });
    });
    hero.addEventListener('focusin', e => {
      if (e.target !== rotation) setPaused(true);
    });
    hero.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse') { hovered = true; schedule(); }
    });
    hero.addEventListener('pointerleave', () => { hovered = false; schedule(); });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) setPaused(true);
    });
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(hero);
    setPaused(paused);
  }
}
