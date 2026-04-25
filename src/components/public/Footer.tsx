import Link from "next/link";

const LINKS = [
  { href: "/cases",     label: "работа" },
  { href: "/about",     label: "подход" },
  { href: "/manifesto", label: "манифест" },
  { href: "/contact",   label: "контакт" },
];

export default function Footer() {
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "local-dev").slice(0, 7);
  const region = process.env.VERCEL_REGION || "local";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-base)]">
      <div className="mx-auto max-w-[1280px] px-8 pt-16 pb-10">

        {/* Top row */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 mb-16">
          <div>
            <p className="font-mono text-[12px] tracking-[0.04em] text-[var(--text-1)] mb-6">
              <span className="text-[var(--text-1)]">veretennikov</span>
              <span className="text-[var(--text-3)]"> / </span>
              <span className="text-[var(--text-2)]">studio</span>
            </p>
            <p
              className="display text-[var(--text-1)] mb-2 max-w-[18ch]"
              style={{
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Анатолий <br />Веретенников
            </p>
            <p className="text-sm text-[var(--text-2)] mb-6">
              Екатеринбург, Россия
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a
                href="mailto:strana.vfx@gmail.com"
                className="text-sm text-[var(--text-2)] hover:text-[var(--accent-glow)] transition-colors"
              >
                strana.vfx@gmail.com
              </a>
              <a
                href="https://t.me/"
                className="text-sm text-[var(--text-2)] hover:text-[var(--accent-glow)] transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="mono-meta mb-2">Навигация</p>
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[14px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom — runtime metadata flex */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row gap-3 sm:gap-8 items-start sm:items-center justify-between font-mono text-[11px] text-[var(--text-3)]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="block w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
              <span className="tracking-[0.06em]">build {sha}</span>
            </span>
            <span className="text-[var(--text-3)]">·</span>
            <span className="tracking-[0.06em]">region {region}</span>
            <span className="text-[var(--text-3)]">·</span>
            <span className="tracking-[0.06em]">stack next 16 · prisma 7</span>
          </div>
          <span className="tracking-[0.1em] uppercase">© {year} Veretennikov Studio</span>
        </div>
      </div>
    </footer>
  );
}
