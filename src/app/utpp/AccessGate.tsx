"use client"

import { useActionState } from "react"

import { accessAction, type AccessState } from "./auth"

const initial: AccessState = { error: null }

/**
 * Экран доступа. Код и его хэш существуют только на сервере; клиент отправляет
 * введённое значение через server action. Логотипа УТПП здесь нет: страница
 * не подписывается знаком Палаты до отдельного согласования.
 */
export default function AccessGate() {
  const [state, formAction, pending] = useActionState(accessAction, initial)

  return (
    <main className="utpp-page-gate">
      <form className="utpp-page-gate-card" action={formAction}>
        <p className="utpp-page-gate-eyebrow">Закрытый рабочий документ</p>

        <h1 className="utpp-page-gate-title">Пять цифровых инициатив УТПП</h1>

        <p className="utpp-page-gate-note">
          Материал предпроектной проработки для Уральской торгово-промышленной
          палаты. Доступ по коду из письма.
        </p>

        <label className="utpp-page-gate-label" htmlFor="utpp-page-code">
          Код доступа
        </label>
        <input
          id="utpp-page-code"
          className="utpp-page-gate-input"
          type="password"
          name="code"
          autoComplete="off"
          autoFocus
          required
        />

        {state.error ? (
          <p className="utpp-page-gate-error" role="alert">
            {state.error}
          </p>
        ) : null}

        <button className="utpp-page-gate-button" type="submit" disabled={pending}>
          {pending ? "Проверяем…" : "Открыть"}
        </button>
      </form>
    </main>
  )
}
