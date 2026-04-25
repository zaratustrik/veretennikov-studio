/**
 * Imports all videos from Kinescope as draft Case entries.
 *
 * Idempotent — if a case with the same videoId or slug already exists, skip it.
 * All imports are marked isPublic=false so they don't appear on the site
 * until the user explicitly publishes them.
 *
 * Run:
 *   KINESCOPE_TOKEN=xxx npx tsx prisma/import-kinescope.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const TOKEN = process.env.KINESCOPE_TOKEN
if (!TOKEN) {
  console.error('Set KINESCOPE_TOKEN env var')
  process.exit(1)
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

interface KinescopeVideo {
  id: string
  title: string
  duration: number
  created_at: string
  embed_link: string
}

interface KinescopeResponse {
  meta: { pagination: { page: number; per_page: number; total: number } }
  data: KinescopeVideo[]
}

async function fetchAllVideos(): Promise<KinescopeVideo[]> {
  const all: KinescopeVideo[] = []
  let page = 1
  while (true) {
    const url = `https://api.kinescope.io/v1/videos?page=${page}&per_page=100`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    }
    const json = (await res.json()) as KinescopeResponse
    all.push(...json.data)
    if (json.data.length < 100) break
    page++
  }
  return all
}

async function main() {
  console.log('Fetching Kinescope videos...')
  const videos = await fetchAllVideos()
  console.log(`Got ${videos.length} videos.\n`)

  // Sort by created_at desc so newer drafts get lower order numbers
  videos.sort((a, b) => b.created_at.localeCompare(a.created_at))

  let created = 0
  let skipped = 0

  for (const [i, v] of videos.entries()) {
    const embedId = v.embed_link.replace('https://kinescope.io/embed/', '')
    if (!embedId) {
      console.log(`  ! skip (no embed_id): "${v.title}"`)
      continue
    }

    // Idempotency: skip if a case already exists with this videoId or slug
    const existing = await prisma.case.findFirst({
      where: { OR: [{ videoId: embedId }, { slug: embedId }] },
      select: { id: true, slug: true },
    })
    if (existing) {
      skipped++
      continue
    }

    const year = parseInt(v.created_at.slice(0, 4)) || 2024
    const title = v.title?.trim() || `Без названия (${embedId.slice(0, 6)})`

    await prisma.case.create({
      data: {
        slug: embedId,
        client: '',
        title,
        description: '',
        type: 'VIDEO',
        year,
        services: [],
        videoId: embedId,
        isPublic: false,
        order: 1000 + i,
      },
    })
    created++
    if (created % 10 === 0) console.log(`  ... ${created} imported`)
  }

  console.log(`\nDone. Created: ${created}, Skipped (already exist): ${skipped}`)

  // Print final state summary
  const totalCases = await prisma.case.count()
  const publicCases = await prisma.case.count({ where: { isPublic: true } })
  const drafts = totalCases - publicCases
  console.log(`\nDB state: ${totalCases} cases total · ${publicCases} public · ${drafts} drafts`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
