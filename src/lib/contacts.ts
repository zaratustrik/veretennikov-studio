/**
 * Единая точка правды по контактам студии.
 *
 * ВАЖНО. Корпоративная почта на домене veretennikov.info на момент правки
 * НЕ настроена: Resend-домен не верифицирован, EMAIL_FROM всё ещё
 * `onboarding@resend.dev`. Поэтому здесь стоит реальный рабочий адрес
 * владельца — тот же, что в allowlist админки. Выдумывать `hello@…`
 * нельзя: письмо на него никуда не придёт.
 *
 * Когда домен в Resend будет верифицирован — меняем EMAIL здесь
 * (одно место) и EMAIL_FROM в .env.production на VM.
 */

export const PHONE_HUMAN = "+7 922 613 01 54"
/** E.164 для tel: — без пробелов и скобок. */
export const PHONE_TEL = "+79226130154"

export const TELEGRAM_HANDLE = "@VeretennikovINFO"
export const TELEGRAM_URL = "https://t.me/VeretennikovINFO"

export const EMAIL = "strana.vfx@gmail.com"
export const EMAIL_HREF = `mailto:${EMAIL}`

export const CITY = "Екатеринбург"
export const GEO_NOTE = "Работаем по России"
