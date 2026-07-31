"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "./auth";

const initialState: LoginState = { error: null };

/**
 * Форма пароля закрытой страницы. Сам пароль и его хэш существуют только
 * на сервере; клиент отправляет введённое значение через server action.
 */
export function PasswordGate({ query }: { query: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="ic-gate">
      <form action={formAction} className="ic-gate-card" aria-label="Вход на закрытую страницу">
        <p className="ic-gate-eyebrow">Закрытый аналитический материал</p>
        <h1 className="ic-gate-title">Инвестиционный климат Свердловской области</h1>
        <p className="ic-gate-note">
          Страница доступна по паролю. Доступ действует 30 дней на этом устройстве.
        </p>
        <input type="hidden" name="qs" value={query} />
        <label className="ic-gate-label" htmlFor="ic-password">
          Пароль
        </label>
        <input
          id="ic-password"
          className="ic-gate-input"
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
        />
        {state.error ? (
          <p className="ic-gate-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <button className="ic-gate-button" type="submit" disabled={pending}>
          {pending ? "Проверка…" : "Войти"}
        </button>
      </form>
    </main>
  );
}

/** Заглушка, когда env INVEST_CLIMATE_PASSWORD не задан: вход невозможен. */
export function GateNotConfigured() {
  return (
    <main className="ic-gate">
      <div className="ic-gate-card" role="alert">
        <p className="ic-gate-eyebrow">Закрытый аналитический материал</p>
        <h1 className="ic-gate-title">Доступ не настроен</h1>
        <p className="ic-gate-note">
          Пароль доступа к странице не задан на сервере (переменная окружения
          INVEST_CLIMATE_PASSWORD). Обратитесь к администратору сайта — без
          настройки пароля страница не открывается.
        </p>
      </div>
    </main>
  );
}
