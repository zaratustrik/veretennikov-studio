import type { MetadataRoute } from "next"
import { prisma } from "@/lib/db"

const BASE_URL = "https://www.veretennikov.info"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/cases`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/brief`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/manifesto`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  const cases = await prisma.case.findMany({
    where: { isPublic: true },
    select: { slug: true, createdAt: true },
    orderBy: { order: "asc" },
  })

  const casesPages: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${BASE_URL}/show/${c.slug}`,
    lastModified: c.createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticPages, ...casesPages]
}
