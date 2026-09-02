import type { ReactNode } from "react";

export type SlideTone = "sheet" | "sheet-2" | "graphite";

/**
 * One full-viewport deck section. Server component: composition only,
 * no client hooks. Motion lives inside the children.
 *
 * `bare` skips the padded 12-column grid so a slide can run an image to
 * the edge and place its own text panel.
 */
export default function Slide({
  index,
  total,
  label,
  tone = "sheet",
  counterLabel,
  bare = false,
  tight = false,
  counterOnLight = false,
  children,
}: {
  index: number;
  total: number;
  label: string;
  tone?: SlideTone;
  counterLabel?: string;
  bare?: boolean;
  /** Более плотные поля: для справочных экранов с длинными списками. */
  tight?: boolean;
  counterOnLight?: boolean;
  children: ReactNode;
}) {
  const counter =
    counterLabel ??
    `${String(index).padStart(2, "0")} — ${String(total).padStart(2, "0")}`;

  return (
    <section
      id={`slide-${index}`}
      data-slide={index}
      aria-label={label}
      className={`deck-slide deck-tone-${tone}`}
    >
      {bare ? (
        children
      ) : (
        <div
          className={`grid w-full grid-cols-12 gap-x-6 px-[6vw] ${
            tight
              ? "gap-y-6 py-[7vh] md:py-[5vh]"
              : "gap-y-8 py-[11vh] md:py-[9vh]"
          }`}
        >
          {children}
        </div>
      )}

      <span
        aria-hidden
        className={`deck-chrome deck-rubric pointer-events-none absolute right-[6vw] top-[5vh] z-20 select-none opacity-70 ${
          counterOnLight ? "text-white" : "deck-secondary"
        }`}
      >
        {counter}
      </span>
    </section>
  );
}
