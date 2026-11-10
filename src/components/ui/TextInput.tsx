import { CONTROL_CLASS } from './controlStyles';

import type { InputHTMLAttributes } from 'react';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
}

/** A single-line text control. `type` defaults to `text`, never to a guess. */
export function TextInput({ className, type = 'text', ...rest }: TextInputProps) {
  return (
    <input type={type} className={[CONTROL_CLASS, className].filter(Boolean).join(' ')} {...rest} />
  );
}
