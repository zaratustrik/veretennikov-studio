import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import LeadForm from "../razbor/LeadForm"
import { SITE_URL, breadcrumbListSchema } from "@/lib/seo"
import {
  PHONE_HUMAN,
  PHONE_TEL,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
  EMAIL,
  EMAIL_HREF,
  CITY,
  GEO_NOTE,
} from "@/lib/contacts"

export const metadata: Metadata = {
  title: "Связаться",
  description:
    "Телефон, Telegram и почта студии. Или короткая форма — ответим в течение рабочего дня. Екатеринбург, работаем по России.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    title: "Связаться — Veretennikov Studio",
    description: "Телефон, Telegram, почта. Ответим в течение рабочего дня.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const DIRECT = [
  {
    label: "Telegram",
    value: TELEGRAM_HANDLE,
    href: TELEGRAM_URL,
    note: "Быстрее всего",
    external: true,
  },
  {
    label: "Телефон",
    value: PHONE_HUMAN,
    href: `tel:${PHONE_TEL}`,
    note: "Пн–пт, 10:00–19:00 (UTC+5)",
    external: false,
  },
  {
    label: "Почта",
    value: EMAIL,
    href: EMAIL_HREF,
    note: "Для документов и КП",
    external: false,
  },
]

export default function ContactPage() {
  const jsonLd = breadcrumbListSchema([
    { name: "Главная", url: SITE_URL },
    { name: "Контакты", url: `${SITE_URL}/contact` },
  ])

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-14 md:pt-20 pb-12">
            <p className="eyebrow mb-6">Контакт</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.9rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                animation: "none",
              }}
            >
              Расскажите о задаче.{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                Разберёмся вместе.
              </span>
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)", maxWidth: "58ch" }}
            >
              Отвечаем в течение рабочего дня. Если задача ещё не сформулирована —
              это нормально, для этого есть{" "}
              <Link
                href="/razbor"
                className="text-[var(--cobalt)] hover:underline underline-offset-4"
              >
                разбор процесса на 40 минут
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── Прямые контакты + форма ──────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 lg:gap-20">
            {/* Прямые контакты */}
            <div>
              <p className="eyebrow mb-7">Прямые контакты</p>

              <div className="flex flex-col">
                {DIRECT.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    {...(c.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group border-t border-[var(--rule)] py-5 block"
                  >
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-1.5">
                      {c.label}
                    </p>
                    <p
                      className="text-[var(--ink)] group-hover:text-[var(--cobalt)] transition-colors break-words"
                      style={{ fontSize: "17px", letterSpacing: "-0.01em" }}
                    >
                      {c.value}
                    </p>
                    <p className="text-[var(--ink-3)] mt-1" style={{ fontSize: "12.5px" }}>
                      {c.note}
                    </p>
                  </a>
                ))}

                <div className="border-t border-b border-[var(--rule)] py-5">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-1.5">
                    База
                  </p>
                  <p className="text-[var(--ink)]" style={{ fontSize: "17px" }}>
                    {CITY}
                  </p>
                  <p className="text-[var(--ink-3)] mt-1" style={{ fontSize: "12.5px" }}>
                    {GEO_NOTE}
                  </p>
                </div>
              </div>

              <p className="text-[var(--ink-3)] mt-7 leading-[1.6]" style={{ fontSize: "13px" }}>
                NDA подписываем до содержательного разговора — по вашей форме
                или по нашей.
              </p>
            </div>

            {/* Форма */}
            <div>
              <p className="eyebrow mb-7">Написать</p>
              <h2
                className="display mb-3"
                style={{
                  fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  animation: "none",
                }}
              >
                Коротко о задаче — ответим в течение рабочего дня.
              </h2>
              <p className="text-[var(--ink-2)] text-[14.5px] leading-[1.65] mb-9 max-w-[52ch]">
                Заявка сохраняется у нас и приходит уведомлением. Открывать
                почтовый клиент не нужно.
              </p>

              <LeadForm
                source="CONTACT"
                page="/contact"
                submitLabel="Отправить"
                processLabel="Что нужно сделать"
                processPlaceholder="Задача, контекст, сроки — коротко. Можно не заполнять."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Для уже сформулированных задач ───────────────────────── */}
      <section style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-9)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-2"
              style={{
                fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Уже понимаете, что нужно?
            </h2>
            <p className="text-[var(--ink-2)] text-[15px] leading-[1.6] max-w-[54ch]">
              Подробный бриф помогает быстрее посчитать смету и предложить
              решение. Двадцать минут — и у нас есть всё, чтобы ответить
              по существу.
            </p>
          </div>
          <Link
            href="/brief"
            className="shrink-0 px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors inline-flex items-center gap-2"
          >
            Заполнить бриф <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
