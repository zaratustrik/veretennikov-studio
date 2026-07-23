"use client";

import { Check } from "@/components/karandash-brief/icons";

export function ProgressHeader({
  stageTitles,
  currentIndex,
  onJump,
  completion,
  draftSaved
}: {
  stageTitles: string[];
  currentIndex: number;
  onJump: (index: number) => void;
  completion: number;
  draftSaved: boolean;
}) {
  const total = stageTitles.length;
  const stepLabel = `Раздел ${currentIndex + 1} из ${total}`;

  return (
    <div className="sticky top-20 z-30 -mx-5 border-b border-line bg-background/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{stepLabel}</p>
            <p className="truncate font-kbh text-base font-bold text-graphite">
              {stageTitles[currentIndex]}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`flex items-center gap-1 text-xs font-medium transition-opacity ${
                draftSaved ? "text-green-700 opacity-100" : "text-muted opacity-70"
              }`}
              aria-live="polite"
            >
              <Check size={14} aria-hidden />
              {draftSaved ? "Черновик сохранён" : "Автосохранение"}
            </span>
            <span className="text-sm font-bold text-primary">{completion}%</span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${Math.max(4, (currentIndex + 1) * (100 / total))}%` }}
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="Прогресс по разделам"
          />
        </div>

        <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Разделы брифа">
          {stageTitles.map((title, index) => (
            <button
              key={title}
              onClick={() => onJump(index)}
              aria-current={index === currentIndex ? "step" : undefined}
              aria-label={`Раздел ${index + 1}: ${title}`}
              title={title}
              className={`h-2 w-8 shrink-0 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : index < currentIndex
                    ? "bg-primary/40"
                    : "bg-surface-container hover:bg-outline-variant"
              }`}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
