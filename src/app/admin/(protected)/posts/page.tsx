import Link from "next/link"
import { prisma } from "@/lib/db"
import { togglePublicPost } from "./actions"
import DeletePostButton from "./_components/DeletePostButton"

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = "all" } = await searchParams

  const where =
    filter === "published" ? { isPublic: true } :
    filter === "drafts"    ? { isPublic: false } :
    {}

  const posts = await prisma.post.findMany({
    where,
    orderBy: [
      { isPublic: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true, slug: true, title: true, isPublic: true,
      publishedAt: true, createdAt: true, tags: true,
    },
  })

  const totalAll       = await prisma.post.count()
  const totalPublished = await prisma.post.count({ where: { isPublic: true } })
  const totalDrafts    = totalAll - totalPublished

  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: "var(--content-max)" }}>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-3">Журнал · {totalAll}</p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              animation: "none",
            }}
          >
            Статьи блога
          </h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-[var(--ink)] text-[var(--paper)] text-[13px] font-medium rounded-full hover:bg-[var(--ink-2)] transition-colors"
        >
          + Новая статья
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <FilterTab href="/admin/posts" active={filter === "all"} label="Все" count={totalAll} />
        <FilterTab href="/admin/posts?filter=published" active={filter === "published"} label="Опубликованные" count={totalPublished} />
        <FilterTab href="/admin/posts?filter=drafts" active={filter === "drafts"} label="Черновики" count={totalDrafts} />
      </div>

      {posts.length === 0 ? (
        <div className="border border-[var(--rule)] p-12 text-center text-[var(--ink-3)] text-[14px]">
          Статей в этой категории пока нет.
        </div>
      ) : (
        <div className="border border-[var(--rule)]">
          <div
            className="grid font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)] py-3 px-4 border-b border-[var(--rule)]"
            style={{ gridTemplateColumns: "70px 110px 1fr 160px", gap: "16px", background: "var(--paper-1)" }}
          >
            <span>статус</span>
            <span>дата</span>
            <span>заголовок</span>
            <span className="text-right">действия</span>
          </div>
          {posts.map((p) => (
            <div
              key={p.id}
              className="grid items-center py-3 px-4 border-b border-[var(--rule)] last:border-b-0 hover:bg-[var(--paper-1)] transition-colors"
              style={{ gridTemplateColumns: "70px 110px 1fr 160px", gap: "16px" }}
            >
              <span
                className="font-mono text-[10px] tracking-[0.12em] uppercase inline-flex items-center gap-1.5"
                style={{ color: p.isPublic ? "var(--cobalt)" : "var(--ink-3)" }}
              >
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: p.isPublic ? "var(--cobalt)" : "var(--ink-4)" }}
                />
                {p.isPublic ? "live" : "draft"}
              </span>

              <span className="font-mono text-[11px] text-[var(--ink-3)]">
                {formatDate(p.publishedAt ?? p.createdAt)}
              </span>

              <div className="min-w-0">
                <div className="text-[14px] text-[var(--ink)] truncate">
                  {p.title || <span className="text-[var(--ink-3)] italic">без названия</span>}
                </div>
                <div className="font-mono text-[10px] text-[var(--ink-3)] truncate">
                  /blog/{p.slug}
                  {p.tags.length > 0 && <span> · {p.tags.join(", ")}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end flex-wrap">
                <Link
                  href={`/admin/posts/${p.id}`}
                  className="font-mono text-[11px] px-2.5 py-1 border border-[var(--ink-3)] text-[var(--ink-2)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
                  style={{ borderRadius: 2 }}
                >
                  ред.
                </Link>
                <form action={togglePublicPost.bind(null, p.id)}>
                  <button
                    type="submit"
                    className="font-mono text-[11px] px-2.5 py-1 border border-[var(--ink-3)] text-[var(--ink-2)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
                    style={{ borderRadius: 2 }}
                  >
                    {p.isPublic ? "скрыть" : "опубл."}
                  </button>
                </form>
                <DeletePostButton id={p.id} title={p.title || p.slug} />
              </div>
            </div>
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
