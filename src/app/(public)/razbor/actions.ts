"use server"

import { prisma } from "@/lib/db"
import { Resend } from "resend"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { notifyLead } from "@/lib/telegram"
import { PD_CONSENT_STAMP } from "@/lib/pd"
import { EMAIL } from "@/lib/contacts"
import type { Attribution } from "@/lib/attribution"

export interface LeadInput {
  source: "RAZBOR" | "CONTACT"
  name: string
  contact: string
  process?: string
  /** Значение из закрытого списка окон (только для RAZBOR). */
  slot?: string
  /** Метка страницы-источника. */
  page?: string
  /** Атрибуция первого касания — см. lib/attribution.ts. Не ПДн. */
  attribution?: Attribution
  pdConsent?: boolean
  /** Honeypot — должен быть пустым. */
  website_url?: string
}

export type LeadResult = { ok: false; error: string } | never

const MAX = { name: 120, contact: 160, process: 2000, slot: 80, page: 120 }
/** Метки приходят с клиента, то есть из недоверенного источника. */
const MAX_UTM = 120
const MAX_URL = 200

function clamp(v: string | undefined, max: number): string | null {
  const s = (v ?? "").trim()
  if (!s) return null
  return s.slice(0, max)
}

/**
 * Первый безопасный шаг. Три обязательных поля — имя, контакт, согласие.
 * Всё остальное опционально: чем меньше трения на первом касании,
 * тем выше шанс, что разговор вообще состоится.
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const thanksUrl =
    input.source === "RAZBOR" ? "/razbor/thanks" : "/razbor/thanks?from=contact"

  // Honeypot — боты заполняют все поля, включая скрытые
  if (input.website_url && input.website_url.trim().length > 0) {
    redirect(thanksUrl) // делаем вид, что всё хорошо
  }

  const name = clamp(input.name, MAX.name)
  const contact = clamp(input.contact, MAX.contact)

  if (!name) return { ok: false, error: "Как к вам обращаться?" }
  if (!contact) {
    return {
      ok: false,
      error: "Оставьте телефон, Telegram или email — иначе мы не сможем ответить",
    }
  }
  if (contact.length < 5) {
    return { ok: false, error: "Проверьте контакт — кажется, он неполный" }
  }
  // 152-ФЗ: без согласия форма не обрабатывается
  if (input.pdConsent !== true) {
    return {
      ok: false,
      error: "Для отправки нужно согласие на обработку персональных данных",
    }
  }

  let lead
  try {
    lead = await prisma.lead.create({
      data: {
        source: input.source,
        status: "NEW",
        name,
        contact,
        process: clamp(input.process, MAX.process),
        slot: clamp(input.slot, MAX.slot),
        page: clamp(input.page, MAX.page),
        utmSource: clamp(input.attribution?.utmSource, MAX_UTM),
        utmMedium: clamp(input.attribution?.utmMedium, MAX_UTM),
        utmCampaign: clamp(input.attribution?.utmCampaign, MAX_UTM),
        utmContent: clamp(input.attribution?.utmContent, MAX_UTM),
        utmTerm: clamp(input.attribution?.utmTerm, MAX_UTM),
        landing: clamp(input.attribution?.landing, MAX_URL),
        referer: clamp(input.attribution?.referer, MAX_URL),
        consentVersion: PD_CONSENT_STAMP,
        consentAt: new Date(),
      },
    })
  } catch (e) {
    console.error("[lead] create failed:", e)
    return {
      ok: false,
      error:
        "Не удалось отправить — напишите, пожалуйста, в Telegram, там ответим быстрее",
    }
  }

  const h = await headers()
  const host = h.get("host") ?? "veretennikov.info"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  const SOURCE_LABEL: Record<string, string> = {
    RAZBOR: "Разбор процесса",
    CONTACT: "Страница контактов",
  }

  /**
   * 152-ФЗ: Resend и почтовый ящик получателя — иностранные сервисы, поэтому
   * письмо НАМЕРЕННО не содержит персональных данных заявителя. Только
   * неперсональные атрибуты (источник, окно из закрытого списка) и ссылка
   * в админку, где данные и живут — на сервере в РФ. Та же логика, что
   * и для брифов.
   */
  const apiKey = process.env.AUTH_RESEND_KEY
  if (apiKey) {
    try {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Veretennikov Studio <onboarding@resend.dev>",
        to: EMAIL,
        subject: `Новое обращение · ${SOURCE_LABEL[input.source] ?? input.source}`,
        html: `<!DOCTYPE html>
<html><body style="margin:0;background:#F9F7F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F1A2E;">
<table style="max-width:520px;margin:32px auto;background:#fff;border:1px solid #DDD;">
<tr><td style="padding:32px;">
  <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1F4DDE;">● Новое обращение</p>
  <h1 style="margin:0 0 18px;font-size:21px;font-weight:500;letter-spacing:-0.015em;">${SOURCE_LABEL[input.source] ?? input.source}</h1>
  ${lead.slot ? `<p style="margin:0 0 6px;font-size:14px;">Удобное время: <b>${lead.slot}</b></p>` : ""}
  ${lead.page ? `<p style="margin:0 0 6px;font-size:13px;color:#666;">Страница: ${lead.page}</p>` : ""}
  ${lead.utmSource ? `<p style="margin:0 0 6px;font-size:13px;color:#666;">Источник: ${lead.utmSource}${lead.utmCampaign ? ` · ${lead.utmCampaign}` : ""}</p>` : ""}
  ${lead.process ? `<p style="margin:0 0 6px;font-size:13px;color:#666;">Описание задачи: есть</p>` : ""}
  <hr style="border:0;border-top:1px solid #DDD;margin:22px 0 16px;">
  <p style="margin:0 0 6px;font-size:14px;">
    <a href="${baseUrl}/admin/leads" style="color:#1F4DDE;text-decoration:none;">Открыть обращение в админке →</a>
  </p>
  <p style="margin:0;font-size:12px;color:#888;">Имя и контакт — только в админке (минимизация ПДн, 152-ФЗ).</p>
</td></tr></table>
</body></html>`,
      })
    } catch (e) {
      // Заявка уже в БД — сбой доставки не должен ломать пользователю отправку
      console.error("[lead] email send failed:", e)
    }
  }

  // Telegram — если токены заданы. Сейчас на бою они пустые, поэтому
  // функция молча выходит; основной канал уведомления — письмо выше.
  try {
    await notifyLead({
      id: lead.id,
      source: input.source,
      slot: lead.slot,
      page: lead.page,
      hasProcess: Boolean(lead.process),
      baseUrl,
    })
  } catch (e) {
    console.error("[lead] telegram notify failed:", e)
  }

  redirect(thanksUrl)
}
