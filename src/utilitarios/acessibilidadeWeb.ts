// RN Web cached navigation screens need inert, not aria-hidden alone.
export function instalarAcessibilidadeWeb() {
  if (typeof document === 'undefined') return () => {};
  const managed = new Set<HTMLElement>();
  const sync = () => {
    managed.forEach(el => { if (!el.isConnected || el.getAttribute('aria-hidden') !== 'true') { el.inert = false; managed.delete(el); } });
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => { if (el instanceof HTMLElement && !el.inert) { el.inert = true; managed.add(el); } });
  };
  sync(); const observer = new MutationObserver(sync); observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-hidden'] });
  const keydown = (event: KeyboardEvent) => {
    const el = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[role="checkbox"],[role="radio"],[role="tab"]') : null;
    if (!el || el.closest('[aria-hidden="true"],[inert]') || el.getAttribute('aria-disabled') === 'true' || el.matches(':disabled')) return;
    const role = el.getAttribute('role');
    if (event.key === ' ' && el.tagName !== 'INPUT') { event.preventDefault(); if (!event.repeat) el.click(); return; }
    const group = el.closest(role === 'tab' ? '[role="tablist"]' : '[role="radiogroup"]');
    if (!group || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    const options = Array.from(group.querySelectorAll<HTMLElement>(`[role="${role}"]`)).filter(x => !x.closest('[aria-hidden="true"],[inert]') && x.getAttribute('aria-disabled') !== 'true');
    if (!options.length) return; event.preventDefault();
    const index = options.indexOf(el); const direction = ['ArrowLeft','ArrowUp'].includes(event.key) ? -1 : 1;
    const next = event.key === 'Home' ? options[0] : event.key === 'End' ? options[options.length-1] : options[(index + direction + options.length) % options.length];
    next.focus(); next.click(); requestAnimationFrame(() => requestAnimationFrame(() => next.isConnected && next.focus()));
  };
  document.addEventListener('keydown', keydown);
  return () => { observer.disconnect(); document.removeEventListener('keydown', keydown); managed.forEach(el => { el.inert = false; }); };
}
