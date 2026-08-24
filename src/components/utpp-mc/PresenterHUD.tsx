"use client"

import { parts, slideIndexOf, slides, TOTAL } from "./content.ru"
import { speakerNotes } from "./speakerNotes.ru"
import type { DeckState } from "./useDeck"

/**
 * Панель ведущего. Открывается клавишей P, заметки — N.
 * Видна только докладчику, если вывод продублирован с расширением
 * рабочего стола; на слайд она не попадает.
 */
export default function PresenterHUD({ deck }: { deck: DeckState }) {
  const meta = slides[deck.slide]
  const nextMeta = slides[deck.slide + 1]
  const notes = meta ? (speakerNotes[meta.id] ?? []) : []

  const activePart = (() => {
    let id = parts[0]?.id ?? ""
    parts.forEach((p) => {
      if (slideIndexOf(p.id) <= deck.slide) id = p.id
    })
    return id
  })()

  return (
    <div className="utpp-hud" role="region" aria-label="Панель ведущего">
      <div className="utpp-hud-bar">
        <span className="utpp-hud-pos">
          {String(deck.slide + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
        <span className="utpp-hud-scene">{meta?.label}</span>
        {deck.beatsHere > 1 ? (
          <span className="utpp-hud-beats">
            шаг {deck.beat + 1} из {deck.beatsHere}
          </span>
        ) : null}
        <span className="utpp-hud-next">далее · {nextMeta?.label ?? "конец"}</span>

        <span className="utpp-hud-keys">
          <kbd>→</kbd> вперёд <kbd>←</kbd> назад <kbd>R</kbd> сброс <kbd>B</kbd> чёрный{" "}
          <kbd>N</kbd> заметки <kbd>F</kbd> экран <kbd>P</kbd> выход
        </span>

        <button type="button" onClick={deck.toggleNotes}>
          {deck.notesOpen ? "Скрыть заметки" : "Заметки"}
        </button>
      </div>

      {deck.notesOpen ? (
        <div className="utpp-hud-notes">
          {notes.length ? (
            <ol>
              {notes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          ) : (
            <p>Для этого слайда заметок нет.</p>
          )}
        </div>
      ) : null}

      <nav className="utpp-hud-jump" aria-label="Быстрый переход по разделам">
        {parts.map((p) => (
          <button
            key={p.id}
            type="button"
            data-active={p.id === activePart}
            onClick={() => deck.goSlide(slideIndexOf(p.id))}
          >
            {p.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
