"use client"

import { chapters, sceneOrder, scenes } from "./content.ru"
import { speakerNotes } from "./speakerNotes.ru"
import type { PresenterState } from "./usePresenter"

/**
 * Панель ведущего. Видна только в режиме показа и только на экране
 * докладчика — на проекции её не будет, если вывод продублирован
 * с расширением рабочего стола.
 */
export default function PresenterHUD({ presenter }: { presenter: PresenterState }) {
  const { sceneIdx, sceneId, notesOpen } = presenter
  const notes = speakerNotes[sceneId] ?? []
  const meta = scenes.find((s) => s.id === sceneId)
  const nextId = sceneOrder[sceneIdx + 1]
  const nextMeta = nextId ? scenes.find((s) => s.id === nextId) : undefined
  const nextLabel =
    nextMeta?.chapter ?? (nextId ? nextId.replace(/-/g, " ") : "конец")

  return (
    <div className="utpp-hud" role="region" aria-label="Панель ведущего">
      <div className="utpp-hud-bar">
        <span className="utpp-hud-pos">
          {String(sceneIdx + 1).padStart(2, "0")} / {String(sceneOrder.length).padStart(2, "0")}
        </span>
        <span className="utpp-hud-scene">{meta?.chapter ?? sceneId.replace(/-/g, " ")}</span>
        {meta?.beats && meta.beats > 1 ? (
          <span className="utpp-hud-beats">{meta.beats} beat</span>
        ) : null}
        <span className="utpp-hud-next">далее · {nextLabel}</span>

        <span className="utpp-hud-keys">
          <kbd>Space</kbd> вперёд <kbd>←</kbd> назад <kbd>R</kbd> сброс <kbd>B</kbd> чёрный{" "}
          <kbd>N</kbd> заметки <kbd>F</kbd> экран <kbd>P</kbd> выход
        </span>

        <button type="button" onClick={presenter.toggleNotes}>
          {notesOpen ? "Скрыть заметки" : "Заметки"}
        </button>
      </div>

      {notesOpen ? (
        <div className="utpp-hud-notes">
          {notes.length ? (
            <ol>
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          ) : (
            <p>Для этой сцены заметок нет.</p>
          )}
        </div>
      ) : null}

      <nav className="utpp-hud-jump" aria-label="Быстрый переход по главам">
        {chapters.map((c) => (
          <button
            key={c.id}
            type="button"
            data-active={c.id === sceneId}
            onClick={() => presenter.go(sceneOrder.indexOf(c.id))}
          >
            {c.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
