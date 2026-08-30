"use server"

import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { notifyLead } from "@/lib/telegram"
import { PD_CONSENT_STAMP } from "@/lib/pd"

export interface LeadInput {
  source: "RAZBOR" | "CONTACT"
  name: string
  contact: string
  process?: string
  /** Значение из закрытого списка окон (только для RAZBOR). */
  slot?: string
  /** Метка страницы-источника. */
  page?: string
  pdConsent?: boolean
  /** Honeypot — должен быть пустым. */
  website_url?: string
}

export type LeadResult = { ok: false; error: string } | never

const MAX = { name: 120, contact: 160, process: 2000, slot: 80, page: 120 }

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

  // Уведомление владельцу — без персональных данных (см. lib/telegram.ts)
  try {
    const h = await headers()
    const host = h.get("host") ?? "veretennikov.info"
    const protocol = host.startsWith("localhost") ? "http" : "https"

    await notifyLead({
      id: lead.id,
      source: input.source,
      slot: lead.slot,
      page: lead.page,
      hasProcess: Boolean(lead.process),
      baseUrl: `${protocol}://${host}`,
    })
  } catch (e) {
    // Сбой уведомления не должен ломать пользователю отправку — заявка уже в БД
    console.error("[lead] telegram notify failed:", e)
  }

  redirect(thanksUrl)
}
