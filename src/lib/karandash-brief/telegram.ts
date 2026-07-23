// Серверная отправка брифа «Карандаш» в Telegram.
//
// ВАЖНО: используются ВЫДЕЛЕННЫЕ переменные окружения, а НЕ общие
// TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID — последние уже заняты штатным
// брифингом студии (src/lib/telegram.ts, бот @VeretennikovBriefBot).
// Переопределение общих переменных сломало бы существующий брифинг,
// поэтому у брифа «Карандаш» — свой бот (@roma_karandash_bot) и свои vars.
//
// Токен читается только из env и никогда не логируется.

export type TelegramConfig = { token: string; chatId: string };

export function getTelegramConfig(): TelegramConfig | null {
  const token = process.env.KARANDASH_BRIEF_BOT_TOKEN;
  const chatId = process.env.KARANDASH_BRIEF_CHAT_ID;
  if (!token || !chatId) return null;
  return { token, chatId };
}

export type SendResult = { ok: true } | { ok: false; reason: string };

const TIMEOUT_MS = 12_000;

async function tgFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Отправляет краткое текстовое резюме и .md-файл в Telegram. */
export async function sendBriefToTelegram(
  cfg: TelegramConfig,
  summaryText: string,
  markdown: string,
  filename: string
): Promise<SendResult> {
  try {
    const msgRes = await tgFetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text: summaryText,
        disable_web_page_preview: true
      })
    });

    if (!msgRes.ok) {
      return { ok: false, reason: `sendMessage ${msgRes.status}` };
    }

    const form = new FormData();
    form.append("chat_id", cfg.chatId);
    form.append("caption", "Полный бриф во вложении");
    form.append("document", new Blob([markdown], { type: "text/markdown" }), filename);

    const docRes = await tgFetch(`https://api.telegram.org/bot${cfg.token}/sendDocument`, {
      method: "POST",
      body: form
    });

    if (!docRes.ok) {
      return { ok: false, reason: `sendDocument ${docRes.status}` };
    }

    return { ok: true };
  } catch (err) {
    const reason = err instanceof Error && err.name === "AbortError" ? "timeout" : "network";
    return { ok: false, reason };
  }
}

/** Короткое резюме для текстового сообщения (без чувствительных техданных). */
export function buildTelegramSummary(summary: Record<string, string>, completion: number): string {
  const lines = ["📋 Новый бриф по сайту «Карандаш»", "", `Заполнено: ${completion}%`, ""];
  for (const [key, value] of Object.entries(summary)) {
    lines.push(`• ${key}: ${truncate(value, 200)}`);
  }
  return lines.join("\n");
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
