import type { Answer } from "./types"
import type { AiRole, DirId, ProcId } from "./taxonomy"

/**
 * Резервная демонстрация: 24 виртуальных участника.
 *
 * Сценарий детерминирован — генерируется один раз из фиксированного
 * зерна. Мы заранее знаем, какую картину увидим в зале, если придётся
 * показывать fallback: доминирует «найти и собрать информацию», он же
 * приходит из пяти направлений, самая тяжёлая связка — работа с членами
 * Палаты → понять запрос, и по «подготовить документ» мнения о границе
 * заметно расходятся.
 *
 * Поток неравномерный: короткие паузы, иногда два события почти
 * одновременно — как в реальном зале.
 *
 * События не пишутся таймером: по времени старта и текущему времени
 * вычисляется, какие уже «пришли». Поэтому демо переживает перезапуск
 * процесса и не требует ни одного setInterval на сервере.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Scripted = { delay: number; direction: DirId; process: ProcId; aiRole: AiRole }

/** Вес направления в зале: ВЭД и работа с членами представлены сильнее. */
const DIR_WEIGHTS: Array<[DirId, number]> = [
  ["members", 5],
  ["ved", 4],
  ["expertise", 3],
  ["events", 3],
  ["gov", 2],
  ["education", 2],
  ["management", 2],
  ["legal", 1],
  ["territory", 1],
]

/**
 * Процессы по направлениям. «find-info» и «understand-request» намеренно
 * встречаются у многих: именно это даёт схождение, ради которого
 * процессный слой сделан общим.
 */
const PROC_BY_DIR: Record<DirId, Array<[ProcId, number]>> = {
  ved: [["find-info", 5], ["prepare-doc", 3], ["correspondence", 2], ["repeat", 2]],
  expertise: [["prepare-doc", 4], ["find-info", 3], ["control", 2], ["repeat", 2]],
  members: [["understand-request", 5], ["find-expert", 4], ["find-info", 2], ["control", 2]],
  events: [["organize-people", 4], ["correspondence", 3], ["find-info", 2], ["repeat", 2]],
  education: [["find-info", 3], ["organize-people", 2], ["prepare-doc", 2]],
  gov: [["find-info", 4], ["prepare-doc", 3], ["understand-request", 2]],
  legal: [["prepare-doc", 3], ["find-info", 2], ["understand-request", 2]],
  territory: [["find-expert", 3], ["understand-request", 2], ["find-info", 2]],
  management: [["control", 3], ["find-info", 2], ["understand-request", 2]],
}

/**
 * Готовность делегировать по процессам. «prepare-doc» намеренно
 * поляризован: половина готова отдать целиком, половина оставляет
 * решение себе — на этом срабатывает вывод о расхождении мнений.
 */
const AI_BY_PROC: Record<ProcId, AiRole[]> = {
  "find-info": [1, 1, 2, 2, 2, 3, 3],
  "understand-request": [2, 3, 3, 3, 4, 4],
  "find-expert": [2, 2, 3, 3, 4],
  "prepare-doc": [1, 1, 2, 4, 5, 5],
  correspondence: [2, 2, 3, 3, 4],
  "organize-people": [3, 3, 4, 4, 5],
  control: [1, 2, 2, 3, 3],
  repeat: [1, 1, 1, 2, 2],
}

function pick<T>(rnd: () => number, weighted: Array<[T, number]>): T {
  const total = weighted.reduce((s, [, w]) => s + w, 0)
  let r = rnd() * total
  for (const [v, w] of weighted) {
    r -= w
    if (r <= 0) return v
  }
  return weighted[weighted.length - 1]![0]
}

/** Сценарий строится один раз при загрузке модуля и больше не меняется. */
export const DEMO_SCRIPT: Scripted[] = (() => {
  const rnd = mulberry32(20260828)
  const out: Scripted[] = []
  let t = 1200
  for (let i = 0; i < 24; i++) {
    const direction = pick(rnd, DIR_WEIGHTS)
    const process = pick(rnd, PROC_BY_DIR[direction])
    const pool = AI_BY_PROC[process]
    const aiRole = pool[Math.floor(rnd() * pool.length)]!
    out.push({ delay: t, direction, process, aiRole })
    // Неравномерный поток: обычно 1–2,6 с, изредка почти одновременно.
    const gap = rnd() < 0.18 ? 120 + rnd() * 200 : 900 + rnd() * 1700
    t += gap
  }
  return out
})()

/** Полная длительность демо-потока, мс. */
export const DEMO_DURATION = DEMO_SCRIPT[DEMO_SCRIPT.length - 1]!.delay + 1500

/** Какие виртуальные ответы уже «пришли» к моменту now. */
export function demoAnswersAt(startedAt: number, now: number): Answer[] {
  const elapsed = now - startedAt
  const out: Answer[] = []
  for (let i = 0; i < DEMO_SCRIPT.length; i++) {
    const s = DEMO_SCRIPT[i]!
    if (s.delay > elapsed) break
    out.push({
      pid: `demo-${String(i).padStart(2, "0")}`,
      direction: s.direction,
      process: s.process,
      aiRole: s.aiRole,
      at: startedAt + s.delay,
    })
  }
  return out
}

/** Сколько «подключилось» — идёт немного впереди ответов, как в жизни. */
export function demoConnectedAt(startedAt: number, now: number): number {
  const elapsed = now - startedAt
  if (elapsed <= 0) return 0
  const ahead = demoAnswersAt(startedAt, now + 2600).length
  return Math.min(DEMO_SCRIPT.length + 2, ahead + (elapsed > 600 ? 2 : 0))
}
