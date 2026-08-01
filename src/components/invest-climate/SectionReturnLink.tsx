"use client";

/**
 * SectionReturnLink — навигационная связка в конце крупного раздела:
 * «К основным выводам» и «К пакету решений» (правило «любой раздел
 * достижим не более чем за два действия», ТЗ п. 2).
 */
export function SectionReturnLink({
  onOverview,
  onPackage,
  hidePackage = false,
}: {
  onOverview: () => void;
  onPackage: () => void;
  hidePackage?: boolean;
}) {
  return (
    <nav
      className="ic-no-print mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--ic-line)] pt-4"
      aria-label="Быстрый переход"
    >
      <button
        type="button"
        onClick={onOverview}
        className="text-[13.5px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
      >
        ↑ К основным выводам
      </button>
      {!hidePackage ? (
        <button
          type="button"
          onClick={onPackage}
          className="text-[13.5px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
        >
          К пакету решений →
        </button>
      ) : null}
    </nav>
  );
}
