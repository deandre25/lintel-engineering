import type { MDXComponents } from 'mdx/types';

/**
 * Components MDX uses when rendering an article.
 *
 * Deliberately empty of overrides: article markup is styled by the `.prose`
 * rules in globals.css, which the page wraps the content in. Mapping every
 * element to a styled component here would duplicate those rules and leave two
 * places to change when the typography moves.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
