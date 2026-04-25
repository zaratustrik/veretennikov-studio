"use client"

import { deleteCase } from "../actions"

export default function DeleteButton({
  id, title,
}: {
  id: string; title: string
}) {
  return (
    <form
      action={deleteCase.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Удалить «${title}»? Это действие нельзя отменить.`)) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="font-mono text-[11px] px-2.5 py-1 border border-[var(--ink-4)] text-[var(--ink-3)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
        style={{ borderRadius: 2 }}
        aria-label="Удалить кейс"
      >
        ×
      </button>
    </form>
  )
}
