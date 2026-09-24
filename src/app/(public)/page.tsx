import type { Metadata } from "next";
import HomepageV2 from "@/components/homepage-v2/HomepageV2";
import { SITE_URL } from "@/lib/seo";

const HOME_DESCRIPTION =
  "Студия сложных решений: ИИ и автоматизация процессов, цифровые продукты, промышленное видео, 3D и интерактив. От диагностики до работающей системы.";

export const metadata: Metadata = {
  title: "ИИ, цифровые системы и визуальная инженерия",
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "ИИ, цифровые системы и визуальная инженерия — Veretennikov Studio",
    description: HOME_DESCRIPTION,
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "ИИ, цифровые системы и визуальная инженерия — Veretennikov Studio",
    description: HOME_DESCRIPTION,
  },
};

export default function HomePage() {
  return <HomepageV2 />;
}
