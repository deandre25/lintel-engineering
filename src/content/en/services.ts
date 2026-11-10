import { z } from 'zod';

import { serviceSchema } from '../schema';

import type { Service } from '../schema';

/**
 * The six services, in the order they appear on the index.
 *
 * Standards are named as the basis of assessment. Nothing here claims
 * certification, accreditation or chamber membership on the firm's behalf,
 * which §0 forbids and which the copy states plainly where it matters.
 */
export const services: readonly Service[] = z
  .array(serviceSchema)
  .length(6)
  .parse([
    {
      id: 'structural-engineering',
      slug: 'structural-engineering',
      discipline: 'structures',
      name: 'Structural engineering',
      title: 'Structural engineering',
      summary:
        'Design review, certification, load assessment of existing structures, and seismic and wind analysis.',
      description:
        'Independent structural design review, certification of existing structures, load assessment and seismic analysis to Eurocode, from our Brașov office.',
      intro:
        'We assess, review and certify structures that someone else designed or built, usually because a decision now depends on whether they are adequate. That decision is often not a structural one: it is a crane purchase, a lease, a permit, or a sale.',
      whenToCall: {
        heading: 'When firms call us',
        items: [
          'An authority has rejected a design and the project has stopped.',
          'A building is being asked to carry more than it was designed for.',
          'A structure has visible damage and nobody will say whether it is serious.',
          'Drawings are missing and a buyer wants a position before exchange.',
          'A contractor and a designer disagree, and the disagreement has become expensive.',
        ],
      },
      coverage: {
        heading: 'What the work covers',
        items: [
          {
            term: 'Design review',
            description:
              "An independent check of another engineer's design against the governing code, including the national annex that applies where the structure stands. We report what we checked, what we did not, and on what basis.",
          },
          {
            term: 'Certification of existing structures',
            description:
              'Assessment to current Eurocode of structures designed to codes that no longer apply, which is most industrial stock in the region built before 1990.',
          },
          {
            term: 'Load assessment',
            description:
              'Establishing what a structure can carry now, as built and as degraded, rather than as drawn. Where the original calculations are missing we reconstruct the load path from measured geometry.',
          },
          {
            term: 'Seismic and wind analysis',
            description:
              'Romania is seismically active, and the design response spectrum for much of the country changed with the current national annex. Structures that complied when they were built may not comply now, and that difference is frequently what decides whether a retrofit goes ahead.',
          },
        ],
      },
      howWeWork: {
        heading: 'How we work',
        body: [
          'We measure before we calculate. An assessment based on drawings alone is an assessment of the drawings.',
          'Site work comes first: dimensional survey, connection detailing, section verification, and material sampling where access allows. Where sampling is not possible we say which values are assumed, and carry that assumption through to the conclusion rather than leaving it in an appendix.',
          'Analysis is kept proportionate to the question. A bounding hand calculation is often enough to settle whether there is a problem at all, and we build a finite element model when the structure genuinely requires one, which usually means irregular geometry, seismic response, or fatigue.',
          'Reports separate what was measured from what was inferred. Every assessment states its governing case, the margin against it, and what would change the answer.',
        ],
      },
      standards: {
        heading: 'Standards we work to',
        body: [
          'Eurocodes 0, 1, 2, 3 and 8, applied with the national annex of the country the structure stands in: Romania, Hungary or Germany.',
          'Where an assessment is for a buyer or a lender rather than for an authority, we state which standard we assessed against, because the answer differs depending on the question being asked.',
          'We work to published standards. We do not certify compliance on behalf of any accreditation body, and we say so at the outset when a submission needs a verifier we are not.',
        ],
      },
      engagements: {
        heading: 'Typical engagements',
        body: [
          'A design review on a single structure takes two to three weeks.',
          'Certification of an existing industrial building runs four to ten weeks, depending on how much of it is accessible and how much survey work that implies.',
          'A load assessment tied to a specific piece of plant is usually three to six weeks. The schedule is normally set by when we can get access, not by analysis time.',
        ],
      },
      faq: [
        {
          question: 'Can you assess a structure without the original drawings?',
          answer:
            'Usually, yes. We survey the structure, sample materials where access allows, and reconstruct the load path from measured geometry. The assessment states explicitly which inputs were measured and which were inferred.',
        },
        {
          question: 'Will your assessment be accepted by the authority?',
          answer:
            'That depends on the authority and the submission route. We will tell you at the outset which route applies and whether it needs a verifier we are not. We have had assessments accepted and we have had them queried, and we would rather set that expectation correctly than win the work.',
        },
        {
          question: 'Can you give a figure before the survey?',
          answer:
            'We can give you a range and the two or three findings that would move it. A single number produced before anyone has been on site is a guess with a decimal point.',
        },
      ],
      relatedCaseStudy: 'steel-hall-crane-recertification',
    },

    {
      id: 'industrial-process-and-automation',
      slug: 'industrial-process-and-automation',
      discipline: 'industrial-systems',
      name: 'Industrial process and automation',
      title: 'Industrial process and automation',
      summary:
        'Production line retrofits, control system migration, and commissioning support for plants that cannot stop.',
      description:
        'Control system migration, production line retrofit and commissioning support for industrial plants that have to keep running while they change.',
      intro:
        'We plan and supervise changes to production lines that are still in production. The engineering is rarely the hard part. The hard part is the sequence: what can be changed during a shift, what needs a weekend, and what genuinely needs the line down.',
      whenToCall: {
        heading: 'When firms call us',
        items: [
          'A control platform is going out of support and the migration has to fit around a production calendar.',
          'A line has been modified so many times that no document describes what is actually installed.',
          'A vendor has quoted a shutdown the plant cannot afford.',
          'A commissioning has overrun and nobody can say which subsystem is responsible.',
        ],
      },
      coverage: {
        heading: 'What the work covers',
        items: [
          {
            term: 'Control system migration',
            description:
              'Moving a line from one control platform to another, including I/O verification against what is installed rather than against the drawing set, and a cutover sequence built around the plant calendar.',
          },
          {
            term: 'Production line retrofit',
            description:
              'Specifying and supervising mechanical and electrical changes to existing lines, with the interfaces to the untouched parts of the plant defined before anything is ordered.',
          },
          {
            term: 'Commissioning support',
            description:
              'Acceptance criteria agreed in advance, witnessed testing, and a punch list that distinguishes what blocks production from what merely annoys the operator.',
          },
          {
            term: 'Obsolescence assessment',
            description:
              'Establishing what on a line is genuinely unsupportable and what a vendor would simply prefer to replace, with spares availability checked rather than assumed.',
          },
        ],
      },
      howWeWork: {
        heading: 'How we work',
        body: [
          'We survey the installed system before we read the documentation, and we treat the two as independent sources that happen to describe the same plant. On every migration we have run, they have disagreed.',
          'Cutover is sequenced against the production calendar, not against the engineering convenience. That usually means more, shorter stops rather than one long one, and it almost always means running old and new in parallel for a period.',
          'Parallel running is where undocumented behaviour appears. We plan for it to appear, and we schedule the time to deal with it rather than treating it as an overrun.',
          'We write the acceptance criteria before the work starts and agree them with both the plant and the vendor, so that commissioning ends on evidence rather than on patience.',
        ],
      },
      standards: {
        heading: 'Standards we work to',
        body: [
          'Machinery safety to EN ISO 13849 and EN 62061, functional safety assessed against the performance level the application requires rather than the one that is convenient to claim.',
          'Electrical installations to the national implementation of the relevant harmonised standards in the country the plant sits in.',
          'Where a change affects a safety function, we say so in writing and we do not proceed on a verbal assurance that it does not.',
        ],
      },
      engagements: {
        heading: 'Typical engagements',
        body: [
          'An obsolescence assessment on a single line takes two to four weeks.',
          'A control migration runs from three months to about a year, and the length is set almost entirely by how many production stops the plant can give us and how far apart they are.',
          'Commissioning support is priced against the witnessed test schedule, not against a day rate with an open end.',
        ],
      },
      faq: [
        {
          question: 'Can a migration really be done without a long shutdown?',
          answer:
            'Often, yes, if the line can be divided into sections that can be cut over independently and if the plant can give us several short stops instead of one long one. Where that is not possible we say so early, because the alternative is finding out during the shutdown.',
        },
        {
          question: 'Do you supply or install the equipment?',
          answer:
            'No. We specify, sequence and supervise, and we hold no distribution agreements. The installation is done by a contractor, and we are frequently the party checking their work on behalf of the plant.',
        },
        {
          question: 'What happens when the documentation is wrong?',
          answer:
            'We assume it will be in places, and the survey exists to find out where. Discrepancies are recorded, priced and fed back into the sequence before cutover, rather than discovered during it.',
        },
      ],
      relatedCaseStudy: 'press-line-control-migration',
    },

    {
      id: 'energy-and-efficiency-audits',
      slug: 'energy-and-efficiency-audits',
      discipline: 'industrial-systems',
      name: 'Energy and efficiency audits',
      title: 'Energy and efficiency audits',
      summary:
        'Energy Efficiency Directive compliance, thermal modelling, and decarbonisation roadmaps with costed measures.',
      description:
        'Energy audits, thermal modelling and decarbonisation roadmaps for industrial and commercial buildings, with every measure costed and measured.',
      intro:
        'We measure how much energy a building or a process actually uses, establish where it goes, and cost the measures that would change that. The audit is the easy half. The useful half is the order the measures should be done in.',
      whenToCall: {
        heading: 'When firms call us',
        items: [
          'An audit is required and the deadline has become uncomfortable.',
          'A decarbonisation commitment has been made and nobody has costed the path to it.',
          'A previous audit produced a list of measures and no sequence.',
          'Metered consumption does not match what the plant believes it is using.',
        ],
      },
      coverage: {
        heading: 'What the work covers',
        items: [
          {
            term: 'Energy audits',
            description:
              'Measured audits of industrial and commercial sites to the requirements of the national implementation of the Energy Efficiency Directive, with sub-metering where the existing meter structure cannot answer the question.',
          },
          {
            term: 'Thermal modelling',
            description:
              'Dynamic thermal models of buildings and processes, calibrated against measured consumption rather than left at design assumptions.',
          },
          {
            term: 'Decarbonisation roadmaps',
            description:
              'A costed, ordered sequence of measures, each with its payback, its interaction with the others, and the point at which it has to be done because something else depends on it.',
          },
          {
            term: 'Measurement and verification',
            description:
              'Establishing a baseline before a measure is implemented and verifying the saving afterwards, so a claimed reduction can be checked.',
          },
        ],
      },
      howWeWork: {
        heading: 'How we work',
        body: [
          'We meter before we model. A model calibrated against assumed consumption predicts the assumption.',
          'Measures are reported with their interactions, because the saving from insulation and the saving from a smaller boiler are not additive, and a roadmap that adds them up overstates the result.',
          'Every measure carries a cost range, not a point estimate, and we say which of the two or three unknowns would move it.',
          'Where a measure does not pay back, we say so and leave it in the report. A roadmap containing only the measures that look good is a sales document.',
        ],
      },
      standards: {
        heading: 'Standards we work to',
        body: [
          'Audits are carried out to EN 16247 and to the national implementation of the Energy Efficiency Directive in the country the site is in.',
          'Measurement and verification follows the structure of the International Performance Measurement and Verification Protocol, with the option and the baseline period stated in the report.',
          'We describe these standards as the basis of our work. We are not a verification body and we do not issue certificates on behalf of one.',
        ],
      },
      engagements: {
        heading: 'Typical engagements',
        body: [
          'A single-site audit takes three to six weeks, of which the metering period is usually the longest part.',
          'A calibrated thermal model of one building takes four to eight weeks.',
          'A decarbonisation roadmap across several sites runs two to four months, and the schedule depends on how much historic metering data exists.',
        ],
      },
      faq: [
        {
          question: 'How long do you need to meter before the audit is useful?',
          answer:
            'Two to four weeks for most processes, and a full year of billing data alongside it. A shorter period can be used where production is genuinely steady, and we will tell you when we think it is not.',
        },
        {
          question: 'Will the audit tell us to replace everything?',
          answer:
            'It will tell you what each measure costs and what it returns, including the ones that do not pay back. The order the measures are done in frequently matters more than the list itself.',
        },
      ],
    },

    {
      id: 'technical-due-diligence',
      slug: 'technical-due-diligence',
      discipline: 'information-and-risk',
      name: 'Technical due diligence',
      title: 'Technical due diligence',
      summary:
        'Engineering risk assessment for acquisitions and project finance, delivered against a deal timetable.',
      description:
        'Engineering risk assessment for acquisitions and project finance: condition, capital liability and the questions a data room has not answered.',
      intro:
        'We establish the engineering condition of an asset before somebody buys it or lends against it, and we price what it will cost to keep it running. The work is bounded by a deal timetable that does not move, which shapes everything about how it is done.',
      whenToCall: {
        heading: 'When firms call us',
        items: [
          'A transaction has a technical annex that nobody has verified.',
          'A lender requires an independent engineering position before drawdown.',
          'A vendor data room is complete on paper and thin on measurement.',
          'An asset has been maintained by one contractor for a long time and the records are their records.',
        ],
      },
      coverage: {
        heading: 'What the work covers',
        items: [
          {
            term: 'Condition assessment',
            description:
              'What the asset is, what state it is in, and which parts of that are established by inspection rather than by the vendor saying so.',
          },
          {
            term: 'Capital expenditure forecast',
            description:
              'What has to be spent, and when, to keep the asset operating at the assumed level. Reported as a profile over years rather than a single number.',
          },
          {
            term: 'Compliance and permitting review',
            description:
              'Whether the asset holds the permits it needs, whether those permits survive a change of ownership, and what a renewal is likely to require.',
          },
          {
            term: 'Red-flag reporting',
            description:
              'An early summary of anything that could change the price or stop the deal, issued during the first week rather than held until the full report.',
          },
        ],
      },
      howWeWork: {
        heading: 'How we work',
        body: [
          'We issue a red-flag summary within the first week, because a deal team that learns about a problem in week five has lost four weeks of negotiating position.',
          'Findings are graded by what they do to the transaction: items that change the price, items that change the timetable, items that change neither but will cost money later.',
          'We distinguish throughout between what we inspected, what we were told, and what we could not get access to. The third category is usually the most informative one.',
          'Where the data room contradicts the site, we report both and say which one we believe.',
        ],
      },
      standards: {
        heading: 'How the work is bounded',
        body: [
          'Scope, access and the reporting date are agreed in writing before the work starts, and the report states what was excluded from it.',
          'We act for the party instructing us, and we disclose any prior work we have done on the same asset before accepting an instruction.',
          'We provide an engineering opinion. We do not provide valuation, legal or environmental liability advice, and we say where our report stops.',
        ],
      },
      engagements: {
        heading: 'Typical engagements',
        body: [
          'A single-site due diligence takes two to three weeks from instruction to final report.',
          'A multi-site portfolio runs four to six weeks, with the red-flag summary in week one regardless of portfolio size.',
          'Where access to an operating asset is restricted, we say at the outset which conclusions will carry a wider range as a result.',
        ],
      },
      faq: [
        {
          question: 'Can you work to a deal timetable?',
          answer:
            'Yes, and the timetable is the first thing we ask about. If the date cannot be met with the access available, we say so before we are appointed rather than during the work.',
        },
        {
          question: 'What if the asset is operating and we cannot open anything?',
          answer:
            'Most of the work is still possible, and we state clearly which conclusions rest on inspection and which rest on records. Where a conclusion would need intrusive access, we price that separately so the buyer can decide whether the answer is worth it.',
        },
      ],
      relatedCaseStudy: 'acquisition-due-diligence-three-sites',
    },

    {
      id: 'permitting-and-compliance',
      slug: 'permitting-and-compliance',
      discipline: 'structures',
      name: 'Permitting and compliance',
      title: 'Permitting and compliance',
      summary:
        'Eurocode and national building code, environmental permitting, and liaison with the authority that decides.',
      description:
        'Building code and environmental permitting across Romania, Hungary and Germany, including authority liaison and resubmission after a rejection.',
      intro:
        'We take projects through the permitting process, and we are often brought in after a first submission has already been rejected. The technical question and the administrative one are rarely the same question, and conflating them is what stalls most applications.',
      whenToCall: {
        heading: 'When firms call us',
        items: [
          'A submission has been rejected and the reasons are not entirely clear.',
          'A project crosses a border and the code that applies has changed with it.',
          'A change of use has triggered requirements the building was never designed for.',
          'An environmental permit renewal is due and the conditions have moved since it was granted.',
        ],
      },
      coverage: {
        heading: 'What the work covers',
        items: [
          {
            term: 'Code compliance review',
            description:
              'Assessment against the national building code and the relevant Eurocode national annex, carried out before submission rather than after a rejection.',
          },
          {
            term: 'Environmental permitting',
            description:
              'Preparing and supporting applications, including the supporting assessments, and tracking the conditions attached to a granted permit so a renewal does not start from nothing.',
          },
          {
            term: 'Authority liaison',
            description:
              'Direct contact with the reviewing authority, including resubmission after a rejection, and a written record of what was agreed verbally.',
          },
          {
            term: 'Cross-border projects',
            description:
              'Where the same design is built in more than one of Romania, Hungary and Germany, establishing which national annex governs each element and where the designs must genuinely diverge.',
          },
        ],
      },
      howWeWork: {
        heading: 'How we work',
        body: [
          'We establish what the authority actually asked for before preparing an answer. A rejection is frequently about something adjacent to the stated reason, and the quickest way to find out is to ask.',
          'Everything agreed in a meeting is confirmed in writing the same day. A verbal agreement with a reviewer does not survive the reviewer changing.',
          'We submit when the application is complete rather than when the client is impatient, because an incomplete submission restarts the clock and spends credibility that is needed later.',
          'Where we believe a requirement has been misapplied, we say so to the authority, with the reasoning, rather than quietly redesigning around it.',
        ],
      },
      standards: {
        heading: 'Standards we work to',
        body: [
          'Eurocodes with the national annex of the country the project is in, alongside the national building code and the applicable environmental legislation.',
          'Where national requirements exceed the Eurocode, we design to the national requirement and say in the submission where the difference arises.',
          'We prepare and support applications. The decision rests with the authority, and we do not represent ourselves as able to guarantee an outcome.',
        ],
      },
      engagements: {
        heading: 'Typical engagements',
        body: [
          'A pre-submission compliance review takes two to four weeks.',
          'Supporting a submission through to decision depends almost entirely on the authority, and we give a range based on recent experience in that jurisdiction rather than a single date.',
          'A resubmission after rejection is usually three to eight weeks of our time, with the elapsed period set by the review cycle.',
        ],
      },
      faq: [
        {
          question: 'Can you guarantee the permit will be granted?',
          answer:
            'No, and anyone who does is describing something other than a permitting process. We can tell you what we think the risks are, what we would change before submission, and how similar applications have been treated recently in that jurisdiction.',
        },
        {
          question: 'We were rejected. Do we start again?',
          answer:
            'Rarely. Most rejections turn on a defined set of points, and the first task is establishing which of them are substantive and which are administrative. We have taken resubmissions through in six weeks and we have seen others take a year, and the difference is usually how precisely the first rejection was understood.',
        },
      ],
      relatedCaseStudy: 'water-intake-drawdown-assessment',
    },

    {
      id: 'bim-coordination',
      slug: 'bim-coordination',
      discipline: 'information-and-risk',
      name: 'BIM coordination',
      title: 'BIM coordination',
      summary:
        'Model federation, clash detection, and information management for projects with several design teams.',
      description:
        'Model federation, clash detection and information management for multi-discipline projects, with the information requirements defined before modelling.',
      intro:
        'We run the model side of projects where several design teams have to produce one coordinated result. Most of the value is not in the clash report. It is in deciding, before anybody models anything, what the model is for.',
      whenToCall: {
        heading: 'When firms call us',
        items: [
          'Several design teams are producing models that do not fit together.',
          'A client has asked for a model and nobody has defined what it has to contain.',
          'Clashes are being found on site that should have been found in the model.',
          'A project is being handed over and the model does not match what was built.',
        ],
      },
      coverage: {
        heading: 'What the work covers',
        items: [
          {
            term: 'Information requirements',
            description:
              'Defining what the model has to contain and to what level of detail, tied to the decisions it will be used for, before modelling starts.',
          },
          {
            term: 'Model federation',
            description:
              'Combining discipline models into one coordinated federated model on an agreed cycle, with a record of what changed between cycles.',
          },
          {
            term: 'Clash detection and resolution',
            description:
              'Running the clash process, and more importantly triaging the output so that the meeting addresses the forty clashes that matter rather than the four thousand that do not.',
          },
          {
            term: 'Handover information',
            description:
              'Checking that what is delivered at handover matches what was built and is structured so the operator can actually use it.',
          },
        ],
      },
      howWeWork: {
        heading: 'How we work',
        body: [
          'We define the information requirements first. A model built without knowing which decisions it supports will be both too detailed and missing the thing you need.',
          'Clash output is triaged before it is circulated. An untriaged clash report moves work from the coordinator to twelve designers, which is the opposite of coordination.',
          'Federation runs on a fixed cycle that the project can actually sustain, with a changelog, so that a team returning after two weeks can see what moved.',
          'We describe our process as aligned with the ISO 19650 series. That is a description of method, and not a claim of certification by us or on behalf of anybody else.',
        ],
      },
      standards: {
        heading: 'Standards we work to',
        body: [
          'The ISO 19650 series provides the structure for information management, naming and the common data environment.',
          'Exchange is through IFC where the project allows it, with native formats retained alongside, so that a model outlives the licence that produced it.',
          'We describe the standard generically and apply its structure. We hold no certification against it and make no claim to one.',
        ],
      },
      engagements: {
        heading: 'Typical engagements',
        body: [
          'Defining information requirements for a project takes two to three weeks, and is the cheapest part of the work by a wide margin.',
          'Ongoing coordination is priced per federation cycle, usually fortnightly, for the duration of the design.',
          'A handover information check takes three to five weeks depending on the size of the asset and the state of the model when it arrives.',
        ],
      },
      faq: [
        {
          question: 'Do we need a model at all?',
          answer:
            'Not always. If the project has one design team, few services and no complex interfaces, the coordination cost can exceed what it saves. We will tell you when we think that is the case.',
        },
        {
          question: 'Our designers all use different software. Is that a problem?',
          answer:
            'Usually not, provided the exchange format and the information requirements are agreed at the start. It becomes a problem when it is discovered in month four.',
        },
      ],
    },
  ]);
