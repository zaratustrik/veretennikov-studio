/**
 * Updates 4 case slugs for /services/industrial-video featured grid:
 *   - PE_RUSSIAN_4K        → ПРОМЭЛЕКТРОНИКА · Презентационный фильм
 *   - technex1610 1        → ТЕХНЭКС · Презентационный фильм
 *   - BIOSMART RUSSIAN     → БИОСМАРТ · Промо оборудования
 *   - sgm-iset-test6       → СГМ ИСЕТЬ · Промо светильника
 *
 * All set isPublic=true, client/title/description filled.
 * Looks up by Kinescope embed_id (= slug), since these are imports.
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const UPDATES = [
  {
    slug: '6YA7dyiF3th9v3tRTcKu77', // PE_RUSSIAN_4K
    client: 'ПРОМЭЛЕКТРОНИКА',
    title: 'Презентационный фильм',
    description:
      'Корпоративный фильм для компании «Промэлектроника» — презентация производства электронных компонентов и решений.',
  },
  {
    slug: '8wjNKW31ftL3rGpAq2xCYu', // technex1610 1
    client: 'ТЕХНЭКС',
    title: 'Презентационный фильм',
    description:
      'Презентационный фильм для компании «Технэкс» — производитель промышленного оборудования.',
  },
  {
    slug: 'kESPfvNod3wgWQYPMAecCX', // BIOSMART RUSSIAN
    client: 'БИОСМАРТ',
    title: 'Промо оборудования',
    description:
      'Промо-ролик для компании «Биосмарт» — производитель биометрического оборудования и систем контроля доступа.',
  },
  {
    slug: 'wTWpUo7DmVKGGZT1gnCAvA', // sgm-iset-test6
    client: 'СГМ ИСЕТЬ',
    title: 'Промо светильника',
    description:
      'Промо-ролик светильника производства «СГМ Исеть» — продуктовая презентация промышленного освещения.',
  },
]

async function main() {
  console.log(`Updating ${UPDATES.length} industrial cases...\n`)

  // First, check current state
  for (const u of UPDATES) {
    const existing = await prisma.case.findUnique({
      where: { slug: u.slug },
      select: { slug: true, client: true, title: true, isPublic: true, posterUrl: true },
    })
    if (!existing) {
      console.log(`  ✗ ${u.slug.padEnd(28)} NOT FOUND in DB`)
      continue
    }
    const before = existing.isPublic ? '✓ PUBLIC' : '○ DRAFT '
    console.log(`  ${before} ${u.slug.padEnd(28)} → ${u.client} · ${u.title}`)
  }

  console.log('\nApplying updates...\n')

  for (const u of UPDATES) {
    await prisma.case.update({
      where: { slug: u.slug },
      data: {
        client: u.client,
        title: u.title,
        description: u.description,
        isPublic: true,
      },
    })
    console.log(`  ✓ ${u.slug.padEnd(28)} updated`)
  }

  const totalPublic = await prisma.case.count({ where: { isPublic: true } })
  console.log(`\nTotal public cases: ${totalPublic}`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
