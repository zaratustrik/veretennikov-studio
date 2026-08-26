import { redirect } from "next/navigation"

import { currentSession } from "@/lib/live/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Короткий вход на случай, если кто-то откроет адрес без кода сессии:
 * уводим на активную. Сам QR всегда содержит адрес конкретной сессии,
 * чтобы старые ответы не попали в новую демонстрацию.
 */
export default async function LiveEntry() {
  const s = await currentSession()
  if (s) redirect(`/live/${s.id}`)
  return (
    <div className="lv-center">
      <p className="lv-big">Сессия ещё не началась</p>
      <p className="lv-note">Отсканируйте код с экрана, когда ведущий его покажет.</p>
    </div>
  )
}
