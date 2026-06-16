/**
 * Reusable section banner-hero for the series portal.
 * Wide image (Object Storage) with a malachite veil for legibility + title block.
 * Server component (no client JS). Scoped to /b portal.
 */
export default function SectionHero({
  kicker,
  title,
  lead,
  imgWebp,
  imgJpg,
  alt,
}: {
  kicker: string
  title: string
  lead?: string
  imgWebp?: string
  imgJpg: string
  alt: string
}) {
  return (
    <header className="bgv-section-hero">
      <picture>
        {imgWebp ? <source srcSet={imgWebp} type="image/webp" /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgJpg} alt={alt} loading="eager" />
      </picture>
      <div className="bgv-section-hero-veil" aria-hidden />
      <div className="bgv-section-hero-body">
        <p className="bgv-kicker">{kicker}</p>
        <h1 className="bgv-display mt-2 text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.05]">
          <span className="bgv-title-gradient">{title}</span>
        </h1>
        {lead ? (
          <p className="mt-3 max-w-[640px] text-[0.95rem] leading-relaxed text-[var(--mal-text-2)]">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  )
}
