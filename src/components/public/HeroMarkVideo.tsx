"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Hero visual — a looping, graded motion mark (replaces the SVG diagram on
 * desktop). Source clip was colour-graded so its background sits near-white;
 * mix-blend-mode: multiply then melts that into the paper section, and a
 * radial feather mask dissolves the edges so there is no video rectangle —
 * the blueprint bloom appears to float on the paper.
 *
 * muted · loop · autoplay · playsInline, with a poster for instant paint and
 * a graceful prefers-reduced-motion fallback (still poster, no playback).
 */

const MASK =
  "radial-gradient(ellipse 72% 70% at 50% 47%, #000 50%, rgba(0,0,0,0.35) 70%, transparent 82%)";

const SHARED: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  mixBlendMode: "multiply",
  WebkitMaskImage: MASK,
  maskImage: MASK,
};

export default function HeroMarkVideo() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        height: "min(560px, 60vh)",
        overflow: "hidden",
        marginInline: "auto",
      }}
    >
      {reduce ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/hero/hero-mark-poster.jpg" alt="" style={SHARED} />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-mark-poster.jpg"
          style={SHARED}
        >
          <source src="/hero/hero-mark.webm" type="video/webm" />
          <source src="/hero/hero-mark.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
