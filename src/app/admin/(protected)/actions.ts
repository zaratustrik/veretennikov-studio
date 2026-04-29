"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  uploadToR2,
  deleteFromR2,
  posterKey,
  keyFromPublicUrl,
  isR2Configured,
} from "@/lib/r2"

async function requireAuth() {
  const session = await auth()
  if (!session) redirect("/admin/signin")
}

export async function togglePublic(id: string) {
  await requireAuth()
  const c = await prisma.case.findUnique({ where: { id }, select: { isPublic: true } })
  if (!c) return
  await prisma.case.update({
    where: { id },
    data: { isPublic: !c.isPublic },
  })
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/cases")
}

export async function deleteCase(id: string) {
  await requireAuth()
  await prisma.case.delete({ where: { id } })
  revalidatePath("/admin")
  revalidatePath("/cases")
}

export async function updateCase(id: string, formData: FormData) {
  await requireAuth()

  const existing = await prisma.case.findUnique({
    where: { id },
    select: { posterUrl: true },
  })
  if (!existing) throw new Error("Case not found")

  const slug        = String(formData.get("slug") ?? "").trim()
  const client      = String(formData.get("client") ?? "").trim()
  const title       = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const type        = String(formData.get("type") ?? "VIDEO") as "VIDEO" | "AI" | "SYNTHESIS" | "DEV"
  const year        = parseInt(String(formData.get("year") ?? "2024"), 10) || 2024
  const order       = parseInt(String(formData.get("order") ?? "0"), 10) || 0
  const videoIdRaw  = String(formData.get("videoId") ?? "").trim()
  // Accept either bare ID or full iframe / URL — extract the embed ID
  const embedMatch  = videoIdRaw.match(/kinescope\.io\/embed\/([A-Za-z0-9]+)/)
  const videoId     = embedMatch ? embedMatch[1] : (videoIdRaw || null)
  const challenge   = String(formData.get("challenge") ?? "").trim() || null
  const solution    = String(formData.get("solution") ?? "").trim() || null
  const outcome     = String(formData.get("outcome") ?? "").trim() || null
  const isPublic    = formData.get("isPublic") === "on"

  const servicesRaw = String(formData.get("services") ?? "").trim()
  const services = servicesRaw
    ? servicesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  if (!slug || !title) {
    throw new Error("slug и title обязательны")
  }

  // Poster: либо file upload в R2, либо ручной URL, либо «удалить»
  let posterUrl: string | null | undefined = undefined // undefined = не трогать
  const posterUrlInput = String(formData.get("posterUrl") ?? "").trim()
  const posterAction = String(formData.get("posterAction") ?? "")
  const posterFile = formData.get("posterFile") as File | null

  if (posterAction === "remove") {
    posterUrl = null
    if (existing.posterUrl) {
      const oldKey = keyFromPublicUrl(existing.posterUrl)
      if (oldKey) await deleteFromR2(oldKey)
    }
  } else if (posterFile && posterFile.size > 0) {
    if (!isR2Configured()) {
      throw new Error(
        "R2 не настроен. Задайте R2_* в env или используйте ручной URL.",
      )
    }
    if (posterFile.size > 10 * 1024 * 1024) {
      throw new Error("Размер файла > 10 МБ. Сожмите изображение.")
    }
    const buffer = Buffer.from(await posterFile.arrayBuffer())
    const ext = (posterFile.name.split(".").pop() ?? "jpg").toLowerCase()
    const key = posterKey(slug, ext)
    const result = await uploadToR2({
      key,
      body: buffer,
      contentType: posterFile.type || "image/jpeg",
    })
    // Удалить предыдущий постер из R2, если был
    if (existing.posterUrl && existing.posterUrl !== result.url) {
      const oldKey = keyFromPublicUrl(existing.posterUrl)
      if (oldKey) await deleteFromR2(oldKey)
    }
    posterUrl = result.url
  } else if (posterUrlInput && posterUrlInput !== existing.posterUrl) {
    // Ручной URL fallback
    posterUrl = posterUrlInput
  }

  await prisma.case.update({
    where: { id },
    data: {
      slug, client, title, description, type, year, order,
      videoId, challenge, solution, outcome, isPublic, services,
      ...(posterUrl !== undefined && { posterUrl }),
    },
  })

  revalidatePath("/admin")
  revalidatePath(`/admin/${id}`)
  revalidatePath("/")
  revalidatePath("/cases")
  revalidatePath(`/show/${slug}`)
}
