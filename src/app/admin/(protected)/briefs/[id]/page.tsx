import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { setBriefStatus, deleteBrief, updateBriefNotes } from "../actions"

const STATUS_LABEL = {
  NEW: "Новый",
  CONTACTED: "Связались",
  IN_DISCUSSION: "Обсуждение",
  CONVERTED: "В работе",
  ARCHIVED: "Архив",
} as const

const STATUS_OPTIONS: (keyof typeof STATUS_LABEL)[] = [
  "NEW", "CONTACTED", "IN_DISCUSSION", "CONVERTED", "ARCHIVED",
]

const TYPE_LABEL = {
  VIDEO: "Видеопродакшн",
  AI: "Разработка / AI",
  UNSURE: "Не уверен",
} as const

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const b = await prisma.brief.findUnique({ where: { id } })
  if (!b) notFound()

  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: 920 }}>
      <Link
        href="/admin/briefs"
        className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] hover:text-[var(--cobalt)] transition-colors mb-6 inline-block uppercase"
      >
        ← все брифы
      </Link>

      {/* Header */}
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-3">
            {TYPE_LABEL[b.type]} · {b.createdAt.toLocaleDateString("ru-RU")}
          </p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              animation: "none",
            }}
          >
            {b.name}
            {b.company && (
              <span style={{ color: "var(--ink-3)" }}> · {b.company}</span>
            )}
          </h1>
        </div>
      </div>

      {/* Status switcher */}
      <div className="border border-[var(--rule)] p-4 mb-10">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-3">
          Статус
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <form key={s} action={setBriefStatus.bind(null, b.id, s)}>
              <button
                type="submit"
                className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] border transition-colors ${
                  b.status === s
                    ? "border-[var(--cobalt)] bg-[var(--cobalt)] text-white"
                    : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)]"
                }`}
                style={{ borderRadius: 2 }}
              >
                {STATUS_LABEL[s]}
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <Section title="Контакт">
        <Row label="Email">
          <a
            href={`mailto:${b.email}`}
            className="text-[var(--cobalt)] hover:underline"
          >
            {b.email}
          </a>
        </Row>
        {b.position && <Row label="Должность">{b.position}</Row>}
        {b.phone && (
          <Row label="Телефон">
            <a href={`tel:${b.phone}`} className="text-[var(--cobalt)] hover:underline">
              {b.phone}
            </a>
          </Row>
        )}
        {b.telegram && (
          <Row label="Telegram">
            <a
              href={
                b.telegram.startsWith("http")
                  ? b.telegram
                  : `https://t.me/${b.telegram.replace(/^@/, "")}`
              }
              className="text-[var(--cobalt)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {b.telegram}
            </a>
          </Row>
        )}
        {b.bestTime && <Row label="Удобное время">{b.bestTime}</Row>}
      </Section>

      {/* Project */}
      {(b.format || b.projectTitle || b.mainIdea || b.audience || b.showWhere ||
        b.duration || b.hasMaterials || b.currentProcess || b.scale ||
        b.integrations || b.successMetric) && (
        <Section title="Задача">
          {b.format && <Row label="Формат">{b.format}</Row>}
          {b.projectTitle && <Row label="Название">{b.projectTitle}</Row>}
          {b.mainIdea && <Row label="Главная идея" multiline>{b.mainIdea}</Row>}
          {b.audience && <Row label="Аудитория">{b.audience}</Row>}
          {b.showWhere && <Row label="Где показано">{b.showWhere}</Row>}
          {b.duration && <Row label="Длительность">{b.duration}</Row>}
          {b.hasMaterials && <Row label="Материалы" multiline>{b.hasMaterials}</Row>}
          {b.currentProcess && <Row label="Сейчас процесс" multiline>{b.currentProcess}</Row>}
          {b.scale && <Row label="Масштаб">{b.scale}</Row>}
          {b.integrations && <Row label="Интеграции">{b.integrations}</Row>}
          {b.successMetric && <Row label="Метрика успеха">{b.successMetric}</Row>}
        </Section>
      )}

      {/* Company */}
      {(b.industry || b.website || b.trigger) && (
        <Section title="Компания">
          {b.industry && <Row label="Сфера">{b.industry}</Row>}
          {b.website && (
            <Row label="Сайт">
              <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-[var(--cobalt)] hover:underline">
                {b.website}
              </a>
            </Row>
          )}
          {b.trigger && <Row label="Триггер" multiline>{b.trigger}</Row>}
        </Section>
      )}

      {/* Constraints */}
      {(b.deadline || b.budget || b.ndaNeeded) && (
        <Section title="Сроки и бюджет">
          {b.deadline && <Row label="Срок">{b.deadline}</Row>}
          {b.budget && <Row label="Бюджет">{b.budget}</Row>}
          {b.ndaNeeded && <Row label="NDA">да, нужен до брифа</Row>}
        </Section>
      )}

      {/* References */}
      {(b.references || b.antiReferences || b.attachments) && (
        <Section title="Референсы">
          {b.references && <Row label="Что нравится" multiline>{b.references}</Row>}
          {b.antiReferences && <Row label="Анти-референсы" multiline>{b.antiReferences}</Row>}
          {b.attachments && <Row label="Файлы / ссылки" multiline>{b.attachments}</Row>}
        </Section>
      )}

      {/* Admin notes */}
      <Section title="Заметки (для себя)">
        <form action={updateBriefNotes.bind(null, b.id)} className="space-y-3">
          <textarea
            name="adminNotes"
            defaultValue={b.adminNotes ?? ""}
            rows={4}
            placeholder="Что обсудили, что обещали, на что смотреть..."
            className="w-full px-3 py-2.5 bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-[14px] focus:outline-none focus:border-[var(--cobalt)] transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-[var(--ink)] text-[var(--paper)] text-[13px] rounded-full hover:bg-[var(--cobalt)] transition-colors"
          >
            Сохранить
          </button>
        </form>
      </Section>

      {/* Danger */}
      <div className="border-t border-[var(--rule)] pt-8 mt-12">
        <form action={deleteBrief.bind(null, b.id)}>
          <button
            type="submit"
            className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] hover:text-[var(--cobalt)] uppercase"
          >
            × Удалить бриф навсегда
          </button>
        </form>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[var(--rule)] py-6 mb-2">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-4">
        {title}
      </p>
      <dl className="space-y-3">{children}</dl>
    </div>
  )
}

function Row({
  label, children, multiline,
}: {
  label: string
  children: React.ReactNode
  multiline?: boolean
}) {
  return (
    <div
      className={multiline ? "flex flex-col gap-1" : "grid items-baseline gap-4"}
      style={multiline ? undefined : { gridTemplateColumns: "180px 1fr" }}
    >
      <dt className="font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)] uppercase">
        {label}
      </dt>
      <dd className="text-[14px] text-[var(--ink)] leading-[1.6] whitespace-pre-wrap">
        {children}
      </dd>
    </div>
  )
}
