import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import FallbackPoster from "@/components/public/FallbackPoster";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SITE_URL, collectionPageSchema } from "@/lib/seo";

const PAGE_TITLE = "Журнал";
const PAGE_DESCRIPTION =
  "Журнал студии: AI для бизнеса без магии, промышленное видео, выставки и интерактив, разработка под бизнес-процессы. Сложные темы простым языком.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: `${PAGE_TITLE} — Veretennikov Studio`,
    description: PAGE_DESCRIPTION,
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} — Veretennikov Studio`,
    description: PAGE_DESCRIPTION,
  },
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverUrl: true,
      tags: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          url: `${SITE_URL}/blog`,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          itemsCount: posts.length,
        })}
      />

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Veretennikov Studio</span>
            <span className="eyebrow text-center hidden md:block">Журнал</span>
            <span className="eyebrow text-right">{posts.length} ст.</span>
          </div>

          <div className="pt-16 pb-14 md:pt-20 md:pb-16 max-w-[760px]">
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                marginBottom: "24px",
                animation: "none",
              }}
            >
              Журнал студии
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)" }}
            >
              Сложные B2B-темы простым языком: AI без магии, промышленное видео,
              выставки и интерактив, разработка под бизнес-процессы.
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-10)" }}>
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {posts.length === 0 ? (
            <p
              className="text-center text-[var(--ink-3)] py-16"
              style={{ fontSize: "14px" }}
            >
              Статьи скоро появятся.
            </p>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
              {posts.map((p, i) => {
                const date = p.publishedAt ?? p.createdAt;
                return (
                  <StaggerItem key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block"
                  >
                    <div
                      className="relative w-full overflow-hidden bg-[var(--paper-2)] mb-5"
                      style={{ aspectRatio: "16 / 9", borderRadius: 2 }}
                    >
                      {p.coverUrl ? (
                        <Image
                          src={p.coverUrl}
                          alt={p.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          unoptimized
                        />
                      ) : (
                        <FallbackPoster title={p.title} index={i + 1} />
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-2.5">
                      <time
                        className="font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)]"
                        dateTime={date.toISOString()}
                      >
                        {formatDate(date)}
                      </time>
                      {p.tags.length > 0 && (
                        <span className="font-mono text-[11px] tracking-[0.04em] text-[var(--cobalt)]">
                          {p.tags[0]}
                        </span>
                      )}
                    </div>

                    <h2
                      className="display text-[var(--ink)] mb-2 transition-colors group-hover:text-[var(--cobalt)]"
                      style={{
                        fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        animation: "none",
                      }}
                    >
                      {p.title}
                    </h2>

                    {p.excerpt && (
                      <p
                        className="text-[var(--ink-2)] leading-[1.6]"
                        style={{
                          fontSize: "14px",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                        }}
                      >
                        {p.excerpt}
                      </p>
                    )}
                  </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
