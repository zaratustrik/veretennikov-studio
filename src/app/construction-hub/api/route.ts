import { NextRequest, NextResponse } from "next/server"
import { authenticate, COOKIE, digest, HubError, id, limit, mutate, readState, sessionFor, TTL, view } from "@/lib/construction-hub/store"
import { statuses, type Collection, type HubRecord, type Invite } from "@/lib/construction-hub/types"
import { randomBytes } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const response = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" } })
function text(value: unknown, max: number, required = false) {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new HubError("Проверьте заполненные поля и длину текста.")
  return value.trim()
}
function collection(value: unknown): Collection {
  if (value !== "decisions" && value !== "tasks" && value !== "topics" && value !== "agenda") throw new HubError("Неизвестный раздел.")
  return value
}
function organizer(person: Invite) { if (person.role !== "organizer") throw new HubError("Это действие доступно организатору.", 403) }
function externalChat(value: unknown) {
  const url = text(value, 500)
  if (!url) return ""
  let parsed: URL
  try { parsed = new URL(url) } catch { throw new HubError("Укажите полную ссылку на группу.") }
  if (parsed.protocol !== "https:" || !["t.me", "telegram.me", "chat.whatsapp.com", "max.ru"].includes(parsed.hostname) || parsed.username || parsed.password) throw new HubError("Подойдёт HTTPS-ссылка на группу Telegram, WhatsApp или MAX.")
  return parsed.href
}
function failure(error: unknown) {
  if (error instanceof HubError) return response({ error: error.message }, error.status)
  console.error("construction-hub request failed", error instanceof Error ? error.message : "unknown")
  return response({ error: "Не удалось сохранить изменение. Попробуйте ещё раз." }, 500)
}
export async function GET(request: NextRequest) {
  try {
    const person = await authenticate(request.cookies.get(COOKIE)?.value)
    if (!person) return response({ error: "Войдите по приглашению организатора." }, 401)
    return response(view(await readState(), person))
  } catch (error) { return failure(error) }
}
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin")
    if (!origin || new URL(origin).host !== request.headers.get("host")) throw new HubError("Откройте площадку и повторите действие.", 403)
    const raw = await request.text()
    if (raw.length > 24_000) throw new HubError("Сообщение слишком большое.", 413)
    let input: Record<string, unknown>
    try { input = JSON.parse(raw) } catch { throw new HubError("Не удалось прочитать данные.") }
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new HubError("Некорректные данные.")
    if (input.action === "login") {
      limit(`login:${digest(request.headers.get("x-forwarded-for") || "local")}`, 12)
      const token = text(input.token, 100, true)
      const state = await readState()
      const person = state.invites.find(p => p.active && p.hash === digest(token))
      if (!person) throw new HubError("Приглашение не найдено или отозвано.", 401)
      const result = response({ ok: true })
      result.cookies.set(COOKIE, await sessionFor(person), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/construction-hub", maxAge: TTL })
      return result
    }
    const person = await authenticate(request.cookies.get(COOKIE)?.value)
    if (!person) throw new HubError("Войдите по приглашению организатора.", 401)
    limit(`write:${person.id}:${digest(request.headers.get("x-forwarded-for") || "local")}`)
    if (input.action === "share") {
      organizer(person)
      const token = (await readFile(path.join(process.env.CONSTRUCTION_HUB_DIR || path.join(process.cwd(), ".data", "construction-hub"), "colleagues.key"), "utf8")).trim()
      const state = await readState()
      if (!state.invites.some(p => p.active && p.role === "member" && p.hash === digest(token))) throw new HubError("Ссылка коллег ещё не настроена.", 503)
      return response({ token })
    }
    if (input.action === "logout") {
      const result = response({ ok: true }); result.cookies.set(COOKIE, "", { path: "/construction-hub", maxAge: 0 }); return result
    }
    const result = await mutate(state => {
      // Re-check revocation while holding the mutation lock.
      if (!state.invites.some(p => p.id === person.id && p.active)) throw new HubError("Приглашение отозвано.", 401)
      const now = new Date().toISOString()
      const author = person.role === "organizer" ? person.name : text(input.author || "Коллега", 100, true)
      const recordHistory = (message: string) => state.history.push({ at: now, author, text: message })
      if (input.action === "comment") {
        const target = text(input.target ?? "general", 80)
        if (target !== "general" && ![...state.topics, ...state.decisions, ...state.tasks, ...state.agenda].some(r => r.id === target)) throw new HubError("Тема обсуждения больше не существует.")
        if (state.comments.length >= 5000) throw new HubError("Обсуждение достигло лимита. Обратитесь к организатору.")
        state.comments.push({ id: id(), authorId: person.id, author, body: text(input.body, 4000, true), target, createdAt: now })
        recordHistory("Добавлен комментарий")
      } else if (input.action === "propose") {
        if (state.topics.length >= 250) throw new HubError("Слишком много тем. Обратитесь к организатору.")
        state.topics.push({ id: id(), title: text(input.title, 180, true), body: text(input.body, 4000, true), status: "Предложение", owner: author, due: "", updatedAt: now })
        recordHistory("Предложена тема")
      } else if (input.action === "save") {
        organizer(person)
        const key = collection(input.collection)
        const recordId = input.id ? text(input.id, 40) : id()
        const existing = state[key].find(r => r.id === recordId)
        if (input.id && !existing) throw new HubError("Запись больше не существует.", 409)
        if (existing && input.updatedAt !== existing.updatedAt) throw new HubError("Запись уже изменена. Обновите страницу и повторите правку.", 409)
        const status = text(input.status, 60, true)
        if (!(statuses[key] as readonly string[]).includes(status)) throw new HubError("Выберите статус из списка.")
        const due = text(input.due ?? "", 10)
        if (due && (!/^\d{4}-\d{2}-\d{2}$/.test(due) || !Number.isFinite(Date.parse(due)))) throw new HubError("Проверьте дату.")
        const record: HubRecord = { id: recordId, title: text(input.title, 180, true), body: text(input.body, 6000), status, owner: text(input.owner, 160), due, updatedAt: now }
        if (key === "agenda") { const minutes = Number(input.minutes); if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) throw new HubError("Длительность должна быть от 1 до 180 минут."); record.minutes = minutes }
        if (existing) state[key] = state[key].map(r => r.id === recordId ? record : r)
        else { if (state[key].length >= 250) throw new HubError("Достигнут лимит записей."); state[key].push(record) }
        recordHistory(`${existing ? "Обновлено" : "Добавлено"}: ${record.title}`)
      } else if (input.action === "delete") {
        organizer(person); const key = collection(input.collection); const record = state[key].find(r => r.id === input.id)
        if (!record || record.updatedAt !== input.updatedAt) throw new HubError("Обновите страницу перед удалением.", 409)
        state[key] = state[key].filter(r => r.id !== input.id); recordHistory(`Удалено: ${record.title}`)
      } else if (input.action === "meta") {
        organizer(person)
        if (input.updatedAt !== state.updatedAt) throw new HubError("Данные уже изменились. Обновите страницу перед сохранением.", 409)
        state.meta = { title: text(input.title, 160, true), goal: text(input.goal, 1000, true), date: text(input.date, 200), venue: text(input.venue, 200), audience: text(input.audience, 500), chatUrl: externalChat(input.chatUrl), messenger: text(input.messenger, 40) }
        recordHistory("Обновлены параметры мероприятия")
      } else if (input.action === "check") {
        organizer(person); const checkId = text(input.id, 80, true)
        if (!/^[a-z0-9-]+$/.test(checkId) || typeof input.value !== "boolean") throw new HubError("Некорректный пункт.")
        state.checks[checkId] = input.value; recordHistory("Обновлен чек-лист")
      } else if (input.action === "invite") {
        organizer(person)
        if (state.invites.length >= 200) throw new HubError("Достигнут лимит приглашений.")
        const token = randomBytes(32).toString("base64url")
        state.invites.push({ id: id(), name: text(input.name, 100, true), role: "member", hash: digest(token), active: true, createdAt: now })
        recordHistory("Создано приглашение участника")
        return { token }
      } else if (input.action === "revoke") {
        organizer(person)
        const invited = state.invites.find(p => p.id === input.id)
        if (!invited || invited.role === "organizer") throw new HubError("Можно отозвать приглашение коллеги.")
        invited.active = false; recordHistory(`Отозван доступ: ${invited.name}`)
      } else throw new HubError("Неизвестное действие.")
      return { ok: true }
    })
    return response(result)
  } catch (error) { return failure(error) }
}
