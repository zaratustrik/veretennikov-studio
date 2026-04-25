/**
 * Fetches all videos from Kinescope, prints a compact title → embed_link list.
 * Run: KINESCOPE_TOKEN=... npx tsx prisma/list-kinescope.ts
 */

const TOKEN = process.env.KINESCOPE_TOKEN

interface KinescopeVideo {
  id: string
  title: string
  duration: number
  created_at: string
  embed_link: string
  play_link: string
  poster?: { sm?: string }
}

interface KinescopeResponse {
  meta: { pagination: { page: number; per_page: number; total: number } }
  data: KinescopeVideo[]
}

async function main() {
  if (!TOKEN) {
    console.error('Set KINESCOPE_TOKEN env var')
    process.exit(1)
  }

  const all: KinescopeVideo[] = []
  let page = 1
  while (true) {
    const url = `https://api.kinescope.io/v1/videos?page=${page}&per_page=100`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
    if (!res.ok) {
      console.error(`HTTP ${res.status}: ${await res.text()}`)
      process.exit(1)
    }
    const json = (await res.json()) as KinescopeResponse
    all.push(...json.data)
    if (json.data.length < 100) break
    page++
  }

  // Sort by created_at desc
  all.sort((a, b) => b.created_at.localeCompare(a.created_at))

  console.log(`Total videos: ${all.length}\n`)
  console.log('Compact list (title · duration · created · embed_id):\n')
  for (const v of all) {
    const m = Math.floor(v.duration / 60)
    const s = String(Math.floor(v.duration % 60)).padStart(2, '0')
    const dur = `${m}:${s}`
    const date = v.created_at.slice(0, 10)
    const id = v.embed_link.replace('https://kinescope.io/embed/', '')
    console.log(`  ${v.title.padEnd(50)} ${dur.padStart(7)}  ${date}  ${id}`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
