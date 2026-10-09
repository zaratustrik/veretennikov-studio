"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Building2, ClipboardCheck, Layers3, ListChecks, MessagesSquare, DraftingCompass, BookOpen, Plus, UsersRound, LockKeyhole, RefreshCw, X, Pencil, type LucideIcon } from "lucide-react"
import { guide, materials } from "./content"
import { statuses, type Collection, type HubRecord, type HubView } from "@/lib/construction-hub/types"

type Section = "overview" | "decisions" | "topics" | "tasks" | "discussion" | "guide" | "materials"
const sections: { id: Section; name: string; icon: string }[] = [
  { id: "overview", name: "Обзор", icon: "grid" }, { id: "decisions", name: "Договорённости", icon: "check" },
  { id: "topics", name: "Темы и программа", icon: "layers" }, { id: "tasks", name: "Подготовка", icon: "list" },
  { id: "discussion", name: "Обсуждение", icon: "chat" }, { id: "guide", name: "Как провести конференцию", icon: "spark" },
  { id: "materials", name: "Материалы", icon: "book" },
]
function Icon({ name }: { name: string }) {
  const components: Record<string, LucideIcon> = { grid: Building2, check: ClipboardCheck, layers: Layers3, list: ListChecks, chat: MessagesSquare, spark: DraftingCompass, book: BookOpen, plus: Plus, users: UsersRound, lock: LockKeyhole, refresh: RefreshCw, x: X, edit: Pencil }
  const Component = components[name] || Building2
  return <Component size={21} strokeWidth={1.7} aria-hidden="true" />
}
const format = (value: string) => new Intl.DateTimeFormat("ru-RU", { timeZone: "Asia/Yekaterinburg", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value))
const dueDate = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`))
const tone = (status: string) => ["Готово", "Утверждено", "Согласовано", "В программе"].includes(status) ? "green" : ["Нужно согласовать", "Нужна помощь", "Предложение"].includes(status) ? "orange" : status.includes("Отлож") || status.includes("следующей") || status === "Отклонено" ? "gray" : "blue"

async function api(data?: Record<string, unknown>): Promise<HubView & { error?: string; token?: string }> {
  const result = await fetch("/construction-hub/api", { method: data ? "POST" : "GET", cache: "no-store", headers: data ? { "Content-Type": "application/json" } : undefined, body: data ? JSON.stringify(data) : undefined })
  const value = await result.json()
  if (!result.ok) throw new Error(value.error || "Не удалось выполнить действие.")
  return value
}

function Modal({ title, children, close, error }: { title: string; children: ReactNode; close: () => void; error: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { ref.current?.showModal() }, [])
  return <dialog ref={ref} className="hub-modal" onCancel={close}><div className="hub-modal-top"><h2>{title}</h2><button type="button" className="hub-icon-button" aria-label="Закрыть" onClick={close}><Icon name="x"/></button></div>{error && <p className="hub-error" role="alert">{error}</p>}{children}</dialog>
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="hub-field"><span>{label}</span>{children}</label> }

export default function Hub() {
  const [data, setData] = useState<HubView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)
  const [section, setSection] = useState<Section>("overview")
  const [author, setAuthor] = useState("")
  const [editor, setEditor] = useState<{ collection: Collection; record?: HubRecord } | null>(null)
  const [settings, setSettings] = useState(false)
  const [team, setTeam] = useState(false)
  const [propose, setPropose] = useState(false)
  const [filter, setFilter] = useState("Все")
  const [target, setTarget] = useState("general")
  const [invitation, setInvitation] = useState("")
  const [phase, setPhase] = useState("before")
  const started = useRef(false)

  async function refresh() { const next = await api(); setData(next) }
  useEffect(() => {
    if (started.current) return
    started.current = true
    try { setAuthor(localStorage.getItem("construction-hub-author") || "") } catch {}
    const invite = new URLSearchParams(location.hash.slice(1)).get("invite")
    if (invite) history.replaceState(null, "", location.pathname)
    ;(async () => {
      try { if (invite) await api({ action: "login", token: invite }); await refresh() }
      catch (e) { if (invite || !(e instanceof Error && e.message.includes("Войдите"))) setError(e instanceof Error ? e.message : "Не удалось открыть площадку.") }
      finally { setLoading(false) }
    })()
  }, [])
  useEffect(() => {
    const openLink = async () => {
      const invite = new URLSearchParams(location.hash.slice(1)).get("invite")
      if (!invite) return
      history.replaceState(null, "", location.pathname)
      setError("")
      try { await api({ action: "login", token: invite }); await refresh() }
      catch (e) { setData(null); setError(e instanceof Error ? e.message : "Не удалось открыть площадку.") }
    }
    window.addEventListener("hashchange", openLink)
    return () => window.removeEventListener("hashchange", openLink)
  }, [])
  useEffect(() => {
    if (!data) return
    const reload = () => { if (document.visibilityState === "visible") refresh().catch(() => {}) }
    const timer = setInterval(reload, 45_000)
    document.addEventListener("visibilitychange", reload)
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", reload) }
  }, [Boolean(data)])
  function rememberAuthor(value: string) {
    setAuthor(value)
    try { localStorage.setItem("construction-hub-author", value) } catch {}
  }
  async function act(input: Record<string, unknown>, after?: (result: { token?: string }) => void) {
    setBusy(true); setError(""); setNotice("")
    try { const result = await api({ ...input, author }); await refresh(); after?.(result); setNotice("Сохранено. Изменение видно всем участникам.") }
    catch (e) { setError(e instanceof Error ? e.message : "Не удалось сохранить изменение.") }
    finally { setBusy(false) }
  }
  function navigate(next: Section) { setSection(next); setFilter("Все"); setError(""); setNotice("") }
  function discuss(record: HubRecord) { setTarget(record.id); navigate("discussion") }

  if (!data) return <div className="hub-root hub-gate"><div className="hub-gate-image"><div className="hub-gate-wordmark"><span className="hub-mark">П</span>Строим практику</div><div className="hub-gate-copy"><span className="hub-eyebrow">ИИ В СТРОИТЕЛЬСТВЕ · УРАЛ</span><h1>Готовим конференцию.<br/>Собираем практику.</h1><p>При поддержке Уральской торгово-промышленной палаты</p></div><span className="hub-image-caption">Иллюстративное изображение</span></div><div className="hub-gate-form"><span className="hub-lock"><Icon name="lock"/></span><h2>{loading ? "Открываем площадку…" : "Доступ по ссылке"}</h2><p>Откройте ссылку, которую передал организатор. Площадка загрузится автоматически — без регистрации и личного кабинета.</p>{error && <p className="hub-error" role="alert">{error}</p>}<small>Доступ к материалам и обсуждениям есть только у приглашённых участников.</small></div></div>

  const admin = data.viewer.role === "organizer"
  const done = data.tasks.filter(t => t.status === "Готово").length
  const pending = data.decisions.filter(t => t.status === "Нужно согласовать").length
  const agendaTotal = data.agenda.reduce((n, r) => n + (r.minutes || 0), 0)
  const records = [...data.decisions, ...data.topics, ...data.tasks, ...data.agenda]
  const activeSection = sections.find(s => s.id === section)!
  const discussionTitle = target === "general" ? "Общее обсуждение" : records.find(r => r.id === target)?.title || "Обсуждение архивной темы"

  function Card({ record, collection: key }: { record: HubRecord; collection: Collection }) {
    return <article className="hub-record"><div className="hub-record-top"><span className={`hub-badge ${tone(record.status)}`}>{record.status}</span>{admin && <button aria-label={`Изменить: ${record.title}`} className="hub-icon-button" onClick={() => setEditor({ collection: key, record })}><Icon name="edit"/></button>}</div><h3>{record.title}</h3><p>{record.body}</p><div className="hub-record-footer"><span>{record.owner || "Ответственный не назначен"}{record.due ? ` · ${dueDate(record.due)}` : ""}</span><button className="hub-text-button" onClick={() => discuss(record)}>Обсудить{data?.comments.filter(c => c.target === record.id).length ? ` (${data.comments.filter(c => c.target === record.id).length})` : ""}</button></div></article>
  }
  const collectionTitle = { decisions: "Договорённости", tasks: "Задачи подготовки", topics: "Темы", agenda: "Программа" }
  function RecordList({ name }: { name: Collection }) {
    const list = data![name].filter(r => filter === "Все" || r.status === filter)
    return <><div className="hub-section-actions"><div className="hub-filter"><label htmlFor={`filter-${name}`}>Статус</label><select id={`filter-${name}`} value={filter} onChange={e => setFilter(e.target.value)}><option>Все</option>{statuses[name].map(s => <option key={s}>{s}</option>)}</select></div>{admin && <button className="hub-button small" onClick={() => setEditor({ collection: name })}><Icon name="plus"/>Добавить</button>}</div><div className="hub-record-grid">{list.map(r => <Card key={r.id} record={r} collection={name}/>)}</div>{!list.length && <div className="hub-empty">В этом статусе пока нет записей.</div>}</>
  }

  return <div className="hub-root hub-app"><a className="hub-skip" href="#hub-main">Перейти к содержанию</a><aside className="hub-sidebar"><a className="hub-brand" href="/construction-hub"><span className="hub-mark">П</span><span>Строим <br/>практику</span></a><div className="hub-side-label">РАБОЧАЯ ПЛОЩАДКА</div><nav aria-label="Разделы площадки">{sections.map(s => <button key={s.id} aria-current={section === s.id ? "page" : undefined} onClick={() => navigate(s.id)}><Icon name={s.icon}/><span>{s.name}</span>{s.id === "decisions" && pending > 0 ? <b>{pending}</b> : null}</button>)}</nav><div className="hub-side-bottom"><span className="hub-badge blue"><Icon name="lock"/>По ссылке</span><p>ИИ в строительстве<br/>При поддержке Уральской ТПП</p></div></aside>
    <div className="hub-workspace"><header className="hub-topbar"><span className="hub-breadcrumb">Проект / <strong>{activeSection.name}</strong></span><div className="hub-top-actions"><button className="hub-icon-button" aria-label="Обновить данные" disabled={busy} onClick={() => { setBusy(true); refresh().then(() => setNotice("Данные обновлены")).catch(e => setError(e.message)).finally(() => setBusy(false)) }}><Icon name="refresh"/></button>{admin && <button className="hub-team-button" onClick={() => { setTeam(true); api({ action: "share" }).then(result => setInvitation(`${location.origin}/construction-hub#invite=${result.token}`)).catch(e => setError(e.message)) }}><Icon name="users"/><span>Ссылка для коллег</span></button>}<span className="hub-badge blue">{admin ? "Организатор" : "Общий доступ"}</span></div></header>
    <main id="hub-main" className="hub-main"><div className="hub-notifications" aria-live="polite">{error && <div className="hub-error" role="alert">{error}<button aria-label="Закрыть сообщение" onClick={() => setError("")}>×</button></div>}{notice && <div className="hub-success">{notice}<button aria-label="Закрыть сообщение" onClick={() => setNotice("")}>×</button></div>}</div>
    {section === "overview" ? <>
      <section className="hub-hero"><div><span className="hub-eyebrow">ГОТОВИМ КОНФЕРЕНЦИЮ</span><h1>{data.meta.title}</h1><p>{data.meta.goal}</p><div className="hub-hero-tags"><span>Практика</span><span>Обмен опытом</span><span>Продолжение</span></div></div><div className="hub-hero-photo"><span className="hub-image-caption">Иллюстративное изображение</span></div></section>
      <div className="hub-stat-grid"><article><span className="hub-stat-icon blue"><Icon name="check"/></span><div><strong>{pending}</strong><span>решений ждут согласования</span></div></article><article><span className="hub-stat-icon orange"><Icon name="list"/></span><div><strong>{done}<small> / {data.tasks.length}</small></strong><span>задач подготовки завершено</span></div></article><article><span className="hub-stat-icon violet"><Icon name="layers"/></span><div><strong>{data.topics.length}</strong><span>тем предложено к обсуждению</span></div></article><article><span className="hub-stat-icon green"><Icon name="users"/></span><div><strong>{data.comments.length}</strong><span>комментариев в обсуждении</span></div></article></div>
      <div className="hub-overview-grid"><section className="hub-panel"><div className="hub-section-heading"><h2>Что нужно определить</h2><button className="hub-text-button" onClick={() => navigate("decisions")}>Все договорённости</button></div>{data.decisions.filter(d => d.status === "Нужно согласовать").slice(0, 3).map((r, i) => <button key={r.id} className="hub-decision-row" onClick={() => admin ? setEditor({ collection: "decisions", record: r }) : discuss(r)}><span className="hub-row-number">0{i + 1}</span><div><strong>{r.title}</strong><p>{r.body}</p></div></button>)}{pending === 0 && <p className="hub-empty">Открытых решений нет.</p>}</section><section className="hub-event-card"><span className="hub-eyebrow">КОНФЕРЕНЦИЯ</span><h2>Практика.<br/>Диалог.<br/>Продолжение.</h2><dl><div><dt>Когда</dt><dd>{data.meta.date || "Нужно определить"}</dd></div><div><dt>Где</dt><dd>{data.meta.venue || "Нужно определить"}</dd></div><div><dt>Для кого</dt><dd>{data.meta.audience || "Нужно определить"}</dd></div></dl>{admin && <button className="hub-button light" onClick={() => setSettings(true)}>Уточнить параметры</button>}</section></div>
      <div className="hub-overview-grid"><section className="hub-panel"><div className="hub-section-heading"><h2>Ближайшие задачи</h2><button className="hub-text-button" onClick={() => navigate("tasks")}>План подготовки</button></div>{data.tasks.filter(t => t.status !== "Готово").slice(0, 4).map(r => <div key={r.id} className="hub-task-row"><span className={`hub-status-square ${tone(r.status)}`}><Icon name="list"/></span><div><strong>{r.title}</strong><small>{r.owner || "Назначить ответственного"}{r.due ? ` · ${dueDate(r.due)}` : " · Срок не установлен"}</small></div><span className={`hub-badge ${tone(r.status)}`}>{r.status}</span></div>)}</section><section className="hub-chat-card"><span className="hub-stat-icon orange"><Icon name="chat"/></span><h2>Обсуждаем здесь.<br/>Созваниваемся в чате.</h2><p>Мнения и предложения сохраняются на площадке. Общая группа поможет быстро связаться с коллегами.</p>{data.meta.chatUrl ? <a className="hub-button" href={data.meta.chatUrl} target="_blank" rel="noreferrer">Открыть группу {data.meta.messenger}</a> : <><span className="hub-badge orange">Мессенджер ещё не выбран</span><div className="hub-chat-options">Telegram · WhatsApp · MAX</div>{admin && <button className="hub-text-button" onClick={() => setSettings(true)}>Добавить ссылку на группу</button>}</>}<button className="hub-text-button" onClick={() => navigate("discussion")}>Перейти к обсуждению</button></section></div>
      <section className="hub-panel hub-history"><div className="hub-section-heading"><h2>Последние изменения</h2><span>Обновлено {format(data.updatedAt)}</span></div>{data.history.slice(-5).reverse().map((entry, i) => <div key={`${entry.at}-${i}`}><span>{entry.text}</span><small>{entry.author} · {format(entry.at)}</small></div>)}</section>
    </> : <>
      <div className="hub-page-heading"><div><span className="hub-eyebrow">ИИ В СТРОИТЕЛЬСТВЕ</span><h1>{activeSection.name}</h1><p>{{ decisions: "Итоги встречи 8 октября и решения, которые ещё предстоит принять.", topics: "Предложения коллег и рабочий вариант первого мероприятия.", tasks: "Ответственные, сроки и текущий ход подготовки.", discussion: "Вопросы, мнения и предложения рабочей команды.", guide: "Что проверить до, во время и после мероприятия.", materials: "Наши исследования и демонстрации для подготовки программы.", overview: "" }[section]}</p></div>{section === "topics" && <button className="hub-button" onClick={() => setPropose(true)}><Icon name="plus"/>Предложить тему</button>}</div>
      {section === "decisions" && <RecordList name="decisions"/>}
      {section === "tasks" && <RecordList name="tasks"/>}
      {section === "topics" && <><RecordList name="topics"/><section className="hub-panel hub-agenda"><div className="hub-section-heading"><div><span className="hub-eyebrow">РАБОЧИЙ ВАРИАНТ</span><h2>Программа · {agendaTotal} минут</h2></div>{admin && <button className="hub-button small" onClick={() => setEditor({ collection: "agenda" })}>Добавить блок</button>}</div><p className="hub-muted">Порядок и длительность обсуждаем. Участие спикеров нужно подтвердить.</p>{data.agenda.map((r, i) => <div className="hub-agenda-row" key={r.id}><span className="hub-row-number">{String(i + 1).padStart(2, "0")}</span><div><strong>{r.title}</strong><p>{r.body}</p><small>{r.owner || "Спикер не определён"} · {r.status}</small></div><span className="hub-minutes">{r.minutes} мин</span>{admin && <button className="hub-icon-button" aria-label={`Изменить блок ${r.title}`} onClick={() => setEditor({ collection: "agenda", record: r })}><Icon name="edit"/></button>}</div>)}</section></>}
      {section === "discussion" && <div className="hub-discussion-grid"><section className="hub-panel"><Field label="Обсуждаем"><select value={target} onChange={e => setTarget(e.target.value)}><option value="general">Общее обсуждение</option>{records.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}</select></Field><h2 className="hub-discussion-title">{discussionTitle}</h2>{data.comments.filter(c => c.target === target).map(c => <article key={c.id} className="hub-comment"><div className="hub-comment-author"><span className="hub-avatar">{c.author.slice(0, 1)}</span><div><strong>{c.author}</strong><small>{format(c.createdAt)}</small></div></div><p>{c.body}</p></article>)}{!data.comments.some(c => c.target === target) && <div className="hub-empty"><Icon name="chat"/><h3>Начните разговор</h3><p>Задайте вопрос или предложите следующий шаг.</p></div>}<form className="hub-comment-form" onSubmit={e => { e.preventDefault(); const form = e.currentTarget; const body = new FormData(form).get("body"); act({ action: "comment", body, target }, () => form.reset()) }}><Field label="Ваше имя (по желанию)"><input value={author} onChange={e => rememberAuthor(e.target.value)} maxLength={100} placeholder="Имя и компания"/></Field><Field label="Ваш комментарий"><textarea name="body" placeholder="Что стоит уточнить или сделать?" required maxLength={4000} rows={4}/></Field><button className="hub-button" disabled={busy}>{busy ? "Сохраняем…" : "Опубликовать комментарий"}</button></form></section><aside className="hub-discussion-note"><span className="hub-stat-icon violet"><Icon name="spark"/></span><h2>Помогаем принять решение</h2><p>Конкретный пример из вашей работы полезнее общего утверждения.</p><ul><li>Какую задачу решаем?</li><li>Что уже пробовали?</li><li>Что предлагаете проверить?</li><li>Какой следующий шаг?</li></ul><p>Организатор переносит согласованные выводы в договорённости и задачи.</p></aside></div>}
      {section === "guide" && <><div className="hub-guide-tabs" role="group" aria-label="Этап мероприятия">{guide.map(g => <button key={g.id} aria-pressed={phase === g.id} onClick={() => setPhase(g.id)}>{g.label}</button>)}</div>{guide.filter(g => g.id === phase).map(g => <section key={g.id} className="hub-guide"><div className="hub-guide-intro"><div><span className="hub-eyebrow">ПАМЯТКА ОРГАНИЗАТОРУ</span><h2>{g.title}</h2><p>{g.intro}</p></div><div className="hub-field-photo"><span className="hub-image-caption">Иллюстративное изображение</span></div></div><div className="hub-guide-assessment"><article><span className="hub-badge green">На что опираемся</span><p>{g.good}</p></article><article><span className="hub-badge orange">Что может помешать</span><p>{g.risk}</p></article></div><div className="hub-panel"><h3>Проверяем готовность</h3>{g.checks.map(([checkId, title, description]) => <label key={checkId} className="hub-check-row"><input type="checkbox" checked={!!data.checks[checkId]} disabled={!admin || busy} onChange={e => act({ action: "check", id: checkId, value: e.target.checked })}/><span><strong>{title}</strong><small>{description}</small></span></label>)}{!admin && <p className="hub-muted">Готовность отмечает организатор. Предложения можно оставить в обсуждении.</p>}</div><div className="hub-guide-source">Основа памятки: наша рабочая встреча и <a href="https://www.cvent.com/en/blog/events/conference-planning" target="_blank" rel="noreferrer">руководство Cvent по подготовке конференций</a>.</div></section>)}</>}
      {section === "materials" && <><div className="hub-materials-grid">{materials.map(m => <a key={m.href} className="hub-material" href={m.href} target="_blank" rel="noreferrer"><span className={`hub-stat-icon ${m.color}`}><Icon name="book"/></span><small>{m.label}</small><h2>{m.title}</h2><p>{m.description}</p><span className="hub-material-link">Открыть материал</span></a>)}</div><section className="hub-panel hub-method-note"><h2>Как использовать исследования</h2><p>Общая концепция охватывает больше тем, чем конференция. Выбираем несколько примеров для первого мероприятия, остальные сохраняем для продолжения. Статусы решений и доступность инструментов проверяем перед показом.</p></section></>}
    </>}
    <footer className="hub-footer"><span>Рабочая площадка организаторов · Строим практику</span><span>Данные обновлены {format(data.updatedAt)}</span></footer></main></div>

    {editor && <Modal error={error} title={editor.record ? "Изменить запись" : `Добавить · ${collectionTitle[editor.collection]}`} close={() => setEditor(null)}><form onSubmit={e => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget)); act({ action: "save", collection: editor.collection, id: editor.record?.id, updatedAt: editor.record?.updatedAt, ...values }, () => setEditor(null)) }}><Field label="Название"><input name="title" defaultValue={editor.record?.title} required maxLength={180}/></Field><Field label="Содержание"><textarea name="body" defaultValue={editor.record?.body} maxLength={6000} rows={5}/></Field><div className="hub-form-grid"><Field label="Статус"><select name="status" defaultValue={editor.record?.status || statuses[editor.collection][0]}>{statuses[editor.collection].map(s => <option key={s}>{s}</option>)}</select></Field><Field label="Ответственный"><input name="owner" defaultValue={editor.record?.owner} maxLength={160} placeholder="Назначить после согласования"/></Field><Field label="Срок"><input type="date" name="due" defaultValue={editor.record?.due}/></Field>{editor.collection === "agenda" && <Field label="Длительность, минут"><input name="minutes" type="number" defaultValue={editor.record?.minutes || 20} min={1} max={180} required/></Field>}</div><div className="hub-form-actions"><button className="hub-button" disabled={busy}>Сохранить</button>{editor.record && <button type="button" className="hub-delete" disabled={busy} onClick={() => { if (confirm("Удалить эту запись? Комментарии останутся в истории обсуждения.")) act({ action: "delete", collection: editor.collection, id: editor.record!.id, updatedAt: editor.record!.updatedAt }, () => setEditor(null)) }}>Удалить</button>}</div></form></Modal>}
    {settings && <Modal error={error} title="Параметры мероприятия" close={() => setSettings(false)}><form onSubmit={e => { e.preventDefault(); act({ action: "meta", updatedAt: data.updatedAt, ...Object.fromEntries(new FormData(e.currentTarget)) }, () => setSettings(false)) }}><Field label="Название"><input name="title" defaultValue={data.meta.title} required maxLength={160}/></Field><Field label="Цель конференции"><textarea name="goal" defaultValue={data.meta.goal} required maxLength={1000} rows={3}/></Field><Field label="Дата или окно проведения"><input name="date" defaultValue={data.meta.date} maxLength={200}/></Field><Field label="Площадка"><input name="venue" defaultValue={data.meta.venue} maxLength={200}/></Field><Field label="Аудитория"><textarea name="audience" defaultValue={data.meta.audience} maxLength={500} rows={2}/></Field><div className="hub-form-grid"><Field label="Общий чат"><select name="messenger" defaultValue={data.meta.messenger}><option value="">Ещё не выбран</option><option>Telegram</option><option>WhatsApp</option><option>MAX</option></select></Field><Field label="Ссылка приглашения в группу"><input name="chatUrl" defaultValue={data.meta.chatUrl} type="url" placeholder="https://…" maxLength={500}/></Field></div><button className="hub-button" disabled={busy}>Сохранить параметры</button></form></Modal>}
    {propose && <Modal error={error} title="Предложить тему" close={() => setPropose(false)}><p className="hub-muted">Опишите задачу и что можно показать участникам. Организатор обсудит её включение в программу.</p><form onSubmit={e => { e.preventDefault(); act({ action: "propose", ...Object.fromEntries(new FormData(e.currentTarget)) }, () => setPropose(false)) }}><Field label="Ваше имя (по желанию)"><input value={author} onChange={e => rememberAuthor(e.target.value)} maxLength={100} placeholder="Имя и компания"/></Field><Field label="Название темы"><input name="title" required maxLength={180}/></Field><Field label="Задача и пример"><textarea name="body" required maxLength={4000} rows={5} placeholder="Кому полезно, какую задачу решает, есть ли пример для показа"/></Field><button className="hub-button" disabled={busy}>Отправить предложение</button></form></Modal>}
    {team && <Modal error={error} title="Ссылка для коллег" close={() => { setTeam(false); setInvitation("") }}><p className="hub-muted">Передайте эту общую ссылку коллегам. Она сразу открывает площадку: можно читать материалы, писать комментарии и предлагать темы. Имя можно указать прямо при публикации.</p>{invitation ? <div className="hub-invite-result"><textarea aria-label="Общая ссылка для коллег" value={invitation} readOnly rows={3}/><button className="hub-button" onClick={() => navigator.clipboard.writeText(invitation).then(() => setNotice("Ссылка скопирована")).catch(() => setError("Выделите и скопируйте ссылку вручную."))}>Скопировать ссылку</button></div> : <p>Загружаем ссылку…</p>}<p className="hub-muted">Ваша отдельная ссылка организатора позволяет менять договорённости, задачи и программу.</p><button className="hub-text-button hub-export" onClick={() => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "stroim-praktiku.json"; link.click(); URL.revokeObjectURL(url) }}>Скачать копию договорённостей и обсуждений</button></Modal>}
  </div>
}
