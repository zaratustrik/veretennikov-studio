"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"

/**
 * Annotations — review layer for the screenplay reader.
 *
 * Select text in a scene → a tooltip offers "Комментировать" → write a note.
 * Notes are anchored to (sceneId + character offset range within the scene
 * block); because the rendered script DOM is deterministic (same fountain →
 * same markup), offsets re-resolve to live Ranges across reloads.
 *
 * Storage: localStorage, keyed per document (`baghov-anno:<docId>`). No server.
 * Export: human-readable Markdown (place + quote + comment) and JSON (re-import).
 *
 * Highlighting uses the CSS Custom Highlight API when available (no DOM
 * mutation); if unavailable the notes still save, list and export.
 */

export type Anno = {
  id: string
  sceneId: number
  sceneHeading: string
  start: number
  end: number
  quote: string
  comment: string
  createdAt: string
}

type Pending = {
  sceneId: number
  sceneHeading: string
  start: number
  end: number
  quote: string
  rect: { top: number; left: number; bottom: number; width: number }
}

/* ── DOM helpers ──────────────────────────────────────────────────── */

function closestScene(node: Node | null): HTMLElement | null {
  let el: HTMLElement | null =
    node instanceof HTMLElement ? node : node?.parentElement ?? null
  return el?.closest<HTMLElement>("[data-scene-id]") ?? null
}

/** Character offset of (node, offset) within root's text content. */
function textOffset(root: HTMLElement, node: Node, offset: number): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let total = 0
  let cur: Node | null = walker.nextNode()
  while (cur) {
    if (cur === node) return total + offset
    total += (cur.textContent ?? "").length
    cur = walker.nextNode()
  }
  return total + offset
}

/** Build a Range spanning [start, end] character offsets within root. */
function rangeFromOffsets(
  root: HTMLElement,
  start: number,
  end: number,
): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let total = 0
  let startNode: Node | null = null
  let startOff = 0
  let endNode: Node | null = null
  let endOff = 0
  let cur: Node | null = walker.nextNode()
  while (cur) {
    const len = (cur.textContent ?? "").length
    if (startNode === null && total + len >= start) {
      startNode = cur
      startOff = start - total
    }
    if (total + len >= end) {
      endNode = cur
      endOff = end - total
      break
    }
    total += len
    cur = walker.nextNode()
  }
  if (!startNode || !endNode) return null
  try {
    const r = document.createRange()
    r.setStart(startNode, startOff)
    r.setEnd(endNode, endOff)
    return r
  } catch {
    return null
  }
}

function hlSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Highlight" in window &&
    "highlights" in CSS
  )
}

/* ── component ────────────────────────────────────────────────────── */

export default function Annotations({
  docId,
  docTitle,
  docMeta,
}: {
  docId: string
  docTitle: string
  docMeta?: string
}) {
  const storeKey = `baghov-anno:${docId}`
  const [annos, setAnnos] = useState<Anno[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [pending, setPending] = useState<Pending | null>(null)
  const [composing, setComposing] = useState<Pending | null>(null)
  const [editing, setEditing] = useState<Anno | null>(null)
  const [draftText, setDraftText] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  /* load */
  useEffect(() => {
    setHydrated(true)
    try {
      const raw = localStorage.getItem(storeKey)
      if (raw) setAnnos(JSON.parse(raw) as Anno[])
    } catch {
      /* ignore corrupt store */
    }
  }, [storeKey])

  /* persist */
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storeKey, JSON.stringify(annos))
    } catch {
      /* quota / private mode — silently ignore */
    }
  }, [annos, hydrated, storeKey])

  /* ── highlight rendering (CSS Custom Highlight API) ── */
  const renderHighlights = useCallback(() => {
    if (!hlSupported()) return
    const HL = (window as unknown as { Highlight: new (...ranges: Range[]) => unknown }).Highlight
    const ranges: Range[] = []
    for (const a of annos) {
      const sceneEl = document.querySelector<HTMLElement>(
        `[data-scene-id="${a.sceneId}"]`,
      )
      if (!sceneEl) continue
      const r = rangeFromOffsets(sceneEl, a.start, a.end)
      if (r) ranges.push(r)
    }
    try {
      const highlights = (CSS as unknown as { highlights: Map<string, unknown> })
        .highlights
      if (ranges.length) {
        highlights.set("bgv-anno", new HL(...ranges))
      } else {
        highlights.delete("bgv-anno")
      }
    } catch {
      /* ignore */
    }
  }, [annos])

  useEffect(() => {
    // Defer so the scene DOM is laid out before we resolve offsets.
    const id = requestAnimationFrame(renderHighlights)
    return () => cancelAnimationFrame(id)
  }, [renderHighlights])

  /* ── selection → tooltip ── */
  useEffect(() => {
    const onUp = (e: Event) => {
      const tgt = e.target as HTMLElement | null
      if (tgt?.closest?.(".bgv-anno-ui")) return // our own UI
      // Defer to let the selection settle (esp. on touch).
      setTimeout(() => {
        const sel = window.getSelection()
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
          setPending(null)
          return
        }
        const range = sel.getRangeAt(0)
        const quote = sel.toString().trim()
        if (quote.length < 2) {
          setPending(null)
          return
        }
        const sceneEl = closestScene(range.commonAncestorContainer)
        if (!sceneEl) {
          setPending(null)
          return
        }
        const sceneId = parseInt(sceneEl.dataset.sceneId ?? "0", 10)
        const sceneHeading =
          sceneEl.querySelector(".scene-text")?.textContent?.trim() ?? ""
        const start = textOffset(sceneEl, range.startContainer, range.startOffset)
        const end = textOffset(sceneEl, range.endContainer, range.endOffset)
        const rect = range.getBoundingClientRect()
        setComposing(null)
        setPending({
          sceneId,
          sceneHeading,
          start: Math.min(start, end),
          end: Math.max(start, end),
          quote,
          rect: {
            top: rect.top,
            left: rect.left + rect.width / 2,
            bottom: rect.bottom,
            width: rect.width,
          },
        })
      }, 10)
    }
    document.addEventListener("mouseup", onUp)
    document.addEventListener("touchend", onUp)
    return () => {
      document.removeEventListener("mouseup", onUp)
      document.removeEventListener("touchend", onUp)
    }
  }, [])

  // Hide tooltip on scroll (rect goes stale) and when selection clears.
  useEffect(() => {
    const onScroll = () => setPending(null)
    const onSelChange = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) setPending((p) => (composing ? p : null))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("selectionchange", onSelChange)
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("selectionchange", onSelChange)
    }
  }, [composing])

  // Focus composer textarea when it opens.
  useEffect(() => {
    if (composing || editing) {
      requestAnimationFrame(() => taRef.current?.focus())
    }
  }, [composing, editing])

  const openComposer = () => {
    if (!pending) return
    setComposing(pending)
    setDraftText("")
    setPending(null)
  }

  const clearSelection = () => window.getSelection()?.removeAllRanges()

  const saveNew = () => {
    if (!composing || !draftText.trim()) return
    const a: Anno = {
      id: `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`,
      sceneId: composing.sceneId,
      sceneHeading: composing.sceneHeading,
      start: composing.start,
      end: composing.end,
      quote: composing.quote,
      comment: draftText.trim(),
      createdAt: new Date().toISOString(),
    }
    setAnnos((prev) => [...prev, a])
    setComposing(null)
    setDraftText("")
    clearSelection()
  }

  const saveEdit = () => {
    if (!editing) return
    const txt = draftText.trim()
    setAnnos((prev) =>
      prev.map((x) => (x.id === editing.id ? { ...x, comment: txt } : x)),
    )
    setEditing(null)
    setDraftText("")
  }

  const remove = (id: string) =>
    setAnnos((prev) => prev.filter((x) => x.id !== id))

  const clearAll = () => {
    setAnnos([])
    setConfirmClear(false)
  }

  // Reset the clear-confirmation whenever the drawer is closed.
  useEffect(() => {
    if (!panelOpen) setConfirmClear(false)
  }, [panelOpen])

  const jumpTo = (a: Anno) => {
    const sceneEl = document.querySelector<HTMLElement>(
      `[data-scene-id="${a.sceneId}"]`,
    )
    if (!sceneEl) return
    sceneEl.scrollIntoView({ behavior: "smooth", block: "center" })
    setPanelOpen(false)
    // Flash the specific range.
    if (hlSupported()) {
      const r = rangeFromOffsets(sceneEl, a.start, a.end)
      if (r) {
        try {
          const HL = (window as unknown as { Highlight: new (...r: Range[]) => unknown }).Highlight
          const highlights = (CSS as unknown as { highlights: Map<string, unknown> }).highlights
          highlights.set("bgv-anno-flash", new HL(r))
          setTimeout(() => highlights.delete("bgv-anno-flash"), 1800)
        } catch {
          /* ignore */
        }
      }
    }
  }

  /* ── export / import ── */
  const download = (name: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const stamp = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`
  }

  const sorted = useMemo(
    () =>
      [...annos].sort((a, b) =>
        a.sceneId !== b.sceneId ? a.sceneId - b.sceneId : a.start - b.start,
      ),
    [annos],
  )

  const toMarkdown = () => {
    const lines: string[] = []
    lines.push(`# Заметки к сценарию: ${docTitle}`)
    const head = [
      docMeta ? docMeta : null,
      `экспортировано ${new Date().toLocaleString("ru-RU")}`,
      `${annos.length} ${plural(annos.length, ["заметка", "заметки", "заметок"])}`,
    ]
      .filter(Boolean)
      .join(" · ")
    lines.push(head, "")
    let curScene = -1
    for (const a of sorted) {
      if (a.sceneId !== curScene) {
        curScene = a.sceneId
        lines.push(
          `## Сцена ${String(a.sceneId).padStart(2, "0")} — ${a.sceneHeading}`,
          "",
        )
      }
      lines.push(
        a.quote
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n"),
      )
      lines.push("", `**💬 ${a.comment}**`, "", `*${new Date(a.createdAt).toLocaleString("ru-RU")}*`, "", "---", "")
    }
    return lines.join("\n")
  }

  const exportMd = () =>
    download(`zametki-${docId}-${stamp()}.md`, toMarkdown(), "text/markdown;charset=utf-8")

  const exportJson = () =>
    download(
      `zametki-${docId}-${stamp()}.json`,
      JSON.stringify({ docId, docTitle, exportedAt: new Date().toISOString(), annotations: annos }, null, 2),
      "application/json",
    )

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const incoming: Anno[] = Array.isArray(parsed)
          ? parsed
          : parsed.annotations ?? []
        if (!Array.isArray(incoming)) return
        setAnnos((prev) => {
          const byId = new Map(prev.map((x) => [x.id, x]))
          for (const a of incoming) if (a && a.id) byId.set(a.id, a)
          return [...byId.values()]
        })
      } catch {
        /* ignore bad file */
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  if (!hydrated) return null

  const clampLeft = (left: number) =>
    Math.max(80, Math.min(left, window.innerWidth - 80))

  return (
    <div className="bgv-anno-ui">
      {/* Selection tooltip */}
      {pending ? (
        <div
          className="bgv-anno-tip"
          style={{
            top: pending.rect.top - 10,
            left: clampLeft(pending.rect.left),
          }}
        >
          <button onClick={openComposer}>💬 Комментировать</button>
        </div>
      ) : null}

      {/* Composer (new) */}
      {composing ? (
        <div
          className="bgv-anno-pop"
          style={{
            top: Math.min(composing.rect.bottom + 10, window.innerHeight - 230),
            left: clampLeft(composing.rect.left),
          }}
        >
          <div className="bgv-anno-pop-quote">«{trim(composing.quote, 140)}»</div>
          <textarea
            ref={taRef}
            value={draftText}
            placeholder="Ваш комментарий к этому месту…"
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveNew()
              if (e.key === "Escape") {
                setComposing(null)
                clearSelection()
              }
            }}
          />
          <div className="bgv-anno-pop-row">
            <button className="ghost" onClick={() => { setComposing(null); clearSelection() }}>
              Отмена
            </button>
            <button className="primary" onClick={saveNew} disabled={!draftText.trim()}>
              Сохранить
            </button>
          </div>
        </div>
      ) : null}

      {/* Edit composer (centered) */}
      {editing ? (
        <>
          <div className="bgv-anno-backdrop" onClick={() => setEditing(null)} />
          <div className="bgv-anno-pop centered">
            <div className="bgv-anno-pop-quote">«{trim(editing.quote, 140)}»</div>
            <textarea
              ref={taRef}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEdit()
                if (e.key === "Escape") setEditing(null)
              }}
            />
            <div className="bgv-anno-pop-row">
              <button className="ghost" onClick={() => setEditing(null)}>Отмена</button>
              <button className="primary" onClick={saveEdit}>Сохранить</button>
            </div>
          </div>
        </>
      ) : null}

      {/* Floating button */}
      <button
        className="bgv-anno-fab"
        onClick={() => setPanelOpen((v) => !v)}
        title="Заметки ревью"
      >
        🖊 Заметки{annos.length ? ` · ${annos.length}` : ""}
      </button>

      {/* Notes drawer */}
      {panelOpen ? (
        <div className="bgv-anno-backdrop" onClick={() => setPanelOpen(false)} />
      ) : null}
      <aside className={`bgv-anno-drawer ${panelOpen ? "open" : ""}`}>
        <div className="bgv-anno-drawer-head">
          <span>ЗАМЕТКИ РЕВЬЮ · {annos.length}</span>
          <button onClick={() => setPanelOpen(false)} aria-label="Закрыть">✕</button>
        </div>

        <div className="bgv-anno-tools">
          <button onClick={exportMd} disabled={!annos.length}>↓ Markdown</button>
          <button onClick={exportJson} disabled={!annos.length}>↓ JSON</button>
          <button onClick={() => fileRef.current?.click()}>↑ Импорт</button>
          <button
            className="danger"
            onClick={() => setConfirmClear(true)}
            disabled={!annos.length}
          >
            🗑 Очистить
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={onImport}
            hidden
          />
        </div>

        {confirmClear ? (
          <div className="bgv-anno-confirm">
            <span>Удалить все заметки ({annos.length})? Это нельзя отменить.</span>
            <div className="bgv-anno-confirm-row">
              <button onClick={() => setConfirmClear(false)}>Отмена</button>
              <button className="danger" onClick={clearAll}>Да, удалить всё</button>
            </div>
          </div>
        ) : null}

        <div className="bgv-anno-list">
          {sorted.length === 0 ? (
            <p className="bgv-anno-empty">
              Выделите фрагмент текста в сценарии — появится кнопка «Комментировать».
              Заметки сохраняются в этом браузере, их можно скачать.
            </p>
          ) : (
            sorted.map((a) => (
              <div className="bgv-anno-item" key={a.id}>
                <button className="bgv-anno-item-loc" onClick={() => jumpTo(a)}>
                  Сцена {String(a.sceneId).padStart(2, "0")} · {trim(a.sceneHeading, 40)}
                </button>
                <div className="bgv-anno-item-quote">«{trim(a.quote, 120)}»</div>
                <div className="bgv-anno-item-comment">{a.comment}</div>
                <div className="bgv-anno-item-row">
                  <button
                    onClick={() => {
                      setEditing(a)
                      setDraftText(a.comment)
                    }}
                  >
                    редактировать
                  </button>
                  <button onClick={() => remove(a.id)}>удалить</button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}

function trim(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim()
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…"
}

function plural(n: number, f: [string, string, string]): string {
  const a = Math.abs(n) % 100
  const l = a % 10
  if (a > 10 && a < 20) return f[2]
  if (l === 1) return f[0]
  if (l >= 2 && l <= 4) return f[1]
  return f[2]
}
