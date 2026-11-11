import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Disclosure } from '@/components/ui/Disclosure';
import { Field } from '@/components/ui/Field';
import { Link } from '@/components/ui/Link';
import { Prose } from '@/components/ui/Prose';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TextInput } from '@/components/ui/TextInput';
import { contrastRatio, formatRatio } from '@/lib/color';
import { PAIRING_GROUPS } from '@/lib/contrastPairs';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';
import { readColorTokens } from '@/lib/tokens';

import { StyleguideSection } from './StyleguideSection';

import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Styleguide',
  /* A development surface: it must never be indexed or appear in the sitemap. */
  robots: { index: false, follow: false },
};

/**
 * The design system, rendered.
 *
 * Every specimen is the real component reading the real tokens, so this page
 * cannot show something the site does not do. The contrast table is computed at
 * build time from `src/styles/tokens.css` using the same pairing list the unit
 * suite asserts against, which is what makes the figures evidence rather than
 * documentation.
 *
 * Copy here is in English only and written inline. It is scaffolding read by
 * developers, not content, so it is deliberately outside the content modules
 * and the message catalogue.
 */

const TYPE_ROLES = [
  { token: 'text-h1', label: 'h1 / display', className: 'text-h1', family: 'font-display' },
  { token: 'text-h2', label: 'h2', className: 'text-h2', family: 'font-display' },
  { token: 'text-h3', label: 'h3', className: 'text-h3', family: 'font-display' },
  { token: 'text-h4', label: 'h4', className: 'text-h4', family: 'font-display' },
  { token: 'text-h5', label: 'h5', className: 'text-h5', family: 'font-display' },
  { token: 'text-h6', label: 'h6', className: 'text-h6', family: 'font-display' },
  { token: 'text-lead', label: 'lead', className: 'text-lead', family: 'font-sans' },
  { token: 'text-body-lg', label: 'body large', className: 'text-body-lg', family: 'font-sans' },
  { token: 'text-body', label: 'body', className: 'text-body', family: 'font-sans' },
  { token: 'text-caption', label: 'caption', className: 'text-caption', family: 'font-sans' },
  { token: 'text-micro', label: 'micro / eyebrow', className: 'text-micro', family: 'font-sans' },
] as const;

const SPACING_STEPS = [
  { token: 'space-1', px: 4, className: 'w-1' },
  { token: 'space-2', px: 8, className: 'w-2' },
  { token: 'space-3', px: 12, className: 'w-3' },
  { token: 'space-4', px: 16, className: 'w-4' },
  { token: 'space-5', px: 24, className: 'w-5' },
  { token: 'space-6', px: 32, className: 'w-6' },
  { token: 'space-7', px: 48, className: 'w-7' },
  { token: 'space-8', px: 64, className: 'w-8' },
  { token: 'space-9', px: 96, className: 'w-9' },
  { token: 'space-10', px: 128, className: 'w-10' },
  { token: 'space-11', px: 160, className: 'w-11' },
  { token: 'space-12', px: 192, className: 'w-12' },
] as const;

const ENQUIRY_OPTIONS = [
  { value: 'structural', label: 'Structural engineering' },
  { value: 'process', label: 'Industrial process and automation' },
  { value: 'energy', label: 'Energy and efficiency audits' },
] as const;

export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const tokens = readColorTokens();

  const inkRamp = Object.entries(tokens).filter(([name]) => name.startsWith('ink-'));
  const surfaces = Object.entries(tokens).filter(([name]) => name.startsWith('paper'));
  const accents = Object.entries(tokens).filter(([name]) => name.startsWith('accent'));

  return (
    <Container width="bleed" className="py-section-tight">
      <header className="pb-8">
        <p className="text-micro font-medium tracking-eyebrow text-accent uppercase">
          Internal reference
        </p>
        <h1 className="mt-5 font-display text-h2 leading-display tracking-display text-primary">
          Design system
        </h1>
        <p className="mt-5 max-w-measure text-lead leading-snug text-secondary">
          Every specimen below is the component the site ships, reading the tokens the site ships.
          Contrast figures are computed from the stylesheet at build time.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        <StyleguideSection
          title="Type scale"
          note="Ratio 1.25 through the text sizes, widening to 1.333 across the display sizes. Display roles interpolate with clamp() between two fixed steps, so they never leave the scale and never shift after paint."
        >
          <dl className="flex flex-col divide-y divide-rule">
            {TYPE_ROLES.map((role) => (
              <div key={role.token} className="flex flex-col gap-2 py-5">
                <dt className="font-mono text-micro tracking-wide text-muted uppercase">
                  {role.label} · --{role.token}
                </dt>
                <dd
                  className={`${role.className} ${role.family} leading-snug tracking-tight text-primary`}
                >
                  Load assessment of existing structures
                </dd>
              </div>
            ))}
          </dl>
        </StyleguideSection>

        <StyleguideSection
          title="Tabular figures"
          note="Numbers appear in sequence throughout case-study results and team credentials, so tabular figures are the body default and proportional figures are the opt-in."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="border border-rule p-5">
              <p className="text-micro tracking-wide text-muted uppercase">Tabular (default)</p>
              <p className="mt-3 flex flex-col text-body-lg text-primary">
                <span>1 118 400</span>
                <span>9 041 117</span>
                <span>4 400 989</span>
              </p>
            </div>
            <div className="border border-rule p-5">
              <p className="text-micro tracking-wide text-muted uppercase">
                Proportional (headings)
              </p>
              <p className="mt-3 flex flex-col font-display text-body-lg text-primary [font-variant-numeric:normal]">
                <span>1 118 400</span>
                <span>9 041 117</span>
                <span>4 400 989</span>
              </p>
            </div>
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Colour"
          note="One slate-blue near-black, a warm off-white, a neutral ramp sharing that hue, and a single accent in three variants — because no one hex passes AA on both papers and the inverse surface. No pure black or white."
        >
          <div className="flex flex-col gap-6">
            {[
              { name: 'Neutral ramp', entries: inkRamp },
              { name: 'Surfaces', entries: surfaces },
              { name: 'Accent', entries: accents },
            ].map((group) => (
              <div key={group.name}>
                <h3 className="text-micro font-medium tracking-eyebrow text-muted uppercase">
                  {group.name}
                </h3>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {group.entries.map(([name, value]) => (
                    <li key={name} className="border border-rule">
                      <div className="h-14 w-full" style={{ backgroundColor: value }} />
                      <div className="px-3 py-2">
                        <p className="font-mono text-micro text-primary">--{name}</p>
                        <p className="font-mono text-micro text-muted">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Contrast"
          note="Computed from src/styles/tokens.css at build time, over the same pairing list the unit suite asserts. The ratios printed here are the ratios tested; a regression fails the build before it reaches this page."
        >
          <div className="flex flex-col gap-8">
            {PAIRING_GROUPS.map((group) => (
              <div key={group.name}>
                <h3 className="text-micro font-medium tracking-eyebrow text-muted uppercase">
                  {group.name} — minimum {group.threshold.toFixed(1)}:1
                </h3>
                <p className="mt-2 text-micro text-muted">{group.requirement}</p>

                <table className="mt-4 w-full border-collapse text-caption tabular-nums">
                  <caption className="sr-only">
                    {group.name} contrast ratios, measured against WCAG 2.1 relative luminance
                  </caption>
                  <thead>
                    <tr className="border-b border-rule-strong text-left">
                      <th scope="col" className="py-2 pr-4 font-medium text-primary">
                        Foreground
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium text-primary">
                        Background
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium text-primary">
                        Usage
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium text-primary">
                        Ratio
                      </th>
                      <th scope="col" className="py-2 font-medium text-primary">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.pairings.map((pairing) => {
                      const foreground = tokens[pairing.foreground];
                      const background = tokens[pairing.background];

                      if (foreground === undefined || background === undefined) {
                        throw new Error(
                          `Contrast pairing references an undeclared token: ${pairing.foreground} on ${pairing.background}`,
                        );
                      }

                      const ratio = contrastRatio(foreground, background);
                      const passes = ratio >= group.threshold;

                      return (
                        <tr
                          key={`${pairing.foreground}-${pairing.background}-${pairing.usage}`}
                          className="border-b border-rule"
                        >
                          <td className="py-2 pr-4 font-mono text-micro text-secondary">
                            --{pairing.foreground}
                          </td>
                          <td className="py-2 pr-4 font-mono text-micro text-secondary">
                            --{pairing.background}
                          </td>
                          <td className="py-2 pr-4 text-micro text-muted">{pairing.usage}</td>
                          <td className="py-2 pr-4 text-micro text-primary">
                            {formatRatio(ratio)}
                          </td>
                          {/*
                           * The word carries the result, not the colour: §11
                           * forbids colour conveying meaning on its own.
                           */}
                          <td className="py-2 text-micro font-medium text-primary">
                            {passes ? 'Pass' : 'Fail'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Spacing"
          note="An 8px scale with 4px as the only half-step. Section rhythm is a clamp between steps 9 and 11, deliberately larger than instinct suggests."
        >
          <dl className="flex flex-col gap-2">
            {SPACING_STEPS.map((step) => (
              <div key={step.token} className="flex items-center gap-4">
                <dt className="w-40 shrink-0 font-mono text-micro text-muted">
                  --{step.token} · {step.px}px
                </dt>
                <dd className={`${step.className} h-3 bg-accent`} />
              </div>
            ))}
          </dl>
        </StyleguideSection>

        <StyleguideSection
          title="Focus"
          note="One treatment for the whole site, designed rather than inherited: a 2px accent ring offset 3px, on :focus-visible only, so pointer users never see it. Tab through this page to check it against every surface."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary">Focus me with Tab</Button>
              <Link locale={locale} route="home" className="text-caption text-accent underline">
                A focusable link
              </Link>
            </div>
            <div
              data-surface="inverse"
              className="flex flex-wrap items-center gap-4 bg-surface-inverse p-5"
            >
              <p className="text-caption text-inverse-muted">
                On the inverse surface the ring switches to its light variant:
              </p>
              <Link
                locale={locale}
                route="home"
                className="text-caption text-accent-on-dark underline"
              >
                A link on dark
              </Link>
            </div>
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Buttons"
          note="Square corners, hairline borders, no shadows. The accent never fills a button, because it is capped below 5% of the viewport. Actions are buttons and navigation is links — they share styling, never semantics."
        >
          <div className="flex flex-col gap-6">
            {(['primary', 'secondary', 'quiet'] as const).map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-4">
                <span className="w-24 font-mono text-micro text-muted">{variant}</span>
                <Button variant={variant}>Request a call</Button>
                <Button variant={variant} size="sm">
                  Small
                </Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
                <ButtonLink variant={variant} locale={locale} route="contact">
                  As a link
                </ButtonLink>
              </div>
            ))}
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Fields"
          note="Label, hint and error are one unit. aria-describedby points at hint and error together, the error sits in a live region that is always present, and the required marker is text — colour never carries the meaning."
        >
          <div className="grid grid-cols-1 gap-6 md:max-w-measure">
            <Field label="Name" name="name" required>
              {(control) => <TextInput {...control} autoComplete="name" />}
            </Field>

            <Field
              label="Email"
              name="email"
              required
              hint="We reply from a named engineer, not a shared inbox."
            >
              {(control) => <TextInput {...control} type="email" autoComplete="email" />}
            </Field>

            <Field label="Company" name="company">
              {(control) => <TextInput {...control} autoComplete="organization" />}
            </Field>

            <Field label="Enquiry type" name="enquiry" required>
              {(control) => (
                <Select {...control} options={ENQUIRY_OPTIONS} placeholder="Select a discipline" />
              )}
            </Field>

            <Field
              label="Message"
              name="message"
              required
              error="Tell us roughly what the project is, so we can route this to the right discipline."
            >
              {(control) => <Textarea {...control} />}
            </Field>
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Disclosure"
          note="A real button with aria-expanded, not a styled details element. The panel unmounts when closed, so its links are never reachable by Tab while invisible."
        >
          <div className="md:max-w-measure">
            <Disclosure
              summary="Can you assess a structure without the original drawings?"
              defaultOpen
            >
              <Prose>
                <p>
                  Usually, yes. Where drawings are missing we survey the structure, take material
                  samples where access allows, and reconstruct the load path from measured geometry.
                  The assessment states explicitly which assumptions were measured and which were
                  inferred.
                </p>
              </Prose>
            </Disclosure>
            <Disclosure summary="How long does a technical due diligence take?">
              <Prose>
                <p>
                  Between two and six weeks, depending on site count and how complete the vendor
                  data room is. We issue a red-flag summary within the first week so a deal team is
                  not waiting on the full report to react.
                </p>
              </Prose>
            </Disclosure>
          </div>
        </StyleguideSection>

        <StyleguideSection
          title="Breadcrumb"
          note="The last item is text with aria-current='page', not a link to where the visitor already is. Separators sit outside the list items and are hidden from assistive technology."
        >
          <Breadcrumb
            locale={locale}
            label="Breadcrumb"
            items={[
              { label: 'Home', route: 'home' },
              { label: 'Services', route: 'services' },
              { label: 'Structural engineering' },
            ]}
          />
        </StyleguideSection>

        <StyleguideSection
          title="Prose"
          note="Long-form typography for MDX, where generated markup cannot carry utility classes. Measure capped at 68ch. Spacing is margin-top on following siblings, so a block never introduces space above itself."
        >
          <Prose>
            <h2>Assessing fatigue in welded connections</h2>
            <p>
              Industrial structures built before the current Eurocode fatigue provisions often carry
              connection details that would not be specified today. The question is rarely whether a
              detail is poor, but whether its remaining life is shorter than the remaining life of
              the plant around it.
            </p>
            <h3>What the inspection has to establish</h3>
            <ul>
              <li>The stress range actually experienced, not the design value.</li>
              <li>Whether cracking has initiated, and at which detail category.</li>
              <li>How many cycles the structure has already seen.</li>
            </ul>
            <blockquote>
              A detail that fails a code check on paper may still have decades of life, and one that
              passes may be days from a through-thickness crack.
            </blockquote>
            <h3>Reporting</h3>
            <ol>
              <li>Measured stress ranges per detail.</li>
              <li>Remaining cycles, with the assumptions stated.</li>
              <li>An inspection interval, not a single verdict.</li>
            </ol>
            <p>
              Further reading sits on the{' '}
              <Link locale={locale} route="insights">
                insights index
              </Link>
              .
            </p>
            <table>
              <caption>Detail categories assessed on a recent gantry survey</caption>
              <thead>
                <tr>
                  <th scope="col">Detail</th>
                  <th scope="col">Category</th>
                  <th scope="col">Cycles remaining</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Transverse butt weld</td>
                  <td>80</td>
                  <td>1 400 000</td>
                </tr>
                <tr>
                  <td>Cover plate end</td>
                  <td>56</td>
                  <td>310 000</td>
                </tr>
              </tbody>
            </table>
          </Prose>
        </StyleguideSection>
      </div>
    </Container>
  );
}
