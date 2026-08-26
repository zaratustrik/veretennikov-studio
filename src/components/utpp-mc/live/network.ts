import { DIRECTIONS, PROCESSES } from "@/lib/live/taxonomy"
import type { DirId, ProcId } from "@/lib/live/taxonomy"
import type { PartialAnswer, Phase } from "@/lib/live/types"

/**
 * Живая карта процессов: Canvas 2D, без WebGL и без внешних библиотек.
 *
 * Почему не three.js: в сцене девять узлов направлений, восемь узлов
 * процессов и несколько десятков частиц. WebGL здесь не даёт ничего,
 * зато добавляет риск не подняться на чужом ноутбуке и часы отладки
 * накануне выступления. Глубина сделана слоями с параллаксом —
 * это честное 2.5D, и его достаточно.
 *
 * Композиция:
 *
 *        ○ ○ ○   процессы — внешнее кольцо, радиус зависит от того,
 *    ○             сколько люди готовы доверить машине
 *        ◉       направления — внутреннее кольцо, всегда на месте
 *      ●         ядро — центр системы, НЕ подписанное как ИИ
 *
 * Ядро в начале — просто центр композиции. AI-поле входит отдельным
 * слоем и только после того, как появились ответы на третий вопрос:
 * сначала процессы, потом технология. Это не украшение, а смысл
 * всего мастер-класса, выраженный геометрией.
 */

/* ── Геометрия ───────────────────────────────────────────────── */

const R_DIR = 0.3
const R_PROC_NEAR = 0.36
const R_PROC_FAR = 0.82
const TAU = Math.PI * 2

type NodeKind = "dir" | "proc"

type Node = {
  kind: NodeKind
  id: string
  label: string
  angle: number
  /** Целевая позиция в мировых координатах. */
  tx: number
  ty: number
  x: number
  y: number
  vx: number
  vy: number
  weight: number
  /** 0…1 — насколько узел «зажжён». */
  lit: number
  litTarget: number
  /** Всплеск после нового ответа, затухает. */
  pulse: number
  /** Средняя ступень шкалы, 1…5. Только для процессов. */
  ai: number
  seed: number
}

type Edge = {
  from: string
  to: string
  weight: number
  /** Частицы, ползущие по ребру: доля пути 0…1. */
  parts: number[]
}

type Wave = { x: number; y: number; t: number; strength: number }

export type GraphInput = {
  records: PartialAnswer[]
  phase: Phase
  reducedMotion: boolean
}

/* ── Палитра: только токены деки, ни одного нового цвета ─────── */

const C = {
  bg: "#170c21",
  bgGlow: "#33204a",
  dim: "139,122,156", // --u-on-ink-3
  fg: "240,234,243", // --u-on-ink
  brand: "179,36,102", // --u-brand
  brandLit: "217,99,155", // --u-brand-lit
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class NetworkRenderer {
  private ctx: CanvasRenderingContext2D
  private raf = 0
  private watchdog = 0
  private lastFrameAt = 0
  private w = 0
  private h = 0
  private dpr = 1
  private t0 = 0
  private nodes = new Map<string, Node>()
  private edges = new Map<string, Edge>()
  private waves: Wave[] = []
  private phase: Phase = "invite"
  private reduced = false
  /** 0…1 — насколько вошло AI-поле. */
  private aiField = 0
  private aiFieldTarget = 0
  /** 0…1 — насколько сеть «успокоена» (фаза frozen и дальше). */
  private calm = 0
  /** Сдвиг композиции влево на фазе выводов. */
  private shift = 0

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) throw new Error("canvas 2d unavailable")
    this.ctx = ctx
    this.buildNodes()
    this.resize()
  }

  /* ── Построение статичного каркаса ─────────────────────────── */

  private buildNodes() {
    // Девять направлений присутствуют с самого начала — погашенными.
    // Участники их зажигают, а не создают: экран остаётся красивым
    // при любом уровне участия, и это снимает главный риск концепции.
    DIRECTIONS.forEach((d, i) => {
      const angle = -Math.PI / 2 + (i / DIRECTIONS.length) * TAU
      const x = Math.cos(angle) * R_DIR
      const y = Math.sin(angle) * R_DIR
      this.nodes.set(`d:${d.id}`, {
        kind: "dir",
        id: d.id,
        label: d.short,
        angle,
        tx: x,
        ty: y,
        x,
        y,
        vx: 0,
        vy: 0,
        weight: 0,
        lit: 0,
        litTarget: 0,
        pulse: 0,
        ai: 3,
        seed: 1000 + i * 37,
      })
    })

    PROCESSES.forEach((p, i) => {
      const angle = -Math.PI / 2 + ((i + 0.5) / PROCESSES.length) * TAU
      const r = R_PROC_FAR
      this.nodes.set(`p:${p.id}`, {
        kind: "proc",
        id: p.id,
        label: p.short,
        angle,
        tx: Math.cos(angle) * r,
        ty: Math.sin(angle) * r,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        weight: 0,
        lit: 0,
        litTarget: 0,
        pulse: 0,
        ai: 3,
        seed: 5000 + i * 53,
      })
    })
  }

  /* ── Приём состояния ───────────────────────────────────────── */

  update({ records, phase, reducedMotion }: GraphInput) {
    this.phase = phase
    this.reduced = reducedMotion

    const dirCount = new Map<DirId, number>()
    const procCount = new Map<ProcId, number>()
    const procAi = new Map<ProcId, number[]>()
    const edgeCount = new Map<string, number>()
    let aiAnswers = 0

    for (const r of records) {
      if (r.direction) dirCount.set(r.direction, (dirCount.get(r.direction) ?? 0) + 1)
      if (r.process) procCount.set(r.process, (procCount.get(r.process) ?? 0) + 1)
      if (r.process && r.aiRole) {
        const list = procAi.get(r.process) ?? []
        list.push(r.aiRole)
        procAi.set(r.process, list)
        aiAnswers++
      }
      if (r.direction && r.process) {
        const key = `d:${r.direction}|p:${r.process}`
        edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1)
      }
    }

    // AI-поле входит только когда кто-то дошёл до третьего вопроса.
    this.aiFieldTarget = aiAnswers > 0 ? 1 : 0

    // Состояние с сервера авторитетно: вес не только растёт, но и падает.
    // Без этого новая сессия оставляла бы на экране зажжённые узлы старой,
    // а «Сбросить ответы» ничего бы не гасил.
    for (const node of this.nodes.values()) {
      const next =
        node.kind === "dir"
          ? (dirCount.get(node.id as DirId) ?? 0)
          : (procCount.get(node.id as ProcId) ?? 0)
      if (next > node.weight) {
        node.pulse = 1
        this.waves.push({ x: node.x, y: node.y, t: 0, strength: 1 })
        if (this.waves.length > 12) this.waves.shift()
      }
      node.weight = next
      node.litTarget = next > 0 ? 1 : 0
      if (node.kind === "proc") {
        const list = procAi.get(node.id as ProcId)
        node.ai = list && list.length ? list.reduce((s, v) => s + v, 0) / list.length : 3
      }
    }

    // Рёбра: новые появляются, исчезнувшие уходят.
    for (const [key, weight] of edgeCount) {
      const [from, to] = key.split("|") as [string, string]
      const e = this.edges.get(key)
      if (!e) {
        this.edges.set(key, { from, to, weight, parts: [Math.random()] })
      } else if (weight > e.weight) {
        e.weight = weight
        if (e.parts.length < 4) e.parts.push(0)
      } else {
        e.weight = weight
      }
    }
    for (const key of [...this.edges.keys()]) {
      if (!edgeCount.has(key)) this.edges.delete(key)
    }
  }

  /** Полный сброс: новая сессия начинается с чистого созвездия. */
  reset() {
    this.edges.clear()
    this.waves = []
    this.aiField = 0
    this.aiFieldTarget = 0
    for (const node of this.nodes.values()) {
      node.weight = 0
      node.lit = 0
      node.litTarget = 0
      node.pulse = 0
      node.ai = 3
    }
  }

  /* ── Размер и запуск ───────────────────────────────────────── */

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.w = Math.max(1, Math.round(rect.width))
    this.h = Math.max(1, Math.round(rect.height))
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
  }

  start() {
    if (this.raf) return
    this.t0 = performance.now()
    this.lastFrameAt = performance.now()

    const loop = (now: number) => {
      this.lastFrameAt = now
      this.frame((now - this.t0) / 1000)
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)

    // Страховка от замирания кадров. Браузер останавливает
    // requestAnimationFrame, когда вкладка уходит на второй план —
    // а на сцене это значит замерший проектор в тот момент, когда
    // ведущий переключился на пульт в соседнем окне. Сторожевой таймер
    // не заменяет rAF (он грубее), но не даёт картинке застыть совсем.
    this.watchdog = window.setInterval(() => {
      const now = performance.now()
      if (now - this.lastFrameAt < 250) return
      this.lastFrameAt = now
      this.frame((now - this.t0) / 1000)
    }, 200)
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf)
    if (this.watchdog) window.clearInterval(this.watchdog)
    this.raf = 0
    this.watchdog = 0
  }

  /* ── Кадр ──────────────────────────────────────────────────── */

  private frame(t: number) {
    const ctx = this.ctx
    const { w, h, dpr } = this
    const scale = Math.min(w, h) * 0.5

    // Фазы: покой, сдвиг, яркость.
    const calmTarget =
      this.phase === "invite" || this.phase === "collecting" ? 0 : 1
    this.calm += (calmTarget - this.calm) * 0.03
    const shiftTarget = this.phase === "insights" ? -0.26 : 0
    this.shift += (shiftTarget - this.shift) * 0.05
    this.aiField += (this.aiFieldTarget - this.aiField) * 0.02

    const globalDim =
      this.phase === "invite" ? 0.32 : this.phase === "insights" ? 0.55 : 1

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // Фон: глубина двумя слоями с разным параллаксом.
    const camX = this.reduced ? 0 : Math.sin(t * 0.11) * 0.012
    const camY = this.reduced ? 0 : Math.cos(t * 0.083) * 0.009
    this.paintBackground(t, camX, camY)

    const cx = w / 2 + (camX + this.shift) * scale
    const cy = h / 2 + camY * scale
    const breathe = this.reduced ? 1 : 1 + Math.sin(t * 0.42) * 0.012 * (1 - this.calm)

    const toScreen = (nx: number, ny: number): [number, number] => [
      cx + nx * scale * breathe,
      cy + ny * scale * breathe,
    ]

    this.stepPhysics(t)

    ctx.globalCompositeOperation = "lighter"

    this.paintAiField(cx, cy, scale, globalDim)
    this.paintEdges(toScreen, scale, globalDim)
    this.paintCore(cx, cy, scale, t, globalDim)
    this.paintWaves(toScreen, scale, globalDim)
    this.paintNodes(toScreen, scale, t, globalDim)

    ctx.globalCompositeOperation = "source-over"
    this.paintLabels(toScreen, scale, globalDim)
  }

  /* ── Физика ────────────────────────────────────────────────── */

  private stepPhysics(t: number) {
    const damping = this.reduced ? 0 : 0.86
    for (const node of this.nodes.values()) {
      // Процессы подтягиваются к ядру тем сильнее, чем больше готовность
      // делегировать. Это и есть главный визуальный вывод: граница между
      // человеком и машиной видна как расстояние, а не как цвет.
      if (node.kind === "proc") {
        const k = this.aiField * Math.min(1, node.weight)
        const target =
          R_PROC_FAR - k * (R_PROC_FAR - R_PROC_NEAR) * (1 - (node.ai - 1) / 4)
        node.tx = Math.cos(node.angle) * target
        node.ty = Math.sin(node.angle) * target
      }

      if (this.reduced) {
        node.x = node.tx
        node.y = node.ty
      } else {
        const rnd = mulberry32(node.seed)
        const drift = (1 - this.calm) * 0.006
        const dx = Math.sin(t * (0.3 + rnd() * 0.2) + node.seed) * drift
        const dy = Math.cos(t * (0.26 + rnd() * 0.2) + node.seed) * drift
        node.vx += (node.tx + dx - node.x) * 0.05
        node.vy += (node.ty + dy - node.y) * 0.05
        node.vx *= damping
        node.vy *= damping
        node.x += node.vx
        node.y += node.vy
      }

      node.lit += (node.litTarget - node.lit) * 0.05
      node.pulse *= this.reduced ? 0 : 0.955
    }

    for (const w of this.waves) w.t += this.reduced ? 1 : 0.02
    this.waves = this.waves.filter((w) => w.t < 1)

    for (const e of this.edges.values()) {
      for (let i = 0; i < e.parts.length; i++) {
        e.parts[i] = (e.parts[i]! + (this.reduced ? 0 : 0.0035 + e.weight * 0.0008)) % 1
      }
    }
  }

  /* ── Слои ──────────────────────────────────────────────────── */

  private paintBackground(t: number, camX: number, camY: number) {
    const { ctx, w, h } = this
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, w, h)

    const scale = Math.min(w, h)
    // Дальний слой движется меньше — отсюда ощущение объёма.
    const blobs: Array<[number, number, number, number]> = [
      [0.5 + camX * 0.3, 0.42 + camY * 0.3, 0.75, 0.5],
      [0.22 + camX * 0.7, 0.75 + camY * 0.7, 0.42, 0.22],
      [0.82 + camX * 0.55, 0.24 + camY * 0.55, 0.36, 0.18],
    ]
    ctx.globalCompositeOperation = "lighter"
    for (const [bx, by, br, alpha] of blobs) {
      const x = bx * w
      const y = by * h
      const r = br * scale
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      const a = alpha * (0.5 + Math.sin(t * 0.2 + bx * 6) * 0.12)
      g.addColorStop(0, `rgba(51,32,74,${a})`)
      g.addColorStop(1, "rgba(51,32,74,0)")
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TAU)
      ctx.fill()
    }
  }

  /** AI-поле: входит отдельным слоем, когда появились ответы о границе. */
  private paintAiField(cx: number, cy: number, scale: number, dim: number) {
    if (this.aiField < 0.01) return
    const { ctx } = this
    const r = scale * (R_PROC_NEAR + 0.06)
    const g = ctx.createRadialGradient(cx, cy, scale * 0.06, cx, cy, r)
    const a = this.aiField * 0.1 * dim
    g.addColorStop(0, `rgba(${C.brandLit},${a})`)
    g.addColorStop(0.7, `rgba(${C.brand},${a * 0.4})`)
    g.addColorStop(1, `rgba(${C.brand},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, TAU)
    ctx.fill()

    ctx.strokeStyle = `rgba(${C.brandLit},${this.aiField * 0.16 * dim})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.92, 0, TAU)
    ctx.stroke()
  }

  private paintCore(cx: number, cy: number, scale: number, t: number, dim: number) {
    const { ctx } = this
    const pulse = this.reduced ? 0.5 : 0.5 + Math.sin(t * 0.9) * 0.12
    const r = scale * 0.075 * (0.9 + pulse * 0.2)
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    // До появления AI-поля ядро нейтральное: это центр композиции,
    // а не технология. Подпись «ИИ» здесь не появляется никогда.
    const mix = this.aiField
    const col = mix > 0 ? C.brandLit : C.fg
    g.addColorStop(0, `rgba(${col},${(0.42 + pulse * 0.2) * dim})`)
    g.addColorStop(0.35, `rgba(${col},${0.1 * dim})`)
    g.addColorStop(1, `rgba(${col},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, TAU)
    ctx.fill()
  }

  private paintEdges(
    toScreen: (x: number, y: number) => [number, number],
    scale: number,
    dim: number,
  ) {
    const { ctx } = this
    for (const e of this.edges.values()) {
      const a = this.nodes.get(e.from)
      const b = this.nodes.get(e.to)
      if (!a || !b) continue
      const [ax, ay] = toScreen(a.x, a.y)
      const [bx, by] = toScreen(b.x, b.y)
      const alpha = Math.min(0.34, 0.1 + e.weight * 0.055) * dim
      ctx.strokeStyle = `rgba(${C.fg},${alpha})`
      ctx.lineWidth = Math.min(3.2, 0.7 + e.weight * 0.45)
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.stroke()

      // Частицы: движение информации по связям.
      for (const p of e.parts) {
        const px = ax + (bx - ax) * p
        const py = ay + (by - ay) * p
        const pr = scale * 0.006
        const g = ctx.createRadialGradient(px, py, 0, px, py, pr)
        g.addColorStop(0, `rgba(${C.brandLit},${0.7 * dim})`)
        g.addColorStop(1, `rgba(${C.brandLit},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, TAU)
        ctx.fill()
      }
    }
  }

  private paintWaves(
    toScreen: (x: number, y: number) => [number, number],
    scale: number,
    dim: number,
  ) {
    const { ctx } = this
    for (const w of this.waves) {
      const [x, y] = toScreen(w.x, w.y)
      const r = scale * (0.02 + w.t * 0.14)
      ctx.strokeStyle = `rgba(${C.brandLit},${(1 - w.t) * 0.4 * dim})`
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TAU)
      ctx.stroke()
    }
  }

  private paintNodes(
    toScreen: (x: number, y: number) => [number, number],
    scale: number,
    t: number,
    dim: number,
  ) {
    const { ctx } = this
    for (const node of this.nodes.values()) {
      const [x, y] = toScreen(node.x, node.y)
      // Погашенный узел всё равно виден: созвездие до рассвета.
      const base = node.kind === "dir" ? 0.012 : 0.009
      const grow = node.weight > 0 ? Math.sqrt(node.weight) * 0.006 : 0
      const r = scale * (base + grow) * (1 + node.pulse * 0.5)

      const litness = 0.12 + node.lit * 0.88
      // Узлы, которые люди оставляют себе, держат бордовую обводку —
      // цвет здесь только подсказка, работает расстояние.
      const human = node.kind === "proc" && node.ai >= 3.6 && node.lit > 0.3
      const col = human ? C.brand : node.lit > 0.3 ? C.fg : C.dim

      const glow = scale * (base + grow) * 3.4
      const g = ctx.createRadialGradient(x, y, 0, x, y, glow)
      g.addColorStop(0, `rgba(${col},${0.5 * litness * dim})`)
      g.addColorStop(0.4, `rgba(${col},${0.12 * litness * dim})`)
      g.addColorStop(1, `rgba(${col},0)`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, glow, 0, TAU)
      ctx.fill()

      ctx.fillStyle = `rgba(${col},${(0.55 + node.lit * 0.45) * dim})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TAU)
      ctx.fill()

      // Орбитальная пыль вокруг нагруженных узлов.
      if (node.weight >= 2 && !this.reduced) {
        const count = Math.min(6, node.weight)
        for (let i = 0; i < count; i++) {
          const a = t * 0.6 + (i / count) * TAU + node.seed
          const rr = r * 3 + Math.sin(t + i) * r * 0.4
          const px = x + Math.cos(a) * rr
          const py = y + Math.sin(a) * rr
          ctx.fillStyle = `rgba(${col},${0.22 * dim})`
          ctx.beginPath()
          ctx.arc(px, py, scale * 0.0022, 0, TAU)
          ctx.fill()
        }
      }
    }
  }

  private paintLabels(
    toScreen: (x: number, y: number) => [number, number],
    scale: number,
    dim: number,
  ) {
    const { ctx } = this
    // Подписи проступают, когда сеть успокаивается: во время сборки
    // они создавали бы шум и мешали смотреть на движение.
    const show = Math.max(this.calm, this.phase === "collecting" ? 0.35 : 0)
    if (show < 0.05) return

    const size = Math.max(11, Math.round(scale * 0.032))
    ctx.font = `500 ${size}px Inter, system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (const node of this.nodes.values()) {
      if (node.lit < 0.25) continue
      const [x, y] = toScreen(node.x, node.y)
      const off = scale * (node.kind === "dir" ? 0.055 : 0.05)
      const ly = y + (node.y >= 0 ? off : -off)
      const alpha = show * (0.4 + node.lit * 0.6) * dim

      ctx.fillStyle = `rgba(${C.fg},${alpha})`
      ctx.fillText(node.label, x, ly)

      if (node.weight > 1) {
        ctx.font = `500 ${Math.round(size * 0.78)}px "JetBrains Mono", ui-monospace, monospace`
        ctx.fillStyle = `rgba(${C.dim},${alpha * 0.85})`
        ctx.fillText(String(node.weight), x, ly + size * 1.05)
        ctx.font = `500 ${size}px Inter, system-ui, sans-serif`
      }
    }
  }
}
