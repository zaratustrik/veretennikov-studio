/**
 * List of registered game slugs (server-safe — no client imports).
 *
 * Keep in sync with GameRenderer.tsx — both files must agree which
 * slugs have a renderer.
 */
export const REGISTERED_GAME_SLUGS = new Set(["life", "particles"])
