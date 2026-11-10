/**
 * Selector for elements that can receive focus by tabbing.
 *
 * `[tabindex="-1"]` is deliberately excluded: such elements are focusable
 * programmatically but are not tab stops, so including them would let the trap
 * hand focus to something a keyboard user cannot reach on their own.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function focusableElementsWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.offsetParent !== null || element.getClientRects().length > 0,
  );
}

/**
 * Keeps Tab and Shift+Tab inside `container` by moving focus to the opposite
 * end when it would otherwise leave (§11).
 *
 * Returns whether it handled the event, so the caller decides about
 * `preventDefault` and this function stays free of side effects on the event.
 */
export function wrapTabFocus(container: HTMLElement, event: KeyboardEvent | React.KeyboardEvent) {
  if (event.key !== 'Tab') return false;

  const focusable = focusableElementsWithin(container);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (first === undefined || last === undefined) return false;

  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    last.focus();
    return true;
  }

  if (!event.shiftKey && active === last) {
    first.focus();
    return true;
  }

  return false;
}
