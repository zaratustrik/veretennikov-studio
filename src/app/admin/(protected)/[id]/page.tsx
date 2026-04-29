import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { updateCase } from "../actions"
import { isR2Configured } from "@/lib/r2"

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const c = await prisma.case.findUnique({ where: { id } })
  if (!c) notFound()

  const updateAction = updateCase.bind(null, id)
  const r2Ready = isR2Configured()

  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: 920 }}>
      {/* Breadcrumb */}
      <Link
        href="/admin"
        className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] hover:text-[var(--cobalt)] transition-colors mb-6 inline-block uppercase"
      >
        ← все кейсы
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-3">
          {c.isPublic ? (
            <span style={{ color: "var(--cobalt)" }}>● live</span>
          ) : (
            <span>● draft</span>
          )}
          <span className="ml-3">/{c.slug}</span>
        </p>
        <h1
          className="display"
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            animation: "none",
          }}
        >
          {c.client && <span>{c.client} · </span>}
          {c.title || <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>без названия</span>}
        </h1>
      </div>

      {/* Video preview if videoId */}
      {c.videoId && (
        <div className="mb-10">
          <p className="eyebrow mb-3">Превью</p>
          <div
            className="relative w-full overflow-hidden border border-[var(--rule)]"
            style={{ paddingTop: "56.25%", background: "var(--paper-2)" }}
          >
            <iframe
              src={`https://kinescope.io/embed/${c.videoId}`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </div>
        </div>
      )}

      {/* Edit form */}
      <form action={updateAction} encType="multipart/form-data" className="space-y-8">
        {/* Status row */}
        <Section title="Публикация">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublic"
              defaultChecked={c.isPublic}
              className="w-4 h-4 accent-[var(--cobalt)]"
            />
            <span className="text-[14px] text-[var(--ink)]">
              Показывать на сайте (раздел /cases и /show/{c.slug})
            </span>
          </label>
        </Section>

        {/* Identity */}
        <Section title="Идентификация">
          <Field label="Slug (URL)" hint="Используется в URL: /show/{slug}. Только латиница, цифры, дефисы.">
            <input
              type="text" name="slug" defaultValue={c.slug} required
              className={inputCls}
              pattern="[-a-z0-9]+"
            />
          </Field>
          <Field label="Клиент" hint="Название компании. Пусто = пока не указано.">
            <input type="text" name="client" defaultValue={c.client} className={inputCls} />
          </Field>
          <Field label="Название проекта" hint="Краткое название работы.">
            <input type="text" name="title" defaultValue={c.title} required className={inputCls} />
          </Field>
        </Section>

        {/* Meta */}
        <Section title="Метаданные">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Тип" hint="VIDEO / DEV / AI / SYNTHESIS">
              <select name="type" defaultValue={c.type} className={inputCls}>
                <option value="VIDEO">VIDEO</option>
                <option value="DEV">DEV (разработка ПО)</option>
                <option value="AI">AI</option>
                <option value="SYNTHESIS">SYNTHESIS</option>
              </select>
            </Field>
            <Field label="Год">
              <input type="number" name="year" defaultValue={c.year} required className={inputCls} />
            </Field>
            <Field label="Порядок" hint="Меньше = выше">
              <input type="number" name="order" defaultValue={c.order} className={inputCls} />
            </Field>
          </div>
          <Field label="Kinescope Video ID" hint="22-значный ID после /embed/. Можно вставить сам ID или iframe — извлеку.">
            <input type="text" name="videoId" defaultValue={c.videoId ?? ""} className={inputCls} />
          </Field>
        </Section>

        {/* Description */}
        <Section title="Описание">
          <Field label="Краткое описание" hint="2–3 предложения. Видны в списке кейсов и шапке страницы.">
            <textarea
              name="description"
              defaultValue={c.description}
              rows={3}
              className={inputCls}
            />
          </Field>
        </Section>

        {/* Poster */}
        <Section title="Постер">
          {c.posterUrl ? (
            <div className="space-y-3">
              <div
                className="relative w-full max-w-[480px] overflow-hidden border border-[var(--rule)] bg-[var(--paper-2)]"
                style={{ aspectRatio: "16 / 9" }}
              >
                <Image
                  src={c.posterUrl}
                  alt={c.title}
                  fill
                  sizes="480px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="font-mono text-[11px] text-[var(--ink-3)] break-all">
                {c.posterUrl}
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="posterAction"
                  value="remove"
                  className="w-4 h-4 accent-[var(--cobalt)]"
                />
                <span className="text-[14px] text-[var(--ink)]">
                  Удалить постер при сохранении
                </span>
              </label>
            </div>
          ) : (
            <p className="text-[13px] text-[var(--ink-3)] mb-3">
              Постер не загружен. Используется fallback-плашка с буквами клиента.
            </p>
          )}

          {r2Ready ? (
            <Field
              label="Загрузить новый постер"
              hint="JPG, PNG или WEBP. Рекомендуется 1920×1080 (16:9). До 10 МБ. Загружается в Cloudflare R2."
            >
              <input
                type="file"
                name="posterFile"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="block w-full text-[13px] file:mr-4 file:py-2 file:px-4 file:border file:border-[var(--rule)] file:bg-[var(--paper-1)] file:text-[var(--ink)] file:cursor-pointer file:font-mono file:text-[12px] file:tracking-[0.04em] hover:file:bg-[var(--paper-2)]"
              />
            </Field>
          ) : (
            <p
              className="text-[12px] font-mono text-[var(--ink-3)] mb-3 p-3 border border-dashed border-[var(--rule)]"
              style={{ background: "var(--paper-1)" }}
            >
              ⚠ R2 не настроен (нет R2_ACCOUNT_ID / R2_ACCESS_KEY_ID /
              R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL в env).
              Загрузка файлов недоступна — используйте поле «URL постера» ниже.
            </p>
          )}

          <Field
            label="Или URL постера вручную"
            hint="Прямой ссылкой на изображение (Kinescope CDN, R2, любой публичный URL). Перезаписывает текущий, если отличается."
          >
            <input
              type="url"
              name="posterUrl"
              defaultValue={c.posterUrl ?? ""}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>
        </Section>

        {/* Services */}
        <Section title="Услуги">
          <Field label="Что делали" hint="Через запятую: Сценарий, Съёмка, Монтаж, VFX">
            <input
              type="text" name="services"
              defaultValue={c.services.join(", ")}
              className={inputCls}
              placeholder="Сценарий, Съёмка, Монтаж"
            />
          </Field>
        </Section>

        {/* Story */}
        <Section title="История проекта">
          <Field label="Задача" hint="Что нужно было решить. Опционально.">
            <textarea name="challenge" defaultValue={c.challenge ?? ""} rows={4} className={inputCls} />
          </Field>
          <Field label="Решение" hint="Как мы это сделали. Опционально.">
            <textarea name="solution" defaultValue={c.solution ?? ""} rows={4} className={inputCls} />
          </Field>
          <Field label="Результат" hint="Что получилось. Опционально.">
            <textarea name="outcome" defaultValue={c.outcome ?? ""} rows={4} className={inputCls} />
          </Field>
        </Section>

        {/* Submit */}
        <div className="flex items-center justify-between border-t border-[var(--rule)] pt-6">
          <Link
            href="/admin"
            className="font-mono text-[12px] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors"
          >
            ← Отмена
          </Link>
          <button
            type="submit"
            className="px-7 py-3 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
          >
            Сохранить →
          </button>
        </div>
      </form>
    </div>
  )
}

const inputCls =
  "w-full px-3 py-2.5 bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-[16px] md:text-[14px] focus:outline-none focus:border-[var(--cobalt)] transition-colors font-[inherit]"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-[var(--rule)] pt-6 space-y-5">
      <legend className="eyebrow mb-1">{title}</legend>
      {children}
    </fieldset>
  )
}

function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] mb-1.5 uppercase">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[var(--ink-3)] mt-1.5 font-mono">{hint}</p>
      )}
    </div>
  )
}
