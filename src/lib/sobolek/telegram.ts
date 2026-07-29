// Конфиг Telegram-доставки анкеты «Соболёк».
//
// Порядок выбора канала (пустые значения считаются незаданными):
//   1. SOBOL_BRIEF_BOT_TOKEN / SOBOL_BRIEF_CHAT_ID — выделенный бот проекта,
//      если его заведут в .env.production;
//   2. TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID — штатный бот студии
//      (@VeretennikovBriefBot). ВНИМАНИЕ: на проде эти переменные сейчас
//      объявлены, но ПУСТЫЕ — полагаться только на них нельзя;
//   3. KARANDASH_BRIEF_BOT_TOKEN / KARANDASH_BRIEF_CHAT_ID — бот брифа
//      «Карандаш»: единственный канал, реально настроенный и проверенный
//      на проде. Доставляет тому же получателю (владельцу студии).
// Сама отправка (sendMessage + sendDocument) переиспользуется из
// @/lib/karandash-brief/telegram — она не привязана к конкретному боту.

import type { TelegramConfig } from "@/lib/karandash-brief/telegram";

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  return values.find((v) => typeof v === "string" && v.trim().length > 0);
}

export function getSobolekTelegramConfig(): TelegramConfig | null {
  const token = firstNonEmpty(
    process.env.SOBOL_BRIEF_BOT_TOKEN,
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.KARANDASH_BRIEF_BOT_TOKEN
  );
  const chatId = firstNonEmpty(
    process.env.SOBOL_BRIEF_CHAT_ID,
    process.env.TELEGRAM_CHAT_ID,
    process.env.KARANDASH_BRIEF_CHAT_ID
  );
  if (!token || !chatId) return null;
  return { token, chatId };
}
