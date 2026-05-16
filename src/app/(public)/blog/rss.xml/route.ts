import { prisma } from "@/lib/db";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

/**
 * RSS 2.0 feed for the blog — served at /blog/rss.xml.
 * A static `rss.xml` segment takes precedence over the sibling `[slug]`
 * dynamic route, so this does not collide with /blog/[slug].
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const date = (p.publishedAt ?? p.createdAt).toUTCString();
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(p.excerpt ?? p.title)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — Журнал</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Журнал студии: AI для бизнеса без магии, промышленное видео, выставки и интерактив.</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
