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
 */
export default function NotFound() {
  return (
    <main className={`${fontVariables} flex min-h-dvh flex-col bg-surface text-primary`}>
      <NotFoundBody />
    </main>
  );
}
