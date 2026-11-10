import { Link } from './Link';

import type { DynamicRouteId, Locale, StaticRouteId } from '@/lib/routing';

/** A step that links to a route with no parameters. */
interface StaticCrumb {
  readonly label: string;
  readonly route: StaticRouteId;
  readonly slug?: never;
}

/** A step that links to a route carrying a slug, which the type requires. */
interface DynamicCrumb {
  readonly label: string;
  readonly route: DynamicRouteId;
  readonly slug: string;
}

/** The current page: no route, because it does not link to itself. */
interface CurrentCrumb {
  readonly label: string;
  readonly route?: never;
  readonly slug?: never;
}

export type Crumb = StaticCrumb | DynamicCrumb | CurrentCrumb;

export interface BreadcrumbProps {
  locale: Locale;
  /** Ordered from the site root to the current page, which comes last. */
  items: readonly Crumb[];
  /** Accessible name for the nav landmark, translated by the caller. */
  label: string;
}

const CRUMB_LINK_CLASS =
  'underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:text-primary';

/**
 * The trail to the current page.
 *
 * The last item is plain text carrying `aria-current="page"` rather than a link
 * to where the visitor already is. Separators sit outside the list items and
 * are `aria-hidden`, so a screen reader reads a list of steps instead of
 * announcing a slash between each one.
 *
 * The matching `BreadcrumbList` JSON-LD is generated in Phase 5 from this same
 * data, so the visible trail and the structured one cannot disagree.
 */
export function Breadcrumb({ locale, items, label }: BreadcrumbProps) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 text-micro text-muted">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${crumb.label}-${String(index)}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-ink-200">
                  /
                </span>
              ) : null}

              {isLast || crumb.route === undefined ? (
                <span aria-current={isLast ? 'page' : undefined} className="text-secondary">
                  {crumb.label}
                </span>
              ) : crumb.slug === undefined ? (
                <Link locale={locale} route={crumb.route} className={CRUMB_LINK_CLASS}>
                  {crumb.label}
                </Link>
              ) : (
                <Link
                  locale={locale}
                  route={crumb.route}
                  slug={crumb.slug}
                  className={CRUMB_LINK_CLASS}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
