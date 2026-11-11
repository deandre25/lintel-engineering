import { Container } from '@/components/ui/Container';
import { localeTags, locales, routePath } from '@/lib/routing';

import enMessages from '../../../messages/en.json';
import roMessages from '../../../messages/ro.json';

const MESSAGES = { en: enMessages.notFound, ro: roMessages.notFound };

/**
 * The 404, in both languages.
 *
 * Bilingual rather than localised, and deliberately so. Next renders a 404
 * without route params, so neither boundary that can reach this component
 * knows which language the visitor was reading. Guessing would show a Romanian
 * visitor an English page; showing both shows everyone their own.
 *
 * Every block carries its own `lang`, so no text here inherits language from
 * the document. That is what makes the missing `lang` on the shell Next owns a
 * formal defect rather than one a user experiences.
 *
 * One component, used by both `app/not-found.tsx` and
 * `app/[locale]/not-found.tsx`, so a visitor sees the same page whichever
 * boundary Next picks.
 */
export function NotFoundBody() {
  return (
    <>
      {/*
       * Rendered as an element because a `not-found.tsx` cannot export
       * metadata; React hoists it into the head. Both languages, for the same
       * reason the page is.
       */}
      <title>{`${MESSAGES.en.title} — ${MESSAGES.ro.title}`}</title>

      <Container width="bleed" as="section" className="pt-section-tight pb-section">
        <p className="font-display text-h2 leading-tight text-accent tabular-nums">404</p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          {locales.map((locale, index) => {
            const copy = MESSAGES[locale];

            return (
              <section
                key={locale}
                lang={localeTags[locale]}
                className={index === 0 ? 'lg:col-span-5' : 'lg:col-span-5 lg:col-start-8'}
              >
                <h1 className="font-display text-h4 leading-snug tracking-tight text-balance text-primary">
                  {copy.title}
                </h1>
                <p className="mt-4 max-w-measure leading-relaxed text-secondary">{copy.body}</p>

                <ul className="mt-6 flex flex-col border-t border-rule">
                  {(
                    [
                      { route: 'home', label: copy.home },
                      { route: 'services', label: copy.services },
                      { route: 'contact', label: copy.contact },
                    ] as const
                  ).map((item) => (
                    <li key={item.route} className="border-b border-rule">
                      <a
                        href={routePath(locale, item.route)}
                        hrefLang={locale}
                        className="block py-3 text-primary underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>
    </>
  );
}
