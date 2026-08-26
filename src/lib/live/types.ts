import type { AiRole, DirId, ProcId } from "./taxonomy"

/**
 * Фазы сценического финала. Порядок = порядок beat'ов на слайде:
 * стрелка ведущего двигает фазу так же, как двигает шаги на любом
 * другом слайде деки.
 */
export const PHASES = [
  "invite", // QR крупно, сеть погашена
  "collecting", // QR в углу, сеть на первом плане
  "frozen", // движение затухает, подписи проступают
  "insights", // выводы справа
  "final1", // «Каждый видел только свой выбор»
  "final2", // «Вы создали цифровую модель»
  "final3", // «Теперь мы видим систему»
  "final4", // финальная строка
] as const

export type Phase = (typeof PHASES)[number]

export const PHASE_INDEX: Record<Phase, number> = PHASES.reduce(
  (acc, p, i) => {
    acc[p] = i
    return acc
  },
  {} as Record<Phase, number>,
)

export type Answer = {
  /** Анонимный идентификатор из localStorage телефона. Не персональные данные. */
  pid: string
  direction: DirId
  process: ProcId
  aiRole: AiRole
  at: number
}

/**
 * Ответ в процессе заполнения. Телефон отправляет каждый шаг отдельно,
 * поэтому узел направления загорается сразу после первого выбора,
 * а не через двадцать секунд, когда человек дойдёт до третьего вопроса.
 * Именно это делает возможным эффект открытия: зал успевает заметить,
 * что экран отвечает на нажатия.
 */
export type PartialAnswer = {
  pid: string
  direction?: DirId
  process?: ProcId
  aiRole?: AiRole
  at: number
}

/** Только полностью заполненные записи участвуют в анализе. */
export function completeAnswers(records: PartialAnswer[]): Answer[] {
  const out: Answer[] = []
  for (const r of records) {
    if (r.direction && r.process && r.aiRole) {
      out.push({
        pid: r.pid,
        direction: r.direction,
        process: r.process,
        aiRole: r.aiRole,
        at: r.at,
      })
    }
  }
  return out
}

export type SessionMode = "live" | "demo"

/**
 * Состояние, которое большой экран получает при опросе.
 * Ответы отдаются целиком: их десятки, а не тысячи, и экран умеет
 * перерисовать граф с нуля из этого массива — это же и страховка
 * от перезапуска процесса.
 */
export type LiveState = {
  sessionId: string
  mode: SessionMode
  phase: Phase
  /** Растёт при каждой команде с пульта: экран применяет фазу только при смене. */
  phaseNonce: number
  /** Все записи, включая незавершённые: по ним рисуется граф. */
  records: PartialAnswer[]
  /** Только завершённые: по ним считается анализ. */
  answers: Answer[]
  connected: number
  started: number
  completed: number
  /** Приём ответов остановлен ведущим. */
  closed: boolean
  serverTime: number
}

export type ControlCommand =
  | { action: "new-session"; mode?: SessionMode }
  | { action: "phase"; phase: Phase }
  | { action: "close" }
  | { action: "open" }
  | { action: "reset" }
  | { action: "demo" }
  | { action: "live" }
