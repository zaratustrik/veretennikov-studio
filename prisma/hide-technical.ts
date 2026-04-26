/**
 * Hides cases without client AND without description — these are the
 * 23 imports we kept as-is (cryptic Kinescope titles like "OPEN", "RED 2v3").
 * They harm SEO with thin content + ugly slugs. Hidden until manual edit.
 *
 * Reversible: just toggle isPublic back to true via /admin.
 *
 * Run: npx tsx prisma/hide-technical.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  // Find candidates — public cases with empty client AND empty description
  const candidates = await prisma.case.findMany({
    where: {
      isPublic: true,
      client: '',
      description: '',
    },
    select: { slug: true, title: true, type: true },
  })

  console.log(`Candidates to hide: ${candidates.length}`)
  for (const c of candidates) {
    console.log(`  - [${c.type}] ${c.title.padEnd(40)} /${c.slug}`)
  }

  if (candidates.length === 0) {
    console.log('Nothing to hide.')
    return
  }

  const result = await prisma.case.updateMany({
    where: {
      isPublic: true,
      client: '',
      description: '',
    },
    data: { isPublic: false },
  })

  const totalPublic = await prisma.case.count({ where: { isPublic: true } })
  console.log(`\nHidden: ${result.count}`)
  console.log(`Total public cases now: ${totalPublic}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
