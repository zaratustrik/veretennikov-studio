import Link from "next/link";

export default function ShowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      {/* Minimal top bar */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href="/cases"
            className="text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Все кейсы</span>
          </Link>
          <Link href="/" className="flex items-baseline gap-1.5 group">
            <span className="text-xs font-medium text-[var(--text-1)] tracking-tight transition-opacity group-hover:opacity-80">
              Veretennikov
            </span>
            <span className="text-xs text-[var(--text-3)] tracking-tight transition-opacity group-hover:opacity-80">
              Studio
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Minimal footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
          <Link
            href="/cases"
            className="text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
          >
            ← Все кейсы
          </Link>
          <span className="text-[11px] tracking-[0.12em] uppercase font-mono text-[var(--text-3)]">
            Veretennikov Studio
          </span>
        </div>
      </footer>
    </div>
  );
}
