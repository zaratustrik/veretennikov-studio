import type { GraphNode, GraphEdge, PortalData } from "@/lib/baghovPortal"

/**
 * Чистые производные от story-graph для раздела «Контроль сезона».
 * Без React — считаются один раз на клиенте через useMemo.
 */

/** Ядро отношений: главная пятёрка для мини-графа. */
export const CORE_IDS = [
  "char_ilya",
  "char_lera",
  "char_hozyayka",
  "char_polozov",
  "char_kira",
] as const

/** Человеческие подписи типов связей (для досье/ядра). */
export const EDGE_RU: Record<string, string> = {
  loves: "любит",
  family: "родство",
  opposes: "против",
  tests: "испытывает",
  tempts: "соблазняет",
  hides_secret_from: "скрывает тайну от",
  protects: "защищает",
  foreshadows: "предвещает",
  pays_off: "окупает",
  appears_in: "появляется в",
  unlocks: "открывает",
  breaks_rule: "нарушает правило",
  changes_arc: "меняет арку",
  uses: "использует",
  mirrors: "зеркалит",
  mentor_of: "наставник",
}

/** Группировка типов связей в смысловые «секторы» досье. */
export type Sector = "близость" | "давление" | "тайна" | "мир"
export const SECTOR_OF: Record<string, Sector> = {
  loves: "близость",
  family: "близость",
  mentor_of: "близость",
  protects: "близость",
  opposes: "давление",
  tempts: "давление",
  tests: "давление",
  uses: "давление",
  hides_secret_from: "тайна",
  mirrors: "тайна",
  secret: "тайна",
  breaks_rule: "мир",
  unlocks: "мир",
  appears_in: "мир",
  foreshadows: "мир",
  pays_off: "мир",
  changes_arc: "мир",
}

export type NeighborLink = {
  edge: GraphEdge
  otherId: string
  dir: "out" | "in"
}

/** Все связи узла (вход + выход). */
export function neighborsOf(id: string, edges: GraphEdge[]): NeighborLink[] {
  const out: NeighborLink[] = []
  for (const e of edges) {
    if (e.source === id) out.push({ edge: e, otherId: e.target, dir: "out" })
    else if (e.target === id) out.push({ edge: e, otherId: e.source, dir: "in" })
  }
  return out
}

export function nodeMap(nodes: GraphNode[]): Map<string, GraphNode> {
  return new Map(nodes.map((n) => [n.id, n]))
}

/** Список главных героев для сетки досье (по порядку значимости). */
export function mainHeroes(nodes: GraphNode[]): GraphNode[] {
  const order = [
    "char_ilya",
    "char_lera",
    "char_kira",
    "char_hozyayka",
    "char_polozov",
    "char_zhilin",
    "char_veresov",
    "char_marina",
    "char_potapov",
    "char_timur",
    "char_zoya",
    "char_oleg",
    "char_petrovich",
    "char_gorod",
  ]
  const byId = nodeMap(nodes)
  return order.map((id) => byId.get(id)).filter((n): n is GraphNode => !!n)
}

export type PlantRow = {
  id: string
  label: string
  seed: number
  payoff: number
  episodes: number[]
  status: string
  season2: boolean
}

/** Закладки → пэйоффы: дуга seed→payoff из episodes[] каждого plant_payoff. */
export function plantRows(nodes: GraphNode[]): PlantRow[] {
  return nodes
    .filter((n) => n.type === "plant_payoff" && n.episodes && n.episodes.length)
    .map((n) => {
      const eps = [...(n.episodes as number[])].sort((a, b) => a - b)
      return {
        id: n.id,
        label: n.label,
        seed: eps[0],
        payoff: eps[eps.length - 1],
        episodes: eps,
        status: n.status || "locked",
        season2: n.status === "season2_seed",
      }
    })
    .sort((a, b) => a.seed - b.seed || a.payoff - b.payoff)
}

export type PayoffStats = {
  bigTwists: number
  plants: number
  paidInSeason: number
  openMarker: number
  season2Seeds: number
}

export function payoffStats(data: PortalData): PayoffStats {
  const rows = plantRows(data.graph.nodes)
  const season2 = data.graph.nodes.filter(
    (n) => n.status === "season2_seed",
  ).length
  return {
    bigTwists: data.twists?.big?.length || 0,
    plants: rows.length,
    paidInSeason: rows.filter((r) => !r.season2 && r.status !== "open_question").length,
    openMarker: rows.filter((r) => r.status === "open_question").length,
    season2Seeds: season2,
  }
}

/** Связи внутри ядра для мини-графа отношений. */
export function coreEdges(edges: GraphEdge[]): GraphEdge[] {
  const set = new Set<string>(CORE_IDS)
  return edges.filter((e) => set.has(e.source) && set.has(e.target))
}

/** Серии с точкой перелома арки (changes_arc) — для ленты сезона. */
export function arcTurns(edges: GraphEdge[]): Set<number> {
  const s = new Set<number>()
  for (const e of edges) {
    if (e.type === "changes_arc" && e.starts_in_episode) s.add(e.starts_in_episode)
  }
  return s
}
