/**
 * Lists all draft cases (isPublic=false) — quick review tool.
 * Run: npx tsx prisma/review-drafts.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  const drafts = await prisma.case.findMany({
    where: { isPublic: false },
    orderBy: { order: 'asc' },
    select: {
      slug: true, title: true, year: true, type: true, videoId: true, client: true,
    },
  })

  console.log(`\nDraft cases (${drafts.length}):\n`)
  console.log('  YEAR  TYPE       TITLE                                              VIDEO_ID')
  console.log('  ────  ─────────  ─────────────────────────────────────────────────  ──────────────────────')

  for (const c of drafts) {
    const title = (c.title || '').slice(0, 50).padEnd(50)
    const type  = c.type.padEnd(9)
    const vid   = c.videoId || ''
    console.log(`  ${c.year}  ${type}  ${title}  ${vid}`)
  }

  console.log('\nLegend: drafts are not visible on the site. To publish, edit the case and set isPublic=true.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
