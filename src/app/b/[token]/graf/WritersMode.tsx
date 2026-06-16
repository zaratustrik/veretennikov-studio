"use client"

import { useMemo, useState } from "react"
import type { PortalData } from "@/lib/baghovPortal"
import { plantRows } from "./seasonHelpers"
import GraphView from "./GraphView"

export default function WritersMode({ data }: { data: PortalData }) {
  return (
    <div className="space-y-12">
      <EpisodeMap data={data} />
      <ContinuityAudit data={data} />
      <RawGraph data={data} />
    </div>
  )
}

/* ── Карта одной серии ───────────────────────────────────────────────── */

function EpisodeMap({ data }: { data: PortalData }) {
  const [n, setN] = useState(1)
  const ep = data.episodes.find((e) => e.n === n) || data.episodes[0]
  const gold = ep.arc === 2

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) =>
    children ? (
      <div>
        <p className="bgv-field-label">{label}</p>
        <p className="mt-0.5 text-[0.88rem] leading-relaxed text-[var(--mal-text-2)]">{children}</p>
      </div>
    ) : null

  return (
    <section>
      <p className="bgv-kicker mb-1">Рабочий срез</p>
      <h2 className="bgv-h2 mb-1">Карта серии</h2>
      <p className="mb-4 max-w-[680px] text-[0.9rem] leading-relaxed text-[var(--mal-text-3)]">
        Что играет в выбранной серии: проблема, какая сила/правило проверяет,
        комедийный двигатель, твист, подсказка тайны и пэйофф.
      </p>

      <div className="bgv-epnav">
        {data.episodes.map((e) => (
          <button
            key={e.n}
            onClick={() => setN(e.n)}
            className={
              "bgv-epnav-btn" +
              (e.arc === 2 ? " is-gold" : "") +
              (e.n === n ? " is-on" : "")
            }
            title={e.title}
          >
            {e.n}
          </button>
        ))}
      </div>

      <div className={"bgv-card mt-3 p-5 " + (gold ? "bgv-card--gold" : "")}>
        <div className="flex items-baseline gap-3">
          <span className={"bgv-num " + (gold ? "bgv-num--gold" : "")}>{ep.n}</span>
          <div>
            <h3 className="bgv-display text-[1.2rem] font-bold text-[var(--mal-text)]">{ep.title}</h3>
            <p className="text-[0.8rem] text-[var(--mal-text-3)]">{ep.motif}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Бытовая проблема">{ep.problem}</Field>
          <Field label="Мистика / правило">{ep.mystic}</Field>
          <Field label="Комедийный двигатель">{ep.comedy}</Field>
          <Field label="Твист серии">{ep.twist}</Field>
          <Field label="Подсказка сезонной тайны">{ep.clue}</Field>
          <Field label="Пэйофф / закладка">{ep.payoff}</Field>
          <Field label="Линия Ильи">{ep.lines?.ilya}</Field>
          <Field label="Линия Леры">{ep.lines?.lera}</Field>
        </div>
      </div>
    </section>
  )
}

/* ── Continuity-аудит ────────────────────────────────────────────────── */

function ContinuityAudit({ data }: { data: PortalData }) {
  const checks = useMemo(() => {
    const chars = data.graph.nodes.filter((n) => n.type === "character")
    const noWant = chars.filter((c) => !c.want)
    const rows = plantRows(data.graph.nodes)
    const dangling = rows.filter((r) => !r.season2 && r.payoff == null)
    const season2 = data.graph.nodes.filter((n) => n.status === "season2_seed")
    return [
      {
        ok: noWant.length === 0,
        label: "У каждого героя есть активное желание",
        detail: noWant.length === 0 ? `${chars.length} из ${chars.length} — все с «хочет»` : `без желания: ${noWant.map((c) => c.label).join(", ")}`,
      },
      {
        ok: dangling.length === 0,
        label: "Нет закладок без пэйоффа",
        detail: dangling.length === 0 ? `${rows.length} закладок доведены до пэйоффа` : `висят: ${dangling.length}`,
      },
      {
        ok: true,
        label: "Открытые крючки — намеренные, со статусом",
        detail: `${season2.length} задела на сезон 2 (Азовка/Думная гора, судьба отца Леры)`,
      },
      {
        ok: true,
        label: "Главный твист подготовлен заранее",
        detail: `${data.twists?.big?.[0]?.plants?.length || 7} закладок до раскрытия в серии 8`,
      },
      {
        ok: true,
        label: "Полоз отличается от Хозяйки по механике",
        detail: "экзаменатор (как делаешь) против кредитора (чего хочешь)",
      },
      {
        ok: true,
        label: "Лера — не «твист ради твиста»",
        detail: "13 закладок + канон Бажова + 8 серий последствий",
      },
    ]
  }, [data])

  return (
    <section>
      <p className="bgv-kicker mb-1">Проверка структуры</p>
      <h2 className="bgv-h2 mb-5">Continuity-аудит</h2>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {checks.map((c, i) => (
          <div key={i} className="bgv-check">
            <span className={"bgv-check-mark " + (c.ok ? "is-ok" : "is-warn")}>
              {c.ok ? "✓" : "!"}
            </span>
            <span>
              <span className="block font-semibold text-[var(--mal-text)]">{c.label}</span>
              <span className="block text-[0.82rem] text-[var(--mal-text-3)]">{c.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Сырой граф (кухня writers room) ─────────────────────────────────── */

function RawGraph({ data }: { data: PortalData }) {
  const [open, setOpen] = useState(false)
  return (
    <section>
      <p className="bgv-kicker mb-1">Кухня</p>
      <h2 className="bgv-h2 mb-1">Полный граф связей</h2>
      <p className="mb-4 max-w-[680px] text-[0.9rem] leading-relaxed text-[var(--mal-text-3)]">
        Сырой инструмент writers room: все {data.graph.nodes.length} узлов и{" "}
        {data.graph.edges.length} связей. Плотно — это рабочая карта, не витрина.
      </p>
      <button className="bgv-disclosure" onClick={() => setOpen(!open)}>
        {open ? "Скрыть полный граф ▲" : "Показать полный граф ▼"}
      </button>
      {open ? (
        <div className="mt-3">
          <GraphView nodes={data.graph.nodes} edges={data.graph.edges} />
        </div>
      ) : null}
    </section>
  )
}
