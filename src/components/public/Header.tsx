"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/services",  label: "Задачи" },
  { href: "/cases",     label: "Кейсы" },
  { href: "/about",     label: "О подходе" },
  { href: "/manifesto", label: "Манифест" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 border-b border-[var(--rule)]"
        style={{
          background: "oklch(96.8% 0.008 75 / 0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div
          className="mx-auto px-5 md:px-8 h-16 flex items-center justify-between"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-baseline gap-1.5 group"
          >
            <span
              className="text-[15px] font-medium tracking-[-0.01em] text-[var(--ink)] transition-colors group-hover:text-[var(--cobalt)]"
              style={{ transitionDuration: "220ms" }}
            >
              Veretennikov
            </span>
            <span className="text-[15px] tracking-[-0.01em] text-[var(--ink-3)]">
              Studio
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-[13px] py-1 transition-colors ${
                    active
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                  }`}
                  style={{ transitionDuration: "220ms" }}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-px bg-[var(--ink)] origin-left transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right — CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center text-[13px] px-4 py-2 rounded-full border border-[var(--ink-3)] text-[var(--ink)] hover:bg-[var(--paper-1)] transition-colors"
              style={{ transitionDuration: "220ms" }}
            >
              Связаться
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px]"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
            >
              <span className={`block h-px w-5 bg-[var(--ink)] transition-all duration-300 origin-center ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-[var(--ink)] transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-px w-5 bg-[var(--ink)] transition-all duration-300 origin-center ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--paper)] flex flex-col transition-all duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-16" />
        <nav className="flex flex-col px-5 md:px-8 pt-8 pb-10 flex-1">
          {NAV.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`py-5 border-b border-[var(--rule)] flex items-center justify-between group ${
                pathname === href ? "text-[var(--ink)]" : "text-[var(--ink-2)]"
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <span
                className="display tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.6rem, 6vw, 2.2rem)", animation: "none" }}
              >
                {label}
              </span>
              <span className="font-mono text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors">→</span>
            </Link>
          ))}

          <Link
            href="/contact"
            className="mt-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-[var(--ink)] text-[var(--paper)] rounded-full text-[14px] font-medium"
          >
            Обсудить задачу <span>→</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
