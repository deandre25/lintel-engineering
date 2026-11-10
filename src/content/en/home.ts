import { homeSchema } from '../schema';

import type { Home } from '../schema';

export const home: Home = homeSchema.parse({
  title: 'Engineering judgement for projects that are technically contested',
  description:
    'Independent engineering consultancy in Brașov. Structural certification, plant retrofits and engineering risk, for manufacturers and public bodies.',

  hero: {
    eyebrow: 'Brașov, Romania',
    heading: 'Engineering judgement for projects that are technically contested',
    lead: 'Forty-eight people in one office in Brașov. Manufacturers, developers and public infrastructure bodies bring us work that has stalled: a structure that has to be certified, a production line that has to move to a new control platform without a shutdown, an acquisition whose engineering risk has to be priced before the deal closes.',
  },

  positioning: {
    heading: 'We advise, we do not build',
    body: [
      'Lintel was founded in 2009 by three engineers who had spent the previous decade on the contractor side, and who kept meeting the same problem from the wrong end of it: a technical question that had become a commercial one, with a deadline attached and nobody willing to put a number on the risk.',
      'We are independent of contractors, suppliers and vendors. We hold no distribution agreements and take no commission on equipment. When we recommend a course of action, our interest in it is that it is correct.',
      'Work reaches us in three ways. A client cannot get an authority to accept a design. A plant has to change while it keeps running. A buyer needs the engineering condition of an asset established before a date that will not move.',
    ],
  },

  disciplines: {
    heading: 'Six services, grouped under three disciplines',
    standfirst:
      'Each discipline is a standing team with its own lead, and the headcounts below add up to the 48 people in the office.',
  },

  work: {
    heading: 'Selected work',
    standfirst:
      'Four engagements, each described with the constraint that shaped it and the number the client measured us by.',
    cta: 'Read all four',
  },

  figures: {
    heading: 'The firm in figures',
    items: [
      { term: 'Founded', description: '2009, by three engineers' },
      { term: 'People', description: '48, in one office' },
      {
        term: 'Disciplines',
        description: 'Three: structures, industrial systems, information and risk',
      },
      { term: 'Where we work', description: 'Romania, Hungary and southern Germany' },
    ],
  },

  engagement: {
    heading: 'How an engagement starts',
    body: [
      'Tell us what has stalled and when it has to be resolved. We will tell you within two working days whether we are the right firm for it, and if we are not, we will usually know who is.',
      'A first conversation is with the engineer who would lead the work, not with a salesperson.',
      'We quote a fixed fee against a written scope. Where the scope cannot be fixed because the condition of an asset is unknown, we say so, and price the investigation separately from the work that follows it.',
    ],
    cta: 'Tell us what has stalled',
  },

  insights: {
    heading: 'Writing',
    standfirst: 'Notes on problems we meet often enough to have formed a view about.',
    cta: 'Read the insights',
  },
});
