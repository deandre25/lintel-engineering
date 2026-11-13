import { z } from 'zod';

import { caseStudySchema } from '../schema';

import type { CaseStudy } from '../schema';

/**
 * The four case studies, newest first.
 *
 * Clients are described by type and never named (§3). Every outcome carries a
 * number the client could have measured, and each study reports at least one
 * finding that differed from what the paperwork said, because that is what the
 * method is for.
 */
export const caseStudies: readonly CaseStudy[] = z
  .array(caseStudySchema)
  .length(4)
  .parse([
    {
      id: 'steel-hall-crane-recertification',
      slug: 'steel-hall-crane-recertification',
      title: 'Recertifying a 1972 steel hall for a heavier crane',
      description:
        'A contractor priced 44 strengthened connections and a roof removal. Measuring the hall instead reduced the scope to eleven, with the roof left closed.',
      sector: 'Automotive components',
      location: 'Near Sibiu, Romania',
      year: 2023,
      duration: '11 weeks',
      client: 'A Tier-1 automotive supplier',
      headline: { value: '11 of 44', label: 'connections that actually needed strengthening' },
      summary:
        'A hall designed in 1972 for a 12.5-tonne crane had to take a 32-tonne one. Measuring the structure replaced three stacked conservative assumptions with numbers.',
      services: ['structural-engineering'],
      constraint: {
        heading: 'The constraint',
        body: [
          "The plant needed a 32-tonne overhead crane in a hall whose runway had been designed in 1972 for 12.5 tonnes. A contractor's initial assessment concluded that 44 connections required strengthening and that the roof would have to be removed for access: a 14-week stop in a hall running three shifts, which was longer than the programme the new crane had been bought for.",
          'The original drawings covered the portal frames. They did not cover the runway beams, the bracket connections to the columns, or the foundations. Nobody could say whether the 44 connections were genuinely inadequate, or whether the figure was the product of conservative assumptions stacked on top of each other.',
        ],
      },
      approach: {
        heading: 'What we did',
        body: [
          'We surveyed the hall over nine days, including the connections the contractor had assessed from drawings. Four of the runway brackets were not the detail shown on the 1972 drawings. They had been modified, probably during an earlier crane change, and the modification was better than the original.',
          "We took material samples from six locations. The steel tested consistently above the grade assumed in the contractor's assessment, which had used the minimum specified value for the period.",
          'We instrumented the existing crane and recorded 11 days of duty. That established that the load spectrum was substantially lighter than the classification the contractor had applied, and that the governing case was not global capacity but fatigue at the runway bracket welds: a different problem, in a different place, from the one being priced.',
          'We reanalysed to the current Eurocode with the Romanian national annex, using measured geometry, measured material properties and the recorded duty spectrum.',
        ],
      },
      outcome: {
        heading: 'The result',
        body: [
          'Eleven connections required strengthening rather than 44. All eleven were reachable from inside the building using a mobile platform between shifts, and the roof was never opened.',
          'Production stopped for two weekend shifts instead of 14 weeks. The strengthening was completed over four weeks of evening work, and the crane was commissioned 11 weeks after we were appointed.',
          'We also reported two things the client had not asked about: a column base with section loss that was not governing but would be within about eight years, and a bracket on the opposite runway carrying the same unrecorded modification, which we recommended they record before the next crane change.',
        ],
      },
      reflection: {
        heading: 'What made the difference',
        body: [
          "The contractor's assessment was not wrong. It was an assessment of the drawings, carried out with the assumptions that are correct when you have no better information: minimum material grade, nominal geometry, a conservative duty classification. Three conservative assumptions multiply.",
          'Measuring the structure replaced each assumption with a number. The survey, sampling and instrumentation cost a small fraction of the strengthening they removed from the scope, which is the usual relationship on buildings of this age.',
        ],
      },
    },

    {
      id: 'press-line-control-migration',
      slug: 'press-line-control-migration',
      title: 'Moving a press line to a new control platform inside the summer window',
      description:
        'A press line had to change its control platform without a stop longer than nine days. Parallel running found an interlock that no drawing recorded.',
      sector: 'Automotive components',
      location: 'Outside Brașov, Romania',
      year: 2024,
      duration: '7 months',
      client: 'A Tier-1 automotive supplier',
      headline: { value: '6 days', label: 'of the nine-day shutdown window left unused' },
      summary:
        'A control platform migration sequenced across three stops, with old and new controllers run in parallel for 40 days, which is where the undocumented behaviour appeared.',
      services: ['industrial-process-and-automation'],
      constraint: {
        heading: 'The constraint',
        body: [
          "A press line at an automotive supplier outside Brașov had to move to a new control platform. The platform was going out of support, and the line fed a sequence the plant could not buffer for long. The only stop available was the plant's existing nine-day summer maintenance window, and it would not be extended.",
          'The vendor had quoted a single cutover occupying the whole window, with no contingency inside it. If anything was found during that cutover, the line would come back late.',
        ],
      },
      approach: {
        heading: 'What we did',
        body: [
          'We surveyed the installed system before reading the documentation and treated the two as independent descriptions of the same plant.',
          "The plant's I/O schedule listed 1,412 points. We found 1,431. Among the nineteen undocumented points was a hardwired interlock between the destacker and the press guard, added during a repair in 2016 and never drawn. It was functioning, it was load-bearing for safety, and nothing in the migration package knew it existed.",
          'We divided the line into three sections that could be cut over independently and sequenced them across three shorter stops rather than one long one, placing the section containing the undocumented interlock last, once its behaviour had been characterised.',
          'Old and new controllers ran in parallel for 40 days, reading the same inputs with the new system unable to command actuators. Comparing the two command streams is what established that the interlock behaved differently during a jam recovery than anyone had described.',
        ],
      },
      outcome: {
        heading: 'The result',
        body: [
          'The migration was completed across three stops totalling three days, and handover left six days of the nine-day window unused.',
          'The nineteen undocumented I/O points were drawn, tested and added to the maintenance record. The 2016 interlock was reimplemented in the new platform as a documented safety function rather than carried across as a wire nobody could account for.',
          'The line returned to full rate on the first production shift after the final cutover, and the parallel-running data set was handed to the plant as the baseline for the next change.',
        ],
      },
      reflection: {
        heading: 'What made the difference',
        body: [
          'Running the controllers in parallel is what surfaced the interlock. A single-weekend cutover would have found the same behaviour with the line down, the contractor on site and the window already spent.',
          'Parallel running is not free: it costs a licence, a period of double maintenance, and the discipline to leave the new system unable to act while it is watching. On a line that cannot be buffered, it is cheaper than the alternative by a wide margin.',
        ],
      },
    },

    {
      id: 'water-intake-drawdown-assessment',
      slug: 'water-intake-drawdown-assessment',
      title: 'Assessing a river intake during a 72-hour drawdown',
      description:
        'The only access to a municipal water intake was a drawdown not repeated for three years. Survey, sampling and instrumentation inside 72 hours.',
      sector: 'Municipal water',
      location: 'Southern Transylvania, Romania',
      year: 2024,
      duration: '14 weeks, including a 72-hour access window',
      client: 'A municipal water authority',
      headline: { value: '72 hours', label: 'of access, with no second attempt available' },
      summary:
        'A concrete intake structure of uncertain condition, reachable only during a scheduled drawdown, assessed for remaining life with the measurements separated from the assumptions.',
      services: ['structural-engineering', 'permitting-and-compliance'],
      constraint: {
        heading: 'The constraint',
        body: [
          'A municipal water authority needed a remaining-life position on a reinforced concrete river intake built in 1968. The structure was permanently submerged to within a metre of its deck, and the only access was a scheduled drawdown lasting 72 hours, which would not be repeated for three years.',
          'The authority had to decide whether to refurbish or replace within that funding cycle. A deferred answer was equivalent to a decision to replace, because the funding would be committed elsewhere.',
        ],
      },
      approach: {
        heading: 'What we did',
        body: [
          'We planned the 72 hours in 30-minute blocks, with a written fallback for each task, and agreed in advance which measurements would be sacrificed if the schedule slipped. Two teams worked opposite shifts so that no task depended on one person being awake.',
          'Within the window we completed a dimensional survey, chloride and carbonation sampling at 14 locations, half-cell potential mapping across the accessible faces, and cover meter survey of the deck and the upstream wall.',
          'We installed four corrosion-rate probes and a pair of crack gauges before the water came back, which converted a single snapshot into a series we could keep reading for the following three months.',
          'Carbonation depth in the splash zone was roughly half what the structure’s age and exposure class would have predicted. The 1968 concrete was substantially denser than the specification of the period, which is the single finding that changed the recommendation.',
        ],
      },
      outcome: {
        heading: 'The result',
        body: [
          'We reported a remaining life of 18 to 25 years for the main structure subject to a defined repair to the deck soffit, against the 8 to 12 years the authority had been working to.',
          'The report separated what was measured from what was inferred, item by item, and stated which three findings would change the conclusion if the three-month probe data contradicted the snapshot. It did not.',
          'The authority refurbished rather than replaced. The repair scope was about a fifth of the replacement estimate, and the funding released covered a second intake elsewhere on the network.',
        ],
      },
      reflection: {
        heading: 'What made the difference',
        body: [
          'The instrumentation. Three days of access produce a snapshot, and a snapshot of a 1968 structure supports a cautious answer. Leaving probes behind turned the snapshot into a trend that could be checked after the water returned, which is what allowed a number rather than a range of guesses.',
          'Planning the window in 30-minute blocks sounds excessive until the window is the only one for three years. We lost four hours to a pump failure on the first night and still completed every measurement on the list.',
        ],
      },
    },

    {
      id: 'acquisition-due-diligence-three-sites',
      slug: 'acquisition-due-diligence-three-sites',
      title: 'Pricing the engineering risk in a three-site acquisition',
      description:
        'A buyer had five weeks to establish the engineering condition of three plants. The red-flag summary in week one moved the price before completion.',
      sector: 'Industrial manufacturing',
      location: 'Romania and southern Hungary',
      year: 2025,
      duration: '5 weeks',
      client: 'A mid-market private equity buyer',
      headline: { value: '€2.4m', label: 'of capital liability found outside the vendor forecast' },
      summary:
        'Three operating plants assessed against a fixed completion date, with findings graded by whether they changed the price, the timetable, or neither.',
      services: ['technical-due-diligence', 'energy-and-efficiency-audits'],
      constraint: {
        heading: 'The constraint',
        body: [
          'A buyer had agreed heads of terms on a three-plant industrial group and had five weeks to completion. The vendor data room contained a maintenance history, a capital expenditure forecast and a compliance register, all prepared by the incumbent maintenance contractor.',
          'All three plants were operating. Nothing could be opened, stopped or dismantled, and site visits were limited to one day per plant with the vendor present.',
        ],
      },
      approach: {
        heading: 'What we did',
        body: [
          'We issued a red-flag summary at the end of week one, after the three site visits and before any analysis was complete, because a finding that reaches a deal team in week five has lost four weeks of negotiating position.',
          'Findings were graded by what they did to the transaction: items that changed the price, items that changed the timetable, and items that changed neither but would cost money later.',
          'We read the compliance register against the permits themselves rather than against its own summary. Two of the three sites held permits with conditions that did not survive a change of control, which was recoverable but needed to start before completion rather than after it.',
          'The vendor capital forecast assumed a compressed-air system at one plant had been refurbished in 2021. Metered consumption told a different story: specific power was about 40 per cent above what a refurbished system of that size would draw. The refurbishment had been scoped and quoted, and never carried out.',
        ],
      },
      outcome: {
        heading: 'The result',
        body: [
          'We identified €2.4 million of capital liability over five years that was absent from the vendor forecast, of which €900,000 fell in the first 18 months.',
          'The permit conditions were raised before completion, and the transfer applications were lodged in time to avoid a gap in authorisation at two sites.',
          'The buyer completed at a reduced price. We were not party to the negotiation and do not know what proportion of the movement was ours, which is the honest answer to a question we are often asked.',
        ],
      },
      reflection: {
        heading: 'What made the difference',
        body: [
          'The metered consumption. Every other route into the compressed-air question ran through documents the incumbent contractor had produced, and a plant that is running tells you about itself if you measure it.',
          'Reporting in week one rather than week five is a choice about usefulness rather than about thoroughness. The full report said more, and by then the buyer had already had four weeks to act on the part that mattered.',
        ],
      },
    },
  ]);
