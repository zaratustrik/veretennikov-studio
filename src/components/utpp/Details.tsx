"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useId, useState } from "react"

type Group = { title: string; items: string[] }

/**
 * Свёрнутые подробности инициативы.
 *
 * Свёрнуты не ради экономии места, а ради управления вниманием: четыре списка
 * нужны тому, кто будет собирать данные, и мешают тому, кто читает страницу
 * ради общей картины.
 *
 * Раскрытие — обычная кнопка с aria-expanded и aria-controls; при
 * prefers-reduced-motion высота не анимируется.
 */
export default function Details({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const id = useId()
  const panelId = `${id}-panel`

  const visible = groups.filter((g) => g.items.length > 0)
  if (visible.length === 0) return null

  return (
    <div className="utpp-page-details">
      <button
        type="button"
        className="utpp-page-details-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open ? "Свернуть подробности" : "Подробности"}</span>
        <span className="utpp-page-details-sign" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={reduce ? {} : { height: "auto", opacity: 1 }}
            exit={reduce ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="utpp-page-details-body">
              {visible.map((group) => (
                <div key={group.title} className="utpp-page-details-group">
                  <h4 className="utpp-page-details-title">{group.title}</h4>
                  <ul className="utpp-page-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
