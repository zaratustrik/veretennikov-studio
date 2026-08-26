import type { Metadata, Viewport } from "next"

import "./live.css"

export const metadata: Metadata = {
  title: "Уральская ТПП · мастер-класс",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export const viewport: Viewport = {
  themeColor: "#170c21",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

/**
 * Страница участника открыта по прямой ссылке из QR: пароля здесь нет
 * и быть не может — заставлять зал вводить код было бы абсурдом.
 * От индексации закрыта метатегом и заголовком из next.config.ts.
 */
export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <div className="lv">{children}</div>
}
