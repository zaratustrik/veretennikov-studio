import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import FallbackPoster from "@/components/public/FallbackPoster";
import JsonLd from "@/components/JsonLd";
import { GameRenderer } from "@/components/games/GameRenderer";
import { REGISTERED_GAME_SLUGS } from "@/components/games/slugs";
import {
  SITE_URL,
  videoObjectSchema,
  breadcrumbListSchema,
} from "@/lib/seo";

/* ─── Static generation ────────────────────────────────────────── */

export async function generateStaticParams() {
  const cases = await prisma.case.findMany({
    where: { isPublic: true },
    select: { slug: true },
  });
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await prisma.case.findUnique({ where: { slug } });
  if (!c || !c.isPublic) return {};

  const fullTitle = c.client ? `${c.client} — ${c.title}` : c.title;
  const url = `${SITE_URL}/show/${c.slug}`;
  const images = c.posterUrl ? [c.posterUrl] : undefined;

  return {
    title: fullTitle,
    description: c.description || c.title,
    alternates: { canonical: `/show/${c.slug}` },
    openGraph: {
      type: "article",
      url,
      title: fullTitle,
      description: c.description || c.title,
      siteName: "Veretennikov Studio",
      locale: "ru_RU",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: c.description || c.title,
      images,
    },
  };
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.case.findUnique({ where: { slug } });
  if (!project || !project.isPublic) notFound();

  const { client, title, description, year, services, challenge, solution, outcome, videoId } = project;

  const fullName = client ? `${client} — ${title}` : title;
  const pageUrl = `${SITE_URL}/show/${project.slug}`;

  const jsonLd: object[] = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Работы", url: `${SITE_URL}/cases` },
      { name: fullName, url: pageUrl },
    ]),
  ];

  // Add VideoObject only if we have meaningful video metadata
  if (project.videoId && project.posterUrl) {
    jsonLd.push(
      videoObjectSchema({
        name: fullName,
        description: description || title,
        thumbnailUrl: project.posterUrl,
        uploadDate: project.createdAt,
        duration: project.duration,
        videoId: project.videoId,
        pageUrl,
      })
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {/* Mono masthead */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <Link href="/cases" className="eyebrow hover:text-[var(--cobalt)] transition-colors">
              ← Все работы
            </Link>
            <span className="eyebrow text-center hidden md:block">Case Study</span>
            <span className="eyebrow text-right">{year}</span>
          </div>

          <div className="pt-20 pb-16">
            <p className="eyebrow mb-7">{client.toUpperCase()} · {year}</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                marginBottom: "32px",
                animation: "none",
              }}
            >
              {title}
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[640px]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.15rem)" }}
            >
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Video / Game / Media ─────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)", paddingTop: "var(--s-7)", paddingBottom: "var(--s-7)" }}
        >
          {project.type === "GAME" && REGISTERED_GAME_SLUGS.has(project.slug) ? (
            <GameRenderer slug={project.slug} />
          ) : videoId ? (
            <div
              className="relative w-full overflow-hidden border border-[var(--rule)]"
              style={{ paddingTop: "56.25%", background: "var(--paper-2)" }}
            >
              <iframe
                src={`https://kinescope.io/embed/${videoId}`}
                title={`Видео: ${fullName}`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                allowFullScreen
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          ) : (
            <div className="relative aspect-video border border-[var(--rule)]">
              <FallbackPoster
                client={client}
                title={title}
                year={year}
                type={project.type}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Services strip ───────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="border-b border-[var(--rule)]">
          <div
            className="mx-auto px-5 md:px-8"
            style={{ maxWidth: "var(--content-max)", paddingTop: "var(--s-7)", paddingBottom: "var(--s-7)" }}
          >
            <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 md:gap-x-10 gap-y-2.5">
              <span className="eyebrow shrink-0">Что делали</span>
              {services.map((s) => (
                <span key={s} className="text-[14px] text-[var(--ink-2)]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Challenge / Solution / Outcome ───────────────────────── */}
      {(challenge || solution || outcome) && (
        <section className="border-b border-[var(--rule)]">
          <div
            className="mx-auto px-5 md:px-8"
            style={{ maxWidth: "var(--content-max)", paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
          >
            <div
              className="grid md:grid-cols-3 border border-[var(--rule)]"
              style={{ gap: 0 }}
            >
              {challenge && (
                <div
                  className="p-8 md:p-10"
                  style={{
                    background: "var(--paper)",
                    borderRight: "1px solid var(--rule)",
                  }}
                >
                  <p className="eyebrow mb-5">Задача · 01</p>
                  <p className="text-[14px] text-[var(--ink-2)] leading-[1.7]">
                    {challenge}
                  </p>
                </div>
              )}
              {solution && (
                <div
                  className="p-8 md:p-10"
                  style={{
                    background: "var(--paper-2)",
                    borderRight: "1px solid var(--rule)",
                  }}
                >
                  <p className="eyebrow mb-5">Решение · 02</p>
                  <p className="text-[14px] text-[var(--ink-2)] leading-[1.7]">
                    {solution}
                  </p>
                </div>
              )}
              {outcome && (
                <div className="p-8 md:p-10" style={{ background: "var(--paper)" }}>
                  <p className="eyebrow mb-5" style={{ color: "var(--cobalt)" }}>
                    Результат · 03
                  </p>
                  <p className="text-[14px] text-[var(--ink-2)] leading-[1.7]">
                    {outcome}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
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
                Похожая задача?{" "}
                <span style={{ color: "var(--ink-3)" }}>Обсудим.</span>
              </h2>
              <p className="text-[var(--ink-3)] text-[14px]">
                Анатолий ответит лично.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors inline-flex items-center gap-2"
              >
                Написать <span>→</span>
              </Link>
              <Link
                href="/cases"
                className="px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Все работы
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
