"use client"

import { useRef, useState, useDeferredValue } from "react"
import Markdown from "@/components/blog/Markdown"

type Tool =
  | { kind: "wrap"; label: string; title: string; before: string; after: string }
  | { kind: "prefix"; label: string; title: string; prefix: string }
  | { kind: "link"; label: string; title: string }

const TOOLS: Tool[] = [
  { kind: "prefix", label: "H2", title: "Заголовок 2", prefix: "## " },
  { kind: "prefix", label: "H3", title: "Заголовок 3", prefix: "### " },
  { kind: "wrap", label: "B", title: "Жирный", before: "**", after: "**" },
  { kind: "wrap", label: "I", title: "Курсив", before: "_", after: "_" },
  { kind: "link", label: "Ссылка", title: "Ссылка" },
  { kind: "prefix", label: "• Список", title: "Маркированный список", prefix: "- " },
  { kind: "prefix", label: "Цитата", title: "Цитата", prefix: "> " },
  { kind: "wrap", label: "Code", title: "Моноширинный код", before: "`", after: "`" },
]

export default function MarkdownEditor({
  name = "body",
  defaultValue = "",
}: {
  name?: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const ref = useRef<HTMLTextAreaElement>(null)
  const preview = useDeferredValue(value)

  function restore(start: number, end: number) {
    queueMicrotask(() => {
      const ta = ref.current
      if (!ta) return
      ta.focus()
      ta.selectionStart = start
      ta.selectionEnd = end
    })
  }

  function applyWrap(before: string, after: string) {
    const ta = ref.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const sel = value.slice(s, e)
    setValue(value.slice(0, s) + before + sel + after + value.slice(e))
    restore(s + before.length, e + before.length)
  }

  function applyPrefix(prefix: string) {
    const ta = ref.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const lineStart = value.lastIndexOf("\n", s - 1) + 1
    const block = value.slice(lineStart, e)
    const prefixed = block
      .split("\n")
      .map((l) => prefix + l)
      .join("\n")
    setValue(value.slice(0, lineStart) + prefixed + value.slice(e))
    restore(lineStart, e + (prefixed.length - block.length))
  }

  function applyLink() {
    const ta = ref.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const sel = value.slice(s, e) || "текст ссылки"
    const inserted = `[${sel}](https://)`
    setValue(value.slice(0, s) + inserted + value.slice(e))
    const urlStart = s + sel.length + 3
    restore(urlStart + "https://".length, urlStart + "https://".length)
  }

  function apply(t: Tool) {
    if (t.kind === "wrap") applyWrap(t.before, t.after)
    else if (t.kind === "prefix") applyPrefix(t.prefix)
    else applyLink()
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            onClick={() => apply(t)}
            className="font-mono text-[11px] px-2.5 py-1.5 border border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
            style={{ borderRadius: 2 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Editor + live preview */}
      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          ref={ref}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={24}
          spellCheck
          placeholder="Текст статьи в Markdown…"
          className="w-full px-3 py-2.5 bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-[16px] md:text-[14px] font-mono leading-relaxed focus:outline-none focus:border-[var(--cobalt)] transition-colors resize-y"
        />
        <div
          className="border border-[var(--rule)] bg-[var(--paper-1)] px-4 py-3 overflow-auto"
          style={{ maxHeight: 560 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)] mb-3">
            Превью
          </p>
          {preview.trim() ? (
            <Markdown>{preview}</Markdown>
          ) : (
            <p className="text-[13px] text-[var(--ink-3)] italic">
              Превью статьи появится здесь по мере набора.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
