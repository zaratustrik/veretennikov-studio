/**
 * Cloudflare R2 client (S3-compatible).
 *
 * Setup:
 *   1. Cloudflare dashboard → R2 → создать bucket (например veretennikov-media).
 *   2. R2 → Manage R2 API Tokens → Create API Token (Object Read & Write
 *      на нужный бакет). Сохрани Access Key ID и Secret Access Key.
 *   3. Settings бакета → Public Access:
 *      a) Connect a custom domain (рекомендуется) — например media.veretennikov.info.
 *         Добавь CNAME запись в DNS, дождись провижена.
 *      b) Или включи r2.dev subdomain (бесплатный, но rate-limited; не для прод).
 *   4. R2 → Account ID — копируешь из верхнего правого угла.
 *   5. Заполни env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *      R2_BUCKET_NAME, R2_PUBLIC_URL (без слэша в конце).
 *
 * Если переменные не заданы — uploadPoster() кидает понятную ошибку, чтобы
 * админу было ясно, что R2 не настроен.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const BUCKET = process.env.R2_BUCKET_NAME
const PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") // strip trailing slash

let client: S3Client | null = null

function getClient(): S3Client {
  if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    throw new Error(
      "R2 не настроен: задайте R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY в env",
    )
  }
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    })
  }
  return client
}

export function isR2Configured(): boolean {
  return Boolean(
    ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY && BUCKET && PUBLIC_URL,
  )
}

export interface UploadResult {
  url: string
  key: string
  size: number
}

/**
 * Upload a file (Buffer / Uint8Array) to R2.
 * Returns the public URL composed from R2_PUBLIC_URL + key.
 */
export async function uploadToR2(opts: {
  key: string
  body: Buffer | Uint8Array
  contentType: string
  cacheControl?: string
}): Promise<UploadResult> {
  if (!BUCKET) {
    throw new Error("R2_BUCKET_NAME не задан в env")
  }
  if (!PUBLIC_URL) {
    throw new Error("R2_PUBLIC_URL не задан в env")
  }

  const c = getClient()
  await c.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl ?? "public, max-age=31536000, immutable",
    }),
  )

  return {
    url: `${PUBLIC_URL}/${opts.key}`,
    key: opts.key,
    size: opts.body.byteLength,
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  if (!BUCKET) return
  try {
    const c = getClient()
    await c.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
  } catch (e) {
    console.error("[r2] delete failed:", e)
  }
}

/**
 * Compose a poster object key: posters/<slug>-<timestamp>.<ext>
 * — slug-prefixed so the file is human-recognizable in R2 dashboard,
 * — timestamp suffix so re-uploads don't collide with browser cache.
 */
export function posterKey(slug: string, ext: string): string {
  const ts = Date.now()
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "case"
  const safeExt = ext.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 6) || "jpg"
  return `posters/${safeSlug}-${ts}.${safeExt}`
}

/**
 * Try to derive R2 object key from a URL (so we can delete the old poster
 * on re-upload). Returns null if URL is not from our R2 bucket.
 */
export function keyFromPublicUrl(url: string): string | null {
  if (!PUBLIC_URL) return null
  if (!url.startsWith(PUBLIC_URL + "/")) return null
  return url.slice(PUBLIC_URL.length + 1)
}
