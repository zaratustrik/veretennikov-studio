import type { Metadata } from "next";
import "./industrial-digital.css";

// Закрытая аналитическая страница: доступна только по прямой ссылке,
// не участвует в навигации, sitemap и поисковой выдаче.
// HTTP-заголовок X-Robots-Tag для /presentation/:path* задан в next.config.ts,
// путь /presentation/ закрыт в robots.ts — слаг нигде не раскрывается.
export const metadata: Metadata = {
  title:
    "Практический контур внедрения ИИ и цифровых решений в промышленности",
  description:
    "От задачи предприятия и режима данных — к пилоту, измеримому эффекту и масштабированию.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: { canonical: null },
  openGraph: undefined,
  twitter: undefined,
};

export default function IndustrialDigitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="ud-root">{children}</div>;
}
