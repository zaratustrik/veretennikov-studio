import type { Metadata } from "next"
import "./pamyatka.css"

/* Персональная страница: открывается только по прямой ссылке.
 * Без пароля, но вне индексации и вне навигации сайта.
 * Ничего чувствительного на странице нет — ссылку можно переслать. */
export const metadata: Metadata = {
  title: { absolute: "Персональный ИИ-помощник — с чего начать" },
  description:
    "Короткая практическая памятка: с чего начать работу с ИИ-помощником в задачах руководителя.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Персональный ИИ-помощник — с чего начать",
    description:
      "Короткая практическая памятка: с чего начать работу с ИИ-помощником в задачах руководителя.",
    type: "article",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary",
    title: "Персональный ИИ-помощник — с чего начать",
    description:
      "Короткая практическая памятка: с чего начать работу с ИИ-помощником в задачах руководителя.",
  },
}

export default function PamyatkaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="pm-root">{children}</div>
}
