import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh" }}>
      <header className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-8 h-14 flex items-center justify-between"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <Link href="/admin" className="flex items-baseline gap-1.5">
            <span className="font-mono text-[12px] tracking-[0.04em] text-[var(--ink)]">
              veretennikov
            </span>
            <span className="font-mono text-[12px] text-[var(--ink-3)]"> / </span>
            <span className="font-mono text-[12px] text-[var(--cobalt)]">admin</span>
          </Link>

          <Link
            href="/"
            className="text-[12px] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors"
          >
            ← на сайт
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
