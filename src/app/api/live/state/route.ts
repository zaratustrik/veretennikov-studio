import { NextResponse } from "next/server"

import { currentSession, snapshot } from "@/lib/live/store"
import { analyze } from "@/lib/live/insights"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Единственный получатель обновлений — большой экран. Он опрашивает
 * этот адрес раз в ~600 мс. Ответ помечен ETag: когда ничего
 * не изменилось, уходит 304 без тела.
 *
 * Выводы считаются здесь же и только начиная с фазы «frozen»: до неё
 * они не нужны, а лишняя работа на каждом опросе ни к чему.
 */
export async function GET(req: Request) {
  const s = await currentSession()
  if (!s) {
    return NextResponse.json(
      { sessionId: null, phase: "invite", records: [], answers: [], connected: 0 },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    )
  }

  const state = snapshot(s)
  const withInsights =
    state.phase === "frozen" ||
    state.phase === "insights" ||
    state.phase.startsWith("final")

  const body = {
    ...state,
    analysis: withInsights ? analyze(state.answers) : null,
  }

  // Версия состояния: меняется при новом ответе, смене фазы или подключении.
  // Версия меняется и от незавершённых записей: узел загорается сразу
  // после первого выбора, и экран должен это увидеть.
  const fingerprint = state.records
    .map((r) => `${r.pid}:${r.direction ?? ""}${r.process ?? ""}${r.aiRole ?? ""}`)
    .sort()
    .join(",")
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    hash = (hash * 31 + fingerprint.charCodeAt(i)) | 0
  }
  const tag = `W/"${state.sessionId}-${state.records.length}-${hash}-${state.connected}-${state.phaseNonce}-${state.phase}-${state.closed ? 1 : 0}-${withInsights ? 1 : 0}"`

  if (req.headers.get("if-none-match") === tag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: tag, "Cache-Control": "no-store" },
    })
  }

  return NextResponse.json(body, {
    status: 200,
    headers: { ETag: tag, "Cache-Control": "no-store" },
  })
}
