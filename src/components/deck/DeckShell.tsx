"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-snap container for a deck.
 *
 * Keyboard: ↓ → Space PageDown — forward; ↑ ← PageUp — back;
 * Home / End — first and last slide.
 * Deep links (#slide-3) work on load and on reload.
 */
export default function DeckShell({
  total,
  children,
  /** Palette modifier class, e.g. "deck-utpp". Empty keeps the industrial one. */
  variant = "",
  ariaLabel = "Презентация для СОСПП",
}: {
  total: number;
  children: ReactNode;
  variant?: string;
  ariaLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(1);

  /* Intent, not measurement. Reading scrollTop mid-animation loses key
   * presses: two quick taps both resolve to the same target slide. */
  const targetRef = useRef(1);
  const navAtRef = useRef(0);

  const { scrollYProgress } = useScroll({ container: rootRef });
  const bar = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  /* Track the slide nearest the top; resync intent once scrolling settles.
   * A native scroll listener rather than framer's progress value: the
   * browser performs its own jump to #slide-N before framer starts
   * tracking, and the deck would then answer the first arrow press as if
   * it were still on slide one. The initial call covers that jump. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sync = () => {
      const idx = Math.min(
        Math.max(Math.round(root.scrollTop / root.clientHeight) + 1, 1),
        total,
      );
      setCurrent((prev) => (prev === idx ? prev : idx));
      if (Date.now() - navAtRef.current > 800) targetRef.current = idx;
    };
    sync();
    root.addEventListener("scroll", sync, { passive: true });
    return () => root.removeEventListener("scroll", sync);
  }, [total]);

  const goTo = useCallback((index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
    const clamped = Math.min(Math.max(index, 1), slides.length);
    const target = slides[clamped - 1];
    if (!target) return;
    targetRef.current = clamped;
    navAtRef.current = Date.now();
    /* Instant, not smooth: inside a mandatory scroll-snap container
     * Chromium cancels programmatic smooth scrolling, so key presses
     * would silently do nothing. The cut is covered by the reveal
     * animation on the incoming slide; wheel and swipe stay smooth. */
    root.scrollTo({ top: target.offsetTop, behavior: "auto" });
  }, []);

  const step = useCallback(
    (delta: number) => {
      goTo(targetRef.current + delta);
    },
    [goTo],
  );

  /* Keys are bound to the window, not to the container's focus: a
   * presenter opens the link and presses the arrow immediately, without
   * clicking the page first. Typing inside a control still wins. */
  useEffect(() => {
    const forward = ["ArrowDown", "ArrowRight", "PageDown", " ", "Spacebar"];
    const back = ["ArrowUp", "ArrowLeft", "PageUp"];

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(t.tagName))
      ) {
        return;
      }

      if (forward.includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (back.includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(1);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(Number.MAX_SAFE_INTEGER);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goTo]);

  /* Also give the container focus on load: screen readers announce the
   * region, and the scroll container responds to the wheel immediately. */
  useEffect(() => {
    // A short delay, not rAF: some browsers move focus back to <body>
    // once the document finishes loading, undoing an earlier call.
    const id = window.setTimeout(
      () => rootRef.current?.focus({ preventScroll: true }),
      120,
    );
    return () => window.clearTimeout(id);
  }, []);

  /* Honour #slide-N on first paint — the container, not the window, scrolls. */
  useEffect(() => {
    const hash = window.location.hash;
    const match = /^#slide-(\d+)$/.exec(hash);
    if (!match) return;
    const id = Number(match[1]);
    // Two frames: layout must settle before we measure offsetTop.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const root = rootRef.current;
        const target = root?.querySelector<HTMLElement>(`#slide-${id}`);
        if (root && target) {
          targetRef.current = id;
          setCurrent(Math.min(Math.max(id, 1), total));
          root.scrollTo({ top: target.offsetTop, behavior: "auto" });
        }
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [total]);

  return (
    <div
      ref={rootRef}
      className={`deck-root${variant ? ` ${variant}` : ""}`}
      tabIndex={0}
      role="region"
      aria-roledescription="презентация"
      aria-label={ariaLabel}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="deck-chrome fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
          style={{ scaleX: bar, backgroundColor: "var(--deck-copper)" }}
        />
      )}

      {children}

      {/* Screen-reader-only live position */}
      <p className="sr-only" aria-live="polite">
        Слайд {current} из {total}
      </p>
    </div>
  );
}
