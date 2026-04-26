/**
 * Renames 4 dev case slugs to anonymous versions.
 * Idempotent — checks if old slug exists before renaming.
 *
 * Run: npx tsx prisma/rename-dev-slugs.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const RENAMES: { from: string; to: string }[] = [
  { from: 'medoc-portal',       to: 'medical-education-platform' },
  { from: 'avtodor-platform',   to: 'road-analytics-platform' },
  { from: 'sospp-cooperation',  to: 'industrial-cooperation' },
  { from: 'gluhov-school',      to: 'medical-training-platform' },
]

async function main() {
  console.log('Renaming dev case slugs...\n')

  let renamed = 0
  let skipped = 0

  for (const r of RENAMES) {
    const existing = await prisma.case.findUnique({ where: { slug: r.from } })
    if (!existing) {
      const alreadyTarget = await prisma.case.findUnique({ where: { slug: r.to } })
      if (alreadyTarget) {
        console.log(`  ✓ ${r.to.padEnd(32)} (уже переименован)`)
        skipped++
        continue
      }
      console.log(`  ! ${r.from.padEnd(32)} (не найден)`)
      continue
    }

    await prisma.case.update({
      where: { id: existing.id },
      data: { slug: r.to },
    })
    console.log(`  ✓ ${r.from.padEnd(22)} → ${r.to}`)
    renamed++
  }

  console.log(`\nRenamed: ${renamed} · Already renamed: ${skipped}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
