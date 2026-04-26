/**
 * Inserts (or updates) the two games of «Лаборатория эмерджентности» series.
 * Idempotent — uses upsert by slug.
 *
 * Run: npx tsx prisma/insert-game-cases.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const GAMES = [
  {
    slug: 'life',
    client: 'Лаборатория',
    title: 'Игра «Жизнь»',
    description:
      'Конвейская «Жизнь» в WebGL2 — клетки светятся возрастом, эпидемия катится красной волной, импульс жизни сеет новые колонии. Личный эксперимент студии.',
    type: 'GAME' as const,
    year: 2026,
    services: [
      'WebGL2',
      'Дизайн взаимодействия',
      'GPU-рендеринг',
      'Симуляция',
    ],
    challenge:
      'Игра «Жизнь» Конвея сделана за 55 лет тысячами разработчиков — обычно как сетка моргающих квадратов. Задача: показать ту же математику так, чтобы её хотелось смотреть и трогать. Доказать, что студия умеет в премиум-визуал, а не «нормально работает».',
    solution:
      'Движок и рендер разнесены: CPU считает поколения по битовой логике, GPU отдельным multipass-конвейером рисует сцену с HDR-диапазоном, separable Gaussian bloom, scene-aware trail и smooth tween между состояниями. Возрастная окраска через smoothstep-градиент превращает каждую клетку в маленькую историю. Поверх — две интервенции игрока: глобальная эпидемия с per-cell пульсацией и точечный импульс жизни кликом.',
    outcome:
      'Игра живёт в портфолио как технический манифест: «четыре правила Конвея, бесконечность поведений». Доказательство, что студия делает не «достаточно», а интересно.',
    posterUrl: '/cases/life-poster.png',
    isPublic: true,
    order: 0,
  },
  {
    slug: 'particles',
    client: 'Лаборатория',
    title: 'Particle Life',
    description:
      'N-body симуляция в WebGL2: шесть видов частиц, матрица сил 6×6, тор-топология. Ничего, кроме матрицы и физики — но получаются клетки, охотники, спирали и экосистемы, которые никогда не повторяются.',
    type: 'GAME' as const,
    year: 2026,
    services: [
      'WebGL2',
      'Spatial hash',
      'Шейдеры',
      'Симуляция',
      'Дизайн взаимодействия',
    ],
    challenge:
      'Particle Life как идея — задача из мира программистской поэзии: пять секунд кода даёт глубокий мир. Стандартные реализации в вебе либо работают на 500 частиц («слайдшоу»), либо требуют GPU compute. Нужно было получить интересную плотность, плавную физику и собственную визуальную идентичность, которая встаёт рядом с «Жизнью» как часть серии.',
    solution:
      'CPU-симуляция с spatial-hash через linked-list buckets — 4500 частиц на десктопе, 1500 на мобилке, всё на 60fps без GPU compute. Tom-Mohr force-profile с close-range repulsion. Рендер — instanced quads через тот же multipass-конвейер, что у «Жизни» (motion-blur trail, multipass bloom, Reinhard tonemap). Псевдо-3D через z-breath шейдер: каждая частица «дышит» в глубину со своей фазой, плюс dome-vignette от центра экрана даёт ощущение объёма. Игрок управляет двумя действиями — кнопка «Новая вселенная» рандомизирует матрицу 6×6 (новая экосистема каждый раз) и клик по полю даёт взрыв или вихрь (с Shift).',
    outcome:
      'Игра живёт в портфолио как пара к «Жизни» — две разные математики, оба работают как «простые правила → сложные структуры». Серия превращает портфолио из набора отдельных кейсов в манифест.',
    posterUrl: null,
    isPublic: true,
    order: 1,
  },
]

async function main() {
  console.log(`Upserting ${GAMES.length} game cases...\n`)

  for (const g of GAMES) {
    await prisma.case.upsert({
      where: { slug: g.slug },
      create: g,
      update: {
        title: g.title,
        description: g.description,
        posterUrl: g.posterUrl,
      },
    })
    console.log(`  ✓ ${g.slug.padEnd(12)} ${g.title}`)
  }

  const totalGames = await prisma.case.count({ where: { isPublic: true, type: 'GAME' } })
  console.log(`\nGames public: ${totalGames}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
