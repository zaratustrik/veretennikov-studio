/**
 * Telegram Bot API client for brief notifications.
 *
 * 152-ФЗ: уведомление НАМЕРЕННО не содержит персональных данных заявителя
 * (имя, email, телефон, Telegram, свободный текст) — Telegram является
 * иностранным сервисом, и передача ПДн в него означала бы трансграничную
 * передачу с отдельным согласием и уведомлением Роскомнадзора. Поэтому в
 * сообщение попадают только неперсональные атрибуты заявки (тип, формат,
 * срок, бюджет — значения из закрытых списков) и ссылка на админку, где
 * данные и живут (сервер в РФ).
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

export interface BriefNotification {
  id: string
  type: "VIDEO" | "AI" | "UNSURE"
  /** Метка источника (например, «/sospp») — не ПДн. */
  source?: string | null
  // Только неперсональные атрибуты из закрытых списков формы:
  format?: string | null
  duration?: string | null
  deadline?: string | null
  budget?: string | null
  ndaNeeded?: boolean
  // Computed
  baseUrl: string
}

function buildBriefMessage(b: BriefNotification): string {
  const head =
    `● <b>Новый бриф · ${TYPE_LABEL[b.type] ?? b.type}</b>\n` +
    (b.source ? `<i>${escapeHtml(b.source)}</i>\n` : "")

  const attrs = [
    line("Формат", b.format),
    line("Длительность", b.duration),
    line("Срок", b.deadline),
    line("Бюджет", b.budget),
    b.ndaNeeded ? "<b>NDA:</b> да, нужен до брифа\n" : "",
  ].join("")

  const link = `\n<a href="${b.baseUrl}/admin/briefs/${b.id}">Открыть в админке →</a>\n<i>Контакты и детали — только в админке (152-ФЗ).</i>`

  return head + (attrs ? "\n" + attrs : "") + link
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
