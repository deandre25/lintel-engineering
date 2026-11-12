import { BrandMark } from '@/components/graphics/BrandMark';
import { Container } from '@/components/ui/Container';
import { company } from '@/content/company';
import { localeTags, locales, routePath } from '@/lib/routing';

import enMessages from '../../../messages/en.json';
import roMessages from '../../../messages/ro.json';

const MESSAGES = { en: enMessages.notFound, ro: roMessages.notFound };

/**
 * The 404, in both languages, carrying its own chrome.
 *
 * Bilingual by necessity: Next renders a 404 without route params, so neither
 * boundary that reaches this component knows which language the visitor was
 * reading. Guessing would show a Romanian visitor an English page.
 *
 * Every block carries its own `lang`, so no text here inherits language from
 * the document. That is what makes the missing `lang` on the shell Next owns a
 * formal defect rather than one a user experiences.
 *
 * It brings its own wordmark and its own way back rather than inheriting the
 * locale layout, because the global boundary renders outside every layout. A
 * page that looks deliberately spare reads differently from one that looks
 * truncated by a constraint, and the difference costs one header row.
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

      <Container width="bleed" as="header" className="border-b border-rule py-5">
        <a href={routePath('en', 'home')} className="inline-flex items-center gap-3 text-primary">
          <BrandMark size={20} className="text-accent" />
          <span className="font-display text-h6 tracking-tight whitespace-nowrap">
            {company.name}
          </span>
        </a>
      </Container>

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

      <Container
        width="bleed"
        as="footer"
        className="mt-auto border-t border-rule py-6 text-micro text-muted"
      >
        <p>{enMessages.footer.disclosure}</p>
      </Container>
    </>
  );
}
