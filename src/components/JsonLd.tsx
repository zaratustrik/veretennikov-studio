/**
 * Server component that renders a <script type="application/ld+json"> tag.
 * Pass any Schema.org-compatible object (or array of them).
 */

interface JsonLdProps {
  data: object | object[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c")

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  )
}
