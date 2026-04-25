/**
 * Bulk-publish video drafts: extract client/title/description from raw Kinescope titles,
 * then set isPublic=true. Leaves SYNTHESIS/AI legacy drafts (no videoId) untouched.
 *
 * Idempotent — re-running is safe (won't overwrite manually-edited fields).
 *
 * Run: npx tsx prisma/publish-drafts.ts
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

interface Processed {
  client: string
  title: string
  description: string
}

function processTitle(raw: string): Processed {
  const t = raw.trim()

  // ── Russian client patterns ─────────────────────────────────────

  // "Презентационный фильм для компании X"
  let m = t.match(/^Презентационный фильм для компании ["«]?(.+?)["»]?\.?$/i)
  if (m) return {
    client: m[1].trim(),
    title: 'Презентационный фильм',
    description: `Презентационный фильм для компании ${m[1].trim()}.`,
  }

  // "Презентационный фильм компании X"
  m = t.match(/^Презентационный фильм компании ["«]?(.+?)["»]?\.?$/i)
  if (m) return {
    client: m[1].trim(),
    title: 'Презентационный фильм',
    description: `Презентационный фильм компании ${m[1].trim()}.`,
  }

  // "Ролик для компании X"
  m = t.match(/^Ролик для компании ["«]?(.+?)["»]?\.?$/i)
  if (m) return {
    client: m[1].trim(),
    title: 'Имиджевый ролик',
    description: `Корпоративный ролик для компании ${m[1].trim()}.`,
  }

  // "Ролик сети аптек X"
  m = t.match(/^Ролик сети аптек\s+(.+?)\.?$/i)
  if (m) return {
    client: `Аптеки ${m[1].trim()}`,
    title: 'Имиджевый ролик',
    description: `Имиджевый ролик для сети аптек «${m[1].trim()}».`,
  }

  // "X. Аверс СК" — Avers SK product clips
  m = t.match(/^(.+?)\.\s*Аверс\s*СК$/i)
  if (m) return {
    client: 'Аверс СК',
    title: m[1].trim(),
    description: `Технологический ролик для строительной компании «Аверс СК»: ${m[1].trim().toLowerCase()}.`,
  }

  // "Социальный ролик для парка X" / "Социальный ролик для X лесопарка"
  m = t.match(/^Социальный ролик для (?:парка\s+)?[«"]?([^«»"]+?)[»"]?\s*(?:лесопарка)?\.?\s*(?:\(.*\))?$/i)
  if (m && /Шарташ|парк/i.test(t)) return {
    client: 'Парк «Шарташ»',
    title: 'Социальный ролик',
    description: 'Социальный ролик о Шарташском лесопарке Екатеринбурга.',
  }

  // "Видео со съёмок ... банка УБРиР"
  if (/Видео со съ[её]мок.*УБРиР/i.test(t)) return {
    client: 'УБРиР',
    title: 'Backstage новогоднего ролика',
    description: 'Закулисье съёмок новогоднего корпоративного ролика для УБРиР.',
  }

  // "BACKSTAGE ... Шарташ"
  if (/^BACKSTAGE.*Шарташ/i.test(t)) return {
    client: 'Парк «Шарташ»',
    title: 'Backstage съёмок',
    description: 'Закулисье съёмок социального ролика для Шарташского парка.',
  }

  // "Ролик-открытие ... конференции X"
  if (/Ролик-открытие.*Ковалевские чтения/i.test(t)) return {
    client: 'Ковалевские чтения',
    title: 'Ролик-открытие',
    description: 'Открывающий ролик для научно-практической конференции «Ковалевские чтения».',
  }

  if (/Ковалевские/i.test(t) && /конференции/i.test(t)) return {
    client: '',
    title: 'Ролик-открытие конференции',
    description: 'Открывающий ролик для научно-практической конференции.',
  }

  // "ролик открывающий фестиваль Человек труда"
  if (/Человек труда/i.test(t)) return {
    client: 'Человек труда',
    title: 'Ролик-открытие фестиваля',
    description: 'Открывающий ролик для фестиваля «Человек труда».',
  }

  // ── Specific known projects ─────────────────────────────────────

  if (/Каслинский павильон|Русское чудо/i.test(t)) return {
    client: '',
    title: 'Русское чудо. Каслинский павильон',
    description: 'Документальный фильм о Каслинском чугунном павильоне — шедевре уральского художественного литья.',
  }

  if (/Парогенератор/i.test(t)) return {
    client: '',
    title: 'Парогенератор ПГм-15',
    description: 'Презентационный фильм о промышленном парогенераторе ПГм-15 с 3D-визуализацией технологического процесса.',
  }

  if (/Интеллектуальная система управления транспортом/i.test(t)) return {
    client: '',
    title: 'Интеллектуальная система управления транспортом',
    description: 'Презентационный фильм о цифровом продукте для управления транспортной инфраструктурой города.',
  }

  if (/Развязка около Калины/i.test(t)) return {
    client: '',
    title: 'Развязка около ТРЦ «Калина»',
    description: 'Презентационный ролик о проекте дорожной развязки в Екатеринбурге.',
  }

  if (/Челябинск.*технологических инноваций/i.test(t)) return {
    client: 'Челябинск',
    title: 'Город технологических инноваций',
    description: 'Презентационный ролик о Челябинске как центре промышленных и технологических инноваций.',
  }

  if (/Автодор трасса Р242/i.test(t)) return {
    client: 'Автодор',
    title: 'Трасса Р242',
    description: 'Презентационный ролик о федеральной автодороге Р242.',
  }

  if (/Колумбайн УРФУ/i.test(t)) return {
    client: 'УрФУ',
    title: 'Колумбайн',
    description: 'Документальный материал об инциденте в УрФУ.',
  }

  if (/^O,?\s*Charli/i.test(t)) return {
    client: '',
    title: 'O, Charli!',
    description: 'Креативный авторский проект.',
  }

  if (/Трейлер спектакля.*Там живут люди/i.test(t)) return {
    client: '',
    title: 'Спектакль «Там живут люди»',
    description: 'Трейлер театральной постановки «Там живут люди».',
  }

  if (/Emelyanenko vs Peshta|BehindScene profile/i.test(t)) return {
    client: '',
    title: 'Emelyanenko vs Peshta',
    description: 'Behind-the-scenes профайл бойца перед поединком.',
  }

  // Theatre/museum trailers (capital case English names)
  if (/^(STANISLAV|GRANOVSKII|SVERD_MUSEO|KOMI MUSEI|SEVERO_EKAT_KANAL)_trailer$/i.test(t)) {
    const name = t.replace(/_trailer$/i, '').replace(/_/g, ' ')
    return {
      client: '',
      title: `${name} — трейлер`,
      description: `Трейлер для проекта ${name}.`,
    }
  }

  // ORANGE FITNESS CENTER
  if (/ORANGE FITNESS/i.test(t)) return {
    client: 'Orange Fitness',
    title: 'Имиджевый ролик',
    description: 'Имиджевый ролик для сети фитнес-клубов Orange Fitness.',
  }

  // Сушкоф
  if (/Сушкоф/i.test(t)) return {
    client: 'Сушкоф',
    title: 'Презентационный фильм',
    description: 'Презентационный фильм для сети ресторанов «Сушкоф».',
  }

  // ── International client names (single word/abbreviation) ────────

  const namedClients: Record<string, { client: string; title: string; description: string }> = {
    'Miele': {
      client: 'Miele',
      title: 'Имиджевый ролик',
      description: 'Имиджевый ролик для бренда Miele.',
    },
    'BIOSMART RUSSIAN': {
      client: 'BioSmart',
      title: 'Презентационный ролик',
      description: 'Презентационный ролик о продукте компании BioSmart.',
    },
    'FORES_COMPANY': {
      client: 'Fores',
      title: 'Презентационный ролик',
      description: 'Презентационный ролик о компании Fores.',
    },
    'GOK_FINAL': {
      client: 'ГОК',
      title: 'Корпоративный фильм',
      description: 'Корпоративный фильм для горно-обогатительного комбината.',
    },
    'TARKET_Eng_post2': {
      client: 'Tarkett',
      title: 'Presentation film',
      description: 'Presentation film about Tarkett — flooring manufacturer.',
    },
    'FinnPlay_TITAN': {
      client: 'FinnPlay',
      title: 'TITAN — продуктовый ролик',
      description: 'Продуктовый ролик о платформе FinnPlay TITAN.',
    },
    'CAREPLANT_promovideo': {
      client: 'CarePlant',
      title: 'Промо-ролик',
      description: 'Промо-ролик для бренда CarePlant.',
    },
    'PE_RUSSIAN_4K': {
      client: '',
      title: 'PE — 4K-версия',
      description: 'Корпоративный ролик в формате 4K.',
    },
    'InvestAgency Linked Comp 01': {
      client: 'Инвестиционное агентство',
      title: 'Презентационный ролик',
      description: 'Презентационный ролик инвестиционного агентства.',
    },
    'Delovie_Liniy_7_1': {
      client: 'Деловые Линии',
      title: 'Корпоративный фильм',
      description: 'Корпоративный фильм для транспортной компании «Деловые Линии».',
    },
    'rostele-vremya-champ1': {
      client: 'Ростелеком',
      title: 'Заставка корпоративного мероприятия',
      description: 'Motion-заставка для федерального корпоративного ивента «Время чемпионов».',
    },
    'Bel_ver_RUS2': {
      client: 'Белоярская АЭС',
      title: 'Юбилейный корпоративный фильм',
      description: 'Производственный фильм к юбилею Белоярской АЭС с 3D-визуализацией технологических процессов.',
    },
    'finish-ubrir_music2': {
      client: 'УБРиР',
      title: 'Корпоративный фильм',
      description: 'Имиджевый фильм для банка УБРиР.',
    },
    'ubrir-2019-new2': {
      client: 'УБРиР',
      title: 'Новогодний ролик',
      description: 'Новогодний корпоративный ролик для банка УБРиР.',
    },
    'skb-kontur': {
      client: 'СКБ Контур',
      title: 'Имиджевый ролик',
      description: 'Имиджевый ролик для технологической компании «СКБ Контур».',
    },
    'UA_superhero_Graded_03': {
      client: 'Уральские Авиалинии',
      title: 'Имиджевый ролик «Супергерой»',
      description: 'Имиджевый ролик для авиакомпании «Уральские Авиалинии» из серии «Супергерой».',
    },
    'UA-URAL_Final_4K': {
      client: 'Уральские Авиалинии',
      title: 'Имиджевый ролик',
      description: 'Имиджевый ролик для авиакомпании «Уральские Авиалинии».',
    },
    'ServisIngh3': {
      client: 'Сервис Инжиниринг',
      title: 'Промо-ролик',
      description: 'Промо-ролик для компании «Сервис Инжиниринг».',
    },
    'medical 2': {
      client: '',
      title: 'Медицинский продукт',
      description: 'Презентационный ролик для медицинского продукта.',
    },
    'fond svt ekat zastavka cikl MUSIC': {
      client: 'Фонд Святой Екатерины',
      title: 'Заставка музыкального цикла',
      description: 'Заставка для музыкального цикла Фонда Святой Екатерины.',
    },
    'Showreel_3Dec': {
      client: '',
      title: 'Showreel студии',
      description: 'Шоурил студии — подборка избранных работ.',
    },
    '2024-01-09_zavody3': {
      client: '',
      title: 'Промышленные заводы',
      description: 'Производственный материал на промышленных предприятиях.',
    },
    'Galamart_backstage_ver2': {
      client: 'Galamart',
      title: 'Backstage съёмок',
      description: 'Закулисье съёмок ролика для бренда Galamart.',
    },
    'Одна из последних наших работ и первая работа для': {
      client: 'СКБ Контур',
      title: 'Первая работа для СКБ Контур',
      description: 'Первая совместная работа студии и компании «СКБ Контур».',
    },
  }

  if (namedClients[t]) return namedClients[t]

  // Match prefix for "Одна из последних..." since it's truncated
  if (t.startsWith('Одна из последних наших работ')) return namedClients['Одна из последних наших работ и первая работа для']

  // ── Fallback: keep title as-is, no client/description ────────────
  return { client: '', title: t, description: '' }
}

async function main() {
  // Get all video drafts (skip the 2 legacy SYNTHESIS/AI without videoId)
  const drafts = await prisma.case.findMany({
    where: {
      isPublic: false,
      videoId: { not: null },
    },
    select: { id: true, title: true, client: true, description: true },
  })

  console.log(`\nProcessing ${drafts.length} video drafts...\n`)

  let updated = 0
  let publishedOnly = 0
  let kept = 0

  for (const c of drafts) {
    const proposed = processTitle(c.title)

    // If user has already filled client/description manually, don't overwrite
    const skipUpdate = c.client.trim().length > 0 || c.description.trim().length > 0
    if (skipUpdate) {
      await prisma.case.update({
        where: { id: c.id },
        data: { isPublic: true },
      })
      publishedOnly++
      continue
    }

    // No proposed change — just publish, keep title as-is
    if (!proposed.client && !proposed.description && proposed.title === c.title) {
      await prisma.case.update({
        where: { id: c.id },
        data: { isPublic: true },
      })
      kept++
      continue
    }

    // Update with proposed values + publish
    await prisma.case.update({
      where: { id: c.id },
      data: {
        client: proposed.client,
        title: proposed.title,
        description: proposed.description,
        isPublic: true,
      },
    })
    updated++
  }

  const totalPublic = await prisma.case.count({ where: { isPublic: true } })
  console.log(`Updated + published:   ${updated}`)
  console.log(`Already filled (kept): ${publishedOnly}`)
  console.log(`No metadata, kept as-is: ${kept}`)
  console.log(`\nTotal public cases now: ${totalPublic}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
