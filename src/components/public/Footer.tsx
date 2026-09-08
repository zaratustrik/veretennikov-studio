import Link from "next/link";
import Wordmark from "./Wordmark";
import {
  PHONE_HUMAN,
  PHONE_TEL,
  TELEGRAM_URL,
  TELEGRAM_HANDLE,
  EMAIL,
  EMAIL_HREF,
} from "@/lib/contacts";

const AI_COLUMN = [
  { href: "/diagnostika",                    label: "Диагностика процессов" },
  { href: "/services/ai-knowledge-base",      label: "Корпоративная база знаний" },
  { href: "/services/ai-agents",              label: "ИИ-агенты и помощники" },
  { href: "/services/document-processing",    label: "Обработка заявок и документов" },
  { href: "/services/ai-automation",          label: "Разработка под задачу" },
  { href: "/services",                        label: "Все направления" },
];

const PRODUCTION_COLUMN = [
  { href: "/production",                          label: "Направление целиком" },
  { href: "/services/industrial-video",           label: "Промышленный фильм" },
  { href: "/services/digital-twin-visualization", label: "3D и визуальные модели" },
  { href: "/services/expo-stand",                 label: "Выставочные решения" },
  { href: "/services/mini-apps-games",            label: "Интерактив и мини-приложения" },
  { href: "/services/b2b-content-engine",         label: "Контент-подписка" },
];

const STUDIO_COLUMN = [
  { href: "/cases",     label: "Кейсы" },
  { href: "/programs",  label: "Программы по ИИ" },
  { href: "/blog",      label: "Разборы" },
  { href: "/lab",       label: "Лаборатория" },
  { href: "/about",     label: "О студии" },
  { href: "/contact",   label: "Связаться" },
];

function Column({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <nav className="flex flex-col gap-3">
      <p className="eyebrow mb-2">{title}</p>
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-[14px] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors leading-[1.35]"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default function Footer() {
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
        <div className="grid lg:grid-cols-[minmax(240px,1fr)_auto] gap-12 lg:gap-16 mb-14">
          <div>
            <Wordmark asLink={false} className="mb-7" />
            <p
              className="display max-w-[20ch] mb-4"
              style={{
                fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              ИИ и автоматизация процессов. Промышленное видео, 3D и интерактив.
            </p>
            <p className="text-[var(--ink-3)] text-[13.5px] mb-6">
              Екатеринбург · работаем по России
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${PHONE_TEL}`}
                className="text-[15px] text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors font-mono tracking-[0.01em]"
              >
                {PHONE_HUMAN}
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors"
              >
                {TELEGRAM_HANDLE}
              </a>
              <a
                href={EMAIL_HREF}
                className="text-[14px] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors break-all sm:break-normal"
              >
                {EMAIL}
              </a>
            </div>

            <Link
              href="/razbor"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3 bg-[var(--ink)] text-[var(--paper)] text-[13.5px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
            >
              Разобрать процесс <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10">
            <Column title="ИИ и автоматизация" items={AI_COLUMN} />
            <Column title="Видео, 3D, интерактив" items={PRODUCTION_COLUMN} />
            <Column title="Студия" items={STUDIO_COLUMN} />
          </div>
        </div>

        {/* Bottom — legal and brand */}
        <div
          className="border-t border-[var(--rule)] pt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center justify-between font-mono text-[var(--ink-3)]"
          style={{ fontSize: "11px" }}
        >
          <p>Технологии, которые работают на вашу задачу.</p>
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link
                href="/privacy"
                className="hover:text-[var(--cobalt)] transition-colors"
                style={{ letterSpacing: "0.04em" }}
              >
                Политика обработки персональных данных
              </Link>
              <Link
                href="/consent"
                className="hover:text-[var(--cobalt)] transition-colors"
                style={{ letterSpacing: "0.04em" }}
              >
                Согласие на обработку ПДн
              </Link>
            </div>
            <span style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
              © {year} Veretennikov Studio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
