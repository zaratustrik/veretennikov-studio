"use client"

import { useState, useTransition } from "react"
import { askQuestion } from "./actions"

const inputCls =
  "w-full bg-[var(--paper)] border border-[var(--rule)] px-4 py-3 text-[var(--ink)] outline-none transition-colors focus:border-[var(--cobalt)]"
const labelCls =
  "font-mono mb-2 block"

export default function QuestionForm() {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (done) {
    return (
      <div className="border-t-2 border-[var(--cobalt)] pt-6">
        <p className="font-mono mb-2" style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--cobalt)" }}>
          ● Отправлено
        </p>
        <p className="display text-[var(--ink)]" style={{ fontSize: "clamp(1.3rem,2.4vw,1.7rem)", lineHeight: 1.2 }}>
          Спасибо — вопрос получен.
        </p>
        <p className="text-[var(--ink-2)] mt-3 leading-[1.6]" style={{ fontSize: "15px" }}>
          Отвечу лично, обычно в течение рабочего дня.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        setError(null)
        startTransition(async () => {
          const res = await askQuestion({
            name: String(fd.get("name") || ""),
            email: String(fd.get("email") || ""),
            contact: String(fd.get("contact") || ""),
            question: String(fd.get("question") || ""),
            website_url: String(fd.get("website_url") || ""),
          })
          if (res.ok) setDone(true)
          else setError(res.error)
        })
      }}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Не заполняйте<input type="text" name="website_url" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} htmlFor="q-name" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Имя *</label>
          <input id="q-name" name="name" type="text" required className={inputCls} placeholder="Как к вам обращаться" />
        </div>
        <div>
          <label className={labelCls} htmlFor="q-email" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Email *</label>
          <input id="q-email" name="email" type="email" required className={inputCls} placeholder="you@company.ru" />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="q-contact" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Телефон или Telegram</label>
        <input id="q-contact" name="contact" type="text" className={inputCls} placeholder="по желанию — для быстрой связи" />
      </div>

      <div>
        <label className={labelCls} htmlFor="q-question" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Ваш вопрос *</label>
        <textarea id="q-question" name="question" required rows={4} className={`${inputCls} resize-y`} placeholder="Что хотите уточнить по решению или процессу" />
      </div>

      {error && (
        <p className="font-mono" style={{ fontSize: "12px", color: "var(--cobalt)" }}>{error}</p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors disabled:opacity-60"
          style={{ transitionDuration: "220ms" }}
        >
          {pending ? "Отправляю…" : "Отправить вопрос"} <span aria-hidden>→</span>
        </button>
        <span className="font-mono" style={{ fontSize: "11px", letterSpacing: "0.04em", color: "var(--ink-3)" }}>
          Ответ — лично, на ваш email
        </span>
      </div>
    </form>
  )
}
