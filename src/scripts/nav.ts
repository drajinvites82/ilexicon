// Mobile nav sheet (spec §4.1): toggle, aria-expanded, focus trap, Esc to close.
const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
const sheet = document.getElementById('nav-sheet');

if (toggle && sheet) {
  const focusables = () => [toggle, ...sheet.querySelectorAll<HTMLElement>('a[href], button')];

  const setOpen = (open: boolean, moveFocus = true) => {
    sheet.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('nav-open', open);
    if (moveFocus) (open ? focusables()[1] : toggle)?.focus();
  };

  toggle.addEventListener('click', () => setOpen(sheet.hidden));

  document.addEventListener('keydown', (e) => {
    if (sheet.hidden) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Closing the sheet when the viewport grows past the breakpoint
  matchMedia('(min-width: 48rem)').addEventListener('change', (m) => { if (m.matches && !sheet.hidden) setOpen(false, false); });
}
