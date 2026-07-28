// Конфиг Telegram-доставки анкеты «Соболёк».
//
// Сначала пробуем выделенные переменные SOBOL_BRIEF_BOT_TOKEN /
// SOBOL_BRIEF_CHAT_ID (если для проекта заведут отдельного бота),
// затем откатываемся на штатные TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
// студийного бота — они уже настроены на проде, поэтому анкета
// работает без дополнительной конфигурации.
// Сама отправка (sendMessage + sendDocument) переиспользуется из
// @/lib/karandash-brief/telegram — она не привязана к конкретному боту.

import type { TelegramConfig } from "@/lib/karandash-brief/telegram";

export function getSobolekTelegramConfig(): TelegramConfig | null {
  const token = process.env.SOBOL_BRIEF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.SOBOL_BRIEF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;
  return { token, chatId };
}
