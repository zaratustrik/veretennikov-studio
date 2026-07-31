// Серверный модуль (используется только из server components / server actions;
// импорт node:crypto исключает попадание в клиентский бандл).
import { createHash, timingSafeEqual } from "node:crypto";

/** Имя cookie доступа к закрытой странице. */
export const IC_AUTH_COOKIE = "ic_auth";

/** Базовый путь страницы (для path-scoped cookie и редиректов). */
export const IC_BASE_PATH = "/presentation/investment-climate-sverdlovsk-a7k9m2";

/** SHA-256 от строки (Buffer, 32 байта). Выполняется только на сервере. */
export function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Значение cookie: SHA-256 hex от пароля из env. */
export function expectedCookieValue(secret: string): string {
  return sha256(secret).toString("hex");
}

/**
 * Проверка cookie: постоянное по времени сравнение hex-значения cookie
 * с SHA-256 от пароля из env. Любое повреждённое значение → отказ.
 */
export function isAuthorized(
  cookieValue: string | undefined,
  secret: string | undefined,
): boolean {
  if (!secret || !cookieValue) return false;
  if (!/^[0-9a-f]{64}$/.test(cookieValue)) return false;
  const provided = Buffer.from(cookieValue, "hex");
  const expected = sha256(secret);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
