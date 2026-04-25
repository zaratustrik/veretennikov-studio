/**
 * Fetches poster URLs and durations from Kinescope, updates each Case with matching videoId.
 * Run: KINESCOPE_TOKEN=xxx npx tsx prisma/sync-posters.ts
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

interface Poster {
  md?: string
  sm?: string
  original?: string
}

interface KinescopeVideo {
  id: string
  title: string
  duration: number
  embed_link: string
  poster?: Poster
}

interface KinescopeResponse {
  data: KinescopeVideo[]
}

async function fetchAllVideos(): Promise<KinescopeVideo[]> {
  const all: KinescopeVideo[] = []
  let page = 1
  while (true) {
    const url = `https://api.kinescope.io/v1/videos?page=${page}&per_page=100`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    const json = (await res.json()) as KinescopeResponse
    all.push(...json.data)
    if (json.data.length < 100) break
    page++
  }
  return all
}

async function main() {
  console.log('Fetching videos from Kinescope...')
  const videos = await fetchAllVideos()
  console.log(`Got ${videos.length} videos.`)

  const byEmbedId = new Map<string, KinescopeVideo>()
  for (const v of videos) {
    const embedId = v.embed_link.replace('https://kinescope.io/embed/', '')
    if (embedId) byEmbedId.set(embedId, v)
  }

  const cases = await prisma.case.findMany({
    where: { videoId: { not: null } },
    select: { id: true, videoId: true, title: true },
  })

  let updated = 0
  let missing = 0
  for (const c of cases) {
    const v = byEmbedId.get(c.videoId!)
    if (!v) {
      missing++
      continue
    }
    const posterUrl = v.poster?.md ?? v.poster?.sm ?? v.poster?.original ?? null
    const duration = v.duration ? Math.round(v.duration) : null

    await prisma.case.update({
      where: { id: c.id },
      data: { posterUrl, duration },
    })
    updated++
  }

  console.log(`\nUpdated: ${updated}`)
  console.log(`Missing in Kinescope: ${missing}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
