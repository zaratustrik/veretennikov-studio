import { NextResponse } from "next/server"

import { currentSession, submitAnswer } from "@/lib/live/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Итоговый ответ участника. Дедупликация по pid на стороне сервера:
 * повторная отправка не удваивает узел, а заменяет прежний выбор.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const pid = typeof body?.pid === "string" ? body.pid.slice(0, 32) : null
  if (!pid) return NextResponse.json({ ok: false, reason: "no-pid" }, { status: 400 })

  const s = await currentSession()
  if (!s) return NextResponse.json({ ok: false, reason: "no-session" }, { status: 404 })
  if (typeof body?.sessionId === "string" && body.sessionId !== s.id) {
    return NextResponse.json({ ok: false, reason: "stale-session" }, { status: 409 })
  }

  // Шаги приходят по одному: направление → процесс → граница.
  // Незаданные поля не трогаем, чтобы патч не стирал прежний выбор.
  const res = await submitAnswer(s, {
    pid,
    ...(body?.direction !== undefined ? { direction: body.direction } : {}),
    ...(body?.process !== undefined ? { process: body.process } : {}),
    ...(body?.aiRole !== undefined ? { aiRole: body.aiRole } : {}),
  })

  if (!res.ok) return NextResponse.json(res, { status: res.reason === "closed" ? 423 : 400 })
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
}
