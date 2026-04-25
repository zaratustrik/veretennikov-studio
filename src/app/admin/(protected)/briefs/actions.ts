"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAuth() {
  const session = await auth()
  if (!session) redirect("/admin/signin")
}

export async function setBriefStatus(
  id: string,
  status: "NEW" | "CONTACTED" | "IN_DISCUSSION" | "CONVERTED" | "ARCHIVED"
) {
  await requireAuth()
  await prisma.brief.update({
    where: { id },
    data: { status },
  })
  revalidatePath("/admin/briefs")
  revalidatePath(`/admin/briefs/${id}`)
}

export async function deleteBrief(id: string) {
  await requireAuth()
  await prisma.brief.delete({ where: { id } })
  revalidatePath("/admin/briefs")
  redirect("/admin/briefs")
}

export async function updateBriefNotes(id: string, formData: FormData) {
  await requireAuth()
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null
  await prisma.brief.update({
    where: { id },
    data: { adminNotes },
  })
  revalidatePath(`/admin/briefs/${id}`)
}
