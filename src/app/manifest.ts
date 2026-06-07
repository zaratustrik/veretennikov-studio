import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Veretennikov Studio",
    short_name: "Veretennikov",
    description:
      "Студия в Екатеринбурге: AI-автоматизация и корпоративный видеопродакшн.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F7F2",
    theme_color: "#F9F7F2",
    lang: "ru",
    icons: [
      { src: "/icon.svg",     sizes: "any",     type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
