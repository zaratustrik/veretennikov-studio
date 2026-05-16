import Link from "next/link"
import { createPost } from "../actions"
import SubmitButton from "../../_components/SubmitButton"

export default function NewPostPage() {
  return (
    <div className="mx-auto px-5 md:px-8 py-12" style={{ maxWidth: 640 }}>
      <Link
        href="/admin/posts"
        className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] hover:text-[var(--cobalt)] transition-colors mb-6 inline-block uppercase"
      >
        ← все статьи
      </Link>

      <div className="mb-10">
        <p className="eyebrow mb-3">Журнал</p>
        <h1
          className="display"
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            animation: "none",
          }}
        >
          Новая статья
        </h1>
      </div>

      <form action={createPost} className="space-y-8">
        <fieldset className="border-t border-[var(--rule)] pt-6 space-y-5">
          <legend className="eyebrow mb-1">Идентификация</legend>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] mb-1.5 uppercase">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              required
              placeholder="ai-bez-magii"
              className={inputCls}
            />
            <p className="text-[11px] text-[var(--ink-3)] mt-1.5 font-mono">
              Адрес статьи: /blog/&#123;slug&#125;. Только латиница, цифры, дефисы.
            </p>
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] mb-1.5 uppercase">
              Заголовок
            </label>
            <input type="text" name="title" required className={inputCls} />
          </div>
        </fieldset>

        <div className="flex items-center justify-between border-t border-[var(--rule)] pt-6">
          <Link
            href="/admin/posts"
            className="font-mono text-[12px] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors"
          >
            ← Отмена
          </Link>
          <SubmitButton idle="Создать →" pending="Создаём…" />
        </div>
      </form>

      <p className="text-[12px] text-[var(--ink-3)] mt-6">
        Статья создаётся черновиком. Текст, обложку и теги добавите в редакторе.
      </p>
    </div>
  )
}

const inputCls =
  "w-full px-3 py-2.5 bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-[16px] md:text-[14px] focus:outline-none focus:border-[var(--cobalt)] transition-colors font-[inherit]"
