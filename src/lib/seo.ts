/**
 * JSON-LD structured data schemas for Schema.org markup.
 * Used by <JsonLd> component in pages.
 */

export const SITE_URL = "https://www.veretennikov.info"
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
    "Студия в Екатеринбурге: разработка ПО для бизнес-процессов и корпоративный видеопродакшн. Работаем с госсектором, промышленностью, крупным бизнесом.",
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
  areaServed: {
    "@type": "Country",
    name: "Россия",
  },
  sameAs: [
    "https://t.me/VeretennikovINFO",
  ],
  knowsAbout: [
    "AI-автоматизация",
    "Корпоративный видеопродакшн",
    "Презентационные ролики",
    "Документальные фильмы",
    "VFX",
    "Motion Design",
    "Разработка ПО для бизнес-процессов",
  ],
  serviceType: [
    "Разработка ПО для бизнеса",
    "Корпоративный видеопродакшн",
    "Презентационные ролики",
    "Корпоративные фильмы",
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
  jobTitle: "Продюсер, основатель студии",
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
    "Видеопродакшн",
    "AI-автоматизация",
    "Продюсирование",
    "Сценарий",
    "Режиссура",
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
    "AI-автоматизация и корпоративный видеопродакшн. Системы и истории в одном брифе.",
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
