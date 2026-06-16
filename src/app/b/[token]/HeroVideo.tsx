"use client"

import { useEffect, useState } from "react"

/**
 * Hero loop video for the series portal.
 * - autoplay muted loop playsInline (works on iOS Safari)
 * - poster + preload=metadata so first paint is cheap
 * - prefers-reduced-motion → static poster image, no video
 * Scoped to the /b portal; does not touch the main site.
 */
export default function HeroVideo({
  src,
  posterWebp,
  posterJpg,
  label,
}: {
  src: string
  posterWebp?: string
  posterJpg: string
  label: string
}) {
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setAnimate(!mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  return (
    <figure className="bgv-hero-video">
      {animate ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterJpg}
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <picture>
          {posterWebp ? <source srcSet={posterWebp} type="image/webp" /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={posterJpg} alt={label} />
        </picture>
      )}
      <span className="bgv-hero-video-glow" aria-hidden />
    </figure>
  )
}
