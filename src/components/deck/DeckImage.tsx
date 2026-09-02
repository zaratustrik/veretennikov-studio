"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Scrim = "none" | "left" | "bottom" | "top" | "right";

const SCRIM: Record<Scrim, string> = {
  none: "",
  left: "linear-gradient(to right, rgba(20,24,28,.88) 0%, rgba(20,24,28,.62) 34%, rgba(20,24,28,0) 62%)",
  right:
    "linear-gradient(to left, rgba(20,24,28,.88) 0%, rgba(20,24,28,.62) 34%, rgba(20,24,28,0) 62%)",
  bottom:
    "linear-gradient(to top, rgba(20,24,28,.90) 0%, rgba(20,24,28,.55) 34%, rgba(20,24,28,0) 68%)",
  top: "linear-gradient(to bottom, rgba(20,24,28,.85) 0%, rgba(20,24,28,.40) 40%, rgba(20,24,28,0) 72%)",
};

/**
 * Photographic block for a deck slide.
 *
 * The illustrations are warm and slightly saturated; the deck is graphite
 * and copper. Rather than bending the palette to the photographs, the
 * photographs are pulled back a little (desaturate + a touch of contrast)
 * so the copper accent stays the only warm signal on the screen.
 *
 * Parallax is deliberately shallow (±3.5%) and disabled under
 * prefers-reduced-motion.
 */
export default function DeckImage({
  src,
  alt,
  objectPosition = "center",
  scrim = "none",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 55vw",
  className = "",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  scrim?: Scrim;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);

  /* No `relative` here on purpose: callers pass their own positioning
   * (`relative h-[…]` for a panel, `absolute inset-0` for a full bleed).
   * Hard-coding it would collide with `absolute` and collapse the box. */
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale: 1.08 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{
            objectPosition,
            filter: "saturate(0.88) contrast(1.03) brightness(0.97)",
          }}
        />
      </motion.div>

      {scrim !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: SCRIM[scrim] }}
        />
      )}
    </div>
  );
}
