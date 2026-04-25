import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Бриф отправлен",
  description: "Анатолий ответит лично в течение рабочего дня.",
}

const TYPE_LABEL: Record<string, string> = {
  VIDEO: "Видеопродакшн",
  AI: "Разработка / AI",
  UNSURE: "Не уверен",
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const brief = id
    ? await prisma.brief.findUnique({
        where: { id },
        select: {
          type: true, name: true, company: true, mainIdea: true, deadline: true, budget: true,
        },
      })
    : null

  return (
    <>
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow" style={{ color: "var(--cobalt)" }}>
              ● Бриф получен
            </span>
            <span className="eyebrow text-center hidden md:block">Veretennikov Studio</span>
            <span className="eyebrow text-right">
              {new Date().toLocaleDateString("ru-RU")}
            </span>
          </div>

          <div className="pt-20 pb-12 max-w-[720px]">
            <p className="eyebrow mb-7">Спасибо</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "32px",
                animation: "none",
              }}
            >
              Бриф{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>получен.</span>
              <br />
              Прочитаю, отвечу лично.
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              {brief?.name && <>{brief.name}, </>}отвечу в течение рабочего дня.
              Если задача срочная — напишите в Telegram дополнительно, отреагирую быстрее.
            </p>

            {brief && (
              <div
                className="border-l-2 border-[var(--cobalt)] pl-5 py-2 mb-10"
                style={{ background: "var(--cobalt-tint)" }}
              >
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                  Что вы отправили
                </p>
                <p className="text-[14px] text-[var(--ink)] leading-[1.6]">
                  <strong>{TYPE_LABEL[brief.type] ?? brief.type}</strong>
                  {brief.company && <> · {brief.company}</>}
                  {brief.deadline && <> · {brief.deadline}</>}
                  {brief.budget && <> · {brief.budget}</>}
                </p>
                {brief.mainIdea && (
                  <p className="text-[13px] text-[var(--ink-2)] mt-2 leading-[1.55] line-clamp-3">
                    {brief.mainIdea}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3 text-[14px] text-[var(--ink-2)] leading-[1.7] mb-10">
              <p>
                <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)] mr-3">
                  что дальше
                </span>
              </p>
              <ol className="space-y-2 pl-0">
                <li className="flex gap-3">
                  <span className="font-mono text-[11px] text-[var(--cobalt)] mt-1">01</span>
                  <span>Прочитаю бриф и пойму, могу ли я взять задачу</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[11px] text-[var(--ink-3)] mt-1">02</span>
                  <span>Если да — отвечу с уточняющими вопросами или предложу созвон на 30 минут</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[11px] text-[var(--ink-3)] mt-1">03</span>
                  <span>Если нет — честно скажу почему и порекомендую коллег</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                ← На главную
              </Link>
              <Link
                href="/cases"
                className="px-7 py-3.5 text-[var(--ink-2)] hover:text-[var(--cobalt)] text-[14px] transition-colors inline-flex items-center"
              >
                Посмотреть работы →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
