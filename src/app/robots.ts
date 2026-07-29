import type { MetadataRoute } from "next"

const BASE_URL = "https://veretennikov.info"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin",
          "/api/",
          "/brief/thanks",
          "/p/",
          "/r/",
          "/b/",
          "/oleg-ai/",
          "/karandash-brief",
          // Закрытые презентации (в т.ч. «Соболёк») — без раскрытия слага
          "/presentation/",
          // Мастер-класс «ИИ в работе» — только по прямой ссылке
          "/ai-masterclass",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
