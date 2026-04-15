"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { CaseType } from "@/data/cases";

const FILTERS: { value: CaseType | "all"; label: string }[] = [
  { value: "all",       label: "Все" },
  { value: "synthesis", label: "Синтез" },
  { value: "ai",        label: "AI" },
  { value: "video",     label: "Видео" },
];

export default function CasesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("type") ?? "all";

  function setFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/cases?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`text-xs px-4 py-2 rounded-full border transition-colors ${
            current === value
              ? "border-[var(--text-2)] text-[var(--text-1)] bg-[var(--bg-surface)]"
              : "border-[var(--border)] text-[var(--text-2)] hover:border-[#3A3A3A] hover:text-[var(--text-1)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
