import Link from "next/link"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

const SOURCE_LABEL = {
  RAZBOR: "Разбор процесса",
  CONTACT: "Контакты",
} as const

const STATUS_LABEL = {
  NEW: "Новое",
  CONTACTED: "Связались",
  SCHEDULED: "Назначен звонок",
  CONVERTED: "В работе",
  ARCHIVED: "Архив",
} as const

function formatDate(d: Date): string {
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const newCount = leads.filter((l) => l.status === "NEW").length

  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: "var(--content-max)" }}>
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-3">
            Leads · {leads.length}
            {newCount > 0 && (
              <span style={{ color: "var(--cobalt)" }}> · новых {newCount}</span>
            )}
          </p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              animation: "none",
            }}
          >
            Короткие обращения
          </h1>
          <p className="text-[var(--ink-3)] text-[13.5px] mt-2 max-w-[60ch]">
            Заявки с «Разбора процесса» и со страницы контактов. Подробные брифы —{" "}
            <Link href="/admin/briefs" className="text-[var(--cobalt)] hover:underline">
              в разделе брифов
            </Link>
            .
          </p>
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="text-[var(--ink-3)] text-[14px] py-16 text-center border border-dashed border-[var(--rule)]">
          Обращений пока нет.
        </p>
      ) : (
        <div className="flex flex-col">
          {leads.map((l) => (
            <article
              key={l.id}
              className="border-t border-[var(--rule)] py-6 grid gap-3 md:grid-cols-[160px_1fr_140px]"
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase mb-1.5"
                   style={{ color: l.status === "NEW" ? "var(--cobalt)" : "var(--ink-3)" }}>
                  {SOURCE_LABEL[l.source]}
                </p>
                <p className="font-mono text-[11px] text-[var(--ink-3)]">
                  {formatDate(l.createdAt)}
                </p>
                <p className="font-mono text-[11px] text-[var(--ink-4)] mt-1">
                  {STATUS_LABEL[l.status]}
                </p>
              </div>

              <div className="min-w-0">
                <p
                  className="display text-[var(--ink)] mb-1"
                  style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "-0.012em", animation: "none" }}
                >
                  {l.name}
                </p>
                <p className="text-[15px] text-[var(--ink)] mb-2 break-words select-all">
                  {l.contact}
                </p>
                {l.process && (
                  <p className="text-[14px] text-[var(--ink-2)] leading-[1.6] whitespace-pre-wrap break-words">
                    {l.process}
                  </p>
                )}
              </div>

              <div className="md:text-right">
                {l.slot && (
                  <p className="font-mono text-[11px] text-[var(--ink-2)] mb-1">
                    {l.slot}
                  </p>
                )}
                {l.page && (
                  <p className="font-mono text-[10px] text-[var(--ink-4)]">{l.page}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
