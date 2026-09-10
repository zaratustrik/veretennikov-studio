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
      // Экран участника live-финала: открыт по QR, но вне индексации.
      // Пароля здесь нет и быть не может — зал не будет вводить код.
      {
        source: "/live/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
      // Мастер-класс «ИИ в работе»: доступ по прямой ссылке, без индексации
      {
        source: "/ai-masterclass",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
      // Персональные памятки: доступ по прямой ссылке, без индексации
      {
        source: "/pamyatka/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
      // Закрытая проектная страница УТПП: вход по коду, вне индексации.
      // Referrer-Policy здесь строже общесайтовой: со страницы не должно
      // утекать даже то, с какого адреса ушёл переход. Два правила, потому
      // что :path* не покрывает сам /utpp.
      {
        source: "/utpp",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/utpp/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Referrer-Policy", value: "no-referrer" },
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
      // «AI & Visual Audit» переупакован в «Диагностику процессов».
      // 301, чтобы не потерять накопленную историю страницы: /audit была
      // в sitemap с приоритетом 0.9 и на неё вели внутренние ссылки.
      {
        source: "/audit",
        destination: "/diagnostika",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
