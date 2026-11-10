'use client';

import { useId, useState } from 'react';

import type { ReactNode } from 'react';

export interface DisclosureProps {
  summary: string;
  children: ReactNode;
  /** Open on first render. Used for the first item of an FAQ. */
  defaultOpen?: boolean;
}

/**
 * A show/hide section, built as a real `button` with `aria-expanded`.
 *
 * Deliberately not `<details>`/`<summary>`: that element cannot be animated
 * reliably, its open state is not exposed as `aria-expanded` in every
 * screen-reader pairing, and styling the marker away differs per browser. §11
 * calls for a button, so this is a button.
 *
 * The panel is unmounted when closed rather than hidden with CSS, so its links
 * are not reachable by Tab while invisible — the common keyboard trap in
 * accordions.
 */
export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = `${panelId}-button`;

  return (
    <div className="border-b border-rule">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => {
            setIsOpen((open) => !open);
          }}
          className="flex w-full items-start justify-between gap-5 py-5 text-left transition-colors hover:text-accent"
        >
          <span className="font-display text-h5 leading-snug text-primary">{summary}</span>
          {/*
           * A plus that becomes a minus: two rules, one rotated away. Drawn
           * rather than imported, and hidden from assistive technology because
           * `aria-expanded` already conveys the state.
           */}
          <span aria-hidden="true" className="relative mt-2 block size-4 shrink-0">
            <span className="absolute top-2 block h-px w-4 bg-current" />
            <span
              className={`absolute top-2 block h-px w-4 bg-current transition-transform ${
                isOpen ? 'rotate-0' : 'rotate-90'
              }`}
            />
          </span>
        </button>
      </h3>

      {isOpen ? (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-6">
          {children}
        </div>
      ) : null}
    </div>
  );
}
