import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import CtaLink from "@/components/public/CtaLink";
import { SITE_URL, breadcrumbListSchema, personSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "О студии",
  description:
    "Компактная команда: ядро ведёт задачу от постановки до результата, под проект подключаются профильные специалисты. Двенадцать лет проектов для промышленности, госсектора и крупного бизнеса.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "О студии — Veretennikov Studio",
    description:
      "Как устроена команда, как мы ставим задачу и почему визуальная культура помогает в технологических проектах.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
};

const CLIENTS = [
  "Белоярская АЭС",
  "Ростелеком",
  "Уральские Авиалинии",
  "УБРиР",
  "Таркет",
  "УрФУ им. Бориса Ельцина",
  "Технэкс",
  "Промэлектроника",
  "СКБ Контур",
  "Деловые Линии",
  "Биосмарт",
  "Miele",
];

const TIMELINE = [
  {
    period: "2014 →",
    title: "Производство",
    body:
      "Начиналось с видео: режиссура, съёмка, монтаж, VFX. Промышленные площадки, технологические зоны, объекты с пропускным режимом. Отсюда — привычка разбираться в предмете до того, как что-то снимать, и опыт участия в государственных закупках.",
  },
  {
    period: "2019 →",
    title: "3D, интерактив, цифровые среды",
    body:
      "Появились задачи, которые камера не решала: показать устройство машины, объяснить технологический процесс, дать заказчику потрогать продукт на выставке. Так к съёмке добавились 3D-визуализация, анимация процессов и интерактивные форматы.",
  },
  {
    period: "2023 →",
    title: "Системы и платформы",
    body:
      "Стало ясно, что часть задач вообще не про контент: заказчику нужен был не фильм, а работающий инструмент. Появились платформы — образовательные, отраслевые, аналитические. И вместе с ними — практика ставить задачу до того, как выбрана технология.",
  },
  {
    period: "2025 →",
    title: "ИИ и автоматизация процессов",
    body:
      "Языковые модели сделали доступным то, что раньше требовало отдела: разбор документов, поиск по накопленным знаниям, помощники специалистов. Мы взялись за это с той же стороны, с какой всегда — сначала разобраться в процессе, потом считать, и только потом строить.",
  },
];

const PRINCIPLES = [
  {
    t: "Сначала задача, потом технология",
    d: "Заказчик редко приходит с готовым ТЗ — обычно с ситуацией. Наша работа начинается с того, чтобы понять, что на самом деле нужно сделать, и это часто отличается от первоначальной формулировки.",
  },
  {
    t: "Отделять ИИ от не-ИИ",
    d: "Часть задач честнее и дешевле закрывается обычной интеграцией или изменением регламента. Мы говорим это вслух, даже когда за ИИ-проект заплатили бы больше.",
  },
  {
    t: "Измеримость до обещаний",
    d: "Мы не называем процентов эффективности, пока не замерили baseline. Обещание без измерения — это не продажа, это заявка на конфликт при приёмке.",
  },
  {
    t: "Точка возврата на каждом шаге",
    d: "Разбор, диагностика, пилот, внедрение — из каждого этапа можно выйти с результатом на руках. Мы не строим проекты, из которых нельзя выйти.",
  },
  {
    t: "Сложное не значит непонятное",
    d: "Любую систему можно объяснить. Вопрос не в упрощении — упрощение убивает суть, — а в том, чтобы найти правильный уровень детализации для конкретной аудитории.",
  },
  {
    t: "Меньше, но лучше",
    d: "Мы не берём всё подряд. Лучше несколько проектов в год, за которые не стыдно, чем двадцать, в которых уверены наполовину.",
  },
];

export default function AboutPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "О студии", url: `${SITE_URL}/about` },
    ]),
    // Person отдаётся только здесь: на остальных страницах бренд — команда
    personSchema,
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-12 md:pt-16 pb-11">
            <p className="eyebrow mb-6">О студии · Екатеринбург, с 2014 года</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                maxWidth: "20ch",
                animation: "none",
              }}
            >
              Делаем сложное понятным{" "}
              <span className="studio-accent">
                — и работающим.
              </span>
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.12rem)", maxWidth: "64ch" }}
            >
              Двенадцать лет мы работаем с теми, у кого сложный продукт: заводы,
              производители оборудования, инфраструктурные организации, банки,
              госсектор. Сначала мы объясняли их технологии визуально. Потом
              стали строить системы для их процессов. Обе части требуют одного
              и того же — разобраться в предмете глубже, чем требует
              формальное задание.
            </p>
          </div>
        </div>
      </section>

      {/* Как устроена команда */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
            <div>
              <p className="eyebrow mb-6">Как устроена команда · 02</p>
              <h2
                className="display mb-5"
                style={{
                  fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
                  letterSpacing: "-0.022em",
                  lineHeight: 1.15,
                  maxWidth: "22ch",
                  animation: "none",
                }}
              >
                Ядро и профильные специалисты под задачу.
              </h2>
              <p className="text-[var(--ink-2)] leading-[1.7] mb-4" style={{ fontSize: "15.5px" }}>
                Постановку задачи, архитектуру решения и ответственность
                за результат ведёт ядро студии. Под каждый проект собирается
                состав из профильных специалистов: разработка, данные, 3D,
                съёмка, монтаж, предметная экспертиза.
              </p>
              <p className="text-[var(--ink-2)] leading-[1.7] mb-4" style={{ fontSize: "15.5px" }}>
                Мы не держим сто человек в штате, чтобы продавать их часы,
                и не передаём проект на субподряд целиком. За результат
                отвечает один человек, и вы всегда знаете, кто он.
              </p>
              <p className="text-[var(--ink-3)] leading-[1.65]" style={{ fontSize: "14px" }}>
                Основатель студии — Анатолий Веретенников: продюсер, режиссёр,
                автор методики корпоративных программ по ИИ. Он ведёт постановку
                задачи и остаётся на связи по проекту до сдачи.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px self-start" style={{ background: "var(--rule)" }}>
              {[
                ["Постановка задачи", "интервью, разбор процесса, приоритеты"],
                ["Архитектура", "как решение устроено и во что встраивается"],
                ["Разработка", "backend, frontend, интеграции, данные"],
                ["ИИ и данные", "модели, поиск, качество ответов"],
                ["Продакшн", "съёмка, монтаж, звук, режиссура"],
                ["3D и графика", "визуализация, анимация, VFX, motion"],
              ].map(([t, d]) => (
                <div key={t} className="p-5" style={{ background: "var(--paper-2)" }}>
                  <p
                    className="display mb-1.5"
                    style={{ fontSize: "14.5px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.25, animation: "none" }}
                  >
                    {t}
                  </p>
                  <p className="text-[var(--ink-3)] leading-[1.45]" style={{ fontSize: "12.5px" }}>
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Как мы сюда пришли */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-9">Как мы сюда пришли · 03</p>
          {TIMELINE.map((t, i) => (
            <div
              key={t.period}
              className="scroll-reveal grid grid-cols-1 lg:grid-cols-[120px_260px_1fr] gap-y-2 lg:gap-8 border-t border-[var(--rule)] py-7 lg:items-baseline"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                className="font-mono text-[13px] tracking-[0.04em]"
                style={{ color: i === TIMELINE.length - 1 ? "var(--cobalt)" : "var(--ink-3)" }}
              >
                {t.period}
              </span>
              <h3
                className="display"
                style={{ fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 500, letterSpacing: "-0.016em", lineHeight: 1.2, animation: "none" }}
              >
                {t.title}
              </h3>
              <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "14.5px" }}>
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Почему визуальная культура помогает в IT */}
      <section
        style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p
            className="font-mono mb-7"
            style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% 0.02 75)" }}
          >
            Почему это одна компания · 04
          </p>
          <h2
            className="display mb-7"
            style={{
              fontSize: "clamp(1.7rem, 3.6vw, 2.9rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "var(--paper)",
              maxWidth: "26ch",
              animation: "none",
            }}
          >
            Умение объяснить сложное — это инженерный навык, а не украшение.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-[100ch]">
            <p style={{ fontSize: "15.5px", color: "oklch(86% 0.02 75)", lineHeight: 1.7 }}>
              Чтобы снять фильм о технологическом процессе, надо понять этот
              процесс — иначе получится красивый ролик, из которого ничего
              не ясно. Двенадцать лет мы этим и занимались: разбирались
              в чужом производстве до уровня, на котором можно объяснить его
              человеку со стороны.
            </p>
            <p style={{ fontSize: "15.5px", color: "oklch(86% 0.02 75)", lineHeight: 1.7 }}>
              Ровно тот же навык нужен, чтобы автоматизировать процесс:
              сначала понять, как он работает на самом деле. Поэтому наши
              интерфейсы обычно понятны без инструкции, а отчёты по диагностике
              читаются людьми, а не только ИТ-службой.
            </p>
          </div>
        </div>
      </section>

      {/* Принципы */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-9">
            <p className="eyebrow">Принципы работы · 05</p>
            <Link
              href="/manifesto"
              className="font-mono text-[12px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
            >
              Манифест целиком →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {PRINCIPLES.map((p, i) => (
              <div key={p.t} className="border-t border-[var(--rule)] pt-5">
                <p className="font-mono text-[10px] text-[var(--ink-4)] mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="display mb-2"
                  style={{ fontSize: "16.5px", fontWeight: 500, letterSpacing: "-0.013em", lineHeight: 1.3, animation: "none" }}
                >
                  {p.t}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "14px" }}>
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Клиенты + лаборатория */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <p className="eyebrow mb-6">Выполненные проекты для · 06</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 mb-5">
                {CLIENTS.map((c) => (
                  <span key={c} className="text-[var(--ink-2)]" style={{ fontSize: "15px" }}>
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-[var(--ink-3)] leading-[1.6] mb-4" style={{ fontSize: "13.5px", maxWidth: "48ch" }}>
                Часть работ выполнена под соглашениями о конфиденциальности
                и показана в портфолио без названия заказчика.
              </p>
              <Link
                href="/cases"
                className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
              >
                Смотреть работы →
              </Link>
            </div>

            <div>
              <p className="eyebrow mb-6">Исследования и лаборатория · 07</p>
              <p className="text-[var(--ink-2)] leading-[1.65] mb-4" style={{ fontSize: "15px", maxWidth: "50ch" }}>
                Отдельно от заказных проектов мы ведём собственные разработки
                и отраслевые исследования — от симуляций эмерджентного
                поведения до анализа рынка корпоративного ИИ в регионе.
                Это не витрина, а способ держать инженерную форму и проверять
                гипотезы на своих деньгах, а не на клиентских.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link
                  href="/lab"
                  className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
                >
                  Лаборатория →
                </Link>
                <Link
                  href="/blog"
                  className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
                >
                  Разборы →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14 lg:items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-4"
              style={{
                fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.026em",
                fontVariationSettings: '"opsz" 48',
                animation: "none",
              }}
            >
              Познакомимся на конкретной задаче.
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.65] max-w-[52ch]" style={{ fontSize: "15.5px" }}>
              Сорок минут по одному вашему процессу расскажут о нас больше,
              чем эта страница.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CtaLink
              href="/razbor"
              goalName="razbor_cta"
              goalParams={{ place: "about" }}
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Разобрать процесс →
            </CtaLink>
            <Link
              href="/contact"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Контакты
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
