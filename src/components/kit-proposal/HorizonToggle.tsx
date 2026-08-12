"use client"

import { useState } from "react"

import type { Horizon } from "@/types/kit-proposal"

const ACCENT = "#4694D1"
const ACCENT_SOFT = "#DAEAF6"
const LINE = "#C6CEDA"
const SURFACE = "#FFFFFF"
const GREEN = "#1E7F4F"
const AMBER = "#B07208"

const EXECUTORS: Record<Horizon, { t: string; s: string }[]> = {
  A: [
    { t: "Водитель + тягач", s: "магистральное плечо" },
    { t: "Персонал двора", s: "перецепка и подача" },
    { t: "Погрузчик с оператором", s: "склад" },
    { t: "Курьер · партнёр · постамат", s: "последняя миля" },
  ],
  B: [
    { t: "Автономный тягач", s: "магистральное плечо" },
    { t: "Автономный терминальный тягач", s: "перецепка и подача" },
    { t: "AMR · робопогрузчик", s: "склад" },
    { t: "Робот · автономный фургон · дрон", s: "последняя миля" },
  ],
}

/**
 * Переключатель горизонтов: на одной и той же схеме процесса меняются
 * только исполнители. Ядро — задача, полуприцеп, ответственность, событие,
 * показатели и экономика — остаётся неподвижным.
 */
export function HorizonToggle() {
  const [h, setH] = useState<Horizon>("A")
  const execs = EXECUTORS[h]
  const color = h === "A" ? GREEN : AMBER

  return (
    <div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div className="kdl-switch" role="group" aria-label="Переключение горизонта">
          <button type="button" aria-pressed={h === "A"} onClick={() => setH("A")}>
            Horizon A · сегодня
          </button>
          <button type="button" aria-pressed={h === "B"} onClick={() => setH("B")}>
            Horizon B · позже
          </button>
        </div>
        <span className="kdl-small">
          {h === "A"
            ? "Исполнители, которые существуют прямо сейчас."
            : "Исполнители, которые подключаются по мере готовности технологий и регулирования."}
        </span>
      </div>

      <div style={{ marginTop: 24 }} className="kdl-svg-scroll">
        <svg
          viewBox="0 0 968 292"
          role="img"
          aria-label={
            h === "A"
              ? "Схема процесса с исполнителями сегодняшнего дня: водитель, персонал двора, погрузчик, курьер"
              : "Та же схема процесса с автономными исполнителями: автономный тягач, терминальный тягач, складской робот, робот последней мили"
          }
        >
          {/* Неизменное ядро */}
          <rect x="0" y="0" width="968" height="96" rx="6" fill={ACCENT} />
          <text x="20" y="26" className="kdl-svg-head" fill="#DAEAF6">
            ЭТО НЕ МЕНЯЕТСЯ НИКОГДА
          </text>
          <text x="20" y="52" className="kdl-svg-label" fill="#fff">
            заказ · груз · полуприцеп · задача · ответственность за груз · событие · показатели · экономика
          </text>
          <text x="20" y="76" className="kdl-svg-sub" fill="#C9E1F5">
            Появление нового типа исполнителя добавляет запись в реестр ресурсов и адаптер — не переписывает ядро.
          </text>

          <text x="0" y="130" className="kdl-svg-head" fill={color}>
            {h === "A" ? "ИСПОЛНИТЕЛИ СЕГОДНЯ" : "ИСПОЛНИТЕЛИ ПОЗЖЕ"}
          </text>

          {execs.map((e, i) => {
            const x = i * 246
            return (
              <g key={e.s}>
                <line x1={x + 110} y1="96" x2={x + 110} y2="142" stroke={LINE} strokeWidth="1.5" strokeDasharray="4 4" />
                <rect
                  x={x}
                  y="144"
                  width="222"
                  height="72"
                  rx="5"
                  fill={h === "B" ? SURFACE : ACCENT_SOFT}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray={h === "B" ? "5 4" : undefined}
                />
                <text x={x + 16} y="172" className="kdl-svg-label">
                  {e.t.length > 26 ? e.t.slice(0, 26) : e.t}
                </text>
                {e.t.length > 26 ? (
                  <text x={x + 16} y="190" className="kdl-svg-label">
                    {e.t.slice(26)}
                  </text>
                ) : null}
                <text x={x + 16} y={e.t.length > 26 ? 208 : 196} className="kdl-svg-sub">
                  {e.s}
                </text>
              </g>
            )
          })}

          <text x="0" y="256" className="kdl-svg-sub">
            {h === "A"
              ? "Всё, что описано в проекте, окупается на этих исполнителях. Автономность не является условием."
              : "Каждый из этих исполнителей приходит в своё время и по своим правилам. Ядро к этому уже готово."}
          </text>
          <text x="0" y="276" className="kdl-svg-sub">
            {h === "A"
              ? "Переключите на Horizon B, чтобы увидеть, что именно изменится."
              : "Обратите внимание: изменился только нижний ряд."}
          </text>
        </svg>
      </div>
    </div>
  )
}
