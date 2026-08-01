"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type ContentsEntry = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

/**
 * PageContents — боковая панель «Оглавление»: все разделы с подуровнями,
 * индикатор текущего раздела и прогресс прохождения (паттерн in-page
 * navigation USWDS + collapsible-навигация PatternFly, реализация своя).
 */
export function PageContents({
  open,
  entries,
  activeSection,
  onNavigate,
  onClose,
}: {
  open: boolean;
  entries: ContentsEntry[];
  activeSection: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    panelRef.current?.querySelector("button")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose]);

  const flat = entries.map((e) => e.id);
  const activeTop =
    entries.find(
      (e) =>
        e.id === activeSection ||
        e.children?.some((c) => c.id === activeSection),
    )?.id ?? flat[0];
  const idx = Math.max(0, flat.indexOf(activeTop));
  const progress = ((idx + 1) / flat.length) * 100;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="contents-overlay"
            className="ic-contents-overlay ic-no-print"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            key="contents-panel"
            ref={panelRef}
            className="ic-contents ic-no-print"
            role="dialog"
            aria-modal="true"
            aria-label="Оглавление"
            initial={reduced ? false : { x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { x: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="ic-contents-progress" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[var(--ic-line)] px-4 py-3">
              <div>
                <h2 className="text-[15px] font-bold">Оглавление</h2>
                <p className="text-[12px] text-[var(--ic-ink-2)]">
                  Раздел {idx + 1} из {flat.length}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[var(--ic-line)] px-2.5 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
                aria-label="Закрыть оглавление (Esc)"
              >
                Закрыть ✕
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Разделы">
              <ul className="space-y-0.5">
                {entries.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      className={`ic-contents-link ${
                        activeTop === e.id ? "ic-contents-active" : ""
                      }`}
                      aria-current={activeTop === e.id ? "true" : undefined}
                      onClick={() => {
                        onNavigate(e.id);
                        onClose();
                      }}
                    >
                      {e.label}
                    </button>
                    {e.children && e.children.length > 0 ? (
                      <ul>
                        {e.children.map((c) => (
                          <li key={c.id}>
                            <button
                              type="button"
                              className={`ic-contents-link ic-contents-sub ${
                                activeSection === c.id ? "ic-contents-active" : ""
                              }`}
                              onClick={() => {
                                onNavigate(c.id);
                                onClose();
                              }}
                            >
                              {c.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
