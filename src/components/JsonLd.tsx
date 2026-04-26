/**
 * Server component that renders a <script type="application/ld+json"> tag.
 * Pass any Schema.org-compatible object (or array of them).
 */

interface JsonLdProps {
  data: object | object[]
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe — we control the input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
