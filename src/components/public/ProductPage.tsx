import Link from "next/link"
import CtaLink from "./CtaLink"
import JsonLd from "@/components/JsonLd"
import { SITE_URL, breadcrumbListSchema, faqPageSchema, serviceSchema } from "@/lib/seo"
import { DIAGNOSTICS_FACTORS } from "@/lib/pricing"
import type { PricePoint } from "@/lib/pricing"

/**
 * Каркас продуктовой страницы.
 *
 * Смысл в том, чтобы ни одна услуга не выходила без обязательных блоков:
 * ситуация клиента → что это → кому НЕ подходит → этапы → что на выходе →
 * стоимость и от чего зависит → доказательство → технологии → вопросы → CTA.
 * Раньше на страницах не хватало ровно четырёх из них: ситуации, границ
 * применимости, стоимости и доказательства.
 */

export interface Stage {
  n: string
  title: string
  time: string
  body: string
  output: string
}

export interface ProductPageProps {
  /** Крошки и разметка */
  slug: string
  breadcrumb: string
  eyebrow: string
  /** Ситуация клиента от первого лица — заголовок страницы */
  h1: string
  h1Accent?: string
  lead: string
  serviceType: string

  /** Кому подходит / кому нет */
  fitFor: string[]
  notFor: string[]

  /** Этапы работы */
  stages?: Stage[]
  stagesNote?: string

  /** Что получает заказчик */
  deliverables?: { title: string; body: string }[]

  /** Стоимость */
  price?: PricePoint | null
  priceFactors?: string[]
  priceNotIncluded?: string[]

  /** Доказательство — честное, без выдуманных цифр */
  proof?: { label: string; body: string; href?: string; linkLabel?: string }

  /** Технический блок — только после ценности */
  tech?: { title: string; items: string[] }

  faq: { question: string; answer: string }[]

  ctaTitle: string
  ctaBody: string
  ctaHref?: string
  ctaLabel?: string
}

function Section({
  children,
  bg,
  border = true,
}: {
  children: React.ReactNode
  bg?: string
  border?: boolean
}) {
  return (
    <section
      className={border ? "border-b border-[var(--rule)]" : undefined}
      style={{
        background: bg,
        paddingTop: "var(--s-8)",
        paddingBottom: "var(--s-8)",
      }}
    >
      <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
        {children}
      </div>
    </section>
  )
}

export default function ProductPage(p: ProductPageProps) {
  const url = `${SITE_URL}${p.slug}`
  const factors = p.priceFactors ?? DIAGNOSTICS_FACTORS

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: p.breadcrumb, url },
    ]),
    serviceSchema({
      name: p.breadcrumb,
      description: p.lead,
      url,
      serviceType: p.serviceType,
    }),
    faqPageSchema(p.faq),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-12 md:pt-16 pb-11">
            <p className="eyebrow mb-6">{p.eyebrow}</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                maxWidth: "20ch",
                animation: "none",
              }}
            >
              {p.h1}
              {p.h1Accent && (
                <>
                  {" "}
                  <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>{p.h1Accent}</span>
                </>
              )}
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.12rem)", maxWidth: "62ch" }}
            >
              {p.lead}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-9">
              <CtaLink
                href={p.ctaHref ?? "/razbor"}
                goalName="razbor_cta"
                goalParams={{ place: p.slug }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              >
                {p.ctaLabel ?? "Разобрать процесс — 40 минут"}
                <span aria-hidden>→</span>
              </CtaLink>
              <Link
                href="/diagnostika"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Как проходит диагностика
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Кому подходит / кому нет */}
      <Section bg="var(--paper-2)">
        <p className="eyebrow mb-8">Кому это подходит · 02</p>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-5">
              Подходит, если
            </p>
            <ul className="flex flex-col gap-3.5">
              {p.fitFor.map((t) => (
                <li
                  key={t}
                  className="flex items-baseline gap-3 text-[var(--ink-2)]"
                  style={{ fontSize: "15px", lineHeight: 1.55 }}
                >
                  <span className="font-mono text-[var(--cobalt)] shrink-0" style={{ fontSize: "12px" }}>→</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-5">
              Не подходит, если
            </p>
            <ul className="flex flex-col gap-3.5">
              {p.notFor.map((t) => (
                <li
                  key={t}
                  className="flex items-baseline gap-3 text-[var(--ink-3)]"
                  style={{ fontSize: "15px", lineHeight: 1.55 }}
                >
                  <span className="font-mono text-[var(--ink-4)] shrink-0" style={{ fontSize: "12px" }}>—</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-[var(--ink-3)] leading-[1.55] mt-6 max-w-[46ch]">
              Мы говорим об этом заранее: браться за проект, который не дойдёт
              до результата, невыгодно обеим сторонам.
            </p>
          </div>
        </div>
      </Section>

      {/* Этапы */}
      {p.stages && p.stages.length > 0 && (
        <Section>
          <div className="flex justify-between items-baseline mb-9 flex-wrap gap-4">
            <p className="eyebrow">Как идёт работа · 03</p>
            {p.stagesNote && (
              <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)]">
                {p.stagesNote}
              </span>
            )}
          </div>
          <div>
            {p.stages.map((s, i) => (
              <div
                key={s.n}
                className="scroll-reveal grid grid-cols-1 lg:grid-cols-[64px_200px_1fr_1fr] gap-y-3 lg:gap-6 border-t border-[var(--rule)] py-7 lg:items-baseline"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="font-mono leading-none"
                  style={{
                    fontSize: "clamp(26px, 3.2vw, 38px)",
                    color: i === 0 ? "var(--cobalt)" : "var(--ink-3)",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <h3
                    className="display"
                    style={{
                      fontSize: "clamp(17px, 2vw, 23px)",
                      fontWeight: 500,
                      letterSpacing: "-0.016em",
                      lineHeight: 1.15,
                      animation: "none",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)] mt-1.5">
                    {s.time}
                  </p>
                </div>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14px" }}>
                  {s.body}
                </p>
                <div>
                  <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-[var(--ink-4)] mb-1.5">
                    На выходе
                  </p>
                  <p className="text-[var(--ink-2)] leading-[1.55]" style={{ fontSize: "13.5px" }}>
                    {s.output}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Что получает заказчик */}
      {p.deliverables && p.deliverables.length > 0 && (
        <Section bg="var(--paper-2)">
          <p className="eyebrow mb-9">Что вы получаете · 04</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--rule)" }}>
            {p.deliverables.map((d, i) => (
              <div
                key={d.title}
                className="scroll-reveal p-6"
                style={{ background: "var(--paper-2)", animationDelay: `${i * 40}ms` }}
              >
                <h3
                  className="display mb-2"
                  style={{ fontSize: "16.5px", fontWeight: 500, letterSpacing: "-0.012em", lineHeight: 1.3, animation: "none" }}
                >
                  {d.title}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "13.5px" }}>
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Стоимость */}
      <Section>
        <p className="eyebrow mb-9">Стоимость и от чего она зависит · 05</p>
        <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16">
          <div>
            {p.price ? (
              <>
                <p
                  className="display"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                    animation: "none",
                  }}
                >
                  {p.price.value}
                </p>
                {p.price.note && (
                  <p className="text-[var(--ink-2)] leading-[1.6] mt-3" style={{ fontSize: "14px" }}>
                    {p.price.note}
                  </p>
                )}
              </>
            ) : (
              <>
                <p
                  className="display"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    animation: "none",
                  }}
                >
                  Считаем по составу работ
                </p>
                <p className="text-[var(--ink-2)] leading-[1.6] mt-3" style={{ fontSize: "14px" }}>
                  Вилку называем сразу после разбора — до того, как вы потратите
                  на нас больше сорока минут. Точная сумма фиксируется в смете
                  и дальше не меняется.
                </p>
              </>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-4">
                От чего зависит
              </p>
              <ul className="flex flex-col gap-2.5">
                {factors.map((f) => (
                  <li
                    key={f}
                    className="flex items-baseline gap-2.5 text-[var(--ink-2)]"
                    style={{ fontSize: "13.5px", lineHeight: 1.5 }}
                  >
                    <span className="font-mono text-[var(--ink-4)] shrink-0" style={{ fontSize: "11px" }}>·</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {p.priceNotIncluded && p.priceNotIncluded.length > 0 && (
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-4">
                  Что не входит
                </p>
                <ul className="flex flex-col gap-2.5">
                  {p.priceNotIncluded.map((f) => (
                    <li
                      key={f}
                      className="flex items-baseline gap-2.5 text-[var(--ink-3)]"
                      style={{ fontSize: "13.5px", lineHeight: 1.5 }}
                    >
                      <span className="font-mono text-[var(--ink-4)] shrink-0" style={{ fontSize: "11px" }}>·</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Доказательство */}
      {p.proof && (
        <Section bg="var(--paper-2)">
          <p className="eyebrow mb-7">Доказательство · 06</p>
          <div className="max-w-[70ch]">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--cobalt)] mb-4">
              {p.proof.label}
            </p>
            <p className="text-[var(--ink-2)] leading-[1.7]" style={{ fontSize: "16px" }}>
              {p.proof.body}
            </p>
            {p.proof.href && (
              <Link
                href={p.proof.href}
                className="inline-block mt-5 font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
              >
                {p.proof.linkLabel ?? "Смотреть →"}
              </Link>
            )}
          </div>
        </Section>
      )}

      {/* Технологии — после ценности */}
      {p.tech && (
        <Section>
          <p className="eyebrow mb-3">Что внутри · 07</p>
          <h2
            className="display mb-9"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.022em",
              lineHeight: 1.15,
              maxWidth: "24ch",
              animation: "none",
            }}
          >
            {p.tech.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
            {p.tech.items.map((t, i) => (
              <div key={t} className="flex items-baseline gap-3 border-t border-[var(--rule)] pt-3.5">
                <span className="font-mono text-[10px] text-[var(--ink-4)] shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--ink-2)] leading-[1.5]" style={{ fontSize: "13.5px" }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section bg="var(--paper-2)">
        <p className="eyebrow mb-8">Вопросы · 08</p>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          {p.faq.map((f) => (
            <div key={f.question}>
              <h3
                className="display mb-2"
                style={{ fontSize: "17px", fontWeight: 500, letterSpacing: "-0.013em", lineHeight: 1.3, animation: "none" }}
              >
                {f.question}
              </h3>
              <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "14.5px" }}>
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14 lg:items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-4"
              style={{
                fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.026em",
                fontVariationSettings: '"opsz" 48',
                animation: "none",
              }}
            >
              {p.ctaTitle}
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.65] max-w-[52ch]" style={{ fontSize: "15.5px" }}>
              {p.ctaBody}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CtaLink
              href={p.ctaHref ?? "/razbor"}
              goalName="razbor_cta"
              goalParams={{ place: `${p.slug}_footer` }}
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              {p.ctaLabel ?? "Разобрать процесс →"}
            </CtaLink>
            <Link
              href="/contact"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Другие способы связи
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{ fontSize: "11px", letterSpacing: "0.04em", marginTop: "6px" }}
            >
              Ответ в течение рабочего дня · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
