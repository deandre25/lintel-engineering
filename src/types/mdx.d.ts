/// <reference types="mdx" />

/*
 * Pulls in the `*.mdx` module declarations from `@types/mdx`, so importing an
 * article gives an `MDXContent` component rather than `any`. Without this
 * reference the declarations are not in the program, and every article import
 * is an error-typed value that the no-unsafe-assignment rule rejects.
 */
