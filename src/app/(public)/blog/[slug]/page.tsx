import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import Markdown from "@/components/blog/Markdown";
import Button from "@/components/public/Button";
import { SITE_URL, breadcrumbListSchema, articleSchema } from "@/lib/seo";

/* ─── Static generation ────────────────────────────────────────── */

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.isPublic) return {};

  const description = post.excerpt || post.title;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const images = post.coverUrl ? [post.coverUrl] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: "Veretennikov Studio",
      locale: "ru_RU",
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images,
    },
  };
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.isPublic) notFound();

  const date = post.publishedAt ?? post.createdAt;
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const author = post.author || "Veretennikov Studio";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Главная", url: SITE_URL },
            { name: "Журнал", url: `${SITE_URL}/blog` },
            { name: post.title, url: pageUrl },
          ]),
          articleSchema({
            title: post.title,
            description: post.excerpt || post.title,
            url: pageUrl,
            image: post.coverUrl,
            datePublished: date,
            dateModified: post.updatedAt,
            author: post.author,
          }),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <Link
              href="/blog"
              className="eyebrow hover:text-[var(--cobalt)] transition-colors"
            >
              ← Журнал
            </Link>
            <span className="eyebrow text-center hidden md:block">Статья</span>
            <span className="eyebrow text-right">{formatDate(date)}</span>
          </div>

          <div className="pt-16 pb-14 md:pt-20 md:pb-16 max-w-[820px]">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--cobalt)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.75rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                marginBottom: "24px",
                animation: "none",
              }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p
                className="text-[var(--ink-2)] leading-[1.7]"
                style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)" }}
              >
                {post.excerpt}
              </p>
            )}
            <p className="font-mono text-[12px] text-[var(--ink-3)] mt-7">
              {author}
            </p>
          </div>
        </div>
      </section>

      {/* ── Cover ────────────────────────────────────────────────── */}
      {post.coverUrl && (
        <section className="border-b border-[var(--rule)]">
          <div
            className="mx-auto px-5 md:px-8"
            style={{
              maxWidth: "var(--content-max)",
              paddingTop: "var(--s-7)",
              paddingBottom: "var(--s-7)",
            }}
          >
            <div
              className="relative w-full overflow-hidden border border-[var(--rule)] bg-[var(--paper-2)]"
              style={{ aspectRatio: "16 / 9", borderRadius: 2 }}
            >
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(min-width: 1200px) 1136px, 100vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Body ─────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: 760 }}>
          <article className="text-[17px]">
            <Markdown>{post.body}</Markdown>
          </article>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        className="border-t border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2
                className="display mb-3"
                style={{
                  fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Есть похожая задача?{" "}
                <span style={{ color: "var(--ink-3)" }}>Обсудим.</span>
              </h2>
              <p className="text-[var(--ink-3)] text-[14px]">
                Анатолий ответит лично.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact">
                Написать <span>→</span>
              </Button>
              <Button href="/blog" variant="secondary">
                Все статьи
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
