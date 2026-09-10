"use client"

import { questionById } from "@/lib/utpp/questions"
import { buildSummary, downloadText } from "@/lib/utpp/summary"

import { useAnswers } from "./AnswersProvider"

type Copy = {
  empty: string
  nameLabel: string
  namePlaceholder: string
  nameHint: string
  privacy: string
  submit: string
  submitting: string
  skippedTitle: string
  skippedNote: string
  successTitle: string
  successText: string
  errorText: string
  download: string
  again: string
  againNote: string
}

/**
 * Раздел проверки и отправки.
 *
 * Показывает то же, что уйдёт на сервер, — сводка собирается той же функцией,
 * что и текст файла, поэтому расхождения между увиденным и сохранённым нет.
 */
export default function AnswersPanel({ copy }: { copy: Copy }) {
  const {
    answers,
    respondentName,
    setRespondentName,
    answered,
    hydrated,
    draftRestored,
    discardDraft,
    status,
    errorText,
    submit,
    startOver,
  } = useAnswers()

  // До восстановления черновика ничего не рисуем: иначе сводка мигнёт пустой.
  if (!hydrated) return null

  if (status === "sent") {
    return (
      <div className="utpp-page-sent">
        <h3 className="utpp-page-h3">{copy.successTitle}</h3>
        <p className="utpp-page-lead">{copy.successText}</p>
        <div className="utpp-page-actions">
          <button type="button" className="utpp-page-btn-ghost" onClick={startOver}>
            {copy.again}
          </button>
        </div>
        <p className="utpp-page-note">{copy.againNote}</p>
      </div>
    )
  }

  if (answered === 0) {
    return <p className="utpp-page-lead utpp-page-muted">{copy.empty}</p>
  }

  const summary = buildSummary(answers)
  const done = summary.filter((i) => i.answered)
  const skipped = summary.filter((i) => !i.answered)

  return (
    <div className="utpp-page-review">
      {draftRestored ? (
        <p className="utpp-page-draftnote">
          Ответы сохранены в этом браузере.{" "}
          <button type="button" className="utpp-page-linkbtn" onClick={discardDraft}>
            Очистить
          </button>
        </p>
      ) : null}

      <dl className="utpp-page-summary">
        {done.map((item) => {
          const section = questionById(item.id)?.sectionId
          return (
            <div key={item.id} className="utpp-page-summary-row">
              <dt>{item.label}</dt>
              <dd>
                <span className="utpp-page-summary-value">{item.value}</span>
                {item.comment ? (
                  <span className="utpp-page-summary-comment">{item.comment}</span>
                ) : null}
                {section ? (
                  <a className="utpp-page-summary-edit" href={`#${section}`}>
                    Изменить
                  </a>
                ) : null}
              </dd>
            </div>
          )
        })}
      </dl>

      {skipped.length > 0 ? (
        <div className="utpp-page-skipped">
          <h3 className="utpp-page-h4">
            {copy.skippedTitle} — {skipped.length}
          </h3>
          <p className="utpp-page-note">{copy.skippedNote}</p>
          <ul className="utpp-page-list utpp-page-list--muted">
            {skipped.map((item) => {
              const section = questionById(item.id)?.sectionId
              return (
                <li key={item.id}>
                  {section ? <a href={`#${section}`}>{item.label}</a> : item.label}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      <div className="utpp-page-name">
        <label className="utpp-page-q-sublabel" htmlFor="utpp-page-name-input">
          {copy.nameLabel}
        </label>
        <input
          id="utpp-page-name-input"
          type="text"
          className="utpp-page-q-input"
          placeholder={copy.namePlaceholder}
          autoComplete="off"
          value={respondentName}
          onChange={(e) => setRespondentName(e.target.value)}
        />
        <p className="utpp-page-note">{copy.nameHint}</p>
      </div>

      <p className="utpp-page-privacy">{copy.privacy}</p>

      {status === "error" ? (
        <p className="utpp-page-error" role="alert">
          {errorText ?? copy.errorText}
        </p>
      ) : null}

      <div className="utpp-page-actions">
        <button
          type="button"
          className="utpp-page-btn"
          onClick={submit}
          disabled={status === "sending"}
        >
          {status === "sending" ? copy.submitting : copy.submit}
        </button>

        <button
          type="button"
          className="utpp-page-btn-ghost"
          onClick={() => downloadText(answers, respondentName || undefined)}
        >
          {copy.download}
        </button>
      </div>
    </div>
  )
}
