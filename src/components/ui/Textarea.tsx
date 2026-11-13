import { CONTROL_CLASS } from './controlStyles';

import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  className?: string;
}

/**
 * A multi-line text control.
 *
 * `rows` defaults to 6 so the box suggests the length of answer wanted, and
 * resizing is left vertical-only: horizontal resize breaks the measure.
 */
export function Textarea({ className, rows = 6, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={[CONTROL_CLASS, 'resize-y', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
