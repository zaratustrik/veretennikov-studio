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

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="text-sm font-medium text-[var(--text-1)] tracking-tight transition-opacity group-hover:opacity-80">
              Veretennikov
            </span>
            <span className="text-sm text-[var(--text-3)] tracking-tight transition-opacity group-hover:opacity-80">
              Studio
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-[13px] py-1 transition-colors ${
                    active
                      ? "text-[var(--text-1)]"
                      : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-px bg-[var(--text-1)] origin-left transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:block text-[13px] px-4 py-2 rounded-full border border-[var(--border-mid)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[#3A3A3A] transition-colors"
            >
              Связаться
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
            >
              <span
                className={`block h-px w-5 bg-[var(--text-1)] transition-all duration-300 origin-center ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-[var(--text-1)] transition-all duration-300 ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-[var(--text-1)] transition-all duration-300 origin-center ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg-base)] flex flex-col transition-all duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-16" /> {/* header spacer */}
        <nav className="flex flex-col px-6 pt-8 pb-10 flex-1">
          {NAV.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`py-5 border-b border-[var(--border)] flex items-center justify-between group transition-colors ${
                pathname === href
                  ? "text-[var(--text-1)]"
                  : "text-[var(--text-2)] hover:text-[var(--text-1)]"
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <span
                className="font-medium tracking-[-0.01em]"
                style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)" }}
              >
                {label}
              </span>
              <span className="text-[var(--text-3)] group-hover:text-[var(--text-2)] transition-colors text-lg">
                →
              </span>
            </Link>
          ))}

          <div className="mt-auto pt-8">
            <Link
              href="/contact"
              className="inline-block px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              Связаться →
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
