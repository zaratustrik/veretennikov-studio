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

function revalidateBlog(slug?: string) {
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
  revalidatePath("/sitemap.xml")
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function createPost(formData: FormData) {
  await requireAuth()

  const slug = String(formData.get("slug") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()

  if (!slug || !title) throw new Error("slug и title обязательны")
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("slug: только латиница, цифры и дефис")
  }
  const dup = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (dup) throw new Error("Статья с таким slug уже существует")

  const post = await prisma.post.create({
    data: { slug, title, body: "" },
  })

  revalidateBlog()
  redirect(`/admin/posts/${post.id}`)
}

export async function togglePublicPost(id: string) {
  await requireAuth()
  const p = await prisma.post.findUnique({
    where: { id },
    select: { isPublic: true, publishedAt: true, slug: true },
  })
  if (!p) return
  const nextPublic = !p.isPublic
  await prisma.post.update({
    where: { id },
    data: {
      isPublic: nextPublic,
      ...(nextPublic && !p.publishedAt ? { publishedAt: new Date() } : {}),
    },
  })
  revalidateBlog(p.slug)
}

export async function deletePost(id: string) {
  await requireAuth()
  const p = await prisma.post.findUnique({
    where: { id },
    select: { coverUrl: true, slug: true },
  })
  if (p?.coverUrl) {
    const key = keyFromPublicUrl(p.coverUrl)
    if (key) await deleteFromR2(key)
  }
  await prisma.post.delete({ where: { id } })
  revalidateBlog(p?.slug)
  redirect("/admin/posts")
}

export async function updatePost(id: string, formData: FormData) {
  await requireAuth()

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { coverUrl: true, isPublic: true, publishedAt: true },
  })
  if (!existing) throw new Error("Статья не найдена")

  const slug = String(formData.get("slug") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null
  const body = String(formData.get("body") ?? "")
  const author = String(formData.get("author") ?? "").trim() || null
  const isPublic = formData.get("isPublic") === "on"

  const tagsRaw = String(formData.get("tags") ?? "").trim()
  const tags = tagsRaw
    ? tagsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  if (!slug || !title) throw new Error("slug и title обязательны")
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("slug: только латиница, цифры и дефис")
  }
  const dup = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (dup && dup.id !== id) {
    throw new Error("Статья с таким slug уже существует")
  }

  // Cover image: file upload to R2, manual URL, or «remove» — same
  // pattern as the case-editor poster handling.
  let coverUrl: string | null | undefined = undefined // undefined = не трогать
  const coverUrlInput = String(formData.get("coverUrl") ?? "").trim()
  const coverAction = String(formData.get("coverAction") ?? "")
  const coverFile = formData.get("coverFile") as File | null

  if (coverAction === "remove") {
    coverUrl = null
    if (existing.coverUrl) {
      const oldKey = keyFromPublicUrl(existing.coverUrl)
      if (oldKey) await deleteFromR2(oldKey)
    }
  } else if (coverFile && coverFile.size > 0) {
    if (!isR2Configured()) {
      throw new Error(
        "R2 не настроен. Задайте R2_* в env или используйте ручной URL.",
      )
    }
    if (coverFile.size > 10 * 1024 * 1024) {
      throw new Error("Размер файла > 10 МБ. Сожмите изображение.")
    }
    const buffer = Buffer.from(await coverFile.arrayBuffer())
    const ext = (coverFile.name.split(".").pop() ?? "jpg").toLowerCase()
    const key = posterKey(slug, ext)
    const result = await uploadToR2({
      key,
      body: buffer,
      contentType: coverFile.type || "image/jpeg",
    })
    if (existing.coverUrl && existing.coverUrl !== result.url) {
      const oldKey = keyFromPublicUrl(existing.coverUrl)
      if (oldKey) await deleteFromR2(oldKey)
    }
    coverUrl = result.url
  } else if (coverUrlInput && coverUrlInput !== existing.coverUrl) {
    coverUrl = coverUrlInput
  }

  // publishedAt is set the first time the post goes public.
  const publishedAt =
    isPublic && !existing.publishedAt ? new Date() : undefined

  await prisma.post.update({
    where: { id },
    data: {
      slug,
      title,
      excerpt,
      body,
      author,
      tags,
      isPublic,
      ...(coverUrl !== undefined && { coverUrl }),
      ...(publishedAt !== undefined && { publishedAt }),
    },
  })

  revalidateBlog(slug)
  revalidatePath(`/admin/posts/${id}`)
  redirect("/admin/posts")
}
