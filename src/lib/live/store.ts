import "server-only"

import { appendFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { randomBytes } from "node:crypto"
import path from "node:path"

import { demoAnswersAt, demoConnectedAt } from "./demo"
import { isAiRole, isDirId, isProcId } from "./taxonomy"
import { completeAnswers } from "./types"
import type { LiveState, PartialAnswer, Phase, SessionMode } from "./types"

/**
 * Состояние live-сессии.
 *
 * Живёт в памяти процесса. Это законно: прод — один экземпляр pm2
 * в fork-режиме, все запросы обслуживает тот же процесс. Ни Redis,
 * ни базы для одной сессии на четыре минуты не нужно.
 *
 * Страховка от перезапуска — дозапись событий в JSONL рядом с приложением.
 * При старте процесса самая свежая сессия поднимается обратно.
 * Схему Prisma сознательно не трогаем: `db push` на боевом сервере
 * за двое суток до выступления — несоразмерный риск.
 *
 * Демо и live никогда не смешиваются: переключение режима создаёт
 * новую сессию. Виртуальные ответы вычисляются из сценария по времени
 * и в файл не пишутся.
 */

export type Session = {
  id: string
  mode: SessionMode
  phase: Phase
  phaseNonce: number
  closed: boolean
  createdAt: number
  /** Реальные записи по участникам. В демо-сессии всегда пусто. */
  records: Map<string, PartialAnswer>
  /** pid'ы, открывшие страницу участника. */
  connected: Set<string>
  /** pid'ы, сделавшие первый выбор. */
  started: Set<string>
  qrSvg: string
  demoStartedAt?: number
}

type Store = {
  current: Session | null
  restored: boolean
}

const g = globalThis as unknown as { __utppLive?: Store }
const store: Store = (g.__utppLive ??= { current: null, restored: false })

const DATA_DIR = process.env.UTPP_LIVE_DIR ?? path.join(process.cwd(), ".data", "live")

/* ── Идентификаторы ──────────────────────────────────────────── */

/** Без похожих символов: код читают глазами и диктуют голосом. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function shortId(len = 6): string {
  const bytes = randomBytes(len)
  let out = ""
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i]! % ALPHABET.length]
  return out
}

/* ── Хранение на диске ───────────────────────────────────────── */

type Event =
  | { t: "meta"; id: string; mode: SessionMode; at: number }
  | { t: "answer"; a: PartialAnswer }
  | { t: "phase"; phase: Phase; nonce: number }
  | { t: "closed"; closed: boolean }

function fileFor(id: string) {
  return path.join(DATA_DIR, `${id}.jsonl`)
}

async function persist(id: string, ev: Event) {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    await appendFile(fileFor(id), JSON.stringify(ev) + "\n", "utf8")
    await writeFile(path.join(DATA_DIR, "current.txt"), id, "utf8")
  } catch {
    // Диск недоступен — не роняем показ. Память остаётся источником правды.
  }
}

/** Поднять последнюю сессию после перезапуска процесса. */
async function restore(): Promise<void> {
  if (store.restored) return
  store.restored = true
  try {
    const id = (await readFile(path.join(DATA_DIR, "current.txt"), "utf8")).trim()
    if (!id) return
    const raw = await readFile(fileFor(id), "utf8")
    let s: Session | null = null
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue
      const ev = JSON.parse(line) as Event
      if (ev.t === "meta") {
        s = {
          id: ev.id,
          mode: ev.mode,
          phase: "invite",
          phaseNonce: 0,
          closed: false,
          createdAt: ev.at,
          records: new Map(),
          connected: new Set(),
          started: new Set(),
          qrSvg: "",
        }
      } else if (!s) {
        continue
      } else if (ev.t === "answer") {
        const prev = s.records.get(ev.a.pid)
        s.records.set(ev.a.pid, { ...prev, ...ev.a })
        s.connected.add(ev.a.pid)
        s.started.add(ev.a.pid)
      } else if (ev.t === "phase") {
        s.phase = ev.phase
        s.phaseNonce = ev.nonce
      } else if (ev.t === "closed") {
        s.closed = ev.closed
      }
    }
    if (s) {
      s.qrSvg = await renderQr(s.id)
      store.current = s
    }
  } catch {
    // Нечего восстанавливать — это нормальный первый запуск.
  }
}

/** Список сохранённых сессий — только для диагностики. */
export async function listSessions(): Promise<string[]> {
  try {
    const files = await readdir(DATA_DIR)
    return files.filter((f) => f.endsWith(".jsonl")).map((f) => f.replace(/\.jsonl$/, ""))
  } catch {
    return []
  }
}

/* ── QR ──────────────────────────────────────────────────────── */

export function participantUrl(id: string): string {
  const base = process.env.UTPP_LIVE_ORIGIN ?? "https://veretennikov.info"
  return `${base}/live/${id}`
}

/**
 * QR рисуется на сервере один раз при создании сессии и дальше отдаётся
 * как готовая строка SVG. На экране нет ни библиотеки, ни вычислений —
 * значит нечему падать в момент показа.
 */
async function renderQr(id: string): Promise<string> {
  const { toString } = await import("qrcode")
  return toString(participantUrl(id), {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#170C21", light: "#F6F3ED" },
  })
}

/* ── Операции ────────────────────────────────────────────────── */

export async function newSession(mode: SessionMode = "live"): Promise<Session> {
  const id = shortId()
  const s: Session = {
    id,
    mode,
    phase: "invite",
    phaseNonce: 0,
    closed: false,
    createdAt: Date.now(),
    records: new Map(),
    connected: new Set(),
    started: new Set(),
    qrSvg: await renderQr(id),
    demoStartedAt: mode === "demo" ? Date.now() : undefined,
  }
  store.current = s
  store.restored = true
  await persist(id, { t: "meta", id, mode, at: s.createdAt })
  return s
}

export async function currentSession(): Promise<Session | null> {
  await restore()
  return store.current
}

/** Сессия по идентификатору: телефон не должен попасть в чужую или старую. */
export async function sessionById(id: string): Promise<Session | null> {
  const s = await currentSession()
  return s && s.id === id ? s : null
}

export async function ensureSession(): Promise<Session> {
  return (await currentSession()) ?? (await newSession("live"))
}

export function join(s: Session, pid: string): void {
  if (s.mode === "demo") return
  s.connected.add(pid)
}

export type AnswerInput = {
  pid: string
  direction?: unknown
  process?: unknown
  aiRole?: unknown
}

/**
 * Запись ответа. Телефон присылает шаги по мере выбора, поэтому патч
 * может быть частичным. Дедупликация по pid: повторное прохождение
 * заменяет прежний выбор, а не добавляет второй узел.
 */
export async function submitAnswer(
  s: Session,
  input: AnswerInput,
): Promise<{ ok: boolean; reason?: string }> {
  if (s.mode === "demo") return { ok: false, reason: "demo" }
  if (s.closed) return { ok: false, reason: "closed" }

  const patch: PartialAnswer = { pid: input.pid, at: Date.now() }
  if (input.direction !== undefined) {
    if (!isDirId(input.direction)) return { ok: false, reason: "bad-direction" }
    patch.direction = input.direction
  }
  if (input.process !== undefined) {
    if (!isProcId(input.process)) return { ok: false, reason: "bad-process" }
    patch.process = input.process
  }
  if (input.aiRole !== undefined) {
    if (!isAiRole(input.aiRole)) return { ok: false, reason: "bad-ai-role" }
    patch.aiRole = input.aiRole
  }
  if (!patch.direction && !patch.process && !patch.aiRole) {
    return { ok: false, reason: "empty" }
  }

  const prev = s.records.get(input.pid)
  const merged: PartialAnswer = { ...prev, ...patch, pid: input.pid, at: patch.at }
  s.records.set(input.pid, merged)
  s.connected.add(input.pid)
  s.started.add(input.pid)
  await persist(s.id, { t: "answer", a: merged })
  return { ok: true }
}

/** Первый выбор сделан — участник в работе, но ещё не закончил. */
export function markStarted(s: Session, pid: string): void {
  if (s.mode === "demo") return
  s.connected.add(pid)
  s.started.add(pid)
}

export async function setPhase(s: Session, phase: Phase): Promise<void> {
  s.phase = phase
  s.phaseNonce += 1
  await persist(s.id, { t: "phase", phase, nonce: s.phaseNonce })
}

export async function setClosed(s: Session, closed: boolean): Promise<void> {
  s.closed = closed
  await persist(s.id, { t: "closed", closed })
}

/** Сброс ответов без смены сессии: QR у зала остаётся рабочим. */
export async function resetAnswers(s: Session): Promise<void> {
  s.records.clear()
  s.connected.clear()
  s.started.clear()
  s.closed = false
  s.phase = "invite"
  s.phaseNonce += 1
  s.demoStartedAt = s.mode === "demo" ? Date.now() : undefined
  await persist(s.id, { t: "meta", id: s.id, mode: s.mode, at: Date.now() })
}

/* ── Снимок для экрана ───────────────────────────────────────── */

export function snapshot(s: Session): LiveState {
  const now = Date.now()
  const isDemo = s.mode === "demo"
  const records: PartialAnswer[] = isDemo
    ? demoAnswersAt(s.demoStartedAt ?? s.createdAt, now)
    : [...s.records.values()]
  const answers = completeAnswers(records)
  const connected = isDemo
    ? demoConnectedAt(s.demoStartedAt ?? s.createdAt, now)
    : s.connected.size

  return {
    sessionId: s.id,
    mode: s.mode,
    phase: s.phase,
    phaseNonce: s.phaseNonce,
    records,
    answers,
    connected,
    started: isDemo ? records.length : s.started.size,
    completed: answers.length,
    closed: s.closed,
    serverTime: now,
  }
}
