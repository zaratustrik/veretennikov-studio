import { NextResponse } from "next/server"

import { currentSession, join, markStarted } from "@/lib/live/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Телефон сообщает, что открыл страницу. Ничего, кроме анонимного
 * идентификатора из localStorage, не передаётся и не хранится:
 * ни имени, ни почты, ни телефона.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    pid?: unknown
    sessionId?: unknown
    started?: unknown
  } | null

  const pid = typeof body?.pid === "string" ? body.pid.slice(0, 32) : null
  if (!pid) return NextResponse.json({ ok: false, reason: "no-pid" }, { status: 400 })

  const s = await currentSession()
  if (!s) return NextResponse.json({ ok: false, reason: "no-session" }, { status: 404 })
  if (typeof body?.sessionId === "string" && body.sessionId !== s.id) {
    // Телефон остался на старой сессии — пусть перезагрузит страницу.
    return NextResponse.json({ ok: false, reason: "stale-session" }, { status: 409 })
  }

  if (body?.started === true) markStarted(s, pid)
  else join(s, pid)

  return NextResponse.json(
    { ok: true, sessionId: s.id, closed: s.closed },
    { headers: { "Cache-Control": "no-store" } },
  )
}
