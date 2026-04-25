import Link from "next/link"
import { prisma } from "@/lib/db"
import { togglePublic } from "./actions"
import DeleteButton from "./_components/DeleteButton"

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = "all" } = await searchParams

  const where =
    filter === "public"   ? { isPublic: true } :
    filter === "drafts"   ? { isPublic: false } :
    {}

  const cases = await prisma.case.findMany({
    where,
    orderBy: [{ isPublic: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, client: true, title: true, type: true, year: true,
      isPublic: true, videoId: true, order: true,
    },
  })

  const totalAll     = await prisma.case.count()
  const totalPublic  = await prisma.case.count({ where: { isPublic: true } })
  const totalDrafts  = totalAll - totalPublic

  return (
    <div className="mx-auto px-8 py-12" style={{ maxWidth: "var(--content-max)" }}>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-3">Кейсы · {totalAll}</p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              animation: "none",
            }}
          >
            Управление работами
          </h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <FilterTab href="/admin" active={filter === "all"} label="Все" count={totalAll} />
        <FilterTab href="/admin?filter=public" active={filter === "public"} label="Публичные" count={totalPublic} />
        <FilterTab href="/admin?filter=drafts" active={filter === "drafts"} label="Черновики" count={totalDrafts} />
      </div>

      {/* Cases table */}
      <div className="border border-[var(--rule)]">
        <div
          className="grid font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)] py-3 px-4 border-b border-[var(--rule)]"
          style={{ gridTemplateColumns: "60px 90px 80px 1fr 90px 220px", gap: "16px", background: "var(--paper-1)" }}
        >
          <span>статус</span>
          <span>тип</span>
          <span>год</span>
          <span>проект</span>
          <span>видео</span>
          <span className="text-right">действия</span>
        </div>

        {cases.length === 0 && (
          <div className="p-8 text-center text-[var(--ink-3)] text-[14px]">
            Кейсов в этой категории нет.
          </div>
        )}

        {cases.map((c) => (
          <div
            key={c.id}
            className="grid items-center py-3 px-4 border-b border-[var(--rule)] last:border-b-0 hover:bg-[var(--paper-1)] transition-colors"
            style={{ gridTemplateColumns: "60px 90px 80px 1fr 90px 220px", gap: "16px" }}
          >
            {/* Status pill */}
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase inline-flex items-center gap-1.5"
              style={{ color: c.isPublic ? "var(--cobalt)" : "var(--ink-3)" }}
            >
              <span
                className="block w-1.5 h-1.5 rounded-full"
                style={{ background: c.isPublic ? "var(--cobalt)" : "var(--ink-4)" }}
              />
              {c.isPublic ? "live" : "draft"}
            </span>

            {/* Type */}
            <span className="font-mono text-[11px] text-[var(--ink-2)]">{c.type}</span>

            {/* Year */}
            <span className="font-mono text-[11px] text-[var(--ink-3)]">{c.year}</span>

            {/* Title */}
            <div className="min-w-0">
              <div className="text-[14px] text-[var(--ink)] truncate">
                {c.client && <span className="font-medium">{c.client} · </span>}
                <span>{c.title || <span className="text-[var(--ink-3)] italic">без названия</span>}</span>
              </div>
              <div className="font-mono text-[10px] text-[var(--ink-3)] truncate">/{c.slug}</div>
            </div>

            {/* Video badge */}
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              {c.videoId ? "✓ есть" : "—"}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end flex-wrap">
              <Link
                href={`/admin/${c.id}`}
                className="font-mono text-[11px] px-2.5 py-1 border border-[var(--ink-3)] text-[var(--ink-2)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
                style={{ borderRadius: 2 }}
              >
                ред.
              </Link>

              <form action={togglePublic.bind(null, c.id)}>
                <button
                  type="submit"
                  className="font-mono text-[11px] px-2.5 py-1 border border-[var(--ink-3)] text-[var(--ink-2)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
                  style={{ borderRadius: 2 }}
                >
                  {c.isPublic ? "скрыть" : "опубл."}
                </button>
              </form>

              <DeleteButton id={c.id} title={c.title || c.slug} />
            </div>
          </div>
        ))}
      </div>
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

