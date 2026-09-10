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
