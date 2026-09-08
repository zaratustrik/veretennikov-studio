import type { Metadata } from "next"
import QuestionForm from "./QuestionForm"

export const metadata: Metadata = {
  title: { absolute: "AI-процессы для СОСПП — закрытый рабочий бриф" },
  description:
    "Закрытый рабочий бриф: как одним методом автоматизировать рутинные процессы СОСПП с помощью AI-инструментов. Два кейса — актуализация реестра и анализ НПА.",
  robots: { index: false, follow: false },
}

/* ── Данные ────────────────────────────────────────────────────────── */

const METHOD = [
  ["Подписка на AI-инструмент", "Среда, где агент пишет и исполняет код по вашим указаниям, — а не «чат с нейросетью».", "Codex · Claude Code"],
  ["Формулируем задачу", "Что на входе и что на выходе. Чёткое ТЗ — половина результата.", null],
  ["Даём контекст", "Источники, структура данных, правила обработки и обезличивания, ограничения и требования безопасности.", null],
  ["Агент пишет код: бэкенд, база, фронтенд", "Бэкенд — сбор и сверка; база — данные и история; фронтенд — кабинет «загрузил → получил результат». Человек направляет и проверяет.", null],
  ["Тестируем на реальных данных", "Прогон на обезличенных кейсах, проверка по источникам, итерации с агентом — до надёжного результата.", null],
  ["Запускаем", "Разворачиваем сервис, настраиваем доступы и ключи. Данные и ключи остаются под контролем Союза.", null],
  ["Поддерживаем", "Регулярный запуск и доработки под изменения форматов источников и новые требования.", null],
]

const PRINCIPLES = [
  ["ИИ не заменяет эксперта.", "Он сокращает путь от сырого документа до проверяемого черновика — но не принимает решений."],
  ["Источник важнее красивого текста.", "Каждый вывод привязан к пункту документа, ответу предприятия или прежней позиции Союза."],
  ["Сначала обезличивание — потом анализ.", "Чувствительные данные не уходят во внешний ИИ. Реквизиты, контакты и подписи удаляются заранее."],
  ["Финал утверждает человек.", "Официальные формулировки, выбор адресатов и решения остаются за сотрудником СОСПП."],
]

const FIELDS: [string, string, "fns" | "open" | "web"][] = [
  ["Наименование", "ЕГРЮЛ", "fns"],
  ["Адрес ЮЛ", "ЕГРЮЛ", "fns"],
  ["ОГРН", "ЕГРЮЛ", "fns"],
  ["ИНН", "ЕГРЮЛ", "fns"],
  ["КПП", "ЕГРЮЛ", "fns"],
  ["Руководящие органы ЮЛ", "ЕГРЮЛ", "fns"],
  ["ОКВЭД — код и расшифровка", "ЕГРЮЛ", "fns"],
  ["Численность работников", "Открытые данные ФНС", "open"],
  ["Телефон", "Сайт · проверка", "web"],
  ["Электронная почта", "Сайт · проверка", "web"],
]

const REESTR_FLOW = [
  ["Берём ИНН из реестра", "Ключ, по которому собираются остальные данные."],
  ["Запрашиваем ЕГРЮЛ", "Официальная выписка ФНС: наименование, адрес, КПП, руководитель, ОКВЭД, статус."],
  ["Добавляем численность", "Из открытого набора данных ФНС — сопоставление по ИНН."],
  ["Собираем контакты", "Телефон и e-mail с сайта компании — с пометкой «проверить»."],
  ["Сверяем с прошлой версией", "Что изменилось: переименования, смена руководителя и адреса, ликвидации."],
  ["Реестр + лист «Что изменилось»", "Обновлённый файл с подсветкой и сводкой качества."],
]

const NPA_ROUTE = [
  ["Получить пакет", "Проект НПА, действующая редакция, предложения экспертов и ответы предприятий в разных форматах."],
  ["Извлечь и обезличить", "Тексты читаются напрямую, сканы — через OCR. До ИИ удаляются названия, реквизиты, контакты, подписи."],
  ["Разобрать изменения", "Резюме, таблица изменений, зоны риска, вопросы к бизнесу — со ссылками на пункты документа."],
  ["Выбрать адресатов", "Тема НПА сопоставляется с признаками предприятий: отрасль, комитет, ОКВЭД, регион, вид деятельности."],
  ["Собрать ответы", "Формы, письма, DOCX, PDF и сканы — в единую таблицу: позиция, аргумент, риск, предложение, источник."],
  ["Собрать позицию", "ИИ группирует мнения, выделяет повторы и спорные места. Финальную позицию утверждает человек."],
]

const NPA_CASE = [
  ["Вход", "Пять типов источников", "Проект НПА, действующая редакция, приложение с предложениями, ответ компании в DOCX и сканированный ответ с таблицей замечаний."],
  ["Суть", "Не «пересказать», а оценить", "Изменения в разрешительных документах, риск-категориях, профилактических визитах, дистанционном контроле, индикаторах риска и сроках."],
  ["Результат", "Карта позиции", "Сравнение редакций, практические последствия, группировка замечаний «Компании А / Б» и черновик письма со ссылками на источники."],
]

const CONTOUR: [string, string, string][] = [
  ["Вход", "Документы", "НПА, письма, DOCX, PDF, сканы"],
  ["Бэкенд", "Обработка", "API, OCR, правила отбора, очереди"],
  ["База", "Хранение", "предприятия, признаки, ответы"],
  ["ИИ-слой", "Анализ", "сводка, классификация, черновики"],
  ["Интерфейс", "Проверка", "загрузка, выбор адресатов, утверждение"],
  ["Выход", "Результат", "письмо, сводка, позиция в правительство"],
]

const SAFETY_NO = [
  "Названия компаний и групп",
  "ФИО, должности, подписи, контакты",
  "ИНН, КПП, банковские реквизиты",
  "Бланки, логотипы, адреса",
  "Номера и листы согласования писем",
]

const SAFETY_YES = [
  "Отраслевую роль («крупное предприятие»)",
  "Тип аргумента и обезличенное замечание",
  "Ссылку на пункт НПА",
  "Общий вывод без идентификаторов",
  "Публичные данные ЕГРЮЛ и открытых наборов",
]

const START = [
  "1–2 обезличенных НПА или проект с удалёнными служебными данными.",
  "Пример письма предприятиям по похожей теме.",
  "Учебный список 15–30 предприятий с признаками: отрасль, комитет, регион, вид деятельности.",
  "5–10 обезличенных ответов предприятий в разных форматах: форма, DOCX, PDF, скан.",
  "Пример финальной позиции, которую Союз отправлял в правительство.",
  "Критерии релевантности и список данных, которые нельзя отправлять во внешние ИИ-сервисы.",
]

const TIMELINE = [
  ["Неделя 0", "Фиксация процесса", "Описываем текущий путь как есть."],
  ["Неделя 1", "Карта данных", "Источники, форматы, финальные результаты."],
  ["Неделя 2", "Рабочий контур", "Интерфейс, база, загрузка, черновики."],
  ["Неделя 3", "Проверка", "Тест на 2–3 старых кейсах против ручной работы."],
  ["Неделя 4", "Решение", "Эффект, риски, нужен ли локальный контур."],
]

/* ── Хелперы вёрстки ───────────────────────────────────────────────── */

const CONTAINER = "mx-auto px-5 md:px-8"
const CMAX = { maxWidth: "var(--content-max)" } as const
const PAD = { paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" } as const
const H2 = {
  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  animation: "none",
} as const

function NumRow({ i, title, desc, tag }: { i: number; title: string; desc: string; tag?: string | null }) {
  return (
    <li className="grid grid-cols-[44px_1fr] gap-5 md:gap-6 py-5 border-t border-[var(--rule)] last:border-b items-baseline">
      <span className="font-mono text-[12px] text-[var(--ink-3)]">{String(i).padStart(2, "0")}</span>
      <div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="display text-[var(--ink)]" style={{ fontSize: "clamp(1.05rem,1.6vw,1.3rem)", lineHeight: 1.2 }}>
            {title}
          </span>
          {tag && (
            <span className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cobalt)", border: "1px solid var(--cobalt)", padding: "2px 7px", borderRadius: 2 }}>
              {tag}
            </span>
          )}
        </div>
        <p className="text-[var(--ink-2)] mt-1.5" style={{ fontSize: "14px", lineHeight: 1.6 }}>{desc}</p>
      </div>
    </li>
  )
}

/* ── Страница ──────────────────────────────────────────────────────── */

export default function SosppBriefPage() {
  return (
    <>
      {/* ── Masthead + Hero ─────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div className={CONTAINER} style={CMAX}>
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Закрытый бриф · СОСПП</span>
            <span className="eyebrow text-center hidden md:block">AI-процессы</span>
            <span className="eyebrow text-right">Не для индексации</span>
          </div>

          <div className="pt-16 md:pt-20 pb-12">
            <p className="eyebrow mb-7">Рабочий бриф · для обсуждения</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                marginBottom: "32px",
                animation: "none",
              }}
            >
              ИИ готовит черновики. Союз принимает{" "}
              <span style={{ color: "var(--cobalt)" }}>решения.</span>
            </h1>
            <p className="text-[var(--ink-2)] leading-[1.7] max-w-[700px]" style={{ fontSize: "clamp(1rem, 1.25vw, 1.15rem)" }}>
              Как одним методом — с помощью AI-инструментов вроде{" "}
              <span className="text-[var(--ink)]">Codex</span> и{" "}
              <span className="text-[var(--ink)]">Claude&nbsp;Code</span> — автоматизировать
              рутинные процессы СОСПП. На двух примерах: актуализация реестра членов и анализ
              НПА с позицией отрасли. Это объяснение принципа, а не предложение внедрения.
            </p>

            {/* Содержание */}
            <ol className="mt-12 grid sm:grid-cols-2 gap-x-12">
              {[
                ["01", "Метод", "7 шагов"],
                ["02", "Принципы", "4 правила"],
                ["03", "Кейс: реестр", "474 орг."],
                ["04", "Кейс: НПА", "позиция"],
                ["05", "Безопасность", "данные"],
                ["06", "С чего начать", "4 недели"],
              ].map(([n, t, m]) => (
                <li key={n} className="flex items-baseline gap-4 py-3 border-t border-[var(--rule)]">
                  <span className="font-mono text-[12px] text-[var(--cobalt)] font-medium">{n}</span>
                  <span className="text-[var(--ink)]" style={{ fontSize: "15px" }}>{t}</span>
                  <span className="flex-1 border-b border-dotted border-[var(--rule-strong)] translate-y-[-3px]" />
                  <span className="font-mono text-[11px] text-[var(--ink-3)] uppercase tracking-[0.05em]">{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 01 Метод ────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Метод · 01</p>
              <h2 className="display" style={H2}>
                От подписки на AI-инструмент{" "}
                <span className="studio-accent">до работающего сервиса.</span>
              </h2>
              <p className="text-[var(--ink-2)] mt-5 leading-[1.7]" style={{ fontSize: "14px" }}>
                Большая команда разработки не нужна. Агент пишет, запускает и правит код —
                человек ставит задачу, даёт контекст и проверяет каждый шаг.
              </p>
            </div>
            <ol className="flex flex-col">
              {METHOD.map(([t, d, tag], i) => (
                <NumRow key={t} i={i + 1} title={t!} desc={d!} tag={tag} />
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 02 Принципы ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)] bg-[var(--paper-1)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <p className="eyebrow mb-7">Принципы · 02</p>
          <h2 className="display mb-12" style={{ ...H2, maxWidth: "780px" }}>
            Четыре правила,{" "}
            <span className="studio-accent">общие для обоих процессов.</span>
          </h2>
          <ol className="flex flex-col">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[44px_1fr] gap-5 md:gap-6 py-7 border-t border-[var(--rule)] last:border-b items-baseline">
                <span className="font-mono text-[12px] text-[var(--cobalt)] font-medium">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="display text-[var(--ink)]" style={{ fontSize: "clamp(1.3rem,2.6vw,1.8rem)", lineHeight: 1.2 }}>{t}</p>
                  <p className="text-[var(--ink-2)] mt-2 leading-[1.6]" style={{ fontSize: "15px", maxWidth: "60ch" }}>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 03 Кейс: реестр ─────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--paper)", background: "var(--ink)", padding: "4px 9px" }}>Кейс 01</span>
            <span className="eyebrow">Данные · ежеквартально</span>
          </div>
          <h2 className="display mb-5" style={{ ...H2, maxWidth: "820px" }}>
            Реестр членов, который{" "}
            <span style={{ color: "var(--cobalt)" }}>сам остаётся актуальным.</span>
          </h2>
          <p className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-12" style={{ fontSize: "15px" }}>
            474 организации, 10 полей. Раз в квартал сервис собирает данные из официальных
            источников и показывает, что изменилось — переименования, смена руководителя, ликвидации.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Поля */}
            <div>
              <p className="eyebrow mb-1">Что обновляется — и откуда</p>
              <ol className="flex flex-col">
                {FIELDS.map(([nm, src, kind], i) => (
                  <li key={nm} className="grid grid-cols-[32px_1fr_auto] gap-3 items-center py-3 border-t border-[var(--rule)] last:border-b">
                    <span className="font-mono text-[11px] text-[var(--ink-3)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[var(--ink)]" style={{ fontSize: "14px" }}>{nm}</span>
                    <span
                      className="font-mono whitespace-nowrap"
                      style={{
                        fontSize: "9.5px", letterSpacing: "0.04em", textTransform: "uppercase",
                        padding: "3px 8px", borderRadius: 2,
                        color: kind === "fns" ? "var(--cobalt)" : "var(--ink-3)",
                        border: `1px solid ${kind === "fns" ? "var(--cobalt)" : "var(--rule-strong)"}`,
                      }}
                    >
                      {src}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--ink-3)]">
                <span>ЕГРЮЛ — официальный реестр</span>
                <span>Открытые данные ФНС — раз в год</span>
                <span>Сайт — требует подтверждения</span>
              </div>
            </div>

            {/* Конвейер */}
            <div>
              <p className="eyebrow mb-1">Как работает при каждом запуске</p>
              <ol className="flex flex-col">
                {REESTR_FLOW.map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[32px_1fr] gap-4 py-4 border-t border-[var(--rule)] last:border-b">
                    <span className="font-mono text-[11px] mt-0.5" style={{ color: i === REESTR_FLOW.length - 1 ? "var(--cobalt)" : "var(--ink-3)" }}>
                      {i === REESTR_FLOW.length - 1 ? "→" : String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[var(--ink)] font-medium" style={{ fontSize: "14px" }}>{t}</p>
                      <p className="text-[var(--ink-2)] mt-0.5 leading-[1.55]" style={{ fontSize: "13px" }}>{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 Кейс: НПА ────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)] bg-[var(--paper-1)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--paper)", background: "var(--cobalt)", padding: "4px 9px" }}>Кейс 02</span>
            <span className="eyebrow">Документы · регулирование</span>
          </div>
          <h2 className="display mb-5" style={{ ...H2, maxWidth: "820px" }}>
            Анализ НПА и{" "}
            <span className="studio-accent">позиция отрасли.</span>
          </h2>
          <p className="text-[var(--ink-2)] leading-[1.7] max-w-[700px] mb-12" style={{ fontSize: "15px" }}>
            Проект НПА → выбор релевантных предприятий → сбор обратной связи → черновик позиции
            Союза для органов власти. ИИ готовит карту последствий, человек утверждает формулировки.
          </p>

          <p className="eyebrow mb-4">Маршрут одного цикла — шесть шагов</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px mb-14" style={{ background: "var(--rule)", border: "1px solid var(--rule)" }}>
            {NPA_ROUTE.map(([t, d], i) => (
              <div key={t} className="p-5" style={{ background: "var(--paper-1)" }}>
                <span className="font-mono text-[12px] text-[var(--cobalt)] font-medium">{String(i + 1).padStart(2, "0")}</span>
                <p className="display text-[var(--ink)] mt-2" style={{ fontSize: "1.1rem", lineHeight: 1.2 }}>{t}</p>
                <p className="text-[var(--ink-2)] mt-1.5 leading-[1.55]" style={{ fontSize: "13px" }}>{d}</p>
              </div>
            ))}
          </div>

          <p className="eyebrow mb-5">Реальный обезличенный кейс — экологический контроль</p>
          <div className="grid md:grid-cols-3 gap-8">
            {NPA_CASE.map(([tag, t, d]) => (
              <div key={tag} className="border-t-2 border-[var(--ink)] pt-4">
                <span className="font-mono text-[11px] text-[var(--cobalt)] uppercase tracking-[0.05em] font-medium">{tag}</span>
                <p className="display text-[var(--ink)] mt-1.5 mb-2" style={{ fontSize: "1.2rem", lineHeight: 1.2 }}>{t}</p>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14px" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Контур (инверсия + чертёж) ──────────────────────────────── */}
      <section style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className={CONTAINER} style={CMAX}>
          <p className="font-mono mb-7" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% 0.02 75)" }}>
            Контур · 04
          </p>
          <h2 className="display mb-10" style={{ fontSize: "clamp(1.8rem, 3.6vw, 3rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--paper)", maxWidth: "880px", animation: "none" }}>
            Первый рабочий контур проще, чем{" "}
            <span style={{ color: "var(--cobalt-tint)" }}>«большой ИИ-проект».</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-px" style={{ background: "oklch(34% 0.02 255)" }}>
            {CONTOUR.map(([label, t, d]) => (
              <div key={label} className="p-4" style={{ background: "var(--ink)" }}>
                <span className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cobalt-tint)", fontWeight: 500 }}>{label}</span>
                <p className="display mt-2" style={{ fontSize: "1.05rem", lineHeight: 1.2, color: "var(--paper)" }}>{t}</p>
                <p className="font-mono mt-2" style={{ fontSize: "10.5px", lineHeight: 1.5, color: "oklch(72% 0.02 75)" }}>{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-[1.7] max-w-[640px]" style={{ fontSize: "14px", color: "oklch(82% 0.02 75)" }}>
            Для старта достаточно одного процесса, одного типа НПА, одной базы предприятий и
            понятного результата.
          </p>
        </div>
      </section>

      {/* ── 05 Безопасность ─────────────────────────────────────────── */}
      <section className="border-b border-t border-[var(--rule)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <p className="eyebrow mb-7">Безопасность · 05</p>
          <h2 className="display mb-8" style={{ ...H2, maxWidth: "780px" }}>
            Официальные источники,{" "}
            <span className="studio-accent">данные остаются у Союза.</span>
          </h2>

          <div className="flex gap-4 items-start p-5 mb-12" style={{ background: "var(--paper-2)", borderLeft: "2px solid var(--cobalt)" }}>
            <span className="font-mono text-[var(--cobalt)] font-medium shrink-0" style={{ fontSize: "11px", letterSpacing: "0.08em", paddingTop: "2px" }}>ПРАВИЛО</span>
            <p className="text-[var(--ink)] leading-[1.6]" style={{ fontSize: "15px" }}>
              В ИИ-контур не попадают фирменные бланки, подписи, телефоны, почта, адреса,
              ИНН/КПП, банковские реквизиты и номера писем. Что нельзя отдать подрядчику без
              NDA — нельзя загружать в открытый сервис.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-20">
            <div>
              <h3 className="font-mono pb-3 mb-1 border-b-2 border-[var(--ink)]" style={{ fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--ink)" }}>Не уходит во внешний ИИ</h3>
              <ul>
                {SAFETY_NO.map((t) => (
                  <li key={t} className="flex gap-3 py-3 border-b border-[var(--rule)] text-[var(--ink-2)]" style={{ fontSize: "14px" }}>
                    <span className="font-mono text-[var(--ink-3)] shrink-0">×</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono pb-3 mb-1 border-b-2 border-[var(--cobalt)]" style={{ fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--cobalt)" }}>Можно оставить</h3>
              <ul>
                {SAFETY_YES.map((t) => (
                  <li key={t} className="flex gap-3 py-3 border-b border-[var(--rule)] text-[var(--ink-2)]" style={{ fontSize: "14px" }}>
                    <span className="font-mono text-[var(--cobalt)] shrink-0">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 С чего начать ────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)] bg-[var(--paper-1)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">С чего начать · 06</p>
              <h2 className="display" style={H2}>
                Минимальный набор{" "}
                <span className="studio-accent">от СОСПП.</span>
              </h2>
              <p className="text-[var(--ink-2)] mt-5 leading-[1.7]" style={{ fontSize: "14px" }}>
                Данные дают обезличенно. Главное — чтобы они отражали реальную структуру процесса.
              </p>
            </div>
            <div>
              <ol className="flex flex-col mb-12">
                {START.map((t, i) => (
                  <li key={t} className="grid grid-cols-[44px_1fr] gap-6 py-4 border-t border-[var(--rule)] last:border-b items-baseline">
                    <span className="font-mono text-[12px] text-[var(--cobalt)] font-medium">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[var(--ink)]" style={{ fontSize: "15px", lineHeight: 1.55 }}>{t}</span>
                  </li>
                ))}
              </ol>

              <p className="eyebrow mb-4">Реалистичный запуск — четыре недели</p>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-px" style={{ background: "var(--rule)", border: "1px solid var(--rule)" }}>
                {TIMELINE.map(([w, t, d]) => (
                  <div key={w} className="p-4" style={{ background: "var(--paper)", borderTop: "3px solid var(--cobalt)" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-[var(--cobalt)] font-medium">{w}</span>
                    <p className="display text-[var(--ink)] mt-1.5" style={{ fontSize: "1rem", lineHeight: 1.2 }}>{t}</p>
                    <p className="text-[var(--ink-3)] mt-1 leading-[1.5]" style={{ fontSize: "12px" }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Закрытие ────────────────────────────────────────────────── */}
      <section style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: "var(--s-10)", paddingBottom: "var(--s-10)" }}>
        <div className={`${CONTAINER} text-center`} style={CMAX}>
          <h2 className="display mx-auto" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.06, letterSpacing: "-0.025em", fontVariationSettings: '"opsz" 60', color: "var(--paper)", maxWidth: "18ch", animation: "none" }}>
            Один метод — разные{" "}
            <span style={{ color: "var(--cobalt-tint)" }}>процессы Союза.</span>
          </h2>
          <p className="mx-auto leading-[1.7] mt-6 mb-9" style={{ fontSize: "clamp(1rem,1.2vw,1.1rem)", color: "oklch(85% 0.02 75)", maxWidth: "54ch" }}>
            Это объяснение принципа, а не предложение внедрения. Современные AI-инструменты
            позволяют собрать и поддерживать подобную автоматизацию небольшими силами — и тот же
            подход применим к любым реестрам, документам и рутинным процессам с данными.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-mono"
            style={{ fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase", border: "1px solid var(--paper)", color: "var(--paper)", padding: "14px 22px" }}
          >
            Задать вопрос →
          </a>
        </div>
      </section>

      {/* ── 07 Обсудить — форма вопроса ─────────────────────────────── */}
      <section id="contact" className="border-t border-[var(--rule)]" style={PAD}>
        <div className={CONTAINER} style={CMAX}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Обсудить · 07</p>
              <h2 className="display" style={H2}>
                Задать вопрос{" "}
                <span className="studio-accent">по решению.</span>
              </h2>
              <p className="text-[var(--ink-2)] mt-5 leading-[1.7]" style={{ fontSize: "14px" }}>
                Коротко опишите вопрос — отвечу лично. Это не публичная форма: обращение
                видно только команде студии.
              </p>
            </div>
            <QuestionForm />
          </div>
        </div>
      </section>
    </>
  )
}
