import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reads the colour tokens out of `src/styles/tokens.css`.
 *
 * Parsing the stylesheet rather than duplicating the values in TypeScript means
 * the contrast test and the styleguide report on what the site actually ships.
 * A copy would drift, and a drifting copy would report passes that are not real.
 *
 * Node-only: this is for tests and build-time tooling, never a component.
 */

const TOKENS_PATH = join(process.cwd(), 'src', 'styles', 'tokens.css');

const HEX_DECLARATION = /^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6});/gm;

export function readColorTokens(): Record<string, string> {
  /*
   * The path is a constant rather than a parameter so Next can see it is
   * statically scoped. With a parameter, tracing cannot prove what is read and
   * includes the entire project in the server output.
   */
  const css = readFileSync(TOKENS_PATH, 'utf8');
  const tokens: Record<string, string> = {};

  for (const match of css.matchAll(HEX_DECLARATION)) {
    const [, name, value] = match;
    if (name === undefined || value === undefined) continue;
    tokens[name] = value;
  }

  return tokens;
}
