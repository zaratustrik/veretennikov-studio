"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/cases",     label: "работа" },
  { href: "/about",     label: "подход" },
  { href: "/manifesto", label: "манифест" },
  { href: "/contact",   label: "контакт" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "h-12 bg-[var(--bg-base)]/85 border-[var(--border)]"
            : "h-16 bg-[var(--bg-base)]/70 border-transparent"
        } backdrop-blur-xl`}
      >
        <div className="mx-auto max-w-[1280px] px-8 h-full flex items-center justify-between">

          {/* Wordmark */}
          <Link
            href="/"
            className="font-mono text-[12px] tracking-[0.04em] text-[var(--text-1)] hover:text-[var(--accent-glow)] transition-colors"
          >
            <span className="text-[var(--text-1)]">veretennikov</span>
            <span className="text-[var(--text-3)]"> / </span>
            <span className="text-[var(--text-2)]">studio</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label }, i) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <span key={href} className="flex items-center">
                  {i > 0 && <span className="text-[var(--text-3)] mx-2">·</span>}
                  <Link
                    href={href}
                    className={`text-[13px] py-1 transition-colors ${
                      active
                        ? "text-[var(--text-1)]"
                        : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                    }`}
                  >
                    {label}
                  </Link>
                </span>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="hidden md:block font-mono text-[11px] tracking-[0.06em] text-[var(--text-3)]">
              RU
            </span>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
            >
              <span className={`block h-px w-5 bg-[var(--text-1)] transition-all duration-300 origin-center ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-[var(--text-1)] transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-px w-5 bg-[var(--text-1)] transition-all duration-300 origin-center ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg-base)] flex flex-col transition-all duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-16" />
        <nav className="flex flex-col px-8 pt-8 pb-10 flex-1">
          {NAV.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`py-5 border-b border-[var(--border)] flex items-center justify-between group transition-colors ${
                pathname === href ? "text-[var(--text-1)]" : "text-[var(--text-2)] hover:text-[var(--text-1)]"
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <span
                className="display tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.6rem, 6vw, 2.2rem)", animation: "none" }}
              >
                {label}
              </span>
              <span className="font-mono text-[var(--text-3)] group-hover:text-[var(--accent-glow)] transition-colors">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
