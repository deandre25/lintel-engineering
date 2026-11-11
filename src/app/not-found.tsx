import { Container } from '@/components/ui/Container';
import { company } from '@/content/company';
import { localeTags, locales, routePath } from '@/lib/routing';
import { fontVariables } from '@/styles/fonts';

import '@/styles/globals.css';

import enMessages from '../../messages/en.json';
import roMessages from '../../messages/ro.json';

/**
 * The 404 for a URL that matched no route at all.
 *
 * Next renders this inside its own document shell, which it owns: because the
 * root layout lives at `[locale]/layout.tsx`, there is no root layout for Next
 * to wrap this in, and the `<html>` it emits carries no `lang`. Rendering an
 * `<html>` here instead produces one nested inside another. The limitation is
 * recorded in DECISIONS.md with the options for closing it.
 *
 * It is bilingual rather than localised. A path that matched no route has no
 * locale segment to read, and guessing one would be worse than showing both:
 * the site has exactly two languages, and a lost visitor reads one of them.
 * `lang` is set per block so each is announced in the right voice.
 */
const MESSAGES = { en: enMessages.notFound, ro: roMessages.notFound };

export default function NotFound() {
  return (
    <main className={`${fontVariables} flex min-h-dvh flex-col bg-surface text-primary`}>
      {/*
       * `not-found.tsx` cannot export metadata, so the title is rendered as an
       * element: React hoists it into the head. It is in both languages for
       * the same reason the page is.
       */}
      <title>{`${MESSAGES.en.title} — ${MESSAGES.ro.title}`}</title>

      <Container width="bleed" as="section" className="pt-section-tight pb-section">
        <p className="font-display text-h2 leading-tight text-accent tabular-nums">404</p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          {locales.map((locale) => {
            const copy = MESSAGES[locale];

            return (
              <section
                key={locale}
                lang={localeTags[locale]}
                className="lg:col-span-5 lg:[&:last-child]:col-start-8"
              >
                <h1 className="font-display text-h4 leading-snug tracking-tight text-balance">
                  {copy.title}
                </h1>
                <p className="mt-4 max-w-measure leading-relaxed text-secondary">{copy.body}</p>

                <ul className="mt-6 flex flex-col border-t border-rule">
                  <li className="border-b border-rule">
                    <a
                      href={routePath(locale, 'home')}
                      hrefLang={locale}
                      className="block py-3 underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {copy.home}
                    </a>
                  </li>
                  <li className="border-b border-rule">
                    <a
                      href={routePath(locale, 'services')}
                      hrefLang={locale}
                      className="block py-3 underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {copy.services}
                    </a>
                  </li>
                  <li className="border-b border-rule">
                    <a
                      href={routePath(locale, 'contact')}
                      hrefLang={locale}
                      className="block py-3 underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {copy.contact}
                    </a>
                  </li>
                </ul>
              </section>
            );
          })}
        </div>

        <p className="mt-10 border-t border-rule pt-6 text-micro text-muted">
          {enMessages.footer.disclosure} — {company.name}
        </p>
      </Container>
    </main>
  );
}
