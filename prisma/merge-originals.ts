/**
 * Merges 6 original cases (with rich text: client, challenge/solution/outcome)
 * with their corresponding Kinescope-imported drafts (which have videoId + posterUrl).
 *
 * For each pairing:
 *   1. Copy videoId + posterUrl + duration FROM the import TO the original
 *   2. Delete the now-redundant import
 *
 * Result: 6 originals get real Kinescope thumbnails + video previews.
 *
 * Run: npx tsx prisma/merge-originals.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const PAIRINGS: { originalSlug: string; kinescope: string; note: string }[] = [
  { originalSlug: 'belojarskaya-aes',   kinescope: '78KvDACXjszYHStkNUtbkJ', note: 'Bel_ver_RUS2' },
  { originalSlug: 'rostelekom',         kinescope: '8EKywhUtkmJTQGM9agtD93', note: 'rostele-vremya-champ1' },
  { originalSlug: 'uralskie-avialinii', kinescope: '2JH3b2GYG7Qd46vZYXweyJ', note: 'UA_superhero_Graded_03' },
  { originalSlug: 'urfu',               kinescope: '2VNCvkb7pK3TtfWZjThmHH', note: 'Колумбайн УРФУ' },
  { originalSlug: 'ubrir',              kinescope: 'hkGj6vWh5w1bewjbD3NJei', note: 'finish-ubrir_music2' },
  { originalSlug: 'tarket',             kinescope: 'sBpVHZGP9GHFxveqnTzmZ6', note: 'TARKET_Eng_post2' },
]

async function main() {
  let merged = 0
  let skippedNoOriginal = 0
  let skippedNoImport = 0
  let alreadyMerged = 0

  for (const p of PAIRINGS) {
    const original = await prisma.case.findUnique({ where: { slug: p.originalSlug } })
    if (!original) {
      console.log(`  ! No original case with slug "${p.originalSlug}"`)
      skippedNoOriginal++
      continue
    }

    if (original.videoId) {
      console.log(`  ✓ ${p.originalSlug} already has videoId — skipping`)
      alreadyMerged++
      continue
    }

    const imported = await prisma.case.findFirst({ where: { videoId: p.kinescope } })
    if (!imported) {
      console.log(`  ! No imported case with videoId "${p.kinescope}" (${p.note})`)
      skippedNoImport++
      continue
    }

    // Copy media info to original
    await prisma.case.update({
      where: { id: original.id },
      data: {
        videoId: imported.videoId,
        posterUrl: imported.posterUrl,
        duration: imported.duration,
      },
    })

    // Delete the redundant import
    await prisma.case.delete({ where: { id: imported.id } })

    console.log(`  ✓ ${p.originalSlug}  ←  ${p.note}  (deleted ${imported.slug})`)
    merged++
  }

  const totalPublic = await prisma.case.count({ where: { isPublic: true } })
  console.log(`\nMerged: ${merged} · Already merged: ${alreadyMerged} · Skipped (no original): ${skippedNoOriginal} · Skipped (no import): ${skippedNoImport}`)
  console.log(`Total public cases now: ${totalPublic}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
