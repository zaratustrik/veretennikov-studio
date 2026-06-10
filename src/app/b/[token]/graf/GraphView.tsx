"use client"

import { useMemo, useState } from "react"
import type { GraphEdge, GraphNode } from "@/lib/baghovPortal"

/**
 * Dependency-free interactive story graph.
 * Columns by node type, bezier edges, click → detail panel, type filters.
 */

const TYPE_META: Record<string, { label: string; color: string; text: string }> = {
  character: { label: "Герои", color: "#3ecf8e", text: "#08130d" },
  secret: { label: "Тайны", color: "#b96be0", text: "#140a18" },
  conflict: { label: "Конфликты", color: "#e06b6b", text: "#180a0a" },
  myth_rule: { label: "Правила мира", color: "#5ab8e0", text: "#081218" },
  artifact: { label: "Артефакты", color: "#e0b454", text: "#181204" },
  location: { label: "Локации", color: "#8a9b6e", text: "#10130a" },
  plant_payoff: { label: "Закладки", color: "#d98ab0", text: "#180a10" },
  episode: { label: "Серии", color: "#7e937f", text: "#0b110c" },
}

const TYPE_ORDER = [
  "character",
  "secret",
  "conflict",
  "myth_rule",
  "artifact",
  "location",
  "plant_payoff",
  "episode",
]

const EDGE_LABEL: Record<string, string> = {
  loves: "любит",
  family: "родство",
  opposes: "противостоит",
  tests: "испытывает",
  tempts: "соблазняет",
  hides_secret_from: "скрывает тайну",
  protects: "защищает",
  foreshadows: "предвосхищает",
  pays_off: "окупает",
  appears_in: "появляется",
  unlocks: "открывает",
  breaks_rule: "нарушает правило",
  changes_arc: "меняет арку",
  mentor_of: "наставник",
  uses: "использует",
}

const COL_W = 230
const NODE_W = 196
const NODE_H = 26
const GAP_Y = 9
const TOP = 56
const PAD_X = 24

type Props = { nodes: GraphNode[]; edges: GraphEdge[] }

export default function GraphView({ nodes, edges }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const { positions, height, width, columns } = useMemo(() => {
    const cols = TYPE_ORDER.filter((t) => nodes.some((n) => n.type === t))
    const pos = new Map<string, { x: number; y: number; col: number }>()
    let maxRows = 0
    cols.forEach((type, ci) => {
      const list = nodes.filter((n) => n.type === type)
      maxRows = Math.max(maxRows, list.length)
      list.forEach((n, ri) => {
        pos.set(n.id, {
          x: PAD_X + ci * COL_W,
          y: TOP + ri * (NODE_H + GAP_Y),
          col: ci,
        })
      })
    })
    return {
      positions: pos,
      columns: cols,
      width: PAD_X * 2 + cols.length * COL_W,
      height: TOP + maxRows * (NODE_H + GAP_Y) + 30,
    }
  }, [nodes])

  const visible = (n: GraphNode) => !hidden.has(n.type)
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  const selectedEdges = useMemo(
    () =>
      selected
        ? edges.filter((e) => e.source === selected || e.target === selected)
        : [],
    [edges, selected],
  )
  const neighborIds = useMemo(() => {
    const s = new Set<string>()
    selectedEdges.forEach((e) => {
      s.add(e.source)
      s.add(e.target)
    })
    return s
  }, [selectedEdges])

  const toggleType = (t: string) =>
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })

  const sel = selected ? nodeById.get(selected) : null

  return (
    <div>
      {/* filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {columns.map((t) => {
          const meta = TYPE_META[t]
          const off = hidden.has(t)
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className="bgv-chip cursor-pointer transition-opacity"
              style={{
                opacity: off ? 0.35 : 1,
                borderColor: meta.color + "66",
              }}
            >
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-[3px]"
                style={{ background: meta.color }}
              />
              {meta.label} ({nodes.filter((n) => n.type === t).length})
            </button>
          )
        })}
        {selected ? (
          <button onClick={() => setSelected(null)} className="bgv-chip cursor-pointer">
            ✕ сбросить выбор
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* canvas */}
        <div className="bgv-graph-wrap max-h-[640px]">
          <svg width={width} height={height} role="img" aria-label="Карта связей сериала">
            {/* column headers */}
            {columns.map((t, ci) => (
              <text
                key={t}
                x={PAD_X + ci * COL_W + NODE_W / 2}
                y={28}
                textAnchor="middle"
                fontSize={11}
                letterSpacing={1.5}
                fill={TYPE_META[t].color}
                style={{ textTransform: "uppercase", fontFamily: "monospace" }}
              >
                {TYPE_META[t].label.toUpperCase()}
              </text>
            ))}

            {/* edges */}
            {edges.map((e, i) => {
              const a = positions.get(e.source)
              const b = positions.get(e.target)
              const na = nodeById.get(e.source)
              const nb = nodeById.get(e.target)
              if (!a || !b || !na || !nb || !visible(na) || !visible(nb)) return null
              const active =
                selected && (e.source === selected || e.target === selected)
              const dim = selected && !active
              const x1 = a.x + (a.col <= b.col ? NODE_W : 0)
              const x2 = b.x + (a.col <= b.col ? 0 : NODE_W)
              const y1 = a.y + NODE_H / 2
              const y2 = b.y + NODE_H / 2
              const dx = Math.max(40, Math.abs(x2 - x1) * 0.4)
              const d = `M ${x1} ${y1} C ${x1 + (a.col <= b.col ? dx : -dx)} ${y1}, ${x2 + (a.col <= b.col ? -dx : dx)} ${y2}, ${x2} ${y2}`
              return (
                <path
                  key={i}
                  className="bgv-gedge"
                  d={d}
                  fill="none"
                  stroke={active ? "#3ecf8e" : "#5a7a68"}
                  strokeWidth={active ? 2 : 1}
                  opacity={dim ? 0.08 : active ? 0.95 : 0.3}
                />
              )
            })}

            {/* nodes */}
            {nodes.map((n) => {
              const p = positions.get(n.id)
              if (!p || !visible(n)) return null
              const meta = TYPE_META[n.type] || TYPE_META.episode
              const isSel = selected === n.id
              const isNb = selected && neighborIds.has(n.id) && !isSel
              const dim = selected && !isSel && !isNb
              const label =
                n.label.length > 26 ? n.label.slice(0, 25) + "…" : n.label
              return (
                <g
                  key={n.id}
                  className="bgv-gnode"
                  transform={`translate(${p.x}, ${p.y})`}
                  opacity={dim ? 0.25 : 1}
                  onClick={() => setSelected(isSel ? null : n.id)}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx={6}
                    fill={isSel ? meta.color : "#13231a"}
                    stroke={meta.color}
                    strokeWidth={isSel || isNb ? 2 : 1}
                    strokeOpacity={isSel || isNb ? 1 : 0.55}
                  />
                  <text
                    x={9}
                    y={NODE_H / 2 + 4}
                    fontSize={11.5}
                    fill={isSel ? meta.text : "#cfe2d5"}
                  >
                    {label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* detail panel */}
        <aside className="bgv-card max-h-[640px] overflow-y-auto p-5">
          {sel ? (
            <>
              <p className="bgv-kicker" style={{ color: (TYPE_META[sel.type] || TYPE_META.episode).color }}>
                {(TYPE_META[sel.type] || TYPE_META.episode).label}
                {sel.status ? ` · ${sel.status}` : ""}
              </p>
              <h2 className="bgv-display mt-2 text-[1.15rem] font-bold text-[var(--mal-text)]">
                {sel.label}
              </h2>
              {sel.short_description ? (
                <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--mal-text-2)]">
                  {sel.short_description}
                </p>
              ) : null}
              <dl className="mt-3 space-y-2 text-[0.85rem]">
                {sel.want ? (
                  <div>
                    <dt className="bgv-field-label">Хочет</dt>
                    <dd className="text-[var(--mal-text-2)]">{sel.want}</dd>
                  </div>
                ) : null}
                {sel.need && sel.need !== "—" ? (
                  <div>
                    <dt className="bgv-field-label">Нужно</dt>
                    <dd className="text-[var(--mal-text-2)]">{sel.need}</dd>
                  </div>
                ) : null}
                {sel.secret ? (
                  <div>
                    <dt className="bgv-field-label">Тайна</dt>
                    <dd className="text-[var(--mal-text-2)]">{sel.secret}</dd>
                  </div>
                ) : null}
                {sel.episodes?.length ? (
                  <div>
                    <dt className="bgv-field-label">Серии</dt>
                    <dd className="text-[var(--mal-text-2)]">{sel.episodes.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>

              {selectedEdges.length ? (
                <>
                  <p className="bgv-field-label mt-5">Связи ({selectedEdges.length})</p>
                  <ul className="mt-2 space-y-2.5">
                    {selectedEdges.map((e, i) => {
                      const other = e.source === sel.id ? e.target : e.source
                      const on = nodeById.get(other)
                      const dir = e.source === sel.id ? "→" : "←"
                      return (
                        <li key={i} className="text-[0.83rem] leading-snug">
                          <button
                            onClick={() => setSelected(other)}
                            className="cursor-pointer text-left"
                          >
                            <span className="text-[var(--mal-text-3)]">
                              {dir} {EDGE_LABEL[e.type] || e.type}{" "}
                            </span>
                            <span className="font-semibold text-[#8fe6bd] underline-offset-2 hover:underline">
                              {on?.label || other}
                            </span>
                          </button>
                          <span className="block text-[var(--mal-text-3)]">
                            {e.label}
                            {e.starts_in_episode ? ` · с с.${e.starts_in_episode}` : ""}
                            {e.payoff_episode ? ` · пэйофф с.${e.payoff_episode}` : ""}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : null}
            </>
          ) : (
            <>
              <p className="bgv-kicker">Карточка узла</p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--mal-text-2)]">
                Кликните любой узел на карте — здесь появятся его желание,
                тайна, серии и все связи. Клик по связи переводит на соседний
                узел. Фильтры сверху скрывают целые типы.
              </p>
              <p className="mt-4 text-[0.85rem] leading-relaxed text-[var(--mal-text-3)]">
                Это seed-граф второй итерации: {nodes.length} узлов,{" "}
                {edges.length} связей. Полный JSON и graph-аудит — в документе
                12.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
