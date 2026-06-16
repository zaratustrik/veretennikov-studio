import { readFile } from "node:fs/promises"
import path from "node:path"

/**
 * Hidden, link-only series-development portal («Малахитовая карта») for the
 * TV project «Не буди Хозяйку: Малахитовый район».
 *
 * Same opt-out philosophy as the `/p/` screenplay reader and `/r/` analysis:
 *   - ALL story content (data.json + markdown docs) lives OUTSIDE the repo,
 *     on the VM, in the directory given by env BAGHOV_PORTAL_DIR;
 *   - the URL token must equal env BAGHOV_PORTAL_SLUG;
 *   - routes are noindex, excluded from sitemap/robots, 404 otherwise.
 *
 * Safe to ship these files publicly: without both env vars set, every route 404s.
 */

export type PortalEpisode = {
  n: number
  title: string
  motif: string
  arc: 1 | 2
  problem: string
  mystic: string
  comedy: string
  lines: { ilya: string; lera: string; kira: string; ensemble: string }
  twist: string
  clue: string
  payoff: string
  hook: string
  social: { hook: string; vertical: string; theory: string; meme: string }
}

export type PortalCharacter = {
  id: string
  name: string
  tag: string
  want: string
  need: string
  comedy: string
  arc: string
  quote: string
}

export type PortalDoc = {
  slug: string
  file: string
  num: string
  group: string
  title: string
  blurb: string
}

export type GraphNode = {
  id: string
  type: string
  label: string
  short_description?: string
  want?: string | null
  need?: string | null
  secret?: string | null
  episodes?: number[]
  related_docs?: string[]
  status?: string
}

export type GraphEdge = {
  source: string
  target: string
  type: string
  label: string
  starts_in_episode?: number | null
  changes_in_episode?: number[]
  payoff_episode?: number | null
  dramatic_function?: string
}

export type PortalData = {
  meta: {
    title: string
    subtitle: string
    version: string
    date: string
    authors: string
    format: string
    status_line: string
    /** Опциональный hero-видеоролик (Object Storage). Если не задан — fallback на процедурный малахитовый фон. */
    hero_video?: string
    hero_poster_webp?: string
    hero_poster_jpg?: string
  }
  hero: { logline: string; formula: string; theme: string; tone_rule: string }
  facts: string[]
  season: {
    arc1: Record<string, string>
    arc2: Record<string, string>
    handoff: string
    spine: { ep: number; title: string; text: string }[]
  }
  episodes: PortalEpisode[]
  characters: PortalCharacter[]
  mythology: {
    intro: string
    balance: string
    forces: { name: string; essence: string; rules: string[] }[]
    limits: string[]
  }
  twists: {
    big: { title: string; reveal: string; plants: string[] }[]
    joke_rules: { joke: string; rule: string }[]
    props: { prop: string; from: string; to: string }[]
    phrases: { phrase: string; everyday: string; mystic: string }[]
  }
  todo: { title: string; status: string }[]
  docs: PortalDoc[]
  graph: { nodes: GraphNode[]; edges: GraphEdge[] }
  producer?: {
    logline: string
    hook: string
    reasons_viewer: string[]
    reasons_channel: string[]
    budget_formula: string
    best_lines: string[]
    route: { label: string; href: string; note: string }[]
    first_question: string
    first_answer: string
  }
  /** Опциональные баннер-картинки разделов (Object Storage), ключ = слаг раздела. */
  section_media?: Record<string, { webp?: string; jpg: string }>
}

export function getPortalSlug(): string | null {
  return process.env.BAGHOV_PORTAL_SLUG || null
}

function getPortalDir(): string | null {
  return process.env.BAGHOV_PORTAL_DIR || null
}

export async function loadPortalData(): Promise<PortalData | null> {
  const dir = getPortalDir()
  if (!dir) return null
  try {
    const raw = await readFile(path.join(dir, "data.json"), "utf8")
    return JSON.parse(raw) as PortalData
  } catch {
    return null
  }
}

/** Rewrite intra-corpus markdown links so they work inside the portal reader. */
function rewriteDocLinks(md: string, docs: PortalDoc[], token: string): string {
  return md.replace(
    /\]\((?:[^()\s]*\/)?([^()\s/]+\.md)(?::\d+)?\)/g,
    (whole, fname: string) => {
      const base = decodeURIComponent(fname)
      const doc = docs.find((d) => d.file === base)
      return doc ? `](/b/${token}/dokumenty/${doc.slug})` : "]()"
    },
  )
}

export async function readPortalDoc(
  slug: string,
  token: string,
): Promise<{ doc: PortalDoc; content: string } | null> {
  const dir = getPortalDir()
  if (!dir) return null
  const data = await loadPortalData()
  if (!data) return null
  const doc = data.docs.find((d) => d.slug === slug)
  if (!doc) return null
  try {
    const raw = await readFile(path.join(dir, "docs", doc.file), "utf8")
    return { doc, content: rewriteDocLinks(raw, data.docs, token) }
  } catch {
    return null
  }
}

/** Link to the existing hidden fountain reader, if configured on the VM. */
export function getScreenplaySlug(): string | null {
  return process.env.BAGHOV_SLUG || null
}

/** Pilot screenplay (Fountain) shipped alongside portal content on the VM. */
export async function loadPilotScreenplay(): Promise<string | null> {
  const dir = getPortalDir()
  if (!dir) return null
  try {
    return await readFile(path.join(dir, "pilot_full_v02.fountain"), "utf8")
  } catch {
    return null
  }
}
