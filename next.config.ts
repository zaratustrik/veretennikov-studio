import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kinescopecdn.net",
      },
      // Yandex Object Storage (after RU migration)
      {
        protocol: "https",
        hostname: "storage.yandexcloud.net",
      },
      // Legacy Cloudflare R2 public URLs — kept temporarily for a defensive
      // fallback during the YC cutover window. Remove ~1 week after cutover.
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
  experimental: {
    // Server actions handle file uploads up to 12 MB (poster max is 10 MB)
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  async headers() {
    return [
      // Закрытые презентационные страницы: дублируем noindex HTTP-заголовком
      {
        source: "/presentation/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      // Мастер-класс «ИИ в работе»: доступ по прямой ссылке, без индексации
      {
        source: "/ai-masterclass",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Закрытый мини-сайт «ИИ-практикум» (static, public/oleg-ai/) — directory index
      {
        source: "/oleg-ai",
        destination: "/oleg-ai/index.html",
      },
    ];
  },
  async redirects() {
    return [
      // Dev case slug renames (anonymisation, NDA-safe)
      {
        source: "/show/medoc-portal",
        destination: "/show/medical-education-platform",
        permanent: true,
      },
      {
        source: "/show/avtodor-platform",
        destination: "/show/road-analytics-platform",
        permanent: true,
      },
      {
        source: "/show/sospp-cooperation",
        destination: "/show/industrial-cooperation",
        permanent: true,
      },
      {
        source: "/show/gluhov-school",
        destination: "/show/medical-training-platform",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
