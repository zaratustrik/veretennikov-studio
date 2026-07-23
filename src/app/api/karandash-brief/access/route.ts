import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  checkAccessCode,
  cookieOptions,
  isAccessConfigured,
  makeCookieToken,
  verifyCookieToken
} from "@/lib/karandash-brief/access";
import { rateLimit } from "@/lib/karandash-brief/rateLimit";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function isHttps(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return new URL(request.url).protocol === "https:";
}

// Статус доступа: нужен ли код и авторизован ли текущий посетитель.
export async function GET(request: Request) {
  if (!isAccessConfigured()) {
    return NextResponse.json({ required: false, authorized: true });
  }
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ACCESS_COOKIE}=`))
    ?.slice(ACCESS_COOKIE.length + 1);

  return NextResponse.json({ required: true, authorized: verifyCookieToken(cookie) });
}

// Проверка кода доступа и выдача короткоживущей cookie.
export async function POST(request: Request) {
  if (!isAccessConfigured()) {
    return NextResponse.json({ ok: true, required: false });
  }

  const limit = rateLimit(`access:${clientIp(request)}`, 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Слишком много попыток. Попробуйте позже." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const obj = (body ?? {}) as Record<string, unknown>;
  // honeypot: скрытое поле должно быть пустым
  if (typeof obj.website === "string" && obj.website.trim().length > 0) {
    return NextResponse.json({ ok: false, error: "Неверный код доступа" }, { status: 401 });
  }

  const code = typeof obj.code === "string" ? obj.code : "";
  if (!code || !checkAccessCode(code)) {
    return NextResponse.json({ ok: false, error: "Неверный код доступа" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, makeCookieToken(), cookieOptions(isHttps(request)));
  return res;
}
