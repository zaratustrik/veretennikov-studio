"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Inline expandable detail. Keeps the slide readable in two seconds
 * while the depth stays one click away for the discussion.
 */
export default function Detail({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="deck-hairline border-t">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-3 text-left"
      >
        <span className="deck-eyebrow deck-secondary">{title}</span>
        <span
          aria-hidden
          className="shrink-0 font-mono text-[15px] leading-none transition-transform duration-300"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: open ? "var(--deck-copper)" : "currentColor",
            opacity: open ? 1 : 0.5,
          }}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={reduce ? {} : { height: "auto", opacity: 1 }}
            exit={reduce ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="deck-body deck-secondary max-w-[62ch] pb-4">{body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
