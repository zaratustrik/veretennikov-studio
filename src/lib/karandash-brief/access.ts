import { createHmac, timingSafeEqual } from "node:crypto";

// Серверная логика ограничения доступа к брифу.
// Код доступа хранится только в env и никогда не попадает в клиентский бандл.

export const ACCESS_COOKIE = "kb_access";
const COOKIE_TTL_SEC = 12 * 60 * 60; // 12 часов

export function getAccessCode(): string | null {
  const code = process.env.KARANDASH_BRIEF_ACCESS_CODE;
  return code && code.length > 0 ? code : null;
}

/** Если код доступа не задан в env — гейт отключён (открытый режим). */
export function isAccessConfigured(): boolean {
  return getAccessCode() !== null;
}

function secret(): string {
  // Отдельный секрет для подписи cookie; при отсутствии — производный от кода доступа.
  return process.env.KARANDASH_BRIEF_COOKIE_SECRET || getAccessCode() || "karandash-brief";
}

/** Значение подписанной cookie (не содержит сам код). */
export function makeCookieToken(): string {
  const issued = Math.floor(Date.now() / 1000);
  const payload = String(issued);
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyCookieToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  if (Math.floor(Date.now() / 1000) - issued > COOKIE_TTL_SEC) return false;

  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  return safeEqualHex(sig, expected);
}

/** Сравнение кода доступа в постоянном времени. */
export function checkAccessCode(input: string): boolean {
  const code = getAccessCode();
  if (!code) return false;
  return safeEqualUtf8(input, code);
}

export function cookieOptions(secure: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    // путь "/" обязателен: cookie нужен и странице /karandash-brief,
    // и API-маршруту /api/karandash-brief (разные префиксы пути)
    path: "/",
    maxAge: COOKIE_TTL_SEC
  };
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function safeEqualUtf8(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
