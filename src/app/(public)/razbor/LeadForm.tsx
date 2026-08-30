"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { submitLead } from "./actions"
import { PHONE_HUMAN, PHONE_TEL, TELEGRAM_URL } from "@/lib/contacts"
import { goal } from "@/lib/metrika"

const label =
  "block font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2"
const field =
  "w-full bg-transparent border-b border-[var(--rule-strong)] py-2.5 text-[15px] " +
  "text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none " +
  "focus:border-[var(--cobalt)] transition-colors"

export default function LeadForm({
  source = "RAZBOR",
  slots = [],
  page,
  submitLabel = "Отправить запрос",
  processLabel = "Какой процесс разбираем",
  processPlaceholder = "например: обработка входящих заявок. Можно не заполнять",
}: {
  source?: "RAZBOR" | "CONTACT"
  slots?: string[]
  page?: string
  submitLabel?: string
  processLabel?: string
  processPlaceholder?: string
}) {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [processText, setProcessText] = useState("")
  const [slot, setSlot] = useState("")
  const [consent, setConsent] = useState(false)
  const [honey, setHoney] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pending) return // защита от двойного клика
    setError(null)

    startTransition(async () => {
      const res = await submitLead({
        source,
        name,
        contact,
        process: processText,
        slot,
        page,
        pdConsent: consent,
        website_url: honey,
      })
      // Успех = redirect, сюда управление не вернётся
      if (res && res.ok === false) setError(res.error)
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot — скрыт от людей, виден ботам */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="website_url">Не заполняйте это поле</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <div>
          <label className={label} htmlFor="lead-name">
            Как к вам обращаться <span style={{ color: "var(--cobalt)" }}>*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            autoComplete="name"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label className={label} htmlFor="lead-contact">
            Телефон, Telegram или email <span style={{ color: "var(--cobalt)" }}>*</span>
          </label>
          <input
            id="lead-contact"
            name="contact"
            className={field}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="как вам удобнее"
            autoComplete="tel"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div className="mt-7">
        <label className={label} htmlFor="lead-process">
          {processLabel}
        </label>
        <textarea
          id="lead-process"
          name="process"
          rows={3}
          className={`${field} resize-y leading-[1.6]`}
          value={processText}
          onChange={(e) => setProcessText(e.target.value)}
          placeholder={processPlaceholder}
        />
      </div>

      {slots.length > 0 && (
        <fieldset className="mt-9">
          <legend className={label}>Когда удобно созвониться</legend>
          <div className="flex flex-wrap gap-2 mt-1">
            {slots.map((s) => {
              const active = slot === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    const next = active ? "" : s
                    setSlot(next)
                    if (next) goal("razbor_slot_selected")
                  }}
                  aria-pressed={active}
                  className={`px-4 py-2 font-mono text-[12px] tracking-[0.04em] border transition-colors ${
                    active
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  }`}
                  style={{ borderRadius: 2 }}
                >
                  {s}
                </button>
              )
            })}
          </div>
          <p className="text-[12px] text-[var(--ink-3)] mt-3 leading-[1.5]">
            Это ориентир, а не бронь: точное время подтвердим ответным сообщением.
          </p>
        </fieldset>
      )}

      <label className="flex items-start gap-3 mt-9 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-[var(--cobalt)] w-4 h-4 shrink-0"
          required
          aria-required="true"
        />
        <span className="text-[13px] text-[var(--ink-2)] leading-[1.55]">
          Я даю согласие на обработку персональных данных на условиях{" "}
          <Link href="/consent" className="text-[var(--cobalt)] underline underline-offset-2">
            Согласия
          </Link>{" "}
          и{" "}
          <Link href="/privacy" className="text-[var(--cobalt)] underline underline-offset-2">
            Политики
          </Link>
          .
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="mt-6 text-[14px] leading-[1.55] px-4 py-3"
          style={{
            color: "var(--ink)",
            background: "var(--cobalt-tint)",
            borderLeft: "2px solid var(--cobalt)",
          }}
        >
          {error}
        </p>
      )}

      <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          onClick={() => goal(source === "RAZBOR" ? "razbor_submit" : "contact_form_submit")}
          className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[var(--ink)] text-[var(--paper)] text-[15px] font-medium rounded-full hover:bg-[var(--ink-2)] transition-colors disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
        >
          {pending ? "Отправляем…" : submitLabel}
          {!pending && <span aria-hidden>→</span>}
        </button>

        <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)] leading-[1.6]">
          Или сразу{" "}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => goal("telegram_click")}
            className="text-[var(--cobalt)] hover:underline underline-offset-2"
          >
            в Telegram
          </a>{" "}
          ·{" "}
          <a
            href={`tel:${PHONE_TEL}`}
            onClick={() => goal("tel_click")}
            className="text-[var(--cobalt)] hover:underline underline-offset-2 whitespace-nowrap"
          >
            {PHONE_HUMAN}
          </a>
        </p>
      </div>
    </form>
  )
}
