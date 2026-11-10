import { Container } from '@/components/ui/Container';
import { company } from '@/content/company';
import { locales } from '@/lib/routing';

import type { Locale } from '@/lib/routing';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Home page shell.
 *
 * Phase 1 renders only the document skeleton and the type scale in anger, so
 * the layout, fonts and tokens can be judged before any section component
 * exists. The copy here is the positioning line from `content/company.ts`; the
 * real home page is assembled in Phase 4 from the content written in Phase 3.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <Container width="bleed" as="section" className="py-section">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="text-micro font-medium tracking-eyebrow text-accent uppercase">
            {company.address.city}, {company.address.country}
          </p>
          <h1 className="mt-6 font-display text-h1 leading-display tracking-display text-balance text-primary">
            {company.positioning[locale]}
          </h1>
          <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">
            {company.name} has advised manufacturers, developers and public infrastructure bodies
            since {company.founded}. {company.headcount} engineers across{' '}
            {company.disciplines.length} disciplines, working from {company.address.city}.
          </p>
        </div>
      </div>
    </Container>
  );
}
