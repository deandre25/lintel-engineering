import { z } from 'zod';

import { heading, metaDescription, paragraphs, prose, teamMemberSchema } from '../schema';

const aboutSchema = z.object({
  title: heading,
  description: metaDescription,
  intro: prose,
  story: z.object({ heading, body: paragraphs }),
  howWeAreOrganised: z.object({ heading, body: paragraphs }),
  team: z.object({ heading, standfirst: prose, members: z.array(teamMemberSchema).length(4) }),
});

/**
 * The about page and the four people on it.
 *
 * Credentials are generic — discipline, degree field, years — and there are no
 * photographs, per §3 and §6. The names are invented.
 */
export const about = aboutSchema.parse({
  title: 'A firm of 48 people who are asked the difficult half of the question',
  description:
    'Lintel Engineering in Brașov: founded 2009, 48 people across three disciplines, independent of contractors, suppliers and equipment vendors.',
  intro:
    'We are an independent engineering consultancy in Brașov, founded in 2009. We do not design from scratch very often and we do not build at all. We are usually brought in when something has to be established rather than created.',

  story: {
    heading: 'Why the firm exists',
    body: [
      'The three founders had spent the previous decade with contractors and plant operators, and had each spent too long waiting for a technical question to be answered by somebody whose commercial interest depended on the answer.',
      'Lintel was set up to be the firm that gives the answer without that problem. We hold no distribution agreements, take no commission on equipment, and do not bid for the construction work that follows from our advice.',
      'The firm has grown from three people to 48 without opening a second office. Proximity matters more than coverage for the kind of work we do: most engagements involve somebody being on site within a week, and a Brașov base reaches the manufacturing corridor through Transylvania, into Hungary and down into southern Germany.',
    ],
  },

  howWeAreOrganised: {
    heading: 'How we are organised',
    body: [
      'Three disciplines, each with a standing team and a lead who is a practising engineer rather than a manager: structures with 21 people, industrial systems with 17, and information and risk with 10.',
      'Engagements are led by the engineer who will do the work. The person at the first meeting is the person who signs the report, and there is no account management layer between the two.',
      'Reports are reviewed by a second engineer from a different discipline before they are issued. That is slower, and it has caught enough mistakes to be worth the delay.',
    ],
  },

  team: {
    heading: 'Who leads the work',
    standfirst:
      'The three discipline leads and the engineer who runs our site investigation work. All four are practising engineers who sign reports.',
    members: [
      {
        name: 'Adriana Pîrvu',
        role: 'Discipline lead, structures',
        discipline: 'structures',
        qualification: 'Structural engineering, MSc civil engineering, 22 years in practice',
        joined: 2009,
        biography:
          'A founder. Spent eleven years with a contractor on industrial and infrastructure projects before Lintel, mostly on the side that has to build what somebody else drew. Leads the structural assessment and certification work, and takes most of the cases where an authority has already said no once.',
      },
      {
        name: 'Tobias Rennert',
        role: 'Discipline lead, industrial systems',
        discipline: 'industrial-systems',
        qualification:
          'Control engineering, Dipl.-Ing. electrical engineering, 19 years in practice',
        joined: 2012,
        biography:
          'Joined from a machine builder in Baden-Württemberg, where he commissioned lines across central Europe. Leads control migration and commissioning, and is responsible for the practice of running old and new systems in parallel for long enough to find what the drawings left out.',
      },
      {
        name: 'Sorin Bălan',
        role: 'Discipline lead, information and risk',
        discipline: 'information-and-risk',
        qualification: 'Mechanical engineering, MEng, 17 years in practice',
        joined: 2015,
        biography:
          'Came to due diligence from plant maintenance, which is a useful direction to arrive from: he had spent years producing the records that a buyer later has to decide whether to believe. Leads transaction work and the information management side of coordination.',
      },
      {
        name: 'Elena Marcu',
        role: 'Principal engineer, site investigation',
        discipline: 'structures',
        qualification: 'Materials engineering, PhD materials science, 14 years in practice',
        joined: 2017,
        biography:
          'Runs the investigation and instrumentation work across all three disciplines: sampling, monitoring, and the planning of access windows that cannot be repeated. Designed the 72-hour programme used on the river intake assessment, and the approach to leaving instruments behind that it depended on.',
      },
    ],
  },
});
