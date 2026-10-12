// Scroll reveal, nav bottom rule and Services side-index tracking (spec §3.9). No framework.
document.documentElement.classList.add('js');

const nav = document.getElementById('site-nav');
const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 0);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduced || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px' });
  targets.forEach((el) => io.observe(el));
}

// Services side index: mark the section nearest the top as aria-current="location"
const indexLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-side-index] a[href^="#"]')];
const sections = indexLinks.map((a) => document.getElementById(a.hash.slice(1))).filter((s): s is HTMLElement => !!s);
if (sections.length) {
  const setCurrent = () => {
    const y = window.scrollY + 120;
    const active = sections.reduce((best, s) => (s.offsetTop <= y ? s : best), sections[0]);
    indexLinks.forEach((a) => a.hash === `#${active.id}` ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
  };
  setCurrent();
  addEventListener('scroll', setCurrent, { passive: true });
}
