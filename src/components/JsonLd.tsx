interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Structured data for search engines, as a schema.org JSON-LD script. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a string in the data can't close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
