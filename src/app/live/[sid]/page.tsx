import { sessionById } from "@/lib/live/store"
import Mobile from "@/components/utpp-mc/live/Mobile"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Экран участника конкретной сессии. Если сессия уже сменилась,
 * телефон получает понятное сообщение, а не тихо пишет ответы
 * в пустоту.
 */
export default async function LiveSession({
  params,
}: {
  params: Promise<{ sid: string }>
}) {
  const { sid } = await params
  const s = await sessionById(sid)

  if (!s) {
    return (
      <div className="lv-center">
        <p className="lv-big">Эта сессия уже завершена</p>
        <p className="lv-note">Отсканируйте код с экрана ещё раз.</p>
      </div>
    )
  }

  if (s.mode === "demo") {
    return (
      <div className="lv-center">
        <p className="lv-big">Идёт демонстрация</p>
        <p className="lv-note">Сейчас показывается пример работы системы. Посмотрите на экран.</p>
      </div>
    )
  }

  return <Mobile sessionId={s.id} />
}
