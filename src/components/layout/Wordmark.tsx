import { BrandMark } from '@/components/graphics/BrandMark';
import { Link } from '@/components/ui/Link';
import { company } from '@/content/company';

import type { Locale } from '@/lib/routing';

export interface WordmarkProps {
  locale: Locale;
  className?: string;
}

/**
 * The mark plus the company name, linking home.
 *
 * The name is one text node rather than two styled spans, so it reads as a
 * single accessible name and stays selectable; the colour shift on hover is on
 * the mark alone, which keeps the accent off the text.
 */
export function Wordmark({ locale, className }: WordmarkProps) {
  return (
    <Link
      locale={locale}
      route="home"
      className={['group inline-flex items-center gap-3 text-primary', className]
        .filter(Boolean)
        .join(' ')}
    >
      <BrandMark
        size={20}
        className="text-accent transition-colors group-hover:text-accent-strong"
      />
      <span className="font-display text-h6 leading-tight tracking-tight">{company.name}</span>
    </Link>
  );
}
