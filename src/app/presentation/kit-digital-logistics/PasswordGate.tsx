"use client"

import { usePathname } from "next/navigation"
import { useActionState } from "react"

import { loginAction, type LoginState } from "./auth"

const initialState: LoginState = { error: null }

/**
 * Форма доступа к закрытому proposal. Пароль и его хэш существуют только
 * на сервере; клиент отправляет введённое значение через server action.
 * Текущий путь передаётся, чтобы после входа вернуться на исходный deep link;
 * значение валидируется на сервере (должно начинаться с пути раздела).
 */
export function PasswordGate() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)
  const next = usePathname() ?? ""

  return (
    <main className="kdl-gate">
      <form
        action={formAction}
        className="kdl-gate-card"
        aria-label="Вход в закрытый проектный документ"
      >
        <p className="kdl-gate-eyebrow">Закрытый проектный документ</p>
        <h1 className="kdl-gate-title">
          ТК КИТ · Цифровой контур магистральной и автономной логистики
        </h1>
        <p className="kdl-gate-note">
          Материал подготовлен для рабочей встречи и доступен по паролю.
          Доступ сохраняется 30 дней на этом устройстве.
        </p>

        <input type="hidden" name="next" value={next} />

        <label className="kdl-gate-label" htmlFor="kdl-password">
          Пароль доступа
        </label>
        <input
          id="kdl-password"
          className="kdl-gate-input"
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
        />

        {state.error ? (
          <p className="kdl-gate-error" role="alert">
            {state.error}
          </p>
        ) : null}

        <button className="kdl-gate-button" type="submit" disabled={pending}>
          {pending ? "Проверка…" : "Открыть документ"}
        </button>

        <p className="kdl-gate-sign">Veretennikov Studio · август 2026</p>
      </form>
    </main>
  )
}

/** Заглушка, когда env KIT_PROPOSAL_PASSWORD не задан: вход невозможен. */
export function GateNotConfigured() {
  return (
    <main className="kdl-gate">
      <div className="kdl-gate-card" role="alert">
        <p className="kdl-gate-eyebrow">Закрытый проектный документ</p>
        <h1 className="kdl-gate-title">Доступ не настроен</h1>
        <p className="kdl-gate-note">
          Пароль доступа не задан на сервере (переменная окружения
          KIT_PROPOSAL_PASSWORD). Без неё документ не открывается. Обратитесь
          к автору страницы.
        </p>
      </div>
    </main>
  )
}
