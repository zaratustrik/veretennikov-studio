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
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
