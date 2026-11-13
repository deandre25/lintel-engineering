import { company } from '../company';
import { legalPageSchema } from '../schema';

import type { LegalPage } from '../schema';

/**
 * The four legal pages.
 *
 * §4 is explicit that these are not filler: a site without them reads as a
 * mockup, and a site with properly written ones reads as a business. They cite
 * the GDPR articles the processing actually relies on, state the retention
 * period for contact submissions, and describe the cookie categories the site
 * genuinely sets.
 *
 * The legal notice carries the statement that Lintel Engineering is fictional
 * and this site is a demonstration project. That statement is required by §0
 * and §4 and is deliberately not softened.
 */

const addressLine = `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`;

export const privacy: LegalPage = legalPageSchema.parse({
  title: 'How this site handles personal data',
  description:
    'What personal data this site collects, the legal basis under GDPR Article 6, how long it is kept, and the rights you have over it under Articles 15 to 21.',
  updated: '2026-11-10',
  intro: `This policy describes what happens to personal data you give us through this website. ${company.legalName} is the controller for that data, at ${addressLine}.`,
  sections: [
    {
      heading: 'What we collect, and when',
      body: [
        'This site collects personal data in one place only: the contact form. Nothing else on the site asks you for information about yourself, and there is no account to create.',
        'When you submit the contact form we receive the name, company, email address, enquiry type and message you entered, together with the time of submission.',
      ],
      items: [
        {
          term: 'Name and company',
          description: 'So that a reply is addressed to a person rather than to an inbox.',
        },
        {
          term: 'Email address',
          description: 'So that we can reply. We do not use it for anything else.',
        },
        {
          term: 'Enquiry type and message',
          description:
            'So that the enquiry reaches the right discipline without being forwarded twice.',
        },
        {
          term: 'Time of submission',
          description:
            'Recorded with the message and used to detect automated submissions, which arrive implausibly quickly after the page loads.',
        },
      ],
    },
    {
      heading: 'The legal basis we rely on',
      body: [
        'We process contact form submissions on the basis of our legitimate interests under Article 6(1)(f) of the General Data Protection Regulation. The interest is responding to an enquiry that you chose to send us, and we consider it balanced against your rights because you initiated the contact and the data is limited to what a reply requires.',
        'You also tick a consent box before submitting, confirming that you have read this policy. That consent records your agreement to be contacted in reply; it is not the legal basis for the processing itself, and withdrawing it does not make a reply we have already sent unlawful.',
        'If an enquiry becomes an engagement, the data moves into our normal client records and is then processed on the basis of the contract between us, under Article 6(1)(b).',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'Contact form submissions are deleted 24 months after the last message in the exchange, unless the enquiry became an engagement.',
        'Where an enquiry became an engagement, the records are kept for the period required by Romanian accounting and professional liability law, which is ten years from the end of the engagement.',
      ],
    },
    {
      heading: 'Who else sees it',
      body: [
        'The form submission is transmitted by a third-party form processor, which stores it only for as long as it takes to deliver it to us. Our email is hosted by a provider in the European Union.',
        'We do not sell personal data, we do not share it for advertising, and we do not transfer it outside the European Economic Area.',
      ],
    },
    {
      heading: 'Your rights',
      body: [
        'Under Articles 15 to 21 of the GDPR you have the right to ask what we hold about you, to have it corrected, to have it deleted, to restrict how we use it, to receive it in a portable form, and to object to processing based on legitimate interests.',
        'To exercise any of these, write to the address at the top of this page or email us. We reply within 30 days. If you are not satisfied with our response you may complain to the Romanian supervisory authority for data protection.',
      ],
    },
    {
      heading: 'Information we are given under Article 13',
      body: [
        'Article 13 requires us to tell you certain things at the point we collect your data, and this policy is where we do it: who the controller is, what we collect, why, on what legal basis, how long we keep it, who receives it, and what rights you hold.',
        'We have not appointed a data protection officer. Our processing does not meet the thresholds in Article 37 that would require one, and enquiries should go to the address above.',
      ],
    },
  ],
});

export const cookies: LegalPage = legalPageSchema.parse({
  title: 'What this site stores on your device',
  description:
    'The cookie categories this site uses, what each one does, how long it lasts, and how to change or withdraw your choice at any time from the footer.',
  updated: '2026-11-10',
  intro:
    'This site stores very little on your device, and nothing at all in the analytics or preferences categories until you have agreed to it. Nothing here is used for advertising.',
  sections: [
    {
      heading: 'The categories we use',
      body: [
        'Cookies on this site fall into three categories. Only the first is set before you make a choice.',
      ],
      items: [
        {
          term: 'Necessary',
          description:
            'One cookie, recording the choice you made in the consent banner so you are not asked on every page. It lasts twelve months and contains nothing but your choice. It cannot be switched off, because switching it off is itself a choice that has to be remembered.',
        },
        {
          term: 'Analytics',
          description:
            'Aggregated measurement of which pages are read and how visitors arrive. Off until you accept. No cross-site tracking and no advertising identifiers. If you decline, the analytics script is never loaded, rather than loaded and told to behave.',
        },
        {
          term: 'Preferences',
          description:
            'Remembering interface choices you make, such as the language you last read the site in. Off until you accept, and the site works identically without it.',
        },
      ],
    },
    {
      heading: 'What happens if you decline',
      body: [
        'If you reject the analytics and preferences categories, the scripts behind them are never requested. You can confirm this in the network tab of your browser: declining means no request to the analytics provider is made at all.',
        'Rejecting everything optional is a single click, in the same position and the same prominence as accepting everything.',
      ],
    },
    {
      heading: 'Changing your mind',
      body: [
        'Your choice is recorded for twelve months, after which we ask again.',
        'You can change it at any time from the cookie settings link in the footer of every page. Changing it takes effect immediately, and withdrawing consent for analytics stops the script from loading on the next page you view.',
      ],
    },
    {
      heading: 'Cookies we do not use',
      body: [
        'There are no advertising cookies, no social media cookies, no cross-site trackers and no fingerprinting on this site. There are no third-party embeds that set cookies of their own.',
      ],
    },
  ],
});

export const terms: LegalPage = legalPageSchema.parse({
  title: 'Terms for using this website',
  description:
    'The terms covering use of this website: what the content is for, the limits of the information on it, and how professional engagement terms differ.',
  updated: '2026-11-10',
  intro: `These terms cover the use of this website. They do not cover professional engagements with ${company.legalName}, which are governed by a separate written agreement in every case.`,
  sections: [
    {
      heading: 'What the content on this site is for',
      body: [
        'The material on this site describes the services we offer and the way we approach them. It is general information, not engineering advice, and it is not a substitute for an assessment of your own project.',
        'Nothing on this site creates a professional relationship between us. That relationship begins when we have agreed a scope in writing and both parties have signed it.',
      ],
    },
    {
      heading: 'Accuracy, and its limits',
      body: [
        'Standards, codes and national annexes change. Pages on this site describe the position at the date they were written, and we do not undertake to revise every page whenever a standard is amended.',
        'Case studies describe completed engagements. The outcomes are specific to the circumstances of those projects, and no similar result is implied for any other project.',
      ],
    },
    {
      heading: 'Liability',
      body: [
        'We accept no liability for decisions taken on the basis of the general information on this site. Liability arising from a professional engagement is governed by the terms of that engagement, including the limits of liability agreed in it.',
        'Nothing in these terms limits liability for death or personal injury caused by negligence, or for fraud, where that limitation would be unlawful.',
      ],
    },
    {
      heading: 'Intellectual property and links',
      body: [
        'The text, drawings and graphics on this site belong to us. You may quote from it with attribution and a link. You may not reproduce it wholesale or present it as your own.',
        'Where we link to another site, we do so because we think the material is useful. We do not control those sites and are not responsible for their content.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by Romanian law, and the courts of Romania have jurisdiction over any dispute arising from the use of this website.',
      ],
    },
  ],
});

export const legalNotice: LegalPage = legalPageSchema.parse({
  title: 'Company details and site information',
  description:
    'Registered company details for Lintel Engineering SRL, the address, how to contact us, and a statement that this is a demonstration project.',
  updated: '2026-11-10',
  intro: `Company identification details for ${company.legalName}, published as required of a company operating in Romania.`,
  sections: [
    {
      heading: 'This is a demonstration project',
      body: [
        'Lintel Engineering is a fictional company. This website is a demonstration project, built to show how a corporate site of this kind is designed, written and engineered.',
        'The company does not exist. The staff named on the about page are invented, the case studies describe work that was never carried out, and the registration numbers, address, telephone number and email address below are fabricated and do not identify any real entity.',
        'No service described on this site is available for purchase, and no statement on it should be relied on. Nothing here is a representation about any real engineering firm.',
      ],
    },
    {
      heading: 'Company identification',
      body: [
        'The details below are invented, and are shown in the form a Romanian company would publish them.',
      ],
      items: [
        { term: 'Registered name', description: company.legalName },
        { term: 'Registered office', description: addressLine },
        { term: 'Trade register number', description: company.registration.tradeRegister },
        { term: 'VAT identification number', description: company.registration.vatId },
        { term: 'Email', description: company.contact.email },
        { term: 'Telephone', description: company.contact.phoneDisplay },
      ],
    },
    {
      heading: 'Responsibility for content',
      body: [
        'Responsibility for the content of this site would, for a real company, rest with its management board at the registered address above.',
        'Because the company is fictional, editorial responsibility rests with the author of the demonstration project, and the source code is published for inspection.',
      ],
    },
    {
      heading: 'Professional regulation',
      body: [
        'A real engineering consultancy in Romania would list here the professional bodies its engineers are registered with, together with the register and the rules of professional conduct that apply.',
        'Lintel Engineering holds no such registrations, because it does not exist. No certification, accreditation or chamber membership is claimed anywhere on this site.',
      ],
    },
  ],
});
