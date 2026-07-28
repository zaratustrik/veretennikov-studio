import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/karandash-brief/rateLimit";
import { sendBriefToTelegram } from "@/lib/karandash-brief/telegram";
import { MAX_PAYLOAD_BYTES, sanitizeAnswers } from "@/lib/sobolek/sanitize";
import { buildMarkdown, buildSummary, briefFileBase } from "@/lib/sobolek/markdown";
import { getSobolekTelegramConfig } from "@/lib/sobolek/telegram";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  // 1. Rate limit: 5 отправок за 10 минут с одного IP
  const limit = rateLimit(`sobolek:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Слишком много отправок подряд. Подождите немного." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  // 2. Ограничение размера
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

  // 3. Honeypot: заполненное скрытое поле — тихо принимаем и игнорируем
  if (typeof payload.website === "string" && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true, delivered: false, reason: "ignored" });
  }

  // 4. 152-ФЗ: согласие обязательно (дублирует клиентскую проверку)
  if (payload.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Требуется согласие на обработку персональных данных" },
      { status: 400 }
    );
  }

  // 5. Санитизация строго по схеме анкеты
  const answers = sanitizeAnswers(payload.answers);
  if (Object.keys(answers).length === 0) {
    return NextResponse.json({ ok: false, error: "Анкета пуста" }, { status: 400 });
  }

  const filledAt = new Date();
  const markdown = buildMarkdown(answers, filledAt.toISOString());
  const summary = buildSummary(answers);
  const filename = `${briefFileBase(filledAt)}.md`;

  // 6. Доставка в Telegram
  const cfg = getSobolekTelegramConfig();
  if (!cfg) {
    return NextResponse.json({ ok: false, delivered: false, reason: "telegram_not_configured" });
  }

  const result = await sendBriefToTelegram(cfg, summary, markdown, filename);
  if (!result.ok) {
    // Токены и содержимое анкеты не логируем — только техническую причину.
    console.error("Sobolek brief telegram delivery failed:", result.reason);
    return NextResponse.json({ ok: false, delivered: false, reason: "telegram_error" });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
