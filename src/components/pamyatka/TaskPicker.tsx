"use client"

import { useState } from "react"
import CopyBlock from "./CopyBlock"
import { TASKS } from "./content.ru"

/** Четыре карточки задачи. Раскрывается одна — так страница остаётся короткой.
 *  Без модальных окон, без переходов, без второго уровня меню. */
export default function TaskPicker() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="pm-picker">
      {TASKS.map((task) => {
        const isOpen = openId === task.id
        return (
          <div className="pm-picker-item" key={task.id}>
            <h3>
              <button
                type="button"
                className="pm-picker-btn"
                aria-expanded={isOpen}
                aria-controls={`pm-panel-${task.id}`}
                id={`pm-btn-${task.id}`}
                onClick={() => setOpenId(isOpen ? null : task.id)}
              >
                <span>{task.label}</span>
                <svg
                  className="pm-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            {isOpen && (
              <div
                className="pm-picker-inner"
                id={`pm-panel-${task.id}`}
                role="region"
                aria-labelledby={`pm-btn-${task.id}`}
              >
                <p className="pm-picker-result">{task.result}</p>
                <CopyBlock text={task.prompt} id={`pm-text-${task.id}`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
