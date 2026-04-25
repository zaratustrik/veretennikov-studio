"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

  const slug        = String(formData.get("slug") ?? "").trim()
  const client      = String(formData.get("client") ?? "").trim()
  const title       = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const type        = String(formData.get("type") ?? "VIDEO") as "VIDEO" | "AI" | "SYNTHESIS"
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

  await prisma.case.update({
    where: { id },
    data: {
      slug, client, title, description, type, year, order,
      videoId, challenge, solution, outcome, isPublic, services,
    },
  })

  revalidatePath("/admin")
  revalidatePath(`/admin/${id}`)
  revalidatePath("/")
  revalidatePath("/cases")
  revalidatePath(`/show/${slug}`)
}
