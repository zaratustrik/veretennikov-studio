import Link from "next/link";

const LINKS = [
  { href: "/services",  label: "Задачи" },
  { href: "/cases",     label: "Кейсы" },
  { href: "/audit",     label: "Аудит" },
  { href: "/lab",       label: "Лаборатория" },
  { href: "/about",     label: "О подходе" },
  { href: "/manifesto", label: "Манифест" },
  { href: "/contact",   label: "Связаться" },
];

export default function Footer() {
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "local-dev").slice(0, 7);
  const region = process.env.VERCEL_REGION || "local";
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[var(--rule)]"
      style={{ background: "var(--paper-1)" }}
    >
      <div
        className="mx-auto px-5 md:px-8"
        style={{ maxWidth: "var(--content-max)", paddingTop: "var(--s-9)", paddingBottom: "var(--s-7)" }}
      >
        {/* Top — brand + nav */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 mb-14">
          <div>
            <p className="flex items-baseline gap-1.5 mb-7">
              <span className="text-[15px] font-medium tracking-[-0.01em] text-[var(--ink)]">
                Veretennikov
              </span>
              <span className="text-[15px] tracking-[-0.01em] text-[var(--ink-3)]">
                Studio
              </span>
            </p>
            <p
              className="display max-w-[18ch] mb-3"
              style={{
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Анатолий <br />Веретенников
            </p>
            <p className="text-[var(--ink-2)] text-[14px] mb-5">
              Екатеринбург, Россия
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2">
              <a
                href="mailto:strana.vfx@gmail.com"
                className="text-[14px] text-[var(--ink-2)] hover:text-[var(--cobalt)] break-all sm:break-normal"
              >
                strana.vfx@gmail.com
              </a>
              <a
                href="https://t.me/VeretennikovINFO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[var(--ink-2)] hover:text-[var(--cobalt)]"
              >
                Telegram
              </a>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="eyebrow mb-2">Навигация</p>
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[14px] text-[var(--ink-2)] hover:text-[var(--ink)]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom — runtime metadata flex */}
        <div
          className="border-t border-[var(--rule)] pt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center justify-between font-mono text-[var(--ink-3)]"
          style={{ fontSize: "11px" }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2">
              <span
                className="block w-1 h-1 rounded-full"
                style={{ background: "var(--cobalt)" }}
              />
              <span style={{ letterSpacing: "0.06em" }}>build {sha}</span>
            </span>
            <span>·</span>
            <span style={{ letterSpacing: "0.06em" }}>region {region}</span>
            <span>·</span>
            <span style={{ letterSpacing: "0.06em" }}>next 16 · prisma 7</span>
          </div>
          <span style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
            © {year} Veretennikov Studio
          </span>
        </div>
      </div>
    </footer>
  );
}
