import { buttonClassName } from './buttonStyles';

import type { ButtonSize, ButtonVariant } from './buttonStyles';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * A button that performs an action in the page.
 *
 * `type` defaults to `button`, not `submit`: a button inside a form with no
 * explicit type submits it, which is the most common way a secondary control
 * turns into an accidental submission.
 *
 * For navigation use `ButtonLink` — a link that looks like a button. Nothing
 * here renders an anchor, so a "button" is never a div with a click handler.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
