import { CONTROL_CLASS } from './controlStyles';

import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: readonly SelectOption[];
  /** Shown as a disabled first option when nothing is selected yet. */
  placeholder?: string;
  className?: string;
}

/**
 * A native select.
 *
 * Native because the platform control is keyboard accessible, works on touch,
 * and is announced correctly in every screen reader — none of which is true of
 * a div-based replacement without far more code than this page needs.
 *
 * The placeholder option is `disabled`, so it cannot be submitted as a value.
 */
export function Select({ options, placeholder, className, ...rest }: SelectProps) {
  return (
    <select
      className={[CONTROL_CLASS, 'appearance-none pr-10', className].filter(Boolean).join(' ')}
      defaultValue={placeholder === undefined ? undefined : ''}
      {...rest}
    >
      {placeholder === undefined ? null : (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
