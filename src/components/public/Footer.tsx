import Link from "next/link";

const LINKS = [
  { href: "/services",  label: "Задачи" },
  { href: "/cases",     label: "Кейсы" },
  { href: "/about",     label: "О студии" },
  { href: "/manifesto", label: "Манифест" },
  { href: "/contact",   label: "Связаться" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">

        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="text-sm font-medium text-[var(--text-1)] tracking-tight mb-1">
              Veretennikov Studio
            </p>
            <p className="text-xs text-[var(--text-3)]">
              Основана Анатолием Веретенниковым
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
          <span className="text-[11px] tracking-[0.12em] uppercase font-mono text-[var(--text-3)]">
            © {new Date().getFullYear()} Veretennikov Studio
          </span>
          <span className="text-[11px] tracking-[0.12em] uppercase font-mono text-[var(--text-3)]">
            Екатеринбург
          </span>
        </div>

      </div>
    </footer>
  );
}
