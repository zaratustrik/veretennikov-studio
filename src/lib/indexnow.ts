/**
 * IndexNow protocol — fast push-notify search engines (Yandex, Bing, Seznam)
 * about new or changed URLs. https://www.indexnow.org/documentation
 *
 * One call to api.indexnow.org fans out to all participating engines.
 *
 * Setup:
 *  1. INDEXNOW_KEY env var holds the verification key (8-128 hex/alphanumeric)
 *  2. A static file at /<KEY>.txt containing the key (anyone can see it —
 *     that's the ownership proof). Lives in public/.
 *  3. This module is fire-and-forget: failures log but never throw.
 */

const DEFAULT_KEY = "e9f3b48d2c517f6a094bd8e1a72f54c8"
const ENDPOINT = "https://api.indexnow.org/indexnow"

export function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_KEY
}

export function getIndexNowHost(): string {
  // Strip protocol/path, leave bare host.
  const fromEnv = process.env.INDEXNOW_HOST?.trim()
  if (fromEnv) return fromEnv
  return "veretennikov.info"
}

/**
 * Ping IndexNow with one or more URLs. Always returns a promise that
 * resolves — never rejects — so callers can omit `await` without crashing
 * the request flow.
 *
 * Pass full https URLs (e.g. "https://veretennikov.info/blog/foo").
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return

  const key = getIndexNowKey()
  const host = getIndexNowHost()
  const keyLocation = `https://${host}/${key}.txt`

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "VeretennikovStudio/1.0 (+https://veretennikov.info)",
      },
      body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
      // Hard timeout so a slow IndexNow doesn't drag admin saves.
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok && res.status !== 202) {
      console.warn(
        `[indexnow] non-OK response: ${res.status} ${res.statusText} for`,
        urls,
      )
    } else {
      console.log(`[indexnow] ${res.status} — pushed ${urls.length} url(s)`)
    }
  } catch (err) {
    console.warn("[indexnow] ping failed:", err)
  }
}

/** Convenience: full URL for the public post page. */
export function postUrl(slug: string): string {
  return `https://${getIndexNowHost()}/blog/${slug}`
}

/** Convenience: full URL for the public case page. */
export function caseUrl(slug: string): string {
  return `https://${getIndexNowHost()}/show/${slug}`
}
