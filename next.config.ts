import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kinescopecdn.net",
      },
      // R2 public URLs
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      // TODO: после переноса DNS на Cloudflare и подключения Custom Domain
      // добавить сюда конкретный домен (например media.veretennikov.info)
      // и заменить R2_PUBLIC_URL в env на новый адрес.
    ],
  },
  experimental: {
    // Server actions handle file uploads up to 12 MB (poster max is 10 MB)
    serverActions: {
      bodySizeLimit: "12mb",
    },
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
