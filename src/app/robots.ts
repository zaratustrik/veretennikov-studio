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
          // Закрытая презентация для СОСПП — только по прямой ссылке
          "/deck/",
          "/deck",
          "/p/",
          "/r/",
          "/b/",
          "/oleg-ai/",
          "/karandash-brief",
          // Закрытые презентации (в т.ч. «Соболёк») — без раскрытия слага
          "/presentation/",
          // Мастер-класс «ИИ в работе» — только по прямой ссылке
          "/ai-masterclass",
          // Экран участника live-финала — открывается только по QR
          "/live/",
          // NB: /pamyatka/ сознательно НЕ закрыт здесь. Disallow не даёт роботу
          // прочитать meta noindex — URL может попасть в выдачу «без описания».
          // Для персональных памяток защита другая: noindex + X-Robots-Tag,
          // отсутствие в sitemap и отсутствие публичных ссылок.
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
