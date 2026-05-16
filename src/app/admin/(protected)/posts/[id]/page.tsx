import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { isR2Configured } from "@/lib/r2"
import { updatePost } from "../actions"
import SubmitButton from "../../_components/SubmitButton"
import MarkdownEditor from "../_components/MarkdownEditor"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) notFound()

  const updateAction = updatePost.bind(null, id)
  const r2Ready = isR2Configured()

  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: 1100 }}>
      <Link
        href="/admin/posts"
        className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] hover:text-[var(--cobalt)] transition-colors mb-6 inline-block uppercase"
      >
        ← все статьи
      </Link>

      <div className="mb-10">
        <p className="eyebrow mb-3">
          {post.isPublic ? (
            <span style={{ color: "var(--cobalt)" }}>● live</span>
          ) : (
            <span>● draft</span>
          )}
          <span className="ml-3">/blog/{post.slug}</span>
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
          {post.title || (
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
              без названия
            </span>
          )}
        </h1>
      </div>

      <form action={updateAction} encType="multipart/form-data" className="space-y-8">
        {/* Publication */}
        <Section title="Публикация">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublic"
              defaultChecked={post.isPublic}
              className="w-4 h-4 accent-[var(--cobalt)]"
            />
            <span className="text-[14px] text-[var(--ink)]">
              Опубликовать на сайте (раздел /blog)
            </span>
          </label>
          {post.publishedAt && (
            <p className="text-[11px] text-[var(--ink-3)] font-mono">
              Дата публикации: {post.publishedAt.toLocaleString("ru-RU")}
            </p>
          )}
        </Section>

        {/* Identity */}
        <Section title="Идентификация">
          <Field label="Slug (URL)" hint="Используется в URL: /blog/{slug}. Только латиница, цифры, дефисы.">
            <input type="text" name="slug" defaultValue={post.slug} required className={inputCls} />
          </Field>
          <Field label="Заголовок" hint="Заголовок статьи.">
            <input type="text" name="title" defaultValue={post.title} required className={inputCls} />
          </Field>
        </Section>

        {/* Meta */}
        <Section title="Метаданные">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Автор" hint="Пусто = Veretennikov Studio.">
              <input type="text" name="author" defaultValue={post.author ?? ""} className={inputCls} />
            </Field>
            <Field label="Теги" hint="Через запятую: AI, видеопродакшн, выставки">
              <input
                type="text" name="tags"
                defaultValue={post.tags.join(", ")}
                className={inputCls}
                placeholder="AI, автоматизация"
              />
            </Field>
          </div>
        </Section>

        {/* Cover */}
        <Section title="Обложка">
          {post.coverUrl ? (
            <div className="space-y-3">
              <div
                className="relative w-full max-w-[480px] overflow-hidden border border-[var(--rule)] bg-[var(--paper-2)]"
                style={{ aspectRatio: "16 / 9" }}
              >
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  sizes="480px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="font-mono text-[11px] text-[var(--ink-3)] break-all">
                {post.coverUrl}
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="coverAction"
                  value="remove"
                  className="w-4 h-4 accent-[var(--cobalt)]"
                />
                <span className="text-[14px] text-[var(--ink)]">
                  Удалить обложку при сохранении
                </span>
              </label>
            </div>
          ) : (
            <p className="text-[13px] text-[var(--ink-3)] mb-3">
              Обложка не загружена. В списке блога используется типографический fallback.
            </p>
          )}

          {r2Ready ? (
            <Field
              label="Загрузить новую обложку"
              hint="JPG, PNG или WEBP. Рекомендуется 1920×1080 (16:9). До 10 МБ. Загружается в Cloudflare R2."
            >
              <input
                type="file"
                name="coverFile"
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
              Загрузка файлов недоступна — используйте поле «URL обложки» ниже.
            </p>
          )}

          <Field
            label="Или URL обложки вручную"
            hint="Прямой ссылкой на изображение. Перезаписывает текущую, если отличается."
          >
            <input
              type="url"
              name="coverUrl"
              defaultValue={post.coverUrl ?? ""}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>
        </Section>

        {/* Content */}
        <Section title="Анонс и текст">
          <Field label="Анонс" hint="1–2 предложения. Видны в списке блога, в метаописании и RSS.">
            <textarea
              name="excerpt"
              defaultValue={post.excerpt ?? ""}
              rows={3}
              className={inputCls}
            />
          </Field>
          <Field label="Текст статьи" hint="Markdown. Панель сверху вставляет разметку, справа — живое превью.">
            <MarkdownEditor name="body" defaultValue={post.body} />
          </Field>
        </Section>

        {/* Submit */}
        <div className="flex items-center justify-between border-t border-[var(--rule)] pt-6">
          <Link
            href="/admin/posts"
            className="font-mono text-[12px] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors"
          >
            ← Отмена
          </Link>
          <SubmitButton />
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
