import { buttonClassName } from './buttonStyles';
import { Link } from './Link';

import type { ButtonSize, ButtonVariant } from './buttonStyles';
import type { LinkProps } from './Link';

export type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/**
 * A link styled as a button, for navigation that needs a button's prominence.
 *
 * It delegates to `Link`, so it takes a route from the registry rather than an
 * href and inherits the same localised-slug resolution. It stays an anchor, so
 * middle-click, copy-link and the context menu all behave as a visitor expects.
 */
export function ButtonLink({ variant = 'primary', size = 'md', ...props }: ButtonLinkProps) {
  const className = buttonClassName(variant, size, props.className);

  return <Link {...props} className={className} />;
}
