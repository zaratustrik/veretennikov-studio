"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { expectedCookieValue, IC_AUTH_COOKIE, IC_BASE_PATH, sha256 } from "./gate";

export type LoginState = { error: string | null };

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

/**
 * Server action входа: сравнивает пароль с env INVEST_CLIMATE_PASSWORD
 * через timingSafeEqual (по SHA-256-дайджестам — постоянная длина),
 * при успехе ставит httpOnly-cookie на 30 дней и редиректит на страницу
 * с сохранением исходных searchParams (deep link `?item=N` не теряется).
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const secret = process.env.INVEST_CLIMATE_PASSWORD;
  if (!secret) {
    return { error: "Доступ не настроен: обратитесь к администратору страницы." };
  }

  const attempt = formData.get("password");
  if (typeof attempt !== "string" || attempt.length === 0) {
    return { error: "Введите пароль." };
  }

  // Дайджесты одинаковой длины → корректное постоянное по времени сравнение.
  const ok = timingSafeEqual(sha256(attempt), sha256(secret));
  if (!ok) {
    return { error: "Неверный пароль. Попробуйте ещё раз." };
  }

  const store = await cookies();
  store.set(IC_AUTH_COOKIE, expectedCookieValue(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: IC_BASE_PATH,
    maxAge: THIRTY_DAYS_SECONDS,
  });

  // Возврат на исходный deep link: пересобираем query из скрытого поля формы
  // через URLSearchParams (редирект всегда остаётся на фиксированном пути).
  const rawQuery = formData.get("qs");
  const params = new URLSearchParams(
    typeof rawQuery === "string" ? rawQuery : "",
  );
  const qs = params.toString();
  redirect(qs ? `${IC_BASE_PATH}?${qs}` : IC_BASE_PATH);
}
