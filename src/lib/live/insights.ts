import { DIR_BY_ID, PROC_BY_ID } from "./taxonomy"
import type { DirId, ProcId } from "./taxonomy"
import type { Answer } from "./types"

/**
 * Algorithmic Insights Engine.
 *
 * Чистая функция: Answer[] → Insight[]. Никаких внешних моделей,
 * никакой сети, никаких обращений наружу. Всё считается локально
 * и мгновенно — на сцене нельзя ждать ответ по сети.
 *
 * Мы не изображаем работу нейросети. Мы действительно считаем
 * структуру ответов: частоту, межфункциональное схождение,
 * концентрацию связей, границу делегирования и расхождение мнений.
 * В этом и методическая ценность: как только процесс описан
 * структурно, закономерности видит уже обычный алгоритм.
 *
 * Формулировки всегда об участниках интерактива, а не об организации:
 * тридцать человек в зале — не социологическая выборка Палаты.
 */

export type InsightType =
  | "structure"
  | "systemic-process"
  | "strongest-link"
  | "delegation"
  | "polarization"
  | "local-pattern"

export type Insight = {
  type: InsightType
  /** Больше — важнее. Используется для отбора и порядка показа. */
  priority: number
  headline: string
  detail?: string
  evidence: Record<string, number | string | string[]>
}

/** Насколько уверенно можно обобщать при таком числе участников. */
export type Confidence = "structure-only" | "cautious" | "full"

export type ProcessStat = {
  id: ProcId
  title: string
  count: number
  /** Из скольких разных направлений пришёл этот процесс. */
  crossDept: number
  directions: DirId[]
  /** Нормированная энтропия распределения по направлениям, 0…1. */
  evenness: number
  /** Средняя ступень шкалы 1…5. Меньше — больше готовности делегировать. */
  delegation: number
  /** Стандартное отклонение по шкале. */
  spread: number
  /** 0…1. Единица — мнения разделились ровно пополам между краями шкалы. */
  polarization: number
  /** Доля процесса, приходящаяся на самое частое направление. */
  concentration: number
  topDirection: DirId | null
}

export type Stats = {
  participants: number
  answers: number
  activeDirections: number
  activeProcesses: number
  processes: ProcessStat[]
  edges: Array<{ direction: DirId; process: ProcId; weight: number }>
  directionCounts: Array<{ id: DirId; count: number }>
  /** Доли по группам шкалы. */
  delegateShare: number // ступени 1–2
  assistShare: number // ступень 3
  humanShare: number // ступени 4–5
  meanDelegation: number
}

export type Analysis = {
  confidence: Confidence
  stats: Stats
  insights: Insight[]
}

/* ── Мелочи ──────────────────────────────────────────────────── */

function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export function participantsWord(n: number): string {
  return `${n} ${plural(n, "участник", "участника", "участников")}`
}

/** Предложный падеж: «в 6 направлениях». */
function inDirections(n: number): string {
  return `в ${n} ${plural(n, "направлении", "направлениях", "направлениях")}`
}

/** Родительный падеж: «из 6 направлений». */
function ofDirections(n: number): string {
  return `из ${n} ${plural(n, "направления", "направлений", "направлений")}`
}

function procTitle(id: ProcId): string {
  return PROC_BY_ID.get(id)?.title ?? id
}

function dirTitle(id: DirId): string {
  return DIR_BY_ID.get(id)?.title ?? id
}

function dirShort(id: DirId): string {
  return DIR_BY_ID.get(id)?.short ?? id
}

/** Последний ответ каждого участника. Дедупликация на всякий случай. */
function dedupe(answers: Answer[]): Answer[] {
  const byPid = new Map<string, Answer>()
  for (const a of answers) {
    const prev = byPid.get(a.pid)
    if (!prev || a.at >= prev.at) byPid.set(a.pid, a)
  }
  return [...byPid.values()]
}

/* ── Статистика ──────────────────────────────────────────────── */

export function computeStats(input: Answer[]): Stats {
  const answers = dedupe(input)
  const n = answers.length

  const dirCount = new Map<DirId, number>()
  const procAnswers = new Map<ProcId, Answer[]>()
  const edgeCount = new Map<string, number>()

  for (const a of answers) {
    dirCount.set(a.direction, (dirCount.get(a.direction) ?? 0) + 1)
    const list = procAnswers.get(a.process) ?? []
    list.push(a)
    procAnswers.set(a.process, list)
    const key = `${a.direction}|${a.process}`
    edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1)
  }

  const processes: ProcessStat[] = [...procAnswers.entries()].map(([id, list]) => {
    const perDir = new Map<DirId, number>()
    for (const a of list) perDir.set(a.direction, (perDir.get(a.direction) ?? 0) + 1)

    const total = list.length
    // Нормированная энтропия: 1 — процесс равномерно размазан по направлениям.
    let entropy = 0
    for (const c of perDir.values()) {
      const p = c / total
      entropy -= p * Math.log(p)
    }
    const maxEntropy = perDir.size > 1 ? Math.log(perDir.size) : 0
    const evenness = maxEntropy > 0 ? entropy / maxEntropy : 0

    const roles = list.map((a) => a.aiRole)
    const mean = roles.reduce((s, r) => s + r, 0) / total
    const variance = roles.reduce((s, r) => s + (r - mean) ** 2, 0) / total
    const spread = Math.sqrt(variance)

    const lo = roles.filter((r) => r <= 2).length / total
    const hi = roles.filter((r) => r >= 4).length / total
    // 1, когда мнения разделились ровно пополам между краями шкалы.
    const polarization = 2 * Math.min(lo, hi)

    let topDirection: DirId | null = null
    let topCount = 0
    for (const [d, c] of perDir) {
      if (c > topCount) {
        topCount = c
        topDirection = d
      }
    }

    return {
      id,
      title: procTitle(id),
      count: total,
      crossDept: perDir.size,
      directions: [...perDir.keys()],
      evenness,
      delegation: mean,
      spread,
      polarization,
      concentration: total > 0 ? topCount / total : 0,
      topDirection,
    }
  })

  const edges = [...edgeCount.entries()]
    .map(([key, weight]) => {
      const [direction, process] = key.split("|") as [DirId, ProcId]
      return { direction, process, weight }
    })
    .sort((a, b) => b.weight - a.weight)

  const roles = answers.map((a) => a.aiRole)
  const meanDelegation = n > 0 ? roles.reduce((s, r) => s + r, 0) / n : 0

  return {
    participants: n,
    answers: n,
    activeDirections: dirCount.size,
    activeProcesses: procAnswers.size,
    processes: processes.sort((a, b) => b.count - a.count),
    edges,
    directionCounts: [...dirCount.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count),
    delegateShare: n > 0 ? roles.filter((r) => r <= 2).length / n : 0,
    assistShare: n > 0 ? roles.filter((r) => r === 3).length / n : 0,
    humanShare: n > 0 ? roles.filter((r) => r >= 4).length / n : 0,
    meanDelegation,
  }
}

export function confidenceFor(n: number): Confidence {
  if (n < 5) return "structure-only"
  if (n < 10) return "cautious"
  return "full"
}

/* ── Выводы ──────────────────────────────────────────────────── */

/**
 * Кандидаты собираются с оценками, затем отбираются так, чтобы
 * не сказать дважды одно и то же: не больше одного вывода каждого
 * типа и не больше одного вывода про один и тот же процесс,
 * кроме случая, когда частота и схождение сливаются в один вывод.
 */
export function analyze(input: Answer[]): Analysis {
  const stats = computeStats(input)
  const n = stats.participants
  const confidence = confidenceFor(n)

  if (n === 0) {
    return { confidence, stats, insights: [] }
  }

  // Мало людей — только описание структуры, без количественных обобщений.
  if (confidence === "structure-only") {
    const insights: Insight[] = [
      {
        type: "structure",
        priority: 100,
        headline: `${participantsWord(n)} · ${stats.activeDirections} ${plural(
          stats.activeDirections,
          "направление",
          "направления",
          "направлений",
        )} · ${stats.activeProcesses} ${plural(
          stats.activeProcesses,
          "процесс",
          "процесса",
          "процессов",
        )}`,
        detail:
          "Участников пока немного — для обобщений этого мало. Но структура уже собрана: направления, процессы и связи между ними.",
        evidence: {
          participants: n,
          directions: stats.activeDirections,
          processes: stats.activeProcesses,
        },
      },
    ]
    const top = stats.processes[0]
    if (top && top.crossDept >= 2) {
      insights.push({
        type: "systemic-process",
        priority: 80,
        headline: `«${top.title}» уже пришёл из разных направлений`,
        detail: "Даже на небольшом числе ответов видно, что процессы у подразделений общие.",
        evidence: { process: top.id, crossDept: top.crossDept },
      })
    }
    return { confidence, stats, insights }
  }

  const soft = confidence === "cautious"
  const scope = soft ? "среди участников" : "среди участников интерактива"
  const candidates: Insight[] = []

  /* — Главный процессный вывод: схождение или частота — */
  const byCount = [...stats.processes].sort((a, b) => b.count - a.count)
  const topProc = byCount[0]
  const crossProc = [...stats.processes]
    .filter((p) => p.crossDept >= 3)
    .sort((a, b) => b.crossDept - a.crossDept || b.evenness - a.evenness || b.count - a.count)[0]

  // Процесс, который разошёлся по направлениям, важнее просто частого:
  // именно он показывает, что задача общая, а не отдельского масштаба.
  let systemicProcess: ProcId | null = null
  if (crossProc) {
    systemicProcess = crossProc.id
    const alsoTop = topProc?.id === crossProc.id
    candidates.push({
      type: "systemic-process",
      priority: 100 + crossProc.crossDept * 4 + (alsoTop ? 10 : 0),
      headline: `«${crossProc.title}» встречается сразу ${inDirections(crossProc.crossDept)}`,
      detail: soft
        ? "Это не задача одного отдела, а общая работа: решение для неё потенциально используют несколько подразделений."
        : alsoTop
          ? `Его назвали чаще любого другого ${scope}, и пришёл он ${ofDirections(crossProc.crossDept)}. Один инструмент здесь закрывал бы задачу нескольких подразделений сразу.`
          : `Это не задача одного отдела: решение для неё потенциально используют несколько подразделений сразу.`,
      evidence: {
        process: crossProc.id,
        count: crossProc.count,
        crossDept: crossProc.crossDept,
        directions: crossProc.directions.map(dirShort),
      },
    })
  } else if (topProc && topProc.count >= 2 && topProc.concentration < 0.7) {
    systemicProcess = topProc.id
    candidates.push({
      type: "systemic-process",
      priority: 80 + (topProc.count / n) * 30,
      headline: `Чаще других назвали «${topProc.title}»`,
      detail: soft
        ? "Это первый процесс, который имеет смысл проверить на возможность автоматизации."
        : `${participantsWord(topProc.count)} из ${n} ${scope}. Это первый кандидат на проверку.`,
      evidence: { process: topProc.id, count: topProc.count },
    })
  }

  /* — Локальная концентрация: задача одного направления — */
  const local = stats.processes
    .filter(
      (p) =>
        p.count >= 3 && p.concentration >= 0.7 && p.topDirection && p.id !== systemicProcess,
    )
    .sort((a, b) => b.count * b.concentration - a.count * a.concentration)[0]
  if (local && local.topDirection) {
    const isTop = topProc?.id === local.id
    candidates.push({
      type: "local-pattern",
      priority: (isTop ? 96 : 62) + local.count * 2,
      headline: `«${local.title}» — почти целиком про «${dirShort(local.topDirection)}»`,
      detail:
        "В отличие от общих процессов это локальная задача одного направления, и решать её логично точечно.",
      evidence: {
        process: local.id,
        direction: local.topDirection,
        concentration: Math.round(local.concentration * 100),
      },
    })
  }

  /* — Самая тяжёлая связка — */
  const edge = stats.edges[0]
  if (edge && edge.weight >= 2) {
    // Если связка указывает на тот же процесс, что и системный вывод,
    // она всё равно добавляет владельца — но приоритет ниже.
    const sameProcess = edge.process === systemicProcess
    candidates.push({
      type: "strongest-link",
      priority: (sameProcess ? 58 : 74) + (edge.weight / n) * 25,
      headline: `Самая частая связка: ${dirShort(edge.direction)} → «${procTitle(edge.process)}»`,
      detail: soft
        ? "Здесь сходится больше всего ответов."
        : `${participantsWord(edge.weight)} назвали именно эту пару. С неё удобно начинать разбор: владелец процесса очевиден.`,
      evidence: {
        direction: edge.direction,
        directionTitle: dirTitle(edge.direction),
        process: edge.process,
        weight: edge.weight,
      },
    })
  }

  /* — Граница делегирования — */
  if (n >= 5) {
    const { delegateShare, assistShare, humanShare } = stats
    const nearest = [...stats.processes].sort((a, b) => a.delegation - b.delegation)[0]
    const farthest = [...stats.processes].sort((a, b) => b.delegation - a.delegation)[0]
    const middle = delegateShare + assistShare

    let headline: string
    let detail: string
    if (humanShare >= 0.5) {
      headline = "Решение участники в основном оставляют за собой"
      detail = `При этом подготовку отдать готовы: ближе всего к автоматизации оказался процесс «${nearest?.title ?? "—"}».`
    } else if (middle >= 0.6) {
      headline = "Подготовку отдать готовы, решение — нет"
      detail = `Дальше всего от автоматизации участники держат «${farthest?.title ?? "—"}».`
    } else {
      headline = "Готовность делегировать распределена ровно"
      detail = `Ближе всего к автоматизации «${nearest?.title ?? "—"}», дальше всего — «${farthest?.title ?? "—"}».`
    }

    candidates.push({
      type: "delegation",
      priority: 85,
      headline,
      detail,
      evidence: {
        delegatePercent: Math.round(delegateShare * 100),
        assistPercent: Math.round(assistShare * 100),
        humanPercent: Math.round(humanShare * 100),
        nearest: nearest?.id ?? "",
        farthest: farthest?.id ?? "",
      },
    })
  }

  /* — Расхождение мнений: интереснее среднего — */
  const polar = stats.processes
    .filter((p) => p.count >= 4 && p.polarization >= 0.5 && p.spread >= 1.2)
    .sort((a, b) => b.polarization * b.count - a.polarization * a.count)[0]
  if (polar) {
    candidates.push({
      type: "polarization",
      priority: 92,
      headline: `По «${polar.title}» единой границы нет`,
      detail:
        "Одни готовы отдать этот процесс целиком, другие оставляют решение за человеком. Среднее здесь ничего не объясняет — расходятся сами подходы.",
      evidence: {
        process: polar.id,
        count: polar.count,
        spread: Math.round(polar.spread * 100) / 100,
        polarization: Math.round(polar.polarization * 100),
      },
    })
  }

  /* — Отбор —
     Правило неповторяемости: про один процесс допускается не больше
     одного вывода в каждом измерении. Структура (что и откуда) и граница
     (сколько готовы отдать) — разные измерения, и говорить об одном
     процессе в обоих не значит повторяться. */
  const DIMENSION: Record<InsightType, "structure" | "boundary" | "link"> = {
    structure: "structure",
    "systemic-process": "structure",
    "local-pattern": "structure",
    // Связка называет пару «направление → процесс»: её содержание —
    // владелец процесса, а не сам процесс. Это отдельное измерение,
    // и блокировать её процессным выводом неправильно.
    "strongest-link": "link",
    delegation: "boundary",
    polarization: "boundary",
  }

  const chosen: Insight[] = []
  const usedTypes = new Set<InsightType>()
  const usedPairs = new Set<string>()

  for (const c of [...candidates].sort((a, b) => b.priority - a.priority)) {
    if (usedTypes.has(c.type)) continue
    const proc = typeof c.evidence.process === "string" ? c.evidence.process : null
    const pairKey = proc ? `${DIMENSION[c.type]}|${proc}` : null
    if (pairKey && usedPairs.has(pairKey)) continue
    chosen.push(c)
    usedTypes.add(c.type)
    if (pairKey) usedPairs.add(pairKey)
    if (chosen.length === 4) break
  }

  // Лучше три сильных, чем четыре слабых: четвёртый остаётся, только
  // если он сам по себе весомый.
  const strong = chosen.filter((c, i) => i < 3 || c.priority >= 70)

  return { confidence, stats, insights: strong.slice(0, 4) }
}
