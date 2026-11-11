import type { JsonLd as JsonLdValue } from '@/lib/schema';

export interface JsonLdProps {
  /** One node or a graph. Serialised into the page's HTML, not fetched. */
  data: JsonLdValue | readonly JsonLdValue[];
}

/**
 * Renders structured data as `<script type="application/ld+json">`.
 *
 * `<` is escaped so a value containing `</script>` cannot close the element
 * early. The content is produced on the server and ships in the HTML, because
 * a crawler that runs no JavaScript sees only what was sent.
 */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data as JsonLdValue];

  return (
    <>
      {payload.map((node: JsonLdValue) => (
        <script
          key={JSON.stringify(node).slice(0, 64)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}
