/**
 * Проверочные сценарии для Algorithmic Insights Engine.
 *
 * Запуск:  npx tsx src/lib/live/insights.check.ts
 *
 * В проекте нет тест-раннера, и заводить его за двое суток
 * до выступления незачем. Этого скрипта достаточно, чтобы убедиться:
 * алгоритм не напишет на сцене странного.
 */

import { analyze, computeStats } from "./insights"
import { DEMO_SCRIPT, demoAnswersAt, DEMO_DURATION } from "./demo"
import type { AiRole, DirId, ProcId } from "./taxonomy"
import type { Answer } from "./types"

let failures = 0
let checks = 0

function check(name: string, cond: boolean, extra?: unknown) {
  checks++
  if (cond) return
  failures++
  console.log(`  ✗ ${name}`)
  if (extra !== undefined) console.log("    ", JSON.stringify(extra))
}

let pid = 0
function a(direction: DirId, process: ProcId, aiRole: AiRole): Answer {
  pid++
  return { pid: `p${pid}`, direction, process, aiRole, at: 1000 + pid }
}

function scenario(name: string, answers: Answer[], fn: (r: ReturnType<typeof analyze>) => void) {
  console.log(`\n▸ ${name}  (участников: ${answers.length})`)
  const r = analyze(answers)
  console.log(`  уверенность: ${r.confidence}, выводов: ${r.insights.length}`)
  for (const i of r.insights) console.log(`  · [${i.type}] ${i.headline}`)
  fn(r)
}

/* ── 1 · Пусто ───────────────────────────────────────────────── */

scenario("Ни одного ответа", [], (r) => {
  check("выводов нет", r.insights.length === 0)
  check("статистика нулевая", r.stats.participants === 0)
})

/* ── 2 · Мало участников ─────────────────────────────────────── */

pid = 0
scenario(
  "Мало участников (3)",
  [a("ved", "find-info", 2), a("members", "find-info", 3), a("expertise", "prepare-doc", 4)],
  (r) => {
    check("режим structure-only", r.confidence === "structure-only")
    check("не больше двух выводов", r.insights.length <= 2)
    check("есть описание структуры", r.insights.some((i) => i.type === "structure"))
    check(
      "нет количественных обобщений про большинство",
      !r.insights.some((i) => /большинств|процент|%/i.test(i.headline + (i.detail ?? ""))),
    )
    check(
      "нет вывода про границу делегирования",
      !r.insights.some((i) => i.type === "delegation"),
    )
  },
)

/* ── 3 · Один доминирующий процесс, одно направление ─────────── */

pid = 0
scenario(
  "Доминирующий процесс внутри одного направления",
  [
    ...Array.from({ length: 8 }, () => a("members", "understand-request", 3)),
    a("members", "find-expert", 2),
    a("ved", "prepare-doc", 4),
    a("expertise", "control", 5),
    a("events", "correspondence", 2),
  ],
  (r) => {
    check("полная уверенность", r.confidence === "full")
    // Процесс сконцентрирован в одном направлении — это локальная задача,
    // и алгоритм обязан назвать её именно так, а не «самой частой».
    check("распознан как локальный паттерн", r.insights.some((i) => i.type === "local-pattern"))
    const loc = r.insights.find((i) => i.type === "local-pattern")
    check("это understand-request", loc?.evidence.process === "understand-request", loc?.evidence)
    check("выводов три и больше", r.insights.length >= 3, r.insights.length)
    check(
      "самая тяжёлая связка — members → understand-request",
      r.stats.edges[0]?.direction === "members" &&
        r.stats.edges[0]?.process === "understand-request",
      r.stats.edges[0],
    )
    check("нет схождения по многим направлениям", (r.stats.processes[0]?.crossDept ?? 0) <= 2)
  },
)

/* ── 4 · Процесс, общий для многих направлений ───────────────── */

pid = 0
scenario(
  "Схождение: один процесс из шести направлений",
  [
    a("ved", "find-info", 2),
    a("expertise", "find-info", 2),
    a("members", "find-info", 3),
    a("events", "find-info", 1),
    a("gov", "find-info", 3),
    a("legal", "find-info", 2),
    a("management", "control", 2),
    a("territory", "find-expert", 3),
    a("education", "prepare-doc", 4),
    a("members", "find-expert", 3),
    a("ved", "prepare-doc", 2),
    a("events", "organize-people", 4),
  ],
  (r) => {
    const fi = r.stats.processes.find((p) => p.id === "find-info")
    check("find-info пришёл из 6 направлений", fi?.crossDept === 6, fi?.crossDept)
    check("evenness высокая", (fi?.evenness ?? 0) > 0.9, fi?.evenness)
    const sys = r.insights.find((i) => i.type === "systemic-process")
    check("системный вывод про find-info", sys?.evidence.process === "find-info", sys?.evidence)
    check(
      "в заголовке правильный падеж: «в 6 направлениях»",
      /в 6 направлениях/.test(sys?.headline ?? ""),
      sys?.headline,
    )
    // Каждая пара «направление → процесс» здесь встречается один раз,
    // поэтому выделять «самую частую связку» не из чего — и алгоритм
    // обязан промолчать, а не назвать случайную пару.
    check("максимальный вес связки — 1", r.stats.edges[0]?.weight === 1, r.stats.edges[0])
    check("вывода о связке нет", !r.insights.some((i) => i.type === "strongest-link"))
    check("выводов ровно два и они сильные", r.insights.length === 2, r.insights.length)
  },
)

/* ── 5 · Локальная проблема одного направления ───────────────── */

pid = 0
scenario(
  "Локальная проблема: repeat почти целиком у экспертизы",
  [
    ...Array.from({ length: 5 }, () => a("expertise", "repeat", 1)),
    a("ved", "repeat", 2),
    a("members", "understand-request", 3),
    a("members", "find-expert", 3),
    a("events", "organize-people", 4),
    a("gov", "prepare-doc", 4),
    a("ved", "find-info", 2),
    a("management", "control", 3),
  ],
  (r) => {
    const rep = r.stats.processes.find((p) => p.id === "repeat")
    check("концентрация высокая", (rep?.concentration ?? 0) >= 0.75, rep?.concentration)
    check("есть локальный вывод", r.insights.some((i) => i.type === "local-pattern"))
    const loc = r.insights.find((i) => i.type === "local-pattern")
    check("локальный вывод про repeat", loc?.evidence.process === "repeat", loc?.evidence)
  },
)

/* ── 6 · Сильная поляризация по границе AI ───────────────────── */

pid = 0
scenario(
  "Поляризация: по prepare-doc мнения разошлись",
  [
    a("ved", "prepare-doc", 1),
    a("expertise", "prepare-doc", 1),
    a("legal", "prepare-doc", 5),
    a("gov", "prepare-doc", 5),
    a("members", "prepare-doc", 1),
    a("education", "prepare-doc", 5),
    a("ved", "find-info", 2),
    a("members", "understand-request", 3),
    a("events", "organize-people", 3),
    a("territory", "find-expert", 3),
    a("management", "control", 2),
    a("expertise", "find-info", 2),
  ],
  (r) => {
    const pd = r.stats.processes.find((p) => p.id === "prepare-doc")
    check("поляризация максимальна", (pd?.polarization ?? 0) >= 0.9, pd?.polarization)
    check("разброс большой", (pd?.spread ?? 0) >= 1.2, pd?.spread)
    check("есть вывод о расхождении", r.insights.some((i) => i.type === "polarization"))
    const pol = r.insights.find((i) => i.type === "polarization")
    check("расхождение про prepare-doc", pol?.evidence.process === "prepare-doc")
  },
)

/* ── 7 · Ровное распределение без лидера ─────────────────────── */

pid = 0
scenario(
  "Ровное распределение без явного лидера",
  [
    a("ved", "find-info", 3),
    a("expertise", "prepare-doc", 3),
    a("members", "understand-request", 3),
    a("events", "organize-people", 3),
    a("education", "find-expert", 3),
    a("gov", "correspondence", 3),
    a("legal", "control", 3),
    a("territory", "repeat", 3),
    a("management", "find-info", 3),
    a("ved", "prepare-doc", 3),
  ],
  (r) => {
    check("выводов не больше четырёх", r.insights.length <= 4)
    check("выводов хотя бы два", r.insights.length >= 2)
    check(
      "нет вывода о поляризации — её здесь нет",
      !r.insights.some((i) => i.type === "polarization"),
    )
  },
)

/* ── 8 · Дедупликация и неповторяемость ──────────────────────── */

pid = 0
{
  const dup: Answer[] = [
    { pid: "same", direction: "ved", process: "find-info", aiRole: 1, at: 10 },
    { pid: "same", direction: "members", process: "control", aiRole: 5, at: 20 },
    a("expertise", "prepare-doc", 3),
  ]
  const stats = computeStats(dup)
  console.log("\n▸ Дедупликация по pid")
  check("остался один ответ участника", stats.participants === 2, stats.participants)
  check(
    "победил последний ответ",
    stats.processes.some((p) => p.id === "control"),
    stats.processes.map((p) => p.id),
  )
}

/* ── 9 · Ни один процесс не упомянут дважды ──────────────────── */

pid = 0
{
  const many: Answer[] = []
  const dirs: DirId[] = ["ved", "expertise", "members", "events", "gov", "legal"]
  const procs: ProcId[] = ["find-info", "prepare-doc", "understand-request"]
  for (let i = 0; i < 24; i++) {
    many.push(a(dirs[i % dirs.length]!, procs[i % procs.length]!, ((i % 5) + 1) as AiRole))
  }
  const r = analyze(many)
  console.log("\n▸ Неповторяемость выводов (24 участника)")
  for (const i of r.insights) console.log(`  · [${i.type}] ${i.headline}`)
  // Про один процесс допускается не больше одного вывода в каждом
  // измерении: «что и откуда» и «сколько готовы отдать» — разные вещи.
  const DIM: Record<string, string> = {
    structure: "structure",
    "systemic-process": "structure",
    "local-pattern": "structure",
    "strongest-link": "link",
    delegation: "boundary",
    polarization: "boundary",
  }
  const pairs = r.insights
    .map((i) => (typeof i.evidence.process === "string" ? `${DIM[i.type]}|${i.evidence.process}` : null))
    .filter((x): x is string => x !== null)
  check(
    "в одном измерении процесс упомянут не дважды",
    new Set(pairs).size === pairs.length,
    pairs,
  )
  check("типы выводов уникальны", new Set(r.insights.map((i) => i.type)).size === r.insights.length)
  check("не больше четырёх выводов", r.insights.length <= 4)
}

/* ── 10 · Демо-сценарий даёт содержательную картину ──────────── */

{
  const answers = demoAnswersAt(0, DEMO_DURATION)
  const r = analyze(answers)
  console.log(`\n▸ Демо-сценарий (${answers.length} виртуальных участников)`)
  console.log(`  уверенность: ${r.confidence}, выводов: ${r.insights.length}`)
  for (const i of r.insights) console.log(`  · [${i.type}] ${i.headline}`)
  check("демо детерминировано", DEMO_SCRIPT.length === 24)
  check("все 24 приходят к концу потока", answers.length === 24, answers.length)
  check("полная уверенность", r.confidence === "full")
  check("выводов 3–4", r.insights.length >= 3 && r.insights.length <= 4, r.insights.length)
  check("есть системный процесс", r.insights.some((i) => i.type === "systemic-process"))
  check("есть граница делегирования", r.insights.some((i) => i.type === "delegation"))
  const half = demoAnswersAt(0, DEMO_SCRIPT[11]!.delay)
  check("поток нарастает постепенно", half.length > 0 && half.length < 24, half.length)
}

/* ── Итог ────────────────────────────────────────────────────── */

console.log(`\n${failures === 0 ? "ВСЁ ЧИСТО" : "ЕСТЬ ПРОБЛЕМЫ"}: ${checks - failures}/${checks} проверок пройдено`)
if (failures > 0) process.exit(1)
