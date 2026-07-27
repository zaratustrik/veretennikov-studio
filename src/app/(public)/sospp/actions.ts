"use server"

import { prisma } from "@/lib/db"
import { Resend } from "resend"
import { headers } from "next/headers"
import { notifyBrief } from "@/lib/telegram"
import { PD_CONSENT_STAMP } from "@/lib/pd"

export interface QuestionInput {
  name: string
  email: string
  contact?: string // телефон или Telegram, необязательно
  question: string
  pdConsent?: boolean // 152-ФЗ: чекбокс согласия, по умолчанию снят
  website_url?: string // honeypot — должен быть пустым
}

const SOURCE_LABEL = "Вопрос со страницы /sospp (СОСПП)"

export async function askQuestion(
  input: QuestionInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Honeypot — боты заполняют скрытое поле
  if (input.website_url && input.website_url.trim().length > 0) {
    return { ok: true } // делаем вид, что успех
  }

  const name = input.name?.trim()
  const email = input.email?.trim()
  const question = input.question?.trim()

  if (!name || !email || !question) {
    return { ok: false, error: "Заполните имя, email и вопрос." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Введите корректный email." }
  }
  if (question.length < 5) {
    return { ok: false, error: "Вопрос слишком короткий." }
  }
  // 152-ФЗ: без согласия форма не обрабатывается
  if (input.pdConsent !== true) {
    return {
      ok: false,
      error: "Для отправки необходимо согласие на обработку персональных данных",
    }
  }

  const contact = input.contact?.trim() || null
  const isTelegram = contact ? /@|t\.me|telegram/i.test(contact) : false

  // Сохраняем как бриф (тип AI), источник — в projectTitle, текст — в mainIdea
  const brief = await prisma.brief.create({
    data: {
      type: "AI",
      status: "NEW",
      projectTitle: SOURCE_LABEL,
      mainIdea: question,
      name,
      email,
      phone: contact && !isTelegram ? contact : null,
      telegram: contact && isTelegram ? contact : null,
      // 152-ФЗ: фиксация версии согласия и серверного времени
      consentVersion: PD_CONSENT_STAMP,
      consentAt: new Date(),
    },
  })

  const h = await headers()
  const host = h.get("host") ?? "veretennikov.info"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  // Письмо через Resend (мягко пропускаем при ошибке)
  const apiKey = process.env.AUTH_RESEND_KEY
  if (apiKey) {
    try {
      const resend = new Resend(apiKey)
      // 152-ФЗ: письмо без ПДн — Resend/Gmail иностранные сервисы.
      const html = `<!DOCTYPE html><html><body style="margin:0;background:#F9F7F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F1A2E;">
<table style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #DDD;"><tr><td style="padding:28px;">
<p style="margin:0 0 6px;font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1F4DDE;">● Вопрос · /sospp</p>
<p style="margin:0 0 14px;font-size:14px;">Поступил новый вопрос со страницы СОСПП.</p>
<p style="margin:0 0 6px;font-size:14px;"><a href="${baseUrl}/admin/briefs/${brief.id}" style="color:#1F4DDE;text-decoration:none;">Открыть в админке →</a></p>
<p style="margin:0;font-size:12px;color:#888;">Контакты и текст вопроса — только в админке (минимизация ПДн, 152-ФЗ).</p>
</td></tr></table></body></html>`

      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Veretennikov Studio <onboarding@resend.dev>",
        to: "strana.vfx@gmail.com",
        subject: `Вопрос · /sospp`,
        html,
      })
    } catch (e) {
      console.error("[sospp] email send failed:", e)
    }
  }

  // Telegram-уведомление (мягкий пропуск, если env не задан)
  try {
    await notifyBrief({
      id: brief.id,
      type: "AI",
      source: SOURCE_LABEL,
      baseUrl,
    })
  } catch (e) {
    console.error("[sospp] telegram notify failed:", e)
  }

  return { ok: true }
}
