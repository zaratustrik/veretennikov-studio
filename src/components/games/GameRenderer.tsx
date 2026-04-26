"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

/**
 * Client-side game renderer. Lazy-loads game components via next/dynamic
 * with ssr:false (the renderers touch WebGL2 / Canvas APIs that don't
 * exist on the server).
 *
 * Keep slugs in sync with src/components/games/slugs.ts.
 */

const LifeGame = dynamic(
  () => import("./life/LifeGame").then((m) => ({ default: m.LifeGame })),
  { ssr: false },
)

const ParticleGame = dynamic(
  () => import("./particles/ParticleGame").then((m) => ({ default: m.ParticleGame })),
  { ssr: false },
)

const GAMES: Record<string, ComponentType> = {
  life: LifeGame,
  particles: ParticleGame,
}

export function GameRenderer({ slug }: { slug: string }) {
  const Game = GAMES[slug]
  if (!Game) return null
  return <Game />
}
