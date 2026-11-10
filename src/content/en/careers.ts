import { z } from 'zod';

import { heading, metaDescription, paragraphs, prose, vacancySchema } from '../schema';

const careersSchema = z.object({
  title: heading,
  description: metaDescription,
  intro: prose,
  working: z.object({ heading, body: paragraphs }),
  process: z.object({ heading, body: paragraphs }),
  vacancies: z.array(vacancySchema).length(3),
  speculative: z.object({ heading, body: paragraphs }),
});

/**
 * Three open positions.
 *
 * Written the way the rest of the site is written: what the job is, what it
 * pays attention to, and what the firm will not pretend about it. Benefits are
 * stated as facts rather than as a culture section.
 */
export const careers = careersSchema.parse({
  title: 'Three open positions, and what the work is actually like',
  description:
    'Open engineering positions at Lintel Engineering in Brașov: structural assessment, control systems and technical due diligence, with the terms stated.',
  intro:
    'We hire engineers who are comfortable saying what they do not know yet. Most of our work involves giving a client an answer they will act on, which means the useful skill is knowing precisely how confident to be.',

  working: {
    heading: 'What the work is like',
    body: [
      'You will be on site more than most consultancy roles: typically two to five days a month, sometimes in a plant during a shutdown or a building with no services connected. Site work is planned, not improvised, and nobody is sent alone to an unfamiliar structure.',
      'You will write. Every engagement ends in a report that somebody spends money on the strength of, and the standard for those reports is the same standard as the rest of this site: specific, bounded, and clear about which parts are measured and which are inferred.',
      'Reports are reviewed by a second engineer before they are issued, including the discipline leads’ reports. Having your work checked is a permanent condition here rather than a stage you pass through.',
      'We do not run a billable-hours target. We price fixed fees against written scopes, and the pressure that creates is on scoping accurately rather than on recording time.',
    ],
  },

  process: {
    heading: 'How we hire',
    body: [
      'A first conversation with the discipline lead, about an hour, about what you have worked on.',
      'A technical discussion built on a real engagement with the client details removed. We send it to you two days beforehand. It is a conversation about how you would approach it, not a test with a right answer, and we are interested in the questions you ask about the brief.',
      'A half-day in the office, meeting the team you would join, including at least one person who joined in the last two years.',
      'We give a decision within five working days of the final stage, and we give reasons whichever way it goes.',
    ],
  },

  vacancies: [
    {
      slug: 'structural-engineer-assessment',
      title: 'Structural engineer, assessment and certification',
      discipline: 'structures',
      location: 'Brașov, with site work across Romania and Hungary',
      commitment: 'Full time, permanent',
      experience: 'Four or more years in structural design or assessment',
      summary:
        'Assessing and certifying existing structures: industrial buildings, crane runways and infrastructure that has to carry more than it was designed for.',
      responsibilities: [
        'Carry out assessments of existing structures, from site survey through analysis to issued report.',
        'Reconstruct load paths from measured geometry where original calculations are missing.',
        'Review other engineers’ designs against the governing code and national annex.',
        'Present findings to clients and, where the submission requires it, to the reviewing authority.',
      ],
      requirements: [
        'A degree in civil or structural engineering and four or more years in practice.',
        'Working knowledge of Eurocodes 0, 1, 2, 3 and 8, and comfort with a national annex you have not used before.',
        'Experience assessing existing structures rather than only designing new ones.',
        'Romanian and English. German or Hungarian is useful and is not required.',
      ],
      offer: [
        'Salary reviewed annually against a published band for the role, with the band shown to you before you accept.',
        'The professional membership and licensing route of your discipline paid for, including the time to prepare.',
        'Ten days a year for training or study, booked like any other commitment rather than fitted around the work.',
        'A defined on-site allowance and no expectation that travel is absorbed into your own time.',
      ],
    },
    {
      slug: 'control-systems-engineer',
      title: 'Control systems engineer, migration and commissioning',
      discipline: 'industrial-systems',
      location: 'Brașov, with site work across Romania, Hungary and southern Germany',
      commitment: 'Full time, permanent',
      experience: 'Three or more years in industrial control systems',
      summary:
        'Planning and supervising control platform migrations on production lines that cannot stop for long, and the commissioning that follows.',
      responsibilities: [
        'Survey installed control systems and reconcile what is there against what the documentation claims.',
        'Plan cutover sequences around a production calendar, including parallel running periods.',
        'Write acceptance criteria before work starts and witness the testing against them.',
        'Assess the effect of a change on safety functions, and say so in writing when there is one.',
      ],
      requirements: [
        'A degree in electrical, control or automation engineering and three or more years in practice.',
        'Hands-on experience with at least two PLC platforms, and the willingness to work on a third you do not know.',
        'Familiarity with EN ISO 13849 or EN 62061 in practice rather than only in training.',
        'Romanian and English, or German and English.',
      ],
      offer: [
        'Salary reviewed annually against a published band for the role, with the band shown to you before you accept.',
        'Vendor training on the platforms we work with, paid, including the certifications that have to be renewed.',
        'Ten days a year for training or study, booked like any other commitment.',
        'Shutdown work is planned months ahead and compensated as overtime, not expected as goodwill.',
      ],
    },
    {
      slug: 'engineer-technical-due-diligence',
      title: 'Engineer, technical due diligence',
      discipline: 'information-and-risk',
      location: 'Brașov, with site work across Romania and Hungary',
      commitment: 'Full time, permanent',
      experience: 'Three or more years in plant engineering, maintenance or asset management',
      summary:
        'Establishing the engineering condition of industrial assets before somebody buys them, against a deal timetable that does not move.',
      responsibilities: [
        'Carry out site assessments of operating plants within restricted access windows.',
        'Read a vendor data room against the asset itself and report where the two disagree.',
        'Build capital expenditure forecasts as a profile over years, with the assumptions visible.',
        'Produce red-flag summaries in week one, when the information is incomplete and still useful.',
      ],
      requirements: [
        'A degree in mechanical, electrical, process or civil engineering and three or more years in practice.',
        'Experience of operating plant, from either the maintenance or the operations side.',
        'The judgement to write a bounded conclusion from incomplete information, and to say where the bounds are.',
        'Romanian and English.',
      ],
      offer: [
        'Salary reviewed annually against a published band for the role, with the band shown to you before you accept.',
        'Transaction work is intense and finite; we track hours during a deal and give the time back afterwards.',
        'Ten days a year for training or study, booked like any other commitment.',
        'Direct client contact from the first engagement, with a discipline lead alongside rather than in front.',
      ],
    },
  ],

  speculative: {
    heading: 'If none of these is you',
    body: [
      'We read speculative applications and we reply to all of them, usually within two weeks. Tell us what you have worked on and what you would want to work on here.',
      'We are a small firm and we are honest about the limits of that: we recruit two to five people a year, and a speculative application may wait months for a role that fits. We will tell you if that is the situation rather than leaving you to guess.',
    ],
  },
});
