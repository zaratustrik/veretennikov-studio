import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  UTPP_AUTH_COOKIE,
  isAuthorized,
  isControlToken,
} from "@/app/presentation/ural-tpp-4p-x7q2md/gate"
import {
  currentSession,
  ensureSession,
  newSession,
  resetAnswers,
  setClosed,
  setPhase,
  snapshot,
} from "@/lib/live/store"
import { PHASES } from "@/lib/live/types"
import type { Phase } from "@/lib/live/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Пульт ведущего. Закрыт тем же паролем, что и сама дека: без cookie
 * раздела команды не принимаются. Экран участника при этом остаётся
 * публичным — заставлять зал вводить код было бы абсурдом.
 *
 * Демо и live никогда не смешиваются: переключение режима создаёт
 * новую сессию, а не подмешивает виртуальные ответы к настоящим.
 */
async function requireAuth(req: Request): Promise<boolean> {
  const secret = process.env.UTPP_MC_PASSWORD
  // Пароль не задан — раздел открыт по прямой ссылке, пульт тоже.
  if (!secret) return true
  // Основной путь: токен из страницы, уже прошедшей парольный вход.
  if (isControlToken(req.headers.get("x-utpp-control"), secret)) return true
  // Запасной: cookie раздела. Она ограничена путём и сюда обычно
  // не доходит, но проверку оставляем — она ничего не стоит.
  const jar = await cookies()
  return isAuthorized(jar.get(UTPP_AUTH_COOKIE)?.value, secret)
}

export async function POST(req: Request) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const action = typeof body?.action === "string" ? body.action : ""

  switch (action) {
    case "new-session":
    case "live": {
      const s = await newSession("live")
      return NextResponse.json({ ok: true, state: snapshot(s), qr: s.qrSvg })
    }
    case "demo": {
      const s = await newSession("demo")
      return NextResponse.json({ ok: true, state: snapshot(s), qr: s.qrSvg })
    }
    case "phase": {
      const phase = body?.phase
      if (typeof phase !== "string" || !PHASES.includes(phase as Phase)) {
        return NextResponse.json({ ok: false, reason: "bad-phase" }, { status: 400 })
      }
      const s = await ensureSession()
      await setPhase(s, phase as Phase)
      return NextResponse.json({ ok: true, state: snapshot(s) })
    }
    case "close":
    case "open": {
      const s = await ensureSession()
      await setClosed(s, action === "close")
      return NextResponse.json({ ok: true, state: snapshot(s) })
    }
    case "reset": {
      const s = await ensureSession()
      await resetAnswers(s)
      return NextResponse.json({ ok: true, state: snapshot(s) })
    }
    default:
      return NextResponse.json({ ok: false, reason: "bad-action" }, { status: 400 })
  }
}

/** Пульту нужен QR активной сессии — отдаём вместе с состоянием. */
export async function GET(req: Request) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 })
  }
  const s = await currentSession()
  if (!s) return NextResponse.json({ ok: true, state: null, qr: null })
  return NextResponse.json(
    { ok: true, state: snapshot(s), qr: s.qrSvg },
    { headers: { "Cache-Control": "no-store" } },
  )
}
