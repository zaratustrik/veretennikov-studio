"use client"

import { useEffect, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { saveBrief, type BriefInput } from "./actions"

const STORAGE_KEY = "vs:brief:draft:v1"

const TYPES = [
  {
    value: "VIDEO",
    title: "Видеопродакшн",
    hint: "фильм, ролик, серия, презентация",
  },
  {
    value: "AI",
    title: "Разработка / AI",
    hint: "система, автоматизация, инструмент",
  },
  {
    value: "UNSURE",
    title: "Пока не уверен",
    hint: "обсудим голосом",
  },
] as const

const VIDEO_FORMATS = [
  "Корпоративный фильм",
  "Презентационный ролик",
  "Промо / реклама",
  "Серия обучающих роликов",
  "Событийный (заставка / трейлер)",
  "Документальный",
  "Другое",
]

const AI_FORMATS = [
  "Автоматизация процесса",
  "Аналитика / отчётность",
  "Интеграция систем",
  "AI-инструмент для команды",
  "Чат-бот / ассистент",
  "Не знаю — нужен аудит",
  "Другое",
]

const SHOW_WHERE = [
  "Внутри компании",
  "Клиентам / партнёрам",
  "Соцсети / YouTube",
  "Выставка / мероприятие",
  "Несколько каналов",
]

const DEADLINES = [
  "Срочно (до 2-х недель)",
  "В течение месяца",
  "В течение квартала",
  "Без жёсткого срока",
]

const BUDGETS = [
  "до 500k ₽",
  "500k – 1.5M ₽",
  "1.5M – 5M ₽",
  "5M+ ₽",
  "Обсудим",
]

const BEST_TIMES = ["Утро", "День", "Вечер", "В любое"]

const inputCls =
  "w-full px-3 py-2.5 bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-[16px] md:text-[14px] focus:outline-none focus:border-[var(--cobalt)] transition-colors font-[inherit]"

interface FormState extends BriefInput {
  type: "VIDEO" | "AI" | "UNSURE"
}

const BLANK: FormState = {
  type: "VIDEO",
  format: "",
  projectTitle: "",
  mainIdea: "",
  audience: "",
  showWhere: "",
  duration: "",
  hasMaterials: "",
  currentProcess: "",
  scale: "",
  integrations: "",
  successMetric: "",
  company: "",
  industry: "",
  website: "",
  trigger: "",
  deadline: "",
  budget: "",
  ndaNeeded: false,
  references: "",
  antiReferences: "",
  attachments: "",
  name: "",
  position: "",
  email: "",
  phone: "",
  telegram: "",
  bestTime: "",
}

// Track which fields count toward progress (visible based on type)
function visibleFieldKeys(type: FormState["type"]): (keyof FormState)[] {
  const universal: (keyof FormState)[] = [
    "name", "email",
    "company", "industry",
    "deadline", "budget",
    "trigger",
  ]

  if (type === "VIDEO") {
    return [
      ...universal,
      "format", "projectTitle", "mainIdea", "audience",
      "showWhere", "duration", "hasMaterials",
    ]
  }
  if (type === "AI") {
    return [
      ...universal,
      "format", "mainIdea", "currentProcess",
      "scale", "integrations", "successMetric",
    ]
  }
  // UNSURE
  return [...universal, "mainIdea"]
}

export default function BriefForm() {
  const searchParams = useSearchParams()
  const source = searchParams.get("source") // e.g., "audit"

  const [state, setState] = useState<FormState>(BLANK)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [hydrated, setHydrated] = useState(false)

  // Load draft from localStorage; if no draft and source=audit, preselect UNSURE
  useEffect(() => {
    let hadDraft = false
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as FormState
        setState({ ...BLANK, ...parsed })
        hadDraft = true
      }
    } catch {}

    if (!hadDraft) {
      if (source === "audit") {
        setState((s) => ({ ...s, type: "UNSURE" }))
      } else if (source === "industrial-video") {
        setState((s) => ({ ...s, type: "VIDEO" }))
      } else if (source === "ai-automation") {
        setState((s) => ({ ...s, type: "AI" }))
      } else if (source === "expo-stand") {
        setState((s) => ({ ...s, type: "UNSURE" }))
      } else if (source === "digital-twin-visualization") {
        setState((s) => ({ ...s, type: "UNSURE" }))
      } else if (source === "ai-sales-assistant") {
        setState((s) => ({ ...s, type: "AI" }))
      } else if (source === "b2b-content-engine") {
        setState((s) => ({ ...s, type: "VIDEO" }))
      }
    }

    setHydrated(true)
  }, [source])

  // Save draft on every change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state, hydrated])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }

  // Progress calc
  const visible = visibleFieldKeys(state.type)
  const filledCount = visible.filter((k) => {
    const v = state[k]
    return typeof v === "string" ? v.trim().length > 0 : Boolean(v)
  }).length
  const progress = Math.round((filledCount / visible.length) * 100)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await saveBrief(state)
      if (result?.ok === false) {
        setError(result.error)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
      }
    })
  }

  return (
    <>
      {/* Sticky progress bar */}
      <div
        className="sticky top-16 z-30 bg-[var(--paper)] border-b border-[var(--rule)]"
      >
        <div
          className="mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-4"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)] shrink-0">
              Заполнено
            </span>
            <div className="flex-1 max-w-[300px] h-px bg-[var(--rule)] relative">
              <div
                className="absolute inset-y-0 left-0 bg-[var(--cobalt)] transition-all duration-500"
                style={{ width: `${progress}%`, height: "1px" }}
              />
            </div>
            <span className="font-mono text-[11px] text-[var(--ink-2)] tabular-nums">
              {progress}%
            </span>
          </div>
          {state.name.trim() && (
            <span className="font-mono text-[11px] text-[var(--ink-3)] hidden sm:block truncate max-w-[200px]">
              {state.name}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div
          className="mx-auto px-5 md:px-8 py-12 lg:py-16 space-y-12"
          style={{ maxWidth: 920 }}
        >
          {source === "audit" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · AI &amp; Visual Audit
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Достаточно общего описания: что хотите проанализировать (сайт, видео,
                презентации, AI-возможности) и какие задачи стоят перед компанией.
                Детали уточню на звонке после изучения материалов.
              </p>
            </div>
          )}

          {source === "industrial-video" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · Промышленный фильм
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Расскажите о компании, продукте и аудитории фильма. Если уже есть
                сценарная идея, бюджет или дедлайн под выставку — обязательно
                напишите. Если нет — это нормально, разберёмся вместе.
              </p>
            </div>
          )}

          {source === "ai-automation" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · AI Automation
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Опишите процесс, который хочется автоматизировать: где теряется
                время, какие действия повторяются, где сотрудникам нужен помощник.
                Точные модели и интеграции подберём после анализа — пока важна
                бизнес-задача и контекст.
              </p>
            </div>
          )}

          {source === "expo-stand" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · Expo Stand 4.0
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Расскажите про выставку, дату, размер стенда и аудиторию. Если
                есть план-схема от застройщика, бренд-материалы или существующие
                видео — отметьте. Если ещё нет — это нормально, разберёмся вместе.
              </p>
            </div>
          )}

          {source === "digital-twin-visualization" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · Visual Digital Twin Lite
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Опишите объект или процесс, который хочется показать: производство,
                инфраструктура, оборудование, диспетчерская, логистика. Если есть
                чертежи, схемы, 3D-модели или CAD-файлы — отметьте. Это сильно
                ускорит работу.
              </p>
            </div>
          )}

          {source === "ai-sales-assistant" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · AI Sales & Knowledge Assistant
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Расскажите, где должен работать ассистент (сайт, Telegram, стенд,
                CRM) и какие материалы есть для базы знаний (документы, FAQ, КП,
                описания продуктов). Если базы пока нет — это нормально, поможем
                собрать на этапе предпродакшна.
              </p>
            </div>
          )}

          {source === "b2b-content-engine" && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-5 py-3"
              style={{ background: "var(--cobalt-tint)" }}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                Контекст · B2B Content Engine
              </p>
              <p
                className="text-[var(--ink)] leading-[1.55]"
                style={{ fontSize: "14px" }}
              >
                Расскажите про целевой сегмент клиентов, существующую активность
                в инфополе и доступность экспертов в команде (15–30 минут в
                неделю на интервью). Контракт от 3 месяцев — это формат подписки,
                а не разовый проект.
              </p>
            </div>
          )}

          {error && (
            <div
              className="border-l-2 border-[var(--cobalt)] pl-4 py-2 text-[14px] text-[var(--ink)]"
              style={{ background: "var(--cobalt-tint)" }}
            >
              {error}
            </div>
          )}

          {/* ── Type selection ─────────────────────────────────── */}
          <Section number="01" title="Что за задача" required>
            <div className="grid sm:grid-cols-3 gap-3">
              {TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`cursor-pointer p-5 border transition-colors ${
                    state.type === t.value
                      ? "border-[var(--cobalt)] bg-[var(--paper-1)]"
                      : "border-[var(--rule)] hover:border-[var(--ink-3)]"
                  }`}
                  style={{ borderRadius: 2 }}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={state.type === t.value}
                    onChange={() => update("type", t.value)}
                    className="sr-only"
                  />
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                    /0{TYPES.indexOf(t) + 1}
                  </p>
                  <p
                    className="display text-[var(--ink)] mb-1.5"
                    style={{
                      fontSize: "1.1rem",
                      letterSpacing: "-0.012em",
                      lineHeight: 1.2,
                      animation: "none",
                    }}
                  >
                    {t.title}
                  </p>
                  <p className="text-[12px] text-[var(--ink-3)] leading-[1.5]">
                    {t.hint}
                  </p>
                </label>
              ))}
            </div>
          </Section>

          {/* ── Project (conditional) ──────────────────────────── */}
          {state.type === "VIDEO" && (
            <Section number="02" title="О проекте">
              <Field label="Формат">
                <Chips
                  options={VIDEO_FORMATS}
                  value={state.format ?? ""}
                  onChange={(v) => update("format", v)}
                />
              </Field>
              <Field label="Рабочее название или тема" hint="как сами называете задачу">
                <input
                  type="text"
                  value={state.projectTitle ?? ""}
                  onChange={(e) => update("projectTitle", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Главная идея" hint="1–2 предложения. Что хотим донести?">
                <textarea
                  value={state.mainIdea ?? ""}
                  onChange={(e) => update("mainIdea", e.target.value)}
                  rows={3}
                  className={inputCls}
                />
              </Field>
              <Field label="Целевая аудитория" hint="кто будет смотреть">
                <input
                  type="text"
                  value={state.audience ?? ""}
                  onChange={(e) => update("audience", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Где будет показано">
                <Chips
                  options={SHOW_WHERE}
                  value={state.showWhere ?? ""}
                  onChange={(v) => update("showWhere", v)}
                />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Желаемая длительность" hint="например: 1–2 минуты">
                  <input
                    type="text"
                    value={state.duration ?? ""}
                    onChange={(e) => update("duration", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Уже есть материалы?" hint="сценарий, исходники, актёры">
                  <input
                    type="text"
                    value={state.hasMaterials ?? ""}
                    onChange={(e) => update("hasMaterials", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>
          )}

          {state.type === "AI" && (
            <Section number="02" title="О задаче">
              <Field label="Тип решения">
                <Chips
                  options={AI_FORMATS}
                  value={state.format ?? ""}
                  onChange={(v) => update("format", v)}
                />
              </Field>
              <Field label="Что хотим автоматизировать или решить" hint="опишите проблему своими словами">
                <textarea
                  value={state.mainIdea ?? ""}
                  onChange={(e) => update("mainIdea", e.target.value)}
                  rows={3}
                  className={inputCls}
                />
              </Field>
              <Field label="Сейчас этот процесс делается как?" hint="ручной, в Excel, в 1С — расскажите">
                <textarea
                  value={state.currentProcess ?? ""}
                  onChange={(e) => update("currentProcess", e.target.value)}
                  rows={3}
                  className={inputCls}
                />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Масштаб" hint="сколько людей / документов / запросов в день">
                  <input
                    type="text"
                    value={state.scale ?? ""}
                    onChange={(e) => update("scale", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="С чем интегрировать" hint="CRM, ERP, 1С, Bitrix...">
                  <input
                    type="text"
                    value={state.integrations ?? ""}
                    onChange={(e) => update("integrations", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Как поймём, что сработало" hint="метрика успеха: время, ошибки, экономия">
                <input
                  type="text"
                  value={state.successMetric ?? ""}
                  onChange={(e) => update("successMetric", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </Section>
          )}

          {state.type === "UNSURE" && (
            <Section number="02" title="Опишите задачу как умеете">
              <Field label="Опишите задачу" hint="мы сами разберём, что нужно — видео, разработка или их комбинация">
                <textarea
                  value={state.mainIdea ?? ""}
                  onChange={(e) => update("mainIdea", e.target.value)}
                  rows={6}
                  className={inputCls}
                />
              </Field>
            </Section>
          )}

          {/* ── Company ────────────────────────────────────────── */}
          <Section number="03" title="О компании">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Название">
                <input
                  type="text"
                  value={state.company ?? ""}
                  onChange={(e) => update("company", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Сфера / отрасль">
                <input
                  type="text"
                  value={state.industry ?? ""}
                  onChange={(e) => update("industry", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Сайт компании" hint="опционально">
              <input
                type="url"
                value={state.website ?? ""}
                onChange={(e) => update("website", e.target.value)}
                className={inputCls}
                placeholder="https://"
              />
            </Field>
            <Field
              label="Что подтолкнуло искать студию сейчас"
              hint="дедлайн, новый продукт, смена бренда — любой триггер"
            >
              <textarea
                value={state.trigger ?? ""}
                onChange={(e) => update("trigger", e.target.value)}
                rows={2}
                className={inputCls}
              />
            </Field>
          </Section>

          {/* ── Constraints ────────────────────────────────────── */}
          <Section number="04" title="Сроки и бюджет">
            <Field label="Желаемый срок">
              <Chips
                options={DEADLINES}
                value={state.deadline ?? ""}
                onChange={(v) => update("deadline", v)}
              />
            </Field>
            <Field label="Бюджет" hint="чтобы понимать масштаб обсуждения">
              <Chips
                options={BUDGETS}
                value={state.budget ?? ""}
                onChange={(v) => update("budget", v)}
              />
            </Field>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.ndaNeeded}
                onChange={(e) => update("ndaNeeded", e.target.checked)}
                className="mt-1 w-4 h-4 accent-[var(--cobalt)]"
              />
              <span className="text-[14px] text-[var(--ink)]">
                Нужен NDA до содержательного разговора
              </span>
            </label>
          </Section>

          {/* ── References ─────────────────────────────────────── */}
          <Section number="05" title="Референсы">
            <Field label="Что нравится" hint="ссылки на похожие работы — каждую с новой строки">
              <textarea
                value={state.references ?? ""}
                onChange={(e) => update("references", e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="https://..."
              />
            </Field>
            <Field label="Что точно НЕ хотите" hint="анти-референсы помогают не меньше">
              <textarea
                value={state.antiReferences ?? ""}
                onChange={(e) => update("antiReferences", e.target.value)}
                rows={2}
                className={inputCls}
              />
            </Field>
            <Field label="Доп. файлы или ссылки" hint="Google Drive, Notion, Figma — что угодно">
              <textarea
                value={state.attachments ?? ""}
                onChange={(e) => update("attachments", e.target.value)}
                rows={2}
                className={inputCls}
              />
            </Field>
          </Section>

          {/* ── Contact ────────────────────────────────────────── */}
          <Section number="06" title="Как связаться" required>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Имя" required>
                <input
                  type="text"
                  required
                  value={state.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputCls}
                  autoComplete="name"
                />
              </Field>
              <Field label="Должность">
                <input
                  type="text"
                  value={state.position ?? ""}
                  onChange={(e) => update("position", e.target.value)}
                  className={inputCls}
                  autoComplete="organization-title"
                />
              </Field>
            </div>
            <Field label="Email" required>
              <input
                type="email"
                required
                value={state.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls}
                autoComplete="email"
              />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Телефон" hint="хотя бы один из двух">
                <input
                  type="tel"
                  value={state.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputCls}
                  autoComplete="tel"
                />
              </Field>
              <Field label="Telegram" hint="@username или ссылка">
                <input
                  type="text"
                  value={state.telegram ?? ""}
                  onChange={(e) => update("telegram", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Удобное время для звонка">
              <Chips
                options={BEST_TIMES}
                value={state.bestTime ?? ""}
                onChange={(v) => update("bestTime", v)}
              />
            </Field>

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={state.website_url ?? ""}
              onChange={(e) => update("website_url", e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              aria-hidden="true"
              name="website_url"
            />
          </Section>

          {/* Submit */}
          <div className="border-t border-[var(--rule)] pt-8 space-y-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-10 py-4 bg-[var(--ink)] text-[var(--paper)] text-[15px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors inline-flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPending ? "Отправляю..." : "Отправить бриф →"}
            </button>
            <p className="text-[13px] text-[var(--ink-3)] leading-[1.6] max-w-[640px]">
              Отвечу лично в течение рабочего дня.{" "}
              <span className="text-[var(--ink-2)]">— Анатолий</span>
              <br />
              Черновик автоматически сохраняется в этом браузере.
              Можно закрыть вкладку и вернуться.
            </p>
          </div>
        </div>
      </form>
    </>
  )
}

function Section({
  number, title, required, children,
}: {
  number: string
  title: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <fieldset className="space-y-5">
      <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-3">
        <legend className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)]">
            {number}
          </span>
          <span
            className="display text-[var(--ink)]"
            style={{
              fontSize: "1.25rem",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              animation: "none",
            }}
          >
            {title}
          </span>
        </legend>
        {required && (
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--cobalt)]">
            обязательно
          </span>
        )}
      </div>
      {children}
    </fieldset>
  )
}

function Field({
  label, hint, required, children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] mb-1.5 uppercase">
        {label}
        {required && <span className="text-[var(--cobalt)]"> *</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[12px] text-[var(--ink-3)] mt-1.5 leading-[1.5]">{hint}</p>
      )}
    </div>
  )
}

function Chips({
  options, value, onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`px-3.5 py-2 text-[13px] border transition-colors ${
            value === opt
              ? "border-[var(--cobalt)] bg-[var(--cobalt-tint)] text-[var(--ink)]"
              : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          style={{ borderRadius: 2 }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
