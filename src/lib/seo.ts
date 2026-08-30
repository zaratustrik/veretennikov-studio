/**
 * JSON-LD structured data schemas for Schema.org markup.
 * Used by <JsonLd> component in pages.
 */

import { PHONE_TEL, EMAIL, TELEGRAM_URL } from "./contacts"

export const SITE_URL = "https://veretennikov.info"
export const SITE_NAME = "Veretennikov Studio"
export const FOUNDER_NAME = "Анатолий Веретенников"

const ORG_ID = `${SITE_URL}#organization`
const PERSON_ID = `${SITE_URL}#person`
const WEBSITE_ID = `${SITE_URL}#website`

/* ─── Organization (sitewide) ─────────────────────────────────────── */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: ["Студия Веретенникова", "Студия Анатолия Веретенникова"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
  },
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Студия в Екатеринбурге: ИИ и автоматизация бизнес-процессов, промышленное видео, 3D и интерактив. Работаем с промышленностью, госсектором и крупным бизнесом.",
  founder: {
    "@id": PERSON_ID,
  },
  founders: [
    {
      "@id": PERSON_ID,
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Екатеринбург",
    addressRegion: "Свердловская область",
    addressCountry: "RU",
  },
  telephone: PHONE_TEL,
  email: EMAIL,
  areaServed: [
    { "@type": "AdministrativeArea", name: "Свердловская область" },
    { "@type": "AdministrativeArea", name: "Уральский федеральный округ" },
    { "@type": "Country", name: "Россия" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  // Только реально существующие профили. Пустые или чужие ссылки здесь
  // вредят: разметка должна подтверждаться, а не декларировать.
  sameAs: [TELEGRAM_URL],
  knowsAbout: [
    "Автоматизация бизнес-процессов",
    "Внедрение искусственного интеллекта",
    "Корпоративные базы знаний",
    "ИИ-агенты и корпоративные помощники",
    "Обработка документов и обращений",
    "Цифровая трансформация",
    "Промышленное видео",
    "3D-визуализация оборудования",
    "VFX и motion design",
    "Интерактивные и выставочные решения",
  ],
  serviceType: [
    "Диагностика бизнес-процессов",
    "Автоматизация процессов и внедрение ИИ",
    "Корпоративная база знаний",
    "Разработка цифровых решений",
    "Промышленное видео и 3D-визуализация",
    "Корпоративные программы по искусственному интеллекту",
  ],
}

/* ─── Person (founder) ────────────────────────────────────────────── */

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: FOUNDER_NAME,
  givenName: "Анатолий",
  familyName: "Веретенников",
  jobTitle: "Основатель студии, продюсер",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/opengraph-image`,
  worksFor: {
    "@id": ORG_ID,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Екатеринбург",
    addressCountry: "RU",
  },
  knowsAbout: [
    "Постановка задач автоматизации",
    "Внедрение искусственного интеллекта",
    "Продюсирование",
    "Режиссура",
    "Видеопродакшн",
  ],
}

/* ─── WebSite (sitewide) ──────────────────────────────────────────── */

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description:
    "ИИ и автоматизация бизнес-процессов. Промышленное видео, 3D и интерактив.",
  publisher: {
    "@id": ORG_ID,
  },
  inLanguage: "ru-RU",
}

/* ─── BreadcrumbList ──────────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/* ─── VideoObject for case pages ──────────────────────────────────── */

export interface VideoObjectInput {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: Date
  duration?: number | null
  videoId?: string | null
  contentUrl?: string
  pageUrl: string
}

function isoDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `PT${m}M${s}S`
}

export function videoObjectSchema(v: VideoObjectInput) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description || v.name,
    thumbnailUrl: v.thumbnailUrl,
    uploadDate: v.uploadDate.toISOString(),
    publisher: {
      "@id": ORG_ID,
    },
    productionCompany: {
      "@id": ORG_ID,
    },
    inLanguage: "ru-RU",
    url: v.pageUrl,
  }
  if (v.duration) {
    data.duration = isoDuration(v.duration)
  }
  if (v.videoId) {
    data.embedUrl = `https://kinescope.io/embed/${v.videoId}`
  }
  return data
}

/* ─── Service (for /services/* product pages) ────────────────────── */

export function serviceSchema(opts: {
  name: string
  description: string
  url: string
  serviceType: string
  areaServed?: string
  offers?: { priceRange: string; priceCurrency: string }
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType,
    provider: {
      "@id": ORG_ID,
    },
    areaServed: opts.areaServed ?? "Россия",
    inLanguage: "ru-RU",
  }
  if (opts.offers) {
    data.offers = {
      "@type": "AggregateOffer",
      priceRange: opts.offers.priceRange,
      priceCurrency: opts.offers.priceCurrency,
    }
  }
  return data
}

/* ─── FAQPage ─────────────────────────────────────────────────────── */

export interface FaqItem {
  question: string
  answer: string
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

/* ─── BlogPosting (for /blog/[slug] article pages) ────────────────── */

export function articleSchema(opts: {
  title: string
  description: string
  url: string
  image?: string | null
  datePublished: Date
  dateModified: Date
  author?: string | null
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    inLanguage: "ru-RU",
    ...(opts.image ? { image: opts.image } : {}),
    author: opts.author
      ? { "@type": "Person", name: opts.author }
      : { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  }
}

/* ─── CollectionPage (for /cases) ─────────────────────────────────── */

export function collectionPageSchema(opts: {
  url: string
  name: string
  description: string
  itemsCount: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    publisher: {
      "@id": ORG_ID,
    },
    inLanguage: "ru-RU",
    numberOfItems: opts.itemsCount,
  }
}
