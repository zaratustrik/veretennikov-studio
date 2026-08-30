"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Wordmark from "./Wordmark";
import { goal } from "@/lib/metrika";
import { PHONE_HUMAN, PHONE_TEL, TELEGRAM_URL, TELEGRAM_HANDLE } from "@/lib/contacts";

/** Выпадающее меню «Что делаем» — два контура + вход. */
const WHAT_WE_DO = [
  {
    group: "ИИ и автоматизация",
    items: [
      { href: "/diagnostika", label: "Диагностика процессов", note: "с чего начинают" },
      { href: "/services/ai-knowledge-base", label: "Корпоративная база знаний" },
      { href: "/services/ai-agents", label: "ИИ-агенты и помощники" },
      { href: "/services/document-processing", label: "Обработка заявок и документов" },
      { href: "/services", label: "Все направления →" },
    ],
  },
  {
    group: "Промышленное видео, 3D и интерактив",
    items: [
      { href: "/production", label: "Направление целиком", note: "фильмы, 3D, интерактив" },
      { href: "/services/industrial-video", label: "Промышленный фильм" },
      { href: "/services/digital-twin-visualization", label: "3D и визуальные модели" },
      { href: "/services/expo-stand", label: "Выставочные решения" },
    ],
  },
];

const NAV = [
  { href: "/services", label: "Что делаем", dropdown: true },
  { href: "/cases",    label: "Кейсы" },
  { href: "/programs", label: "Программы по ИИ" },
  { href: "/blog",     label: "Разборы" },
  { href: "/about",    label: "О студии" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 border-b border-[var(--rule)]"
        style={{
          background: "oklch(96.8% 0.008 75 / 0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div
          className="mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <Wordmark />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Основная навигация">
            {NAV.map(({ href, label, dropdown }) => {
              const active = isActive(href);

              if (!dropdown) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative text-[13px] py-1 whitespace-nowrap transition-colors ${
                      active ? "text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
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
              }

              return (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    className={`relative text-[13px] py-1 inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      active ? "text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                    }`}
                    aria-haspopup="true"
                  >
                    {label}
                    <span
                      aria-hidden
                      className="font-mono text-[9px] text-[var(--ink-3)] translate-y-px transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                    >
                      ▾
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 right-4 h-px bg-[var(--ink)] origin-left transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>

                  {/* Панель. Открывается по hover и по фокусу с клавиатуры. */}
                  <div
                    className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-[opacity,visibility] duration-200 absolute left-1/2 -translate-x-1/2 top-full pt-4"
                  >
                    <div
                      className="grid grid-cols-2 gap-x-10 gap-y-2 p-7 border border-[var(--rule)] shadow-[0_18px_50px_-24px_rgba(15,26,46,0.35)]"
                      style={{ background: "var(--paper)", borderRadius: 3, width: "min(620px, 78vw)" }}
                    >
                      {WHAT_WE_DO.map((col) => (
                        <div key={col.group}>
                          <p className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-3.5">
                            {col.group}
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {col.items.map((it) => (
                              <li key={it.href}>
                                <Link
                                  href={it.href}
                                  className="block py-1 text-[13.5px] leading-[1.35] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                                >
                                  {it.label}
                                  {it.note && (
                                    <span className="block font-mono text-[10px] tracking-[0.06em] text-[var(--ink-4)] mt-0.5">
                                      {it.note}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right — phone + CTA + burger */}
          <div className="flex items-center gap-3 lg:gap-5">
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => goal("tel_click", { place: "header" })}
              className="hidden xl:inline-block font-mono text-[12.5px] tracking-[0.02em] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors whitespace-nowrap"
            >
              {PHONE_HUMAN}
            </a>

            <Link
              href="/razbor"
              onClick={() => goal("razbor_cta", { place: "header" })}
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-[var(--ink)] text-[var(--paper)] text-[13px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
              style={{ transitionDuration: "220ms" }}
            >
              Разобрать процесс
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] -mr-2"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
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
        className={`fixed inset-0 z-40 bg-[var(--paper)] flex flex-col transition-all duration-300 lg:hidden overflow-y-auto ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-16 shrink-0" />
        <nav className="flex flex-col px-5 md:px-8 pt-4 pb-10 flex-1" aria-label="Мобильная навигация">
          <Link
            href="/razbor"
            onClick={() => goal("razbor_cta", { place: "mobile_menu" })}
            className="flex items-center justify-between py-4 px-5 mb-5 bg-[var(--ink)] text-[var(--paper)] rounded-full"
          >
            <span className="text-[15px] font-medium">Разобрать процесс — 40 минут</span>
            <span aria-hidden className="font-mono">→</span>
          </Link>

          {NAV.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`py-4 border-b border-[var(--rule)] flex items-center justify-between group ${
                isActive(href) ? "text-[var(--ink)]" : "text-[var(--ink-2)]"
              }`}
              style={{ transitionDelay: open ? `${i * 35}ms` : "0ms" }}
            >
              <span
                className="display tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.4rem, 5.5vw, 2rem)", animation: "none" }}
              >
                {label}
              </span>
              <span className="font-mono text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors">→</span>
            </Link>
          ))}

          {/* Прямые контакты — на мобильном это самый короткий путь к сделке */}
          <div className="mt-auto pt-8 flex flex-col gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => goal("tel_click", { place: "mobile_menu" })}
              className="flex items-center justify-between py-4 px-5 border border-[var(--ink-3)] rounded-full text-[var(--ink)]"
            >
              <span className="text-[15px]">{PHONE_HUMAN}</span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)]">Позвонить</span>
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => goal("telegram_click", { place: "mobile_menu" })}
              className="flex items-center justify-between py-4 px-5 border border-[var(--ink-3)] rounded-full text-[var(--ink)]"
            >
              <span className="text-[15px]">{TELEGRAM_HANDLE}</span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)]">Telegram</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
