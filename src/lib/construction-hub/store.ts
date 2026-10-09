import "server-only"
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import type { HubState, HubView, Invite } from "./types"

const directory = () => process.env.CONSTRUCTION_HUB_DIR || path.join(process.cwd(), ".data", "construction-hub")
const file = () => path.join(directory(), "state.json")
export const COOKIE = "construction-hub-session"
export const TTL = 60 * 60 * 24 * 14
export class HubError extends Error { constructor(message: string, public status = 400) { super(message) } }
export const digest = (value: string) => createHash("sha256").update(value).digest("hex")
export const id = () => randomBytes(12).toString("hex")
export async function readState(): Promise<HubState> {
  try { return JSON.parse(await readFile(file(), "utf8")) as HubState }
  catch { throw new HubError("Площадка пока не настроена. Организатор скоро откроет доступ.", 503) }
}
async function key() { return (await readFile(path.join(directory(), "secret.key"), "utf8")).trim() }
export async function sessionFor(person: Invite) {
  const value = Buffer.from(JSON.stringify({ id: person.id, exp: Date.now() + TTL * 1000 })).toString("base64url")
  return `${value}.${createHmac("sha256", await key()).update(value).digest("hex")}`
}
export async function authenticate(cookie?: string): Promise<Invite | null> {
  if (!cookie || cookie.length > 512) return null
  try {
    const [value, signature] = cookie.split(".")
    if (!value || !signature || !/^[a-f0-9]{64}$/.test(signature)) return null
    const expected = createHmac("sha256", await key()).update(value).digest()
    if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return null
    const data = JSON.parse(Buffer.from(value, "base64url").toString())
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null
    return (await readState()).invites.find(p => p.id === data.id && p.active) || null
  } catch { return null }
}
export function view(state: HubState, person: Invite): HubView {
  const { invites, ...rest } = state
  const people = invites.filter(p => person.role === "organizer" || p.active).map(({ hash: _hash, ...p }) => p)
  const { hash: _hash, ...viewer } = person
  return { ...rest, people, viewer }
}

// The deployed app uses one VM. Exclusive filesystem locking and atomic rename
// prevent lost updates across simultaneous requests and process reloads.
export async function mutate<T>(fn: (state: HubState) => T | Promise<T>): Promise<T> {
  await mkdir(directory(), { recursive: true })
  const lock = path.join(directory(), "write.lock")
  let acquired = false
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await mkdir(lock); acquired = true; break }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error
      try {
        if (Date.now() - (await stat(lock)).mtimeMs > 60_000) await rm(lock, { recursive: true, force: true })
      } catch (staleError) {
        if ((staleError as NodeJS.ErrnoException).code !== "ENOENT") throw staleError
      }
      await new Promise(resolve => setTimeout(resolve, 80))
    }
  }
  if (!acquired) throw new HubError("Сейчас сохраняется другое изменение. Повторите через несколько секунд.", 503)
  try {
    const state = await readState()
    const result = await fn(state)
    const before = await readFile(file(), "utf8")
    state.updatedAt = new Date().toISOString()
    state.history = state.history.slice(-200)
    const temporary = path.join(directory(), `${id()}.tmp`)
    await writeFile(path.join(directory(), "previous.json"), before, { mode: 0o600 })
    await writeFile(temporary, JSON.stringify(state, null, 2), { mode: 0o600 })
    await rename(temporary, file())
    return result
  } finally { await rm(lock, { recursive: true, force: true }) }
}

const limits = new Map<string, { count: number; until: number }>()
export function limit(key: string, maximum = 25) {
  const now = Date.now()
  for (const [k, v] of limits) if (v.until < now) limits.delete(k)
  const value = limits.get(key) || { count: 0, until: now + 60_000 }
  value.count++; limits.set(key, value)
  if (value.count > maximum) throw new HubError("Слишком много действий. Подождите минуту.", 429)
}
