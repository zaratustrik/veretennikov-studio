"use client"

import { useFormStatus } from "react-dom"

export default function SubmitButton({
  idle = "Сохранить →",
  pending = "Сохранение…",
}: {
  idle?: string
  pending?: string
}) {
  const status = useFormStatus()
  return (
    <button
      type="submit"
      disabled={status.pending}
      className="px-7 py-3 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-wait"
    >
      {status.pending ? pending : idle}
    </button>
  )
}
