import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  const result = await prisma.case.updateMany({
    where: { type: { in: ['AI', 'SYNTHESIS'] } },
    data: { isPublic: false },
  })
  console.log(`Hidden cases: ${result.count}`)

  const remaining = await prisma.case.findMany({
    where: { isPublic: true },
    select: { slug: true, type: true, client: true },
    orderBy: { order: 'asc' },
  })
  console.log('\nPublic cases now:')
  for (const c of remaining) {
    console.log(`  ${c.type.padEnd(10)} ${c.client.padEnd(28)} /${c.slug}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
