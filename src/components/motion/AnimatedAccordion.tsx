"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Single FAQ-style accordion row with an animated expand/collapse.
 * Height + opacity animate via AnimatePresence; collapses instantly under
 * reduced-motion preference.
 */
export default function AnimatedAccordion({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-[var(--rule)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[var(--ink)] text-[15px] md:text-[16px] font-medium">
          {question}
        </span>
        <span
          className="shrink-0 font-mono text-[18px] leading-none transition-all duration-300"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: open ? "var(--cobalt)" : "var(--ink-3)",
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
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-5 pr-8 text-[var(--ink-2)] text-[14px] leading-[1.7]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
