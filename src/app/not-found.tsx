import { NotFoundBody } from '@/components/sections/NotFoundBody';
import { fontVariables } from '@/styles/fonts';

import '@/styles/globals.css';

/**
 * The 404 for a URL with no usable locale prefix — a mistyped or broken
 * inbound link.
 *
 * Next renders this in a document shell it owns: because the root layout lives
 * at `[locale]/layout.tsx`, there is no root layout for Next to wrap this in,
 * and the `<html>` it emits carries no `lang`. Rendering an `<html>` here
 * produces one nested inside another, so this supplies only the body. See
 * DECISIONS.md.
 *
 * The font variables and the base type are declared on the wrapper rather than
 * inherited. Rendering outside every layout means `body` never sees them, so
 * its own `font-family` resolves to nothing and everything below inherits that
 * failure — the page came out in the system font. Declaring them here puts it
 * back into the site's typefaces.
 */
export default function NotFound() {
  return (
    <main
      className={`${fontVariables} font-scope flex min-h-dvh flex-col bg-surface font-sans text-body leading-body text-primary`}
    >
      <NotFoundBody />
    </main>
  );
}
