import NextLink from 'next/link';

import { routePath } from '@/lib/routing';

import type { DynamicRouteId, Locale, StaticRouteId } from '@/lib/routing';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type AnchorRest = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;

interface CommonProps extends AnchorRest {
  children: ReactNode;
}

/** A route with no `[slug]`, which therefore takes no parameters. */
interface StaticRouteProps extends CommonProps {
  locale: Locale;
  route: StaticRouteId;
}

/** A route with a `[slug]`, where the slug is required by the type. */
interface DynamicRouteProps extends CommonProps {
  locale: Locale;
  route: DynamicRouteId;
  slug: string;
}

/** An address outside the route registry: mailto, tel, or another origin. */
interface ExternalProps extends CommonProps {
  href: string;
}

export type LinkProps = StaticRouteProps | DynamicRouteProps | ExternalProps;

function isExternal(props: LinkProps): props is ExternalProps {
  return 'href' in props;
}

function hasSlug(props: StaticRouteProps | DynamicRouteProps): props is DynamicRouteProps {
  return 'slug' in props;
}

/**
 * The only way internal links are written in this codebase.
 *
 * Callers name a route from the registry, not a path, so a localised slug can
 * never be hard-coded into a component and a renamed route is a type error
 * rather than a 404 found later. External addresses pass `href` instead, and
 * cross-origin ones get `rel="noreferrer"` without each caller remembering.
 */
export function Link(props: LinkProps) {
  if (isExternal(props)) {
    const { href, children, ...rest } = props;
    const crossOrigin = /^https?:\/\//.test(href);

    return (
      <a href={href} {...(crossOrigin ? { rel: 'noreferrer', target: '_blank' } : {})} {...rest}>
        {children}
      </a>
    );
  }

  if (hasSlug(props)) {
    const { locale, route, slug, children, ...rest } = props;

    return (
      <NextLink href={routePath(locale, route, slug)} hrefLang={locale} {...rest}>
        {children}
      </NextLink>
    );
  }

  const { locale, route, children, ...rest } = props;

  return (
    <NextLink href={routePath(locale, route)} hrefLang={locale} {...rest}>
      {children}
    </NextLink>
  );
}
