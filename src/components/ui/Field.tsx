import { useId } from 'react';

import type { ReactNode } from 'react';

/**
 * The attributes a field passes to whatever control it wraps.
 *
 * The control receives them rather than the field guessing at its markup, so an
 * input, a textarea and a select all get correctly wired without `Field`
 * knowing which it is holding.
 */
export interface FieldControlProps {
  readonly id: string;
  readonly name: string;
  readonly 'aria-describedby': string | undefined;
  readonly 'aria-invalid': boolean | undefined;
  readonly 'aria-required': boolean | undefined;
}

export interface FieldProps {
  label: string;
  name: string;
  /** Rendered with the control's attributes, which it must spread onto it. */
  children: (control: FieldControlProps) => ReactNode;
  /** Standing guidance, always visible. Not a replacement for the label. */
  hint?: string;
  /** Validation message. Its presence is what marks the field invalid. */
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * Label, control, hint and error as one accessible unit.
 *
 * `aria-describedby` points at the hint and the error together, so a screen
 * reader announces both rather than the error replacing the guidance. The error
 * is in an `aria-live="polite"` region, so it is announced when it appears
 * without interrupting what the user is typing (§10).
 *
 * The required marker is text, never a bare asterisk with colour doing the
 * work, because §11 forbids colour carrying meaning alone.
 */
export function Field({
  label,
  name,
  children,
  hint,
  error,
  required = false,
  className,
}: FieldProps) {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [hint === undefined ? null : hintId, error === undefined ? null : errorId]
    .filter((value): value is string => value !== null)
    .join(' ');

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className="text-caption font-medium text-primary">
        {label}
        {required ? null : <span className="ml-2 font-normal text-muted">(optional)</span>}
      </label>

      {hint === undefined ? null : (
        <p id={hintId} className="text-micro leading-relaxed text-muted">
          {hint}
        </p>
      )}

      {children({
        id,
        name,
        'aria-describedby': describedBy === '' ? undefined : describedBy,
        'aria-invalid': error === undefined ? undefined : true,
        'aria-required': required ? true : undefined,
      })}

      {/*
       * The region is always in the DOM, so assistive technology is already
       * observing it when the message arrives. Rendering it only on error
       * would mean the announcement is missed.
       */}
      <div id={errorId} aria-live="polite" className="text-micro text-accent">
        {error}
      </div>
    </div>
  );
}
