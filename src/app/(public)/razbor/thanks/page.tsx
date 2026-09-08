import type { Metadata } from "next"
import Link from "next/link"
import { PHONE_HUMAN, PHONE_TEL, TELEGRAM_URL, TELEGRAM_HANDLE } from "@/lib/contacts"

export const metadata: Metadata = {
  title: "Заявка принята",
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  {
    n: "01",
    t: "Ответим в течение рабочего дня",
    d: "Напишем или позвоним по тому контакту, который вы оставили, и подтвердим удобное время.",
  },
  {
    n: "02",
    t: "Сорок минут разговора",
    d: "Разберём один процесс. Без презентации о студии — сразу по вашей задаче.",
  },
  {
    n: "03",
    t: "Короткое резюме после",
    d: "Пришлём письменно: что смотрели, что видно и какой следующий шаг имеет смысл. Даже если ответ — «здесь автоматизировать нечего».",
  },
]

const READ_NEXT = [
  { href: "/diagnostika", label: "Как устроена диагностика процессов" },
  { href: "/blog/ai-avtomatizaciya-bez-magii", label: "AI-автоматизация без магии: что считать результатом" },
  { href: "/cases", label: "Работы студии" },
]

export default async function RazborThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const fromContact = from === "contact"

  return (
    <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-10)" }}>
      <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "820px" }}>
        <p className="eyebrow mb-6">
          <span style={{ color: "var(--cobalt)" }}>●</span> Заявка принята
        </p>

        <h1
          className="display"
          style={{
            fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            fontVariationSettings: '"opsz" 48',
            marginBottom: "20px",
            animation: "none",
          }}
        >
          Получили.{" "}
          <span className="studio-accent">
            Возвращаемся к вам.
          </span>
        </h1>

        <p className="text-[var(--ink-2)] leading-[1.7] mb-14" style={{ fontSize: "17px", maxWidth: "58ch" }}>
          {fromContact
            ? "Сообщение сохранено, уведомление ушло. Ответим в течение рабочего дня."
            : "Заявка сохранена, уведомление ушло. Ответим в течение рабочего дня и подтвердим время."}
        </p>

        {/* Что дальше */}
        <div className="border-t border-[var(--rule)]">
          {NEXT_STEPS.map((s) => (
            <div
              key={s.n}
              className="grid grid-cols-1 sm:grid-cols-[64px_1fr] gap-y-2 sm:gap-6 border-b border-[var(--rule)] py-7"
            >
              <div
                className="font-mono leading-none text-[var(--ink-3)]"
                style={{ fontSize: "clamp(24px, 3vw, 32px)", letterSpacing: "-0.02em" }}
              >
                {s.n}
              </div>
              <div>
                <h2
                  className="display mb-1.5"
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    letterSpacing: "-0.014em",
                    lineHeight: 1.3,
                    animation: "none",
                  }}
                >
                  {s.t}
                </h2>
                <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "14.5px" }}>
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Срочный контакт */}
        <div
          className="mt-12 p-7"
          style={{ background: "var(--paper-2)", borderRadius: 2 }}
        >
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-3">
            Если срочно
          </p>
          <p className="text-[var(--ink-2)] text-[15px] leading-[1.65]">
            Напишите напрямую в Telegram{" "}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--cobalt)] hover:underline underline-offset-2"
            >
              {TELEGRAM_HANDLE}
            </a>{" "}
            или позвоните{" "}
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-[var(--cobalt)] hover:underline underline-offset-2 whitespace-nowrap"
            >
              {PHONE_HUMAN}
            </a>
            .
          </p>
        </div>

        {/* Пока ждёте */}
        <div className="mt-14">
          <p className="eyebrow mb-5">Пока ждёте</p>
          <ul className="flex flex-col gap-3">
            {READ_NEXT.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-baseline gap-3 text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors"
                  style={{ fontSize: "15.5px" }}
                >
                  <span className="font-mono text-[var(--ink-4)] group-hover:text-[var(--cobalt)] transition-colors" style={{ fontSize: "12px" }}>
                    →
                  </span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
