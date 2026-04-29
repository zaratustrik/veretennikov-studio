"use server"

import { prisma } from "@/lib/db"
import { Resend } from "resend"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { notifyBrief } from "@/lib/telegram"

export interface BriefInput {
  type: "VIDEO" | "AI" | "UNSURE"
  // Project
  format?: string
  projectTitle?: string
  mainIdea?: string
  audience?: string
  showWhere?: string
  duration?: string
  hasMaterials?: string
  currentProcess?: string
  scale?: string
  integrations?: string
  successMetric?: string
  // Company
  company?: string
  industry?: string
  website?: string
  trigger?: string
  // Constraints
  deadline?: string
  budget?: string
  ndaNeeded?: boolean
  // References
  references?: string
  antiReferences?: string
  attachments?: string
  // Contact
  name: string
  position?: string
  email: string
  phone?: string
  telegram?: string
  bestTime?: string
  // Honeypot (anti-spam) — must be empty
  website_url?: string
}

const TYPE_LABEL: Record<string, string> = {
  VIDEO: "Видеопродакшн",
  AI: "Разработка / AI",
  UNSURE: "Не уверен — обсудим",
}

function field(label: string, value: string | undefined | null): string {
  if (!value || !value.trim()) return ""
  return `<tr><td style="padding:6px 14px 6px 0;color:#666;font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;font-size:14px;color:#0F1A2E;line-height:1.55;">${escapeHtml(value)}</td></tr>`
}

function section(title: string, rows: string): string {
  const filtered = rows.trim()
  if (!filtered) return ""
  return `<h3 style="margin:24px 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1F4DDE;font-family:monospace;">${title}</h3><table style="width:100%;border-collapse:collapse;">${rows}</table>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function buildEmailHtml(brief: BriefInput, id: string, baseUrl: string): string {
  const projectRows = [
    field("Формат", brief.format),
    field("Название", brief.projectTitle),
    field("Главная идея", brief.mainIdea),
    field("Аудитория", brief.audience),
    field("Где будет показано", brief.showWhere),
    field("Длительность", brief.duration),
    field("Есть материалы", brief.hasMaterials),
    field("Текущий процесс", brief.currentProcess),
    field("Масштаб", brief.scale),
    field("Интеграции", brief.integrations),
    field("Метрика успеха", brief.successMetric),
  ].join("")

  const companyRows = [
    field("Компания", brief.company),
    field("Сфера", brief.industry),
    field("Сайт", brief.website),
    field("Триггер", brief.trigger),
  ].join("")

  const constraintRows = [
    field("Срок", brief.deadline),
    field("Бюджет", brief.budget),
    field("NDA", brief.ndaNeeded ? "да, нужен до брифа" : ""),
  ].join("")

  const refsRows = [
    field("Референсы", brief.references),
    field("Анти-референсы", brief.antiReferences),
    field("Файлы / ссылки", brief.attachments),
  ].join("")

  const contactRows = [
    field("Имя", brief.name),
    field("Должность", brief.position),
    field("Email", brief.email),
    field("Телефон", brief.phone),
    field("Telegram", brief.telegram),
    field("Удобное время", brief.bestTime),
  ].join("")

  return `<!DOCTYPE html>
<html><body style="margin:0;background:#F9F7F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F1A2E;">
<table style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #DDD;">
<tr><td style="padding:32px;">
  <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1F4DDE;">● Новый бриф</p>
  <h1 style="margin:0 0 24px;font-size:24px;font-weight:500;letter-spacing:-0.015em;">${TYPE_LABEL[brief.type] ?? brief.type}</h1>
  <p style="margin:0 0 4px;font-size:14px;color:#0F1A2E;"><strong>${escapeHtml(brief.name)}</strong>${brief.position ? `, ${escapeHtml(brief.position)}` : ""}${brief.company ? ` · ${escapeHtml(brief.company)}` : ""}</p>
  <p style="margin:0 0 24px;font-size:13px;color:#666;">${escapeHtml(brief.email)}${brief.phone ? ` · ${escapeHtml(brief.phone)}` : ""}${brief.telegram ? ` · TG: ${escapeHtml(brief.telegram)}` : ""}</p>
  ${section("Задача", projectRows)}
  ${section("Компания", companyRows)}
  ${section("Сроки и бюджет", constraintRows)}
  ${section("Референсы", refsRows)}
  ${section("Контакт", contactRows)}
  <hr style="border:0;border-top:1px solid #DDD;margin:32px 0 16px;">
  <p style="margin:0;font-size:12px;color:#888;">
    <a href="${baseUrl}/admin/briefs/${id}" style="color:#1F4DDE;text-decoration:none;">Открыть в админке →</a>
  </p>
</td></tr></table>
</body></html>`
}

export async function saveBrief(input: BriefInput): Promise<{ ok: false; error: string } | never> {
  // Honeypot — bots fill all fields including hidden ones
  if (input.website_url && input.website_url.trim().length > 0) {
    // Pretend success
    redirect("/brief/thanks")
  }

  // Required fields
  const name = input.name?.trim()
  const email = input.email?.trim()
  if (!name || !email) {
    return { ok: false, error: "Укажите имя и email" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Введите корректный email" }
  }
  if (!input.type || !["VIDEO", "AI", "UNSURE"].includes(input.type)) {
    return { ok: false, error: "Выберите тип задачи" }
  }
  if (!input.phone?.trim() && !input.telegram?.trim()) {
    return { ok: false, error: "Укажите телефон или Telegram" }
  }

  // Persist
  const brief = await prisma.brief.create({
    data: {
      type: input.type,
      status: "NEW",
      format:         input.format?.trim() || null,
      projectTitle:   input.projectTitle?.trim() || null,
      mainIdea:       input.mainIdea?.trim() || null,
      audience:       input.audience?.trim() || null,
      showWhere:      input.showWhere?.trim() || null,
      duration:       input.duration?.trim() || null,
      hasMaterials:   input.hasMaterials?.trim() || null,
      currentProcess: input.currentProcess?.trim() || null,
      scale:          input.scale?.trim() || null,
      integrations:   input.integrations?.trim() || null,
      successMetric:  input.successMetric?.trim() || null,
      company:        input.company?.trim() || null,
      industry:       input.industry?.trim() || null,
      website:        input.website?.trim() || null,
      trigger:        input.trigger?.trim() || null,
      deadline:       input.deadline?.trim() || null,
      budget:         input.budget?.trim() || null,
      ndaNeeded:      Boolean(input.ndaNeeded),
      references:     input.references?.trim() || null,
      antiReferences: input.antiReferences?.trim() || null,
      attachments:    input.attachments?.trim() || null,
      name,
      position:       input.position?.trim() || null,
      email,
      phone:          input.phone?.trim() || null,
      telegram:       input.telegram?.trim() || null,
      bestTime:       input.bestTime?.trim() || null,
    },
  })

  // Compute base URL for both email and Telegram
  const h = await headers()
  const host = h.get("host") ?? "veretennikov.info"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  // Send email via Resend
  const apiKey = process.env.AUTH_RESEND_KEY
  if (apiKey) {
    try {
      const resend = new Resend(apiKey)
      const html = buildEmailHtml(input, brief.id, baseUrl)

      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Veretennikov Studio <onboarding@resend.dev>",
        to: "strana.vfx@gmail.com",
        replyTo: email,
        subject: `Бриф · ${TYPE_LABEL[input.type] ?? input.type} · ${name}${input.company ? `, ${input.company}` : ""}`,
        html,
      })
    } catch (e) {
      // Email failure shouldn't block the user — log it
      console.error("[brief] email send failed:", e)
    }
  }

  // Send Telegram notification (graceful skip if env not set)
  try {
    await notifyBrief({
      id: brief.id,
      type: input.type,
      name,
      position: input.position?.trim() || null,
      company: input.company?.trim() || null,
      email,
      phone: input.phone?.trim() || null,
      telegram: input.telegram?.trim() || null,
      format: input.format?.trim() || null,
      projectTitle: input.projectTitle?.trim() || null,
      mainIdea: input.mainIdea?.trim() || null,
      audience: input.audience?.trim() || null,
      showWhere: input.showWhere?.trim() || null,
      duration: input.duration?.trim() || null,
      deadline: input.deadline?.trim() || null,
      budget: input.budget?.trim() || null,
      ndaNeeded: Boolean(input.ndaNeeded),
      references: input.references?.trim() || null,
      baseUrl,
    })
  } catch (e) {
    console.error("[brief] telegram notify failed:", e)
  }

  redirect(`/brief/thanks?id=${brief.id}`)
}
