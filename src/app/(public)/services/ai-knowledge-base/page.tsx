import FaqList from "@/components/public/FaqList";
import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/ai-knowledge-base`

export const metadata: Metadata = {
  title: "База знаний и RAG для предприятия",
  description:
    "Корпоративная база знаний на AI: отвечает по вашим данным с указанием источников, не выдумывает. On-premise, 152-ФЗ, интеграция с 1С и Битрикс24. Для промышленности и госсектора.",
  alternates: { canonical: "/services/ai-knowledge-base" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "База знаний и RAG для предприятия — Veretennikov Studio",
    description:
      "AI-система, которая отвечает по вашим данным с источниками. On-premise, 152-ФЗ. Лестница: аудит → пилот → внедрение → поддержка.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

// The signature element: a productized stage ladder (structure, not prices).
const LADDER = [
  {
    n: "01",
    title: "Аудит",
    time: "1–2 недели",
    body:
      "Инвентаризируем источники: что где лежит, в каком формате, кто отвечает. Документируем целевые сценарии и снимаем baseline — сколько занимают самые сложные запросы «вручную» сейчас.",
    out: "Карта данных · правила доступа · список сценариев",
  },
  {
    n: "02",
    title: "Пилот",
    time: "4–8 недель",
    body:
      "Работающий прототип на части данных. Семантическая схема сущностей, гибридный retrieval, тестовый набор вопросов с эталонными ответами. Доказываем, что система отвечает — с измеримой точностью.",
    out: "Прототип · метрики качества · решение go / no-go",
  },
  {
    n: "03",
    title: "Внедрение",
    time: "2–4 месяца",
    body:
      "Production: подключение всех источников, RBAC и матрица доступа, интеграции с 1С / Битрикс24 / почтой, guardrails против галлюцинаций, развёртывание on-premise при необходимости.",
    out: "Рабочая система · интеграции · документация",
  },
  {
    n: "04",
    title: "Поддержка",
    time: "постоянно",
    body:
      "Регулярная переиндексация, мониторинг качества ответов, улучшение по обратной связи, обновление семантической схемы по мере изменения компании. Метрика «сколько раз система сказала не знаю» — KPI на рост базы.",
    out: "SLA · отчёты руководству · развитие базы",
  },
]

const CAPABILITIES = [
  "Семантический слой: явная схема сущностей и связей вашей предметной области",
  "Гибридный retrieval — vector ловит «о чём речь», граф уточняет по связям",
  "Source attribution: к каждому ответу ссылка на исходный документ",
  "Guardrails: при низкой уверенности система говорит «не знаю», не выдумывает",
  "RBAC и матрица доступа — каждая роль видит только свои типы документов",
  "Интеграции с 1С, Битрикс24, корпоративной почтой и порталами",
  "On-premise развёртывание — данные не покидают ваш контур",
  "Self-hosted модели (Qwen, Llama) для чувствительных данных",
  "Аудит запросов: кто, что спросил, какой ответ и из каких источников",
]

const SCENARIOS = [
  {
    q: "«Какие позиции мы заявляли по этому вопросу за последние 5 лет?»",
    body: "Сквозной поиск по протоколам, письмам и официальным документам — за секунды вместо часов разбора папок.",
  },
  {
    q: "«Кто из команды уже работал с этим заказчиком / ведомством?»",
    body: "Связи между людьми, проектами и контрагентами, которые сейчас живут только в головах ключевых сотрудников.",
  },
  {
    q: "«Готов ли пакет материалов по теме X?»",
    body: "Статус и комплектность по теме, собранные из разных источников в один ответ с ссылками.",
  },
  {
    q: "«Как мы обычно решаем такую задачу?»",
    body: "Tacit knowledge — неявный опыт компании, извлечённый из переписки, тикетов и документов, а не из мёртвой wiki.",
  },
  {
    q: "«Что изменилось в регламенте с прошлой версии?»",
    body: "Версионность с историей и diff — система показывает, что и когда поменялось, и кто внёс правку.",
  },
  {
    q: "«Эти два документа противоречат друг другу?»",
    body: "Система не выбирает молча — показывает обе версии и просит ответственного решить.",
  },
]

const TRIGGERS = [
  "Поиск по сетевым папкам возвращает 50 файлов, релевантный — на пятой странице",
  "Решения по сквозным вопросам разбросаны по протоколам без единой нумерации тем",
  "Новый сотрудник входит в курс дела месяцами — за счёт «как мы тут работаем»",
  "Ключевые знания живут в головах трёх-пяти человек, и это риск",
  "Данные чувствительные — нужен on-premise и соответствие 152-ФЗ",
  "Уже пробовали «чат-бота», но он выдумывал и подставлял компанию",
]

const FAQ = [
  {
    question: "Будет ли система «фантазировать» как ChatGPT?",
    answer:
      "Нет. Мы строим на RAG: модель отвечает только по вашей проверенной базе, с указанием источника каждого факта. Если ответа в данных нет — система честно говорит «не знаю», а не выдумывает. Guardrails и тестирование на пограничных случаях — обязательная часть внедрения. Метрику галлюцинаций (hallucination rate) держим ниже 5%.",
  },
  {
    question: "Данные не утекут? У нас режимная информация.",
    answer:
      "Возможно полностью on-premise развёртывание — система работает на вашей инфраструктуре, данные не покидают контур. Для чувствительных задач используем self-hosted модели (Qwen, Llama) без обращений к внешним API. Соответствие 152-ФЗ, RBAC по типам документов, аудит каждого запроса. Подходит для госсектора, банков и промышленности.",
  },
  {
    question: "Чем это отличается от обычного поиска или wiki?",
    answer:
      "Полнотекстовый поиск находит файлы по словам — вы дальше читаете сами. Wiki стареет и умирает: около 40% страниц не открываются за год. Наша система отвечает на вопрос по сути, агрегируя информацию из разных источников, обходя связи между сущностями, и приводит ссылки. Это разница между «нашёл 50 документов» и «вот ответ и вот откуда он».",
  },
  {
    question: "Сколько это занимает и с чего начать?",
    answer:
      "Работаем лестницей: аудит (1–2 недели) → пилот (4–8 недель) → внедрение (2–4 месяца) → поддержка. Начать разумно с аудита — он дёшев, снимает baseline и даёт понимание объёма работ и точную смету остальных этапов без обязательств идти дальше.",
  },
  {
    question: "Что если у нас данные в беспорядке?",
    answer:
      "Это норма, и часть работы. На аудите определяем границы: начинаем со структурного (реестры, протоколы, регламенты), деграды (сканы, неструктурированные таблицы) разбираем отдельно. Самый важный и при этом самый дешёвый этап — семантический слой: договориться, что в компании считать «клиентом», «договором», «проектом». От качества схемы зависит всё остальное.",
  },
  {
    question: "Как формируется стоимость?",
    answer:
      "Зависит от объёма и состояния источников, требований к инфраструктуре (облако / on-premise), числа интеграций и глубины семантической схемы. Точную смету по этапам собираем после аудита. Поддержка — отдельной ежемесячной строкой.",
  },
]

export default function AiKnowledgeBasePage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "База знаний и RAG для предприятия", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "База знаний и RAG для предприятия",
      description:
        "Корпоративная база знаний на AI с on-premise развёртыванием и соответствием 152-ФЗ для промышленности и госсектора.",
      url: PAGE_URL,
      serviceType: "Разработка корпоративных баз знаний и RAG-систем",
    }),
    faqPageSchema(FAQ),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Header + Hero ────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Флагманская услуга · AI</span>
            <span className="eyebrow text-center hidden md:block">Studio Quarterly</span>
            <span className="eyebrow text-right">On-premise · 152-ФЗ</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">База знаний и RAG для предприятия</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                marginBottom: "32px",
                maxWidth: "20ch",
                animation: "none",
              }}
            >
              Система, которая отвечает по вашим данным.{" "}
              <span className="studio-accent">
                С источниками. На вашей инфраструктуре.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Корпоративные знания не теряются — они просто не находятся.
              Мы собираем их в единый слой и даём AI-систему, которая
              отвечает на вопросы по вашим документам с указанием источника,
              не выдумывает и честно говорит «не знаю». Для промышленности
              и госсектора — с развёртыванием on-premise и по 152-ФЗ.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=ai-knowledge-base"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--ink-2)] transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить проект
                <span>→</span>
              </Link>
              <Link
                href="/diagnostika"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Как проходит диагностика
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Проблема · 02</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Wiki не умирает от нехватки.{" "}
                <span className="studio-accent">
                  Она умирает от того, что её не найти.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                В любой компании за годы накапливается огромный объём знаний —
                протоколы, регламенты, переписка, реестры, история решений.
                Но около 40% страниц корпоративной базы не открываются за год,
                поиск возвращает десятки файлов вместо ответа, а самое ценное —
                опыт «как мы это делаем» — живёт в головах трёх-пяти человек.
              </p>
              <p className="text-[var(--ink-3)]">
                За последние два года у этих знаний появился новый потребитель —
                AI-агенты, которые работают ровно настолько хорошо, насколько
                им доступен контекст. Состояние базы знаний перестало быть
                вопросом удобства сотрудников. Это стало прямым ограничителем
                скорости компании.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Ladder (signature) ───────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex justify-between items-baseline mb-12 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-6">Как мы работаем · 03</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  maxWidth: "16ch",
                  animation: "none",
                }}
              >
                Четыре этапа.{" "}
                <span style={{ fontStyle: "italic", color: "var(--cobalt)" }}>
                  Каждый — точка возврата.
                </span>
              </h2>
            </div>
            <span className="eyebrow">от 6 недель до MVP</span>
          </div>

          <div>
            {LADDER.map((s, i) => (
              <div
                key={s.n}
                className="grid grid-cols-1 lg:grid-cols-[90px_minmax(0,1.1fr)_minmax(0,1.4fr)] gap-y-3 lg:gap-x-10 border-t border-[var(--rule)] last:border-b py-9"
              >
                <div
                  className="font-mono leading-none"
                  style={{
                    fontSize: "clamp(36px, 4vw, 56px)",
                    color: i === 0 ? "var(--cobalt)" : "var(--ink-4)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <h3
                    className="display mb-2"
                    style={{
                      fontSize: "clamp(20px, 2.2vw, 28px)",
                      fontWeight: 500,
                      letterSpacing: "-0.018em",
                      lineHeight: 1.1,
                      animation: "none",
                    }}
                  >
                    {s.title}
                  </h3>
                  <span className="font-mono text-[12px] tracking-[0.04em] text-[var(--ink-3)]">
                    {s.time}
                  </span>
                </div>
                <div>
                  <p className="text-[var(--ink-2)] leading-[1.65] mb-3" style={{ fontSize: "14px" }}>
                    {s.body}
                  </p>
                  <p
                    className="font-mono text-[11px] tracking-[0.04em] uppercase"
                    style={{ color: i === 0 ? "var(--cobalt)" : "var(--ink-3)" }}
                  >
                    На выходе: {s.out}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[var(--ink-3)] leading-[1.6] mt-7" style={{ fontSize: "13px", maxWidth: "60ch" }}>
            Самый дешёвый и при этом самый важный этап — семантический слой
            на пилоте. От качества схемы зависит вся последующая работа.
          </p>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Что внутри · 04</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Гибрид vector + graph —{" "}
                <span className="studio-accent">
                  стандарт продакшен-внедрений.
                </span>
              </h2>
            </div>
            <ol className="flex flex-col">
              {CAPABILITIES.map((item, i) => (
                <li
                  key={item}
                  className="grid grid-cols-[44px_1fr] gap-6 py-5 border-t border-[var(--rule)] last:border-b items-baseline"
                >
                  <span className="font-mono text-[12px] text-[var(--ink-3)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--ink)]" style={{ fontSize: "15px", lineHeight: 1.55 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Trust / compliance (ink inversion) ───────────────────── */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          paddingTop: "var(--s-10)",
          paddingBottom: "var(--s-10)",
        }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p
            className="font-mono mb-8"
            style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--cobalt-tint)" }}
          >
            Безопасность · 05
          </p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 60',
              color: "var(--paper)",
              maxWidth: "900px",
              animation: "none",
            }}
          >
            Данные{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              не покидают
            </span>{" "}
            ваш <span style={{ color: "var(--cobalt-tint)" }}>контур.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-px border-t border-b" style={{ background: "oklch(28% 0.04 255)", borderColor: "oklch(28% 0.04 255)" }}>
            {[
              ["On-premise", "Система разворачивается на вашей инфраструктуре. Никакие данные не уходят во внешние сервисы."],
              ["152-ФЗ", "Локализация данных в РФ, соответствие требованиям. Подходит для госсектора, банков и промышленности."],
              ["Self-hosted модели", "Для чувствительных данных — open-source модели (Qwen, Llama) без обращений к зарубежным API."],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "28px 24px", background: "var(--ink)" }}>
                <div
                  className="font-mono mb-2.5"
                  style={{ fontSize: "10.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--cobalt-tint)" }}
                >
                  {k}
                </div>
                <div style={{ fontSize: "15px", color: "oklch(88% 0.015 75)", lineHeight: 1.55 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenarios ────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="mb-12">
            <p className="eyebrow mb-6">На какие вопросы отвечает · 06</p>
            <h2
              className="display"
              style={{
                fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "800px",
                animation: "none",
              }}
            >
              Если система отвечает на это за 30 секунд —{" "}
              <span style={{ color: "var(--cobalt)" }}>она работает.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {SCENARIOS.map((s, i) => (
              <div key={s.q} className="bg-[var(--paper)] p-7 lg:p-9">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase mb-4" style={{ color: i === 0 ? "var(--cobalt)" : "var(--ink-3)" }}>
                  Q/{String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="display text-[var(--ink)] mb-3"
                  style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", lineHeight: 1.3, letterSpacing: "-0.012em", fontStyle: "italic", animation: "none" }}
                >
                  {s.q}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14px" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof / credibility ──────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Опыт · 07</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Мы это{" "}
                <span className="studio-accent">
                  не только проектируем — мы про это пишем.
                </span>
              </h2>
            </div>
            <div className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]" style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}>
              <p>
                Один из проектов — корпоративная база знаний для регионального
                союза промышленников: сотни компаний-членов, профильные комитеты,
                многолетняя история решений и официальных позиций. Система
                отвечает на сквозные вопросы, которые раньше требовали часов
                ручного разбора протоколов.
              </p>
              <p>
                Мы разобрали тему глубоко в отдельной статье — почему классические
                wiki не работают, чем гибрид RAG + GraphRAG отличается от наивного
                подхода, и куда всё это движется к 2030 году.
              </p>
              <Link
                href="/blog/korporativnaya-baza-znaniy-posle-ai-agentov"
                className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.04em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
              >
                Читать статью: корпоративная база знаний после ИИ-агентов →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Triggers ─────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-7">Когда это нужно · 08</p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "780px",
              animation: "none",
            }}
          >
            Шесть сигналов,{" "}
            <span className="studio-accent">
              что база знаний окупится.
            </span>
          </h2>

          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {TRIGGERS.map((t) => (
              <li key={t} className="flex items-baseline gap-3 py-2 border-t border-[var(--rule)]">
                <span className="block w-1 h-1 rounded-full bg-[var(--cobalt)] mt-2 shrink-0" />
                <span className="text-[var(--ink-2)]" style={{ fontSize: "14px", lineHeight: 1.55 }}>
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">FAQ · 09</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Что обычно спрашивают{" "}
                <span className="studio-accent">
                  до подписания брифа.
                </span>
              </h2>
            </div>
            <div className="flex flex-col">
              <FaqList items={FAQ} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Related ──────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-7)", paddingBottom: "var(--s-7)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-6">Связанные направления</p>
          <div className="flex flex-wrap gap-3">
            {[
              ["/services/ai-automation", "AI Automation"],
              ["/services/ai-sales-assistant", "AI Sales & Knowledge Assistant"],
              ["/diagnostika", "Диагностика процессов"],
              ["/services", "Все услуги"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
                style={{ fontSize: "13px", borderRadius: 2 }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-10)", paddingBottom: "var(--s-10)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                animation: "none",
              }}
            >
              Начните с аудита —{" "}
              <span style={{ color: "var(--cobalt)" }}>без обязательств идти дальше.</span>
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]" style={{ fontSize: "15px" }}>
              Аудит снимает baseline, картирует источники и даёт точную смету
              остальных этапов. Заполните бриф — отвечу лично в течение
              рабочего дня и предложу формат пилота.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=ai-knowledge-base"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--ink-2)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить проект →
            </Link>
            <Link
              href="/diagnostika"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Провести аудит
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{ fontSize: "11px", letterSpacing: "0.04em", marginTop: "8px" }}
            >
              On-premise · 152-ФЗ · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
