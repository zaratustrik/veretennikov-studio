import Link from "next/link"

import { prisma } from "@/lib/db"
import { buildSummary } from "@/lib/utpp/summary"
import type { Answers } from "@/types/utpp"

/**
 * Ответы с закрытой страницы /utpp.
 *
 * Отдельной админки не создаём — раздел живёт внутри существующего
 * защищённого контура и наследует его сессию и allowlist.
 */

export const dynamic = "force-dynamic"

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function UtppResponsesPage() {
  const responses = await prisma.utppProjectResponse.findMany({
    orderBy: { submittedAt: "desc" },
  })

  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: "var(--content-max)" }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">УТПП · ответов {responses.length}</p>
        <h1
          className="display"
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            animation: "none",
          }}
        >
          Уточнения с закрытой страницы
        </h1>
        <p className="mt-4 text-[14px] text-[var(--ink-3)] max-w-[64ch] leading-[1.6]">
          Каждая отправка — отдельная запись: если страницу смотрело несколько
          человек, их ответы не перезаписывают друг друга. Поле «Кто отвечал»
          необязательное и может быть пустым.
        </p>
      </div>

      {responses.length === 0 ? (
        <p className="text-[15px] text-[var(--ink-3)]">Ответов пока нет.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {responses.map((response) => {
            const summary = buildSummary(response.answers as Answers).filter(
              (item) => item.answered,
            )

            return (
              <article
                key={response.id}
                className="border border-[var(--rule)] p-5 md:p-7"
              >
                <header className="flex items-baseline justify-between gap-4 flex-wrap mb-5 pb-4 border-b border-[var(--rule)]">
                  <div>
                    <p className="text-[16px] text-[var(--ink)]">
                      {response.respondentName ?? "Без имени"}
                    </p>
                    <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] mt-1">
                      {formatDate(response.submittedAt)} · отвечено{" "}
                      {response.answeredCount}
                    </p>
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-4)]">
                    контент {response.contentVersion} · вопросы{" "}
                    {response.questionSetVersion}
                  </p>
                </header>

                <dl className="flex flex-col gap-4">
                  {summary.map((item) => (
                    <div key={item.id}>
                      <dt className="text-[13px] text-[var(--ink-3)] leading-[1.45]">
                        {item.label}
                      </dt>
                      <dd className="text-[15px] text-[var(--ink)] leading-[1.6] mt-1">
                        {item.value}
                        {item.comment ? (
                          <span className="block text-[13px] text-[var(--ink-2)] mt-1">
                            {item.comment}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </div>
      )}

      <p className="mt-10">
        <Link
          href="/admin"
          className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)] hover:text-[var(--cobalt)] transition-colors"
        >
          ← в админку
        </Link>
      </p>
    </div>
  )
}
