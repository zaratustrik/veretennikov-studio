"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import type { Answer, Answers } from "@/types/utpp"
import { QUESTION_SET_VERSION } from "@/types/utpp"
import { questions } from "@/lib/utpp/questions"
import { clearDraft, loadDraft, saveDraft } from "@/lib/utpp/storage"

type Status = "idle" | "sending" | "sent" | "error"

type Ctx = {
  answers: Answers
  setAnswer: (id: string, answer: Answer | undefined) => void
  respondentName: string
  setRespondentName: (value: string) => void
  /** Сколько вопросов отвечено. */
  answered: number
  total: number
  /** Черновик прочитан — до этого прогресс не показываем, чтобы не мигал. */
  hydrated: boolean
  draftRestored: boolean
  status: Status
  errorText: string | null
  submit: () => void
  startOver: () => void
  discardDraft: () => void
}

const AnswersContext = createContext<Ctx | null>(null)

export function useAnswers(): Ctx {
  const ctx = useContext(AnswersContext)
  if (!ctx) throw new Error("useAnswers вызван вне AnswersProvider")
  return ctx
}

/**
 * Есть ли в ответе что-то содержательное.
 *
 * Правило должно совпадать с серверным `isAnswered` из lib/utpp/sanitize:
 * иначе прогресс на странице разойдётся с тем, что примет сервер.
 * Комментарий без выбора тоже считается ответом.
 */
function filled(answer: Answer | undefined): boolean {
  if (!answer) return false
  if (answer.choice) return true
  if (answer.choices && answer.choices.length > 0) return true
  if (answer.text) return true
  if (answer.comment) return true
  return false
}

export default function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({})
  const [respondentName, setRespondentName] = useState("")
  const [hydrated, setHydrated] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [errorText, setErrorText] = useState<string | null>(null)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Восстановление черновика — один раз, после монтирования.
  //
  // localStorage на сервере нет, поэтому прочитать черновик можно только
  // после монтирования: лениво проинициализировать состояние нельзя без
  // расхождения разметки при гидратации. Все setState здесь выполняются
  // в одном проходе эффекта и батчатся React в одну перерисовку, каскада
  // не возникает. Тот же приём уже применён в форме брифа.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setAnswers(draft.answers)
      if (draft.respondentName) setRespondentName(draft.respondentName)
      setDraftRestored(Object.keys(draft.answers).length > 0)
    }
    setHydrated(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Автосохранение с задержкой. На сервер отсюда не уходит ничего.
  useEffect(() => {
    if (!hydrated) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveDraft(answers, respondentName || undefined)
    }, 400)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [answers, respondentName, hydrated])

  const setAnswer = useCallback((id: string, answer: Answer | undefined) => {
    setAnswers((prev) => {
      const next = { ...prev }
      if (!answer || Object.keys(answer).length === 0) delete next[id]
      else next[id] = answer
      return next
    })
    setStatus((s) => (s === "error" ? "idle" : s))
  }, [])

  const answered = useMemo(
    () => Object.values(answers).filter(filled).length,
    [answers],
  )

  const submit = useCallback(() => {
    setStatus("sending")
    setErrorText(null)

    void (async () => {
      try {
        // Маршрут внутри /utpp: cookie доступа ограничена путём раздела.
        const response = await fetch("/utpp/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            respondentName: respondentName || undefined,
            questionSetVersion: QUESTION_SET_VERSION,
            // Honeypot: настоящий человек это поле не видит.
            website: "",
          }),
        })

        const data = (await response.json().catch(() => null)) as
          | { ok?: boolean; error?: string }
          | null

        if (!response.ok || !data?.ok) {
          setErrorText(data?.error ?? null)
          setStatus("error")
          return
        }

        clearDraft()
        setStatus("sent")
      } catch {
        setErrorText(null)
        setStatus("error")
      }
    })()
  }, [answers, respondentName])

  /** Отправить ещё один ответ — например, если страницу смотрит коллега. */
  const startOver = useCallback(() => {
    setAnswers({})
    setRespondentName("")
    setDraftRestored(false)
    setStatus("idle")
    setErrorText(null)
    clearDraft()
  }, [])

  const discardDraft = useCallback(() => {
    setAnswers({})
    setRespondentName("")
    setDraftRestored(false)
    clearDraft()
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      answers,
      setAnswer,
      respondentName,
      setRespondentName,
      answered,
      total: questions.length,
      hydrated,
      draftRestored,
      status,
      errorText,
      submit,
      startOver,
      discardDraft,
    }),
    [
      answers,
      setAnswer,
      respondentName,
      answered,
      hydrated,
      draftRestored,
      status,
      errorText,
      submit,
      startOver,
      discardDraft,
    ],
  )

  return <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>
}
