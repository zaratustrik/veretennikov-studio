"use client";

import { sceneOrder } from "./content.ru";
import { speakerNotes } from "./speakerNotes.ru";
import type { PresenterState } from "./usePresenter";

const SCENE_TITLES: Record<string, string> = {
  hero: "ИИ в работе",
  "program-vs-ai": "ИИ — не обычная программа",
  generation: "Как ИИ создаёт ответ",
  "chat-assistant-agent": "Чат, помощник и агент",
  "four-p": "Методика 4П",
  "delegate-formula": "Поручайте, как коллеге",
  "good-bad": "Плохой и хороший запрос",
  cycle: "Цикл работы",
  checklist: "Что проверять",
  traffic: "Светофор допустимого",
  ladder: "От запросов — к процессам",
  "pick-task": "Какую задачу выбрать",
  measure: "Измеряйте до и после",
  demos: "Три сценария",
  "data-safety": "Безопасность данных",
  "safe-agent": "Безопасный агент",
  "enterprise-why": "Предприятию нужен свой контур",
  "enterprise-gateway": "Одно окно — уровни защиты",
  "enterprise-path": "Начинать с задач",
  finale: "Практика и финал",
};

export default function PresenterHUD({ presenter }: { presenter: PresenterState }) {
  const { sceneIdx, sceneId, notesOpen } = presenter;
  return (
    <>
      {notesOpen ? (
        <aside className="mc-notes-panel" aria-label="Заметки ведущего">
          <h4>
            {sceneIdx + 1}. {SCENE_TITLES[sceneId]}
          </h4>
          {speakerNotes[sceneId]}
        </aside>
      ) : null}
      <div className="mc-hud" role="toolbar" aria-label="Панель ведущего">
        <b>
          {sceneIdx + 1}/{sceneOrder.length}
        </b>
        <span style={{ maxWidth: "14em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {SCENE_TITLES[sceneId]}
        </span>
        <button type="button" onClick={presenter.prev} aria-label="Предыдущая сцена">
          ←
        </button>
        <button type="button" onClick={presenter.next} aria-label="Следующая сцена">
          →
        </button>
        <button type="button" onClick={presenter.toggleNotes} aria-pressed={notesOpen}>
          Заметки
        </button>
        <button type="button" onClick={presenter.toggleNav} aria-pressed={presenter.navOpen}>
          Оглавление
        </button>
        <button type="button" onClick={presenter.toggleSnap} aria-pressed={presenter.snap}>
          Прилипание {presenter.snap ? "вкл" : "выкл"}
        </button>
        <button type="button" onClick={presenter.toggleFullscreen} aria-label="Полноэкранный режим">
          Экран
        </button>
        <button type="button" onClick={presenter.exit} aria-label="Выйти из режима ведущего">
          ✕
        </button>
        <span className="mc-keys-hint">Space/↓ · ↑ · Home/End · F · N · S · O</span>
      </div>
    </>
  );
}
