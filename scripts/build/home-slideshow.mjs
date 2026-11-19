// Enhance the editable homepage banner at build time, including after re-imports.
export function addHomeSlideshow($) {
  const hero=$('.hero');
  hero.attr({'aria-label':'Caltech Math Meet','aria-roledescription':'carousel'});
  hero.find('> img').addClass('hero-slide is-current');
  hero.append(`<img class="hero-slide" src="/assets/images/006423_cfd8e507197145298542093084af7c48~mv2.jpg" alt="Competitors gathered in a Caltech lecture hall" aria-hidden="true" decoding="async">
<img class="hero-slide" src="/assets/images/006423_cab1a08c2fc740d9a88ae461320d2a85~mv2.jpg" alt="A competitor working on an integral at the chalkboard" aria-hidden="true" decoding="async">`);
}
