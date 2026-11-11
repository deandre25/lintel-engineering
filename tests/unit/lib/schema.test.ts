import { describe, expect, it } from 'vitest';

import { getContent } from '@/content/registry';
import {
  articleSchema,
  breadcrumbFor,
  faqSchema,
  organizationSchema,
  serviceSchema,
} from '@/lib/schema';

/**
 * Shape assertions only. Whether a property is valid for its type is checked
 * against the real schema.org vocabulary by `scripts/validate-jsonld.mjs`,
 * which runs over the build output in CI — a copy of the vocabulary asserted
 * here would be a copy that drifts.
 */

describe('organizationSchema', () => {
  it('publishes a graph whose service references the organisation by id', () => {
    const graph = organizationSchema('en');
    expect(graph['@context']).toBe('https://schema.org');

    const [organisation, service] = graph['@graph'];
    expect(organisation?.['@type']).toBe('Organization');
    expect(service?.['@type']).toBe('ProfessionalService');
    expect(service?.parentOrganization).toEqual({ '@id': organisation?.['@id'] });
  });

  it('claims no profiles it does not have', () => {
    const [organisation] = organizationSchema('ro')['@graph'];
    expect(organisation).not.toHaveProperty('sameAs');
    expect(organisation).not.toHaveProperty('aggregateRating');
  });
});

describe('breadcrumbFor', () => {
  it('numbers the trail from one and leaves the current page without a URL', () => {
    const crumbs = breadcrumbFor(
      'ro',
      [
        { name: 'Acasă', route: 'home' },
        { name: 'Servicii', route: 'services' },
      ],
      'Inginerie structurală',
    );

    expect(crumbs.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: 'https://lintel-engineering.com/ro',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Servicii',
        item: 'https://lintel-engineering.com/ro/servicii',
      },
      { '@type': 'ListItem', position: 3, name: 'Inginerie structurală' },
    ]);
  });
});

describe('serviceSchema and articleSchema', () => {
  it('describes a service with the provider referenced rather than repeated', () => {
    const service = getContent('en').services[0];
    if (service === undefined) throw new Error('no services');

    const node = serviceSchema(service, 'https://lintel-engineering.com/en/services/x');
    expect(node['@type']).toBe('Service');
    expect(node.provider).toEqual({ '@id': 'https://lintel-engineering.com/#organization' });
  });

  it('carries datePublished and a named author on an article', () => {
    const insight = getContent('en').insights[0];
    if (insight === undefined) throw new Error('no insights');

    const node = articleSchema('en', insight, 'https://x.test/a', 'https://x.test/a/og');
    expect(node['@type']).toBe('Article');
    expect(node.datePublished).toBe(insight.publishedAt);
    expect(node.author).toEqual({ '@type': 'Person', name: insight.author });
  });
});

describe('faqSchema', () => {
  it('pairs every question with an answer', () => {
    const node = faqSchema([{ question: 'Q?', answer: 'A.' }]);

    expect(node.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'Q?',
        acceptedAnswer: { '@type': 'Answer', text: 'A.' },
      },
    ]);
  });
});
