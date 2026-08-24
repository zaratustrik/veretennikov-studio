"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useActionState } from "react"

import { loginAction, type LoginState } from "./auth"

const initialState: LoginState = { error: null }

/**
 * Форма доступа к превью мастер-класса. Пароль и его хэш существуют только
 * на сервере; клиент отправляет введённое значение через server action.
 * Текущий путь передаётся, чтобы после входа вернуться на исходный deep link;
 * значение валидируется на сервере (должно начинаться с пути раздела).
 */
export function PasswordGate() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)
  const next = usePathname() ?? ""

  return (
    <main className="utpp-gate">
      <form
        action={formAction}
        className="utpp-gate-card"
        aria-label="Вход в превью мастер-класса"
      >
        <Image
          src="/utpp/utpp-logo.png"
          alt="Уральская торгово-промышленная палата"
          width={144}
          height={54}
          className="utpp-gate-mark"
          priority
        />

        <p className="utpp-gate-eyebrow">Превью · не для распространения</p>
        <h1 className="utpp-gate-title">
          ИИ в работе руководителя
          <span>Понять · Поручить · Проверить · Перестроить</span>
        </h1>
        <p className="utpp-gate-note">
          Рабочая версия мастер-класса для Уральской ТПП. Материал закрыт
          от индексации и доступен по коду. Доступ сохраняется 30 дней
          на этом устройстве.
        </p>

        <input type="hidden" name="next" value={next} />

        <label className="utpp-gate-label" htmlFor="utpp-password">
          Код доступа
        </label>
        <input
          id="utpp-password"
          className="utpp-gate-input"
          type="password"
          name="password"
          inputMode="numeric"
          autoComplete="current-password"
          autoFocus
          required
        />

        {state.error ? (
          <p className="utpp-gate-error" role="alert">
            {state.error}
          </p>
        ) : null}

        <button className="utpp-gate-button" type="submit" disabled={pending}>
          {pending ? "Проверка…" : "Открыть"}
        </button>

        <p className="utpp-gate-sign">Veretennikov Studio · август 2026</p>
      </form>
    </main>
  )
}
