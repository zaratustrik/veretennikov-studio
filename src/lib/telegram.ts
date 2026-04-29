/**
 * Telegram Bot API client for brief notifications.
 *
 * Setup:
 *   1. Create bot via @BotFather, save the token.
 *   2. Send any message to the bot, then GET
 *      https://api.telegram.org/bot<TOKEN>/getUpdates
 *      to find your chat.id.
 *   3. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in env.
 *
 * If env vars are missing, notify*() functions return silently —
 * the brief flow is never blocked by Telegram outages.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

const TYPE_LABEL: Record<string, string> = {
  VIDEO: "Видеопродакшн",
  AI: "Разработка / AI",
  UNSURE: "Не уверен — обсудим",
}

function escapeHtml(s: string): string {
  // Telegram HTML parse_mode requires escaping <, >, &
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function line(label: string, value: string | undefined | null): string {
  if (!value || !value.trim()) return ""
  return `<b>${label}:</b> ${escapeHtml(value.trim())}\n`
}

function block(title: string, body: string): string {
  if (!body.trim()) return ""
  return `\n<i>${title}</i>\n${body}`
}

export interface BriefNotification {
  id: string
  type: "VIDEO" | "AI" | "UNSURE"
  name: string
  position?: string | null
  company?: string | null
  email: string
  phone?: string | null
  telegram?: string | null
  // Project
  format?: string | null
  projectTitle?: string | null
  mainIdea?: string | null
  audience?: string | null
  showWhere?: string | null
  duration?: string | null
  // Constraints
  deadline?: string | null
  budget?: string | null
  ndaNeeded?: boolean
  // Refs
  references?: string | null
  // Computed
  baseUrl: string
}

function buildBriefMessage(b: BriefNotification): string {
  const head =
    `● <b>Новый бриф · ${TYPE_LABEL[b.type] ?? b.type}</b>\n` +
    `<b>${escapeHtml(b.name)}</b>` +
    (b.position ? `, ${escapeHtml(b.position)}` : "") +
    (b.company ? ` · ${escapeHtml(b.company)}` : "") +
    `\n<code>${escapeHtml(b.email)}</code>` +
    (b.phone ? ` · ${escapeHtml(b.phone)}` : "") +
    (b.telegram ? ` · TG ${escapeHtml(b.telegram)}` : "") +
    "\n"

  const project = block(
    "Задача",
    [
      line("Формат", b.format),
      line("Название", b.projectTitle),
      line("Главная идея", b.mainIdea),
      line("Аудитория", b.audience),
      line("Где будет показано", b.showWhere),
      line("Длительность", b.duration),
    ].join(""),
  )

  const constraints = block(
    "Сроки и бюджет",
    [
      line("Срок", b.deadline),
      line("Бюджет", b.budget),
      b.ndaNeeded ? "<b>NDA:</b> да, нужен до брифа\n" : "",
    ].join(""),
  )

  const refs = block("Референсы", line("Ссылки", b.references))

  const link = `\n<a href="${b.baseUrl}/admin/briefs/${b.id}">Открыть в админке →</a>`

  let msg = head + project + constraints + refs + link
  // Telegram message limit is 4096 chars
  if (msg.length > 4000) {
    msg = msg.slice(0, 3990) + "…\n\n" + link
  }
  return msg
}

async function sendMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return // silent skip

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.error("[telegram] sendMessage failed:", res.status, body)
    }
  } catch (e) {
    console.error("[telegram] sendMessage error:", e)
  }
}

export async function notifyBrief(b: BriefNotification): Promise<void> {
  await sendMessage(buildBriefMessage(b))
}
