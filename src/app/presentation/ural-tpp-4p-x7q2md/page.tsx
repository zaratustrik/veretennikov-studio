import Deck from "@/components/utpp-mc/Deck"
import { controlToken } from "./gate"

/**
 * Превью новой версии мастер-класса «4П» для Уральской ТПП.
 *
 * Доступ и метаданные — в layout.tsx раздела. Аналитика на закрытых
 * презентационных страницах не подключается: страница вне публичного
 * контура сайта.
 *
 * Токен пульта считается на сервере и попадает только на страницу,
 * уже прошедшую парольный вход: cookie раздела ограничена путём
 * и до маршрутов /api/ не доходит.
 */
export default function UtppMasterclassPage() {
  const secret = process.env.UTPP_MC_PASSWORD
  return <Deck controlToken={secret ? controlToken(secret) : null} />
}
