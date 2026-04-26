/**
 * Typographic fallback poster — used when a case has no posterUrl.
 * Renders a 16:9 magazine-cover-style layout with client / title / accent.
 * Auto-scales font size to fit longer titles.
 */

interface FallbackPosterProps {
  client?: string
  title: string
  year?: number
  index?: number
  type?: string
}

const TYPE_LABEL: Record<string, string> = {
  VIDEO: "Видео",
  AI: "AI",
  SYNTHESIS: "Синтез",
  DEV: "Разработка",
}

export default function FallbackPoster({
  client, title, year, index, type,
}: FallbackPosterProps) {
  const idx = index !== undefined ? `/${String(index).padStart(2, "0")}` : ""

  // Choose title size based on length — longer titles get smaller text
  const titleLen = title.length
  const titleSize =
    titleLen <= 16 ? "clamp(1.5rem, 3.2vw, 2.6rem)" :
    titleLen <= 32 ? "clamp(1.25rem, 2.6vw, 2.1rem)" :
    titleLen <= 50 ? "clamp(1.05rem, 2.0vw, 1.6rem)" :
    "clamp(0.95rem, 1.6vw, 1.3rem)"

  return (
    <div
      className="absolute inset-0 flex flex-col p-6 lg:p-8"
      style={{
        background: "var(--paper-2)",
        borderTop: "1px solid var(--rule)",
        borderLeft: "1px solid var(--rule)",
      }}
    >
      {/* Top row — index + studio mark */}
      <div className="flex items-baseline justify-between mb-auto">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
          {idx} · STUDIO
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-4)]">
          {type && TYPE_LABEL[type] ? TYPE_LABEL[type] : "—"}
        </span>
      </div>

      {/* Middle — main typographic display */}
      <div className="flex-1 flex flex-col justify-center max-w-[90%]">
        {client && (
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink-3)] mb-3">
            {client}
          </p>
        )}
        <h3
          className="display text-[var(--ink)]"
          style={{
            fontSize: titleSize,
            lineHeight: 1.05,
            letterSpacing: "-0.022em",
            fontVariationSettings: '"opsz" 36',
            fontWeight: 460,
            animation: "none",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Bottom row — cobalt dot + year */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span
          className="block w-1.5 h-1.5 rounded-full"
          style={{
            background: "var(--cobalt)",
            boxShadow: "0 0 8px var(--cobalt)",
          }}
        />
        {year && (
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--ink-3)]">
            {year}
          </span>
        )}
      </div>
    </div>
  )
}
