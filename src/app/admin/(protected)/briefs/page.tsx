import Link from "next/link"
import { prisma } from "@/lib/db"

const STATUS_LABEL = {
  NEW: "Новый",
  CONTACTED: "Связались",
  IN_DISCUSSION: "Обсуждение",
  CONVERTED: "В работе",
  ARCHIVED: "Архив",
} as const

const STATUS_COLOR = {
  NEW: "var(--cobalt)",
  CONTACTED: "var(--ink-2)",
  IN_DISCUSSION: "var(--ink-2)",
  CONVERTED: "var(--cobalt)",
  ARCHIVED: "var(--ink-4)",
} as const

const TYPE_LABEL = {
  VIDEO: "Видео",
  AI: "AI",
  UNSURE: "?",
} as const

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function BriefsListPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = "all" } = await searchParams

  const where =
    filter === "new"          ? { status: "NEW" as const } :
    filter === "active"       ? { status: { in: ["CONTACTED", "IN_DISCUSSION"] as ("CONTACTED" | "IN_DISCUSSION")[] } } :
    filter === "archived"     ? { status: "ARCHIVED" as const } :
    {}

  const briefs = await prisma.brief.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true, type: true, status: true, name: true, company: true,
      email: true, mainIdea: true, deadline: true, budget: true, createdAt: true,
    },
  })

  const counts = {
    all:      await prisma.brief.count(),
    new:      await prisma.brief.count({ where: { status: "NEW" } }),
    active:   await prisma.brief.count({ where: { status: { in: ["CONTACTED", "IN_DISCUSSION"] } } }),
    archived: await prisma.brief.count({ where: { status: "ARCHIVED" } }),
  }

  return (
    <div className="mx-auto px-8 py-12" style={{ maxWidth: "var(--content-max)" }}>
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-3">Briefs · {counts.all}</p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              animation: "none",
            }}
          >
            Входящие брифы
          </h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <FilterTab href="/admin/briefs"               active={filter === "all"}      label="Все"        count={counts.all} />
        <FilterTab href="/admin/briefs?filter=new"    active={filter === "new"}      label="Новые"      count={counts.new} />
        <FilterTab href="/admin/briefs?filter=active" active={filter === "active"}   label="В работе"   count={counts.active} />
        <FilterTab href="/admin/briefs?filter=archived" active={filter === "archived"} label="Архив"    count={counts.archived} />
      </div>

      {briefs.length === 0 ? (
        <div className="border border-[var(--rule)] p-12 text-center text-[var(--ink-3)] text-[14px]">
          Брифов в этой категории пока нет.
        </div>
      ) : (
        <div className="border border-[var(--rule)]">
          <div
            className="grid font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)] py-3 px-4 border-b border-[var(--rule)]"
            style={{ gridTemplateColumns: "120px 50px 1fr 140px 140px", gap: "16px", background: "var(--paper-1)" }}
          >
            <span>дата</span>
            <span>тип</span>
            <span>контакт / задача</span>
            <span>статус</span>
            <span className="text-right">действия</span>
          </div>
          {briefs.map((b) => (
            <Link
              key={b.id}
              href={`/admin/briefs/${b.id}`}
              className="grid items-baseline py-4 px-4 border-b border-[var(--rule)] last:border-b-0 hover:bg-[var(--paper-1)] transition-colors group"
              style={{ gridTemplateColumns: "120px 50px 1fr 140px 140px", gap: "16px" }}
            >
              <span className="font-mono text-[11px] text-[var(--ink-3)]">
                {formatDate(b.createdAt)}
              </span>
              <span className="font-mono text-[11px] text-[var(--ink-2)]">
                {TYPE_LABEL[b.type]}
              </span>
              <div className="min-w-0">
                <div className="text-[14px] text-[var(--ink)] truncate group-hover:text-[var(--cobalt)] transition-colors">
                  <strong>{b.name}</strong>
                  {b.company && <span className="text-[var(--ink-2)]"> · {b.company}</span>}
                </div>
                <p className="text-[12px] text-[var(--ink-3)] truncate mt-0.5">
                  {b.mainIdea || <span className="italic">без описания</span>}
                </p>
              </div>
              <span
                className="font-mono text-[10px] tracking-[0.12em] uppercase inline-flex items-center gap-1.5"
                style={{ color: STATUS_COLOR[b.status] }}
              >
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: STATUS_COLOR[b.status] }}
                />
                {STATUS_LABEL[b.status]}
              </span>
              <div className="text-right">
                <span className="font-mono text-[11px] text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors">
                  открыть →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterTab({
  href, active, label, count,
}: {
  href: string; active: boolean; label: string; count: number
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 font-mono text-[12px] tracking-[0.04em] border transition-colors ${
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
          : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
      }`}
      style={{ borderRadius: 2 }}
    >
      {label}{" "}
      <span className={active ? "text-[var(--paper)]" : "text-[var(--ink-3)]"}>
        / {count}
      </span>
    </Link>
  )
}
