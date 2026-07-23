import { NextResponse } from "next/server";
import { ACCESS_COOKIE, isAccessConfigured, verifyCookieToken } from "@/lib/karandash-brief/access";
import { rateLimit } from "@/lib/karandash-brief/rateLimit";
import { MAX_PAYLOAD_BYTES, sanitizeAnswers } from "@/lib/karandash-brief/sanitize";
import { buildMarkdown, briefFileBase } from "@/lib/karandash-brief/markdown";
import { buildSummary } from "@/lib/karandash-brief/summary";
import { completionPercent } from "@/lib/karandash-brief/values";
import {
  buildTelegramSummary,
  getTelegramConfig,
  sendBriefToTelegram
} from "@/lib/karandash-brief/telegram";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function readCookie(request: Request, name: string): string | undefined {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function POST(request: Request) {
  // 1. Rate limit
  const limit = rateLimit(`brief:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Слишком много отправок подряд. Подождите немного." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  // 2. Проверка доступа (если код настроен)
  if (isAccessConfigured() && !verifyCookieToken(readCookie(request, ACCESS_COOKIE))) {
    return NextResponse.json(
      { ok: false, error: "Доступ истёк. Обновите страницу и введите код заново." },
      { status: 401 }
    );
  }

  // 3. Ограничение размера
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Слишком большой запрос" }, { status: 413 });
  }

  const rawText = await request.text();
  if (rawText.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Слишком большой запрос" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;

  // 4. Honeypot
  if (typeof payload.website === "string" && payload.website.trim().length > 0) {
    // тихо принимаем, но ничего не отправляем
    return NextResponse.json({ ok: true, delivered: false, reason: "ignored" });
  }

  // 5. Серверная санитизация и пересборка (не доверяем клиентскому markdown)
  const answers = sanitizeAnswers(payload.answers);
  if (Object.keys(answers).length === 0) {
    return NextResponse.json({ ok: false, error: "Бриф пуст" }, { status: 400 });
  }

  const filledAt = new Date();
  const markdown = buildMarkdown(answers, filledAt.toISOString());
  const summary = buildSummary(answers);
  const completion = completionPercent(answers);
  const filename = `${briefFileBase(filledAt)}.md`;

  // 6. Отправка в Telegram
  const cfg = getTelegramConfig();
  if (!cfg) {
    // Хостинг/окружение без Telegram — честный fallback на локальный экспорт.
    return NextResponse.json({
      ok: false,
      delivered: false,
      reason: "telegram_not_configured"
    });
  }

  const telegramSummary = buildTelegramSummary(summary, completion);
  const result = await sendBriefToTelegram(cfg, telegramSummary, markdown, filename);

  if (!result.ok) {
    // Не логируем токены и полные ПДн; только техническую причину.
    console.error("Karandash brief telegram delivery failed:", result.reason);
    return NextResponse.json({ ok: false, delivered: false, reason: "telegram_error" });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
