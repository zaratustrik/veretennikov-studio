/**
 * Уведомление о новом ответе на закрытой странице УТПП.
 *
 * 152-ФЗ: сообщение НАМЕРЕННО не содержит ни ответов, ни имени отвечавшего.
 * Telegram — иностранный сервис, и передача в него мнений должностных лиц
 * Палаты означала бы трансграничную передачу персональных данных с отдельным
 * согласием и уведомлением Роскомнадзора. Та же политика уже применяется
 * к брифам и обращениям — см. шапку `src/lib/telegram.ts`.
 *
 * В сообщение попадают только неперсональные факты: сколько вопросов
 * отвечено, версия набора вопросов, время и ссылка на админку — данные
 * живут там, на сервере в РФ.
 *
 * Если переменные окружения не заданы, функция молча ничего не делает:
 * отправка ответа не должна зависеть от доступности Telegram.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

/**
 * Адрес сайта — константа, а не заголовок Host из запроса.
 *
 * Host и X-Forwarded-Host подконтрольны отправителю: собрав ссылку из них,
 * мы позволили бы подделать запрос так, чтобы в Telegram пришло сообщение
 * со ссылкой на чужой домен. Адрес здесь не меняется, поэтому и брать его
 * из запроса незачем.
 */
const SITE_URL = "https://veretennikov.info"

/** Ответ уже сохранён в базе — уведомление не имеет права его задерживать. */
const TIMEOUT_MS = 5000

export interface UtppResponseNotification {
  /** Сколько вопросов реально отвечено. Не ПДн. */
  answeredCount: number
  /** Всего вопросов в наборе. */
  total: number
  /** Версия набора вопросов — чтобы понимать, на какую форму отвечали. */
  questionSetVersion: string
}

function buildMessage(n: UtppResponseNotification): string {
  const when = new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return [
    "● <b>УТПП · новый ответ</b>",
    "",
    `<b>Отвечено:</b> ${n.answeredCount} из ${n.total}`,
    `<b>Версия вопросов:</b> ${n.questionSetVersion}`,
    `<b>Время:</b> ${when} (Екатеринбург)`,
    "",
    `<a href="${SITE_URL}/admin/utpp">Открыть в админке →</a>`,
  ].join("\n")
}

export async function notifyUtppResponse(
  n: UtppResponseNotification,
): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return // тихо пропускаем

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: buildMessage(n),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (!res.ok) {
      // Тело ответа Telegram не содержит наших данных — логировать безопасно.
      const body = await res.text().catch(() => "")
      console.error("[utpp] telegram sendMessage failed:", res.status, body)
    }
  } catch (e) {
    console.error(
      "[utpp] telegram sendMessage error:",
      e instanceof Error ? e.message : "неизвестная ошибка",
    )
  }
}
