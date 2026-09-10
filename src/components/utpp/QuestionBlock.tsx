"use client"

import { useId } from "react"

import type { Answer, Question } from "@/types/utpp"
import { OTHER_OPTION } from "@/lib/utpp/questions"

import { useAnswers } from "./AnswersProvider"

/**
 * Один вопрос внутри раздела.
 *
 * Вопрос — не отдельная анкета и не карточка: горизонтальная линия, метка
 * «Уточнение», строка «зачем нужен ответ» и сами варианты. Ни одного
 * обязательного поля; пропуск — нормальный ответ.
 *
 * Варианты — нативные radio и checkbox внутри label, группы обёрнуты в
 * fieldset с legend: так это работает с клавиатуры и со скринридером
 * без дополнительных ролей.
 */
export default function QuestionBlock({ question }: { question: Question }) {
  const { answers, setAnswer } = useAnswers()
  const answer = answers[question.id]
  const uid = useId()

  function patch(next: Partial<Answer>) {
    const merged: Answer = { ...answer, ...next }
    // Пустые ключи не храним — иначе «отвеченным» станет пустой комментарий.
    for (const key of Object.keys(merged) as (keyof Answer)[]) {
      const v = merged[key]
      if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
        delete merged[key]
      }
    }
    setAnswer(question.id, merged)
  }

  const maxReached =
    question.type === "multi" &&
    question.maxSelections !== undefined &&
    (answer?.choices?.length ?? 0) >= question.maxSelections

  // Обёртка — div, а не section: section с доступным именем становится
  // регионом-ориентиром, и семнадцать вопросов дали бы семнадцать лишних
  // ориентиров при навигации скринридером. Группировку вариантов
  // обеспечивает fieldset с legend, текстовый вопрос — обычный label.
  return (
    <div className="utpp-page-q">
      <p className="utpp-page-q-tag">Уточнение</p>
      <p className="utpp-page-q-why">{question.why}</p>

      {question.type === "text" ? (
        <>
          <label className="utpp-page-q-label" htmlFor={`${uid}-text`}>
            {question.label}
          </label>
          <textarea
            id={`${uid}-text`}
            className="utpp-page-q-textarea"
            rows={2}
            placeholder={question.placeholder}
            value={answer?.text ?? ""}
            onChange={(e) => patch({ text: e.target.value })}
          />
        </>
      ) : (
        <fieldset className="utpp-page-q-fieldset">
          <legend className="utpp-page-q-label">
            {question.label}
          </legend>

          {question.type === "multi" && question.maxSelections ? (
            <p className="utpp-page-q-hint">
              Не более {question.maxSelections === 2 ? "двух" : "трёх"} вариантов
            </p>
          ) : null}

          <div className="utpp-page-q-options">
            {question.options.map((option) => {
              const id = `${uid}-${option}`

              if (question.type === "single") {
                return (
                  <label key={option} className="utpp-page-q-option" htmlFor={id}>
                    <input
                      id={id}
                      type="radio"
                      name={uid}
                      checked={answer?.choice === option}
                      onChange={() => patch({ choice: option })}
                    />
                    <span>{option}</span>
                  </label>
                )
              }

              const selected = answer?.choices?.includes(option) ?? false
              return (
                <label
                  key={option}
                  className={`utpp-page-q-option${
                    !selected && maxReached ? " is-muted" : ""
                  }`}
                  htmlFor={id}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={selected}
                    disabled={!selected && maxReached}
                    onChange={(e) => {
                      const current = answer?.choices ?? []
                      const next = e.target.checked
                        ? [...current, option]
                        : current.filter((c) => c !== option)
                      patch({ choices: next })
                    }}
                  />
                  <span>{option}</span>
                </label>
              )
            })}

            {question.type === "multi" && question.allowOther ? (
              <label
                className={`utpp-page-q-option${
                  !(answer?.choices?.includes(OTHER_OPTION) ?? false) && maxReached
                    ? " is-muted"
                    : ""
                }`}
                htmlFor={`${uid}-other`}
              >
                <input
                  id={`${uid}-other`}
                  type="checkbox"
                  checked={answer?.choices?.includes(OTHER_OPTION) ?? false}
                  disabled={
                    !(answer?.choices?.includes(OTHER_OPTION) ?? false) && maxReached
                  }
                  onChange={(e) => {
                    const current = answer?.choices ?? []
                    const next = e.target.checked
                      ? [...current, OTHER_OPTION]
                      : current.filter((c) => c !== OTHER_OPTION)
                    patch({ choices: next, other: e.target.checked ? answer?.other : "" })
                  }}
                />
                <span>{OTHER_OPTION}</span>
              </label>
            ) : null}
          </div>

          {question.type === "multi" &&
          question.allowOther &&
          (answer?.choices?.includes(OTHER_OPTION) ?? false) ? (
            <input
              type="text"
              className="utpp-page-q-input"
              aria-label="Уточните вариант «Другое»"
              placeholder="Уточните"
              value={answer?.other ?? ""}
              onChange={(e) => patch({ other: e.target.value })}
            />
          ) : null}
        </fieldset>
      )}

      {question.type !== "text" && question.comment ? (
        <div className="utpp-page-q-comment">
          <label className="utpp-page-q-sublabel" htmlFor={`${uid}-comment`}>
            {question.comment.label}
          </label>
          <input
            id={`${uid}-comment`}
            type="text"
            className="utpp-page-q-input"
            placeholder={question.comment.placeholder}
            value={answer?.comment ?? ""}
            onChange={(e) => patch({ comment: e.target.value })}
          />
        </div>
      ) : null}
    </div>
  )
}
