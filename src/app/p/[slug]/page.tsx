import { notFound } from "next/navigation"
import { readFile } from "node:fs/promises"
import type { Metadata } from "next"
import { parseFountain } from "@/lib/fountain"
import Reader from "./Reader"
import "./reader.css"

/**
 * Hidden, link-only screenplay reader. Path = `/p/<slug>` where <slug> must
 * equal env BAGHOV_SLUG (set only on the production VM). Script content is
 * read from a path outside the repo (env BAGHOV_SCRIPT_PATH).
 *
 * Everything about this route is opt-out: robots noindex, no sitemap entry,
 * 404 if slug doesn't match. Safe to ship the route file publicly.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Читальня",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
}

export default async function HiddenScreenplayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const expected = process.env.BAGHOV_SLUG
  const filePath = process.env.BAGHOV_SCRIPT_PATH

  if (!expected || !filePath) notFound()
  if (slug !== expected) notFound()

  let raw: string
  try {
    raw = await readFile(filePath, "utf8")
  } catch {
    notFound()
  }

  const parsed = parseFountain(raw)
  return <Reader data={parsed} docId={`p-${slug}`} />
}
