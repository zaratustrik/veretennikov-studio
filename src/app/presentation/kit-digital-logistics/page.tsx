import { ChapterNav } from "@/components/kit-proposal/ChapterNav"
import { ControlTowerMock } from "@/components/kit-proposal/ControlTowerMock"
import { HorizonToggle } from "@/components/kit-proposal/HorizonToggle"
import { JourneyStrip } from "@/components/kit-proposal/JourneyStrip"
import { PageFooter } from "@/components/kit-proposal/PageFooter"
import { Reveal } from "@/components/kit-proposal/Reveal"
import { StageCard } from "@/components/kit-proposal/StageCard"
import {
  ArchitectureMap,
  CargoHierarchy,
  LayerGap,
  PipelineVsRegular,
  RoadmapStrip,
  TrailerCustody,
  WhyNowTimelines,
} from "@/components/kit-proposal/diagrams/CoreDiagrams"
import {
  Bullets,
  Callout,
  ConfidenceBadge,
  DeepDiveLink,
  Figure,
  SectionHead,
  SourceRef,
  StatGrid,
} from "@/components/kit-proposal/shared"

import capabilitiesJson from "@/data/kit-proposal/capabilities.json"
import chaptersJson from "@/data/kit-proposal/chapters.json"
import journeyJson from "@/data/kit-proposal/journey.json"
import metaJson from "@/data/kit-proposal/meta.json"
import questionsJson from "@/data/kit-proposal/questions.json"
import risksJson from "@/data/kit-proposal/risks.json"
import stagesJson from "@/data/kit-proposal/stages.json"
import statsJson from "@/data/kit-proposal/stats.json"
import systemsJson from "@/data/kit-proposal/systems.json"

import type {
  Capability,
  Chapter,
  JourneyStep,
  Meta,
  Question,
  Risk,
  Stage,
  Stat,
  SystemItem,
} from "@/types/kit-proposal"

const meta = metaJson as unknown as Meta
const chapters = chaptersJson as unknown as Chapter[]
const stats = statsJson as unknown as Stat[]
const systems = systemsJson as unknown as SystemItem[]
const journey = journeyJson as unknown as JourneyStep[]
const capabilities = capabilitiesJson as unknown as Capability[]
const stages = stagesJson as unknown as Stage[]
const risks = risksJson as unknown as Risk[]
const questions = questionsJson as unknown as Question[]

const BASE = "/presentation/kit-digital-logistics"

export default function KitProposalPage() {
  return (
    <>
      <ChapterNav chapters={chapters} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="kdl-hero">
        <div className="kdl-wrap">
          <p className="kdl-hero-eyebrow">ТК КИТ · закрытый проектный документ</p>
          <h1>{meta.title}</h1>
          <p className="kdl-hero-sub">{meta.subtitle}</p>
          <div className="kdl-hero-meta">
            <span>
              <b>{meta.stamp}</b>
            </span>
            <span>
              Подготовлено: <b>{meta.author}</b>, {meta.authorRole}
            </span>
            <span>
              Данные проверены: <b>{meta.checkedAt}</b>
            </span>
          </div>
        </div>
      </header>

      <main>
        {/* ── 01 · О ЧЁМ ЭТО ЗА 60 СЕКУНД ───────────────────── */}
        <section className="kdl-section" id="summary">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="01 · О чём это за 60 секунд"
              title="Короткая версия, если дальше читать некогда"
            />

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 40 }}>
              <Reveal>
                <div className="kdl-card">
                  <h3 className="kdl-h3">Чего мы не предлагаем</h3>
                  <div style={{ marginTop: 14 }}>
                    <Bullets
                      items={[
                        "Не заменяем работающие системы компании",
                        "Не разрабатываем беспилотный автомобиль",
                        "Не переписываем Veeroute — он остаётся планировщиком города",
                        "Не строим цифровой двойник дороги: это зона владельца трассы",
                        "Не называем стоимость до обследования",
                      ]}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="kdl-card">
                  <h3 className="kdl-h3">Что предлагаем</h3>
                  <div style={{ marginTop: 14 }}>
                    <Bullets
                      items={[
                        "Определить, есть ли разрыв между существующими системами",
                        "Если есть — закрыть его слоем, который управляет магистральным плечом, полуприцепом и узлом",
                        "Построить этот слой так, чтобы автономные исполнители подключались позже без переделки ядра",
                        "Измерить эффект относительно подписанного baseline, а не обещать его",
                      ]}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="kdl-card">
                  <h3 className="kdl-h3">С чего начинаем</h3>
                  <div style={{ marginTop: 14 }}>
                    <Bullets
                      items={[
                        "Один реальный рейс от заказа до закрытия — на ваших системах",
                        "Один терминал как прототип узла",
                        "Обезличенные данные за 1–3 месяца по одному направлению",
                        "Через 4–6 недель — фактическая картина и решение, что именно строить",
                      ]}
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            <div style={{ marginTop: 40 }}>
              <Callout wide>
                Проект устроен так, чтобы после первого этапа он мог стать <strong>меньше</strong>, а не
                обязательно больше. Это не фигура речи: один из пяти вопросов, которые мы задаём, способен
                сократить объём работ до набора интеграций.
              </Callout>
            </div>
          </div>
        </section>

        {/* ── 02 · ПОЧЕМУ СЕЙЧАС ────────────────────────────── */}
        <section className="kdl-section" id="why-now">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="02 · Почему сейчас"
              title="Три линии сходятся в одной точке во времени"
              lead="Аргумент не в том, что «наступает эра беспилотников». Аргумент в том, что три независимых процесса — операционный, инфраструктурный и технологический — впервые оказались в одной фазе."
            />

            <div style={{ marginTop: 44 }} className="kdl-svg-scroll">
              <Figure
                caption="Совпадение трёх линий"
                note="Каждая линия развивалась самостоятельно. Их пересечение и есть окно, в котором цифровую основу выгоднее строить до прихода новых исполнителей, а не после."
              >
                <WhyNowTimelines />
              </Figure>
            </div>

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 48 }}>
              <div className="kdl-card">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Операционная
                </h3>
                <p className="kdl-body" style={{ marginTop: 10, fontSize: 15 }}>
                  Компания последовательно переходит от ручного операционного планирования к специализированным
                  инструментам, работающим на данных: автоматическая маршрутизация городской доставки в
                  промышленной эксплуатации с июля 2026 <SourceRef id="SRC-05" />, переход на электронные
                  перевозочные документы <SourceRef id="SRC-06" />, мобильное приложение и ИИ-сервисы для
                  клиентов <SourceRef id="SRC-10" />.
                </p>
              </div>

              <div className="kdl-card">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Инфраструктурная
                </h3>
                <p className="kdl-body" style={{ marginTop: 10, fontSize: 15 }}>
                  М-12 дошла до Урала в июле 2025 года, продление до Тюмени планируется к концу 2026-го
                  <SourceRef id="SRC-12" />. Свердловская область включена в экспериментальный правовой режим
                  по беспилотным грузоперевозкам, продлённый до 12 ноября 2028 года <SourceRef id="SRC-08" />.
                </p>
              </div>

              <div className="kdl-card">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Технологическая
                </h3>
                <p className="kdl-body" style={{ marginTop: 10, fontSize: 15 }}>
                  Автономность приходит неравномерно. Двор, складская робототехника и роботы последней мили
                  уже в промышленной эксплуатации <SourceRef id="SRC-14" /> <SourceRef id="SRC-17" />, тогда
                  как магистральные беспилотники работают в рамках экспериментального режима, а федеральный
                  закон о них не принят пятый год подряд <SourceRef id="SRC-09" />.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 · ЧТО УЖЕ ЕСТЬ ─────────────────────────────── */}
        <section className="kdl-section" id="what-exists">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="03 · Что уже есть у КИТ"
              title="Мы начали с того, что посмотрели, что у вас работает"
              lead="Всё ниже — из открытых источников по состоянию на 12 августа 2026 года. Мы намеренно не строим предположений о том, чего не видим."
            />

            <div style={{ marginTop: 44 }}>
              <StatGrid items={stats} />
              <p className="kdl-small" style={{ marginTop: 18 }}>
                Данные официального сайта компании <SourceRef id="SRC-01" />
              </p>
            </div>

            <div style={{ marginTop: 56 }}>
              <h3 className="kdl-h3">Цифровой контур</h3>
              <div className="kdl-tablewrap" style={{ marginTop: 18 }}>
                <table className="kdl-table">
                  <thead>
                    <tr>
                      <th style={{ width: "22%" }}>Система</th>
                      <th style={{ width: "20%" }}>Назначение</th>
                      <th>Что известно</th>
                      <th style={{ width: "16%" }}>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systems.map((s) => (
                      <tr key={s.name}>
                        <td>{s.name}</td>
                        <td>{s.kind}</td>
                        <td>
                          {s.note} {s.source ? <SourceRef id={s.source} /> : null}
                        </td>
                        <td>
                          <ConfidenceBadge level={s.confidence} short />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: 44 }}>
              <Callout wide>
                Мы не предлагаем заменить работающие системы. Публичные данные показывают активный переход
                компании от ручного операционного планирования к специализированным инструментам на данных.
                Какая часть <strong>магистрального</strong> планирования уже автоматизирована — один из
                ключевых вопросов первого этапа обследования.
              </Callout>
            </div>
          </div>
        </section>

        {/* ── 04 · ГРУЗОПРОВОД ──────────────────────────────── */}
        <section className="kdl-section" id="pipeline">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="04 · Грузопровод™ сегодня"
              title="Механизм не в перецепке. Механизм в режиме труда и отдыха"
              lead="Это важно понять точно, потому что отсюда следует вся остальная логика проекта."
            />

            <div style={{ marginTop: 40 }} className="kdl-svg-scroll">
              <Figure caption="Что даёт технология">
                <PipelineVsRegular />
              </Figure>
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 48 }}>
              <div>
                <p className="kdl-body">
                  Компания формулирует эффект прямо: скорость перевозки выросла на 25–30 %, полуприцеп
                  проходит не 700–800, а <strong>1 000–1 200 км, не нарушая режим труда и отдыха водителей</strong>
                  <SourceRef id="SRC-02" />. Груз идёт в полуприцепе как в передвижном складе, водители
                  сменяют друг друга.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  Отсюда следствие, на котором держится весь проект:{" "}
                  <strong>
                    каждые 1 000–1 200 км маршрута существует обязательная точка смены исполнителя
                  </strong>
                  . Она нужна сегодня — при водителях. Она понадобится завтра — при беспилотном плече. По
                  одной и той же причине.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  Эта точка и есть узел. Всё, что в нём происходит — расцепка, проверка, сцепка, ожидание
                  парного ресурса, — сегодня измеряется в лучшем случае косвенно.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  «М12 Приорити»: обязательство, за которое компания платит
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Доставка Москва — Екатеринбург за 27 часов вместо 72, соблюдение срока «час-в-час»,
                  цена без наценки за скорость и <strong>компенсация при опоздании</strong>
                  <SourceRef id="SRC-04" />.
                </p>
                <p className="kdl-body" style={{ marginTop: 14, fontSize: 15 }}>
                  Это меняет характер разговора о точности расчётного времени прибытия. Она перестаёт быть
                  метрикой качества и становится <strong>прямой защитой от выплат</strong>. Каждая минута
                  накопленного отклонения, замеченная поздно, имеет цену.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 · ОДИН РЕЙС ────────────────────────────────── */}
        <section className="kdl-section" id="journey">
          <div className="kdl-wrap kdl-wrap--wide">
            <div className="kdl-wrap" style={{ padding: 0, maxWidth: 1180 }}>
              <SectionHead
                eyebrow="05 · Один рейс как цифровой объект"
                title="Что система должна знать на каждом шаге"
                lead="Девять шагов одного рейса. На каждом — восемь атрибутов: план, исполнитель, событие, время, ответственность, факт, отклонение, стоимость. Выберите шаг."
              />
              <p className="kdl-small" style={{ marginTop: 18, maxWidth: "70ch" }}>
                <strong>Ответственность за груз</strong> — кто физически и юридически отвечает за грузовую
                единицу прямо сейчас. Жёлтым отмечено то, что, по нашей гипотезе, сегодня существует в
                решении диспетчера, а не в данных. Это предположение, требующее проверки, а не утверждение о
                ваших системах.
              </p>
            </div>

            <div style={{ marginTop: 36 }}>
              <JourneyStrip steps={journey} />
            </div>
          </div>
        </section>

        {/* ── 06 · КЛЮЧЕВАЯ ГИПОТЕЗА ────────────────────────── */}
        <section className="kdl-section" id="hypothesis">
          <div className="kdl-wrap">
            <SectionHead eyebrow="06 · Ключевая гипотеза" title="Формулируем как гипотезу, а не как вывод" />

            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <ConfidenceBadge level="hypothesis" />
            </div>

            <div style={{ marginTop: 20 }}>
              <Callout wide>
                Между клиентским и учётным ядром компании и специализированными системами может отсутствовать
                единый операционный слой, покрывающий магистральные плечи «Грузопровода», полуприцеп,
                передачу ответственности, узел перевалки и будущих автономных исполнителей.
              </Callout>
            </div>

            <div style={{ marginTop: 44 }} className="kdl-svg-scroll">
              <Figure caption="Где может проходить разрыв">
                <LayerGap />
              </Figure>
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 48 }}>
              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="signal" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Почему мы вообще проверяем эту гипотезу
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  После профильного совещания руководство компании самостоятельно обратилось с запросом о
                  возможной разработке информационной системы для будущей модели перевозок и автономной
                  логистики.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Это не публичный факт и не письменное техническое задание. Но это означает, что
                  функциональный разрыв существует <strong>с точки зрения самого руководства</strong>. Наша
                  задача — установить его реальную природу, а не додумать её за вас.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Как проверить — восемь конкретных проверок</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    dense
                    items={[
                      "Показать один реальный магистральный рейс на ваших экранах",
                      "Где принимается решение о плече",
                      "Где хранится план",
                      "Где фиксируется изменение плана",
                      "Где живёт полуприцеп как объект",
                      "Где записана перецепка",
                      "Где считается простой",
                      "Где сравниваются план и факт",
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 · ПОЛУПРИЦЕП ───────────────────────────────── */}
        <section className="kdl-section" id="trailer">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="07 · Полуприцеп — не атрибут рейса"
              title="Исполнители меняются. Грузовая единица остаётся"
              lead="Полуприцеп — единственный объект, который непрерывно существует через все смены тягача, водителя, перевозчика и, в будущем, поставщика автономности."
            />

            <div style={{ marginTop: 40 }} className="kdl-svg-scroll">
              <Figure caption="Постоянный объект и сменяемые исполнители">
                <TrailerCustody />
              </Figure>
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 48 }}>
              <div>
                <h3 className="kdl-h3">Что система должна знать о полуприцепе</h3>
                <div style={{ marginTop: 16 }}>
                  <Bullets
                    items={[
                      "Сквозной идентификатор, не зависящий от государственного номера",
                      "Где находится — в том числе после расцепки",
                      "Что внутри: какие отправления и какие места",
                      "Кем принят и кем передан, с точным временем",
                      "Состояние и целостность пломбы",
                      "Температурный режим, где он важен",
                      "Текущая задача и следующий исполнитель",
                    ]}
                  />
                </div>
              </div>

              <div>
                <div className="kdl-card kdl-card--pad">
                  <ConfidenceBadge level="question" />
                  <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                    Главная гипотетическая слепая зона
                  </h3>
                  <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                    Если телематика установлена на тягачах, а не на полуприцепах, то в момент расцепки
                    полуприцеп исчезает из систем до следующей сцепки. Восстановить, где он был и кто за него
                    отвечал, можно только по документам.
                  </p>
                  <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                    Мы не утверждаем, что это так. Мы говорим, что это первое, что нужно проверить, — потому
                    что от ответа объём работ отличается в разы.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 · ИЕРАРХИЯ ГРУЗА ───────────────────────────── */}
        <section className="kdl-section" id="cargo">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="08 · Иерархия груза"
              title="Решение, которое стоит копейки сейчас и очень дорого потом"
              lead="Сегодня магистрали достаточно знать полуприцеп. Завтра последней миле нужно знать конкретную коробку."
            />

            <div style={{ marginTop: 40 }} className="kdl-svg-scroll">
              <Figure caption="От отправления до отдельного места">
                <CargoHierarchy />
              </Figure>
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 48 }}>
              <div>
                <p className="kdl-body">
                  Чтобы передать отправление курьеру, положить в постамат, загрузить в робота или в
                  автономный фургон, система должна знать <strong>массу и габарит каждого места</strong> и
                  уметь выбрать подмножество, пригодное конкретному исполнителю.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  Если груз существует в информационных системах только на уровне полуприцепа,
                  автоматизированная последняя миля невозможна никогда — независимо от того, насколько
                  зрелой станет технология.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">И это нужно не в 2030 году</h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Уровень места нужен уже сегодня — чтобы сравнивать фактическую стоимость доставки курьером,
                  партнёром и постаматом и выбирать канал по деньгам, а не по привычке.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Резерв под будущее, который приносит пользу сегодня, — это признак того, что абстракция
                  выбрана правильно. Если бы уровень места был нужен только роботам, мы бы его не предлагали.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 · ЧТО МОЖЕТ ПОЯВИТЬСЯ ──────────────────────── */}
        <section className="kdl-section" id="capabilities">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="09 · Что может появиться"
              title="Шесть блоков вместо двадцати модулей"
              lead="Состав определяется после обследования. Не факт, что нужны все шесть — и это нормальный исход."
            />

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 44 }}>
              {capabilities.map((c, i) => (
                <Reveal key={c.id} delay={i * 60}>
                  <article className="kdl-card" style={{ height: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                      }}
                    >
                      <span className="kdl-toc-n">{c.n}</span>
                      <span className="kdl-badge" data-c={c.horizon === "A" ? "confirmed" : "hypothesis"}>
                        {c.horizon === "A" ? "Работает без беспилотников" : "Позже"}
                      </span>
                    </div>
                    <h3 className="kdl-h3" style={{ marginTop: 10 }}>
                      {c.title}
                    </h3>
                    <p className="kdl-body" style={{ marginTop: 12, fontSize: 14.5 }}>
                      {c.what}
                    </p>

                    <div style={{ marginTop: 18 }}>
                      <div className="kdl-attr-k">Какую проблему решает</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {c.problem}
                      </p>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div className="kdl-attr-k">Эффект</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {c.effect}
                      </p>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div className="kdl-attr-k">Какие данные нужны</div>
                      <div style={{ marginTop: 7 }}>
                        <Bullets dense items={c.data} />
                      </div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div className="kdl-attr-k">Что нужно для запуска</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {c.start}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10 · CONTROL TOWER ────────────────────────────── */}
        <section className="kdl-section kdl-section--ink" id="control-tower">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="10 · Control Tower"
              title="Не «дашборд», а ответ на один вопрос"
              lead="Что требует моего вмешательства прямо сейчас — до того, как отклонение станет срывом срока."
            />

            <div style={{ marginTop: 40 }}>
              <ControlTowerMock />
            </div>

            <p className="kdl-small" style={{ marginTop: 22, color: "#9AA6B6", maxWidth: "72ch" }}>
              Концептуальный интерфейс с демонстрационными данными. Он показывает, какую задачу экран должен
              закрывать, и не является утверждением о том, что такие данные у компании уже есть.
            </p>
          </div>
        </section>

        {/* ── 11 · АРХИТЕКТУРА ──────────────────────────────── */}
        <section className="kdl-section" id="architecture">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="11 · Архитектура в одной схеме"
              title="Абстрагируем контракты — не абстрагируем планировщики"
              lead="Разные миры остаются специализированными. Мы связываем их общими понятиями задачи, ресурса, ответственности и события."
            />

            <div style={{ marginTop: 40 }} className="kdl-svg-scroll">
              <Figure caption="Где проходят границы">
                <ArchitectureMap />
              </Figure>
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 48 }}>
              <div>
                <p className="kdl-body">
                  Соблазн в проектах такого класса — построить один универсальный планировщик всего. Это
                  ошибка: планирование городского маршрута, магистральной сети, задач складского робота и
                  полёта беспилотника подчиняются разным ограничениям и работают в разных масштабах времени.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  Общими должны быть <strong>контракты</strong>: что такое задача, что такое ресурс и его
                  способности, как передаётся ответственность за груз, как выглядит событие, как считается
                  стоимость. Они тонкие, стабильные и дешёвые.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  <strong>Адаптер</strong> — тонкий переходник к системе конкретного поставщика.{" "}
                  <strong>Локальный узел</strong> — вычислительный узел на площадке, позволяющий терминалу
                  продолжать критические операции при временной потере связи.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Veeroute остаётся</h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Это не конкурент предлагаемому решению, а работающий специализированный планировщик и
                  показательный прецедент: компания умеет выбирать внешний продукт под конкретную задачу и
                  интегрировать его во внутренние системы.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Мы предлагаем ровно ту же форму — специализированное решение под конкретный пробел, а не
                  замену того, что уже работает.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12 · ДВА ГОРИЗОНТА ────────────────────────────── */}
        <section className="kdl-section" id="horizons">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="12 · Два горизонта"
              title="Автономность — возможность, а не условие окупаемости"
              lead="Переключите горизонт: изменится только нижний ряд схемы. Всё остальное останется на месте."
            />

            <div style={{ marginTop: 40 }}>
              <HorizonToggle />
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 52 }}>
              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Что остаётся, даже если беспилотники не появятся</h3>
                <div style={{ marginTop: 16 }}>
                  <Bullets
                    items={[
                      "Воспроизводимое планирование магистральных плеч",
                      "Видимость полуприцепа в любой момент",
                      "Непрерывная история ответственности за груз",
                      "Сравнение плана и факта",
                      "Точность расчётного времени прибытия",
                      "Аналитика простоев",
                      "Эффективность узла",
                      "Единый операционный экран",
                      "Накопленный исторический датасет",
                      "Фактическая экономика плеча",
                    ]}
                  />
                </div>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Что происходит, когда беспилотник появляется</h3>
                <p
                  className="kdl-body"
                  style={{ marginTop: 14, fontFamily: "var(--kdl-font-mono)", fontSize: 13.5 }}
                >
                  Было: задача → тягач с водителем
                  <br />
                  Стало: задача → подбор по способностям → автономный тягач
                </p>
                <p className="kdl-body" style={{ marginTop: 16, fontSize: 15 }}>
                  Не меняются: заказ, груз, полуприцеп, задача, ответственность, событие, показатели,
                  экономика.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Меняются: исполнитель и адаптер. Это и есть проверка качества архитектуры — если для
                  подключения первого беспилотника пришлось менять ядро, значит оно было спроектировано
                  неверно, и мы узнаем об этом на одном поставщике, а не на пятом.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 44 }}>
              <Callout wide>
                Обратите внимание на неочевидное: <strong>автономность двора зрелее автономности
                магистрали</strong>. Терминальные тягачи уже работают без водителей в портах, а их объект —
                полуприцеп в узле, то есть ядро «Грузопровода» <SourceRef id="SRC-14" />.
              </Callout>
            </div>
          </div>
        </section>

        {/* ── 13 · ЭТАПЫ ────────────────────────────────────── */}
        <section className="kdl-section" id="stages">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="13 · Этапы"
              title="Поэтапно и останавливаемо"
              lead="Каждый этап заканчивается решением: продолжить, скорректировать или остановиться. Никаких многолетних обязательств с первого дня."
            />

            <div style={{ marginTop: 40 }} className="kdl-svg-scroll">
              <Figure caption="Шесть этапов и точки принятия решения">
                <RoadmapStrip />
              </Figure>
            </div>

            <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 12 }}>
              {stages.map((s, i) => (
                <StageCard key={s.id} stage={s} defaultOpen={i === 0} />
              ))}
            </div>

            <p className="kdl-small" style={{ marginTop: 24 }}>
              В каждой карточке последним идёт блок «что остаётся, если следующий этап не запускается». Это
              не формальность: этап, который нельзя остановить без потери вложенного, спроектирован
              неправильно.
            </p>
          </div>
        </section>

        {/* ── 14 · РИСКИ ────────────────────────────────────── */}
        <section className="kdl-section" id="risks">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="14 · Риски"
              title="Одиннадцать рисков и что мы с ними делаем"
              lead="Мы их не прячем и не превращаем в страшилку. Риск без ответа — это не честность, а безответственность."
            />

            <div className="kdl-tablewrap" style={{ marginTop: 40 }}>
              <table className="kdl-table">
                <thead>
                  <tr>
                    <th style={{ width: "48%" }}>Риск</th>
                    <th>Как снимаем</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r) => (
                    <tr key={r.risk}>
                      <td>{r.risk}</td>
                      <td>{r.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 15 · ВОПРОСЫ ──────────────────────────────────── */}
        <section className="kdl-section kdl-section--ink" id="questions">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="15 · Что нужно узнать вместе"
              title="Пять вопросов, ответы на которые меняют проект"
              lead="Мы приходим не с концепцией на утверждение, а с вопросами. От ответов зависит и объём работ, и то, нужны ли они вообще."
            />

            <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 20 }}>
              {questions.map((q) => (
                <Reveal key={q.n}>
                  <div
                    style={{
                      borderTop: "1px solid #26303E",
                      paddingTop: 22,
                      display: "grid",
                      gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)",
                      gap: 24,
                    }}
                    className="kdl-q-row"
                  >
                    <div>
                      <span className="kdl-toc-n" style={{ color: "#4694D1" }}>
                        {q.n}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--kdl-font-display)",
                          fontSize: "clamp(17px,1.5vw,21px)",
                          lineHeight: 1.35,
                          color: "#fff",
                          marginTop: 8,
                        }}
                      >
                        {q.q}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 6 }}>
                      <p style={{ fontSize: 14.5, color: "#9AA6B6" }}>{q.ifA}</p>
                      <p style={{ fontSize: 14.5, color: "#9AA6B6" }}>{q.ifB}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div style={{ marginTop: 48 }}>
              <Callout wide>
                И один вопрос, который важнее остальных: когда вы говорите о новой информационной системе —
                какое решение вы сегодня вынуждены принимать вручную и что хотели бы видеть на экране вместо
                этого?
              </Callout>
            </div>
          </div>
        </section>

        {/* ── DEEP DIVES ────────────────────────────────────── */}
        <section className="kdl-section kdl-section--tight">
          <div className="kdl-wrap">
            <span className="kdl-eyebrow">Подробности</span>
            <h2 className="kdl-h2" style={{ marginBottom: 28 }}>
              Разделы для детального разбора
            </h2>
            <div className="kdl-ddlinks">
              <DeepDiveLink
                href={`${BASE}/architecture`}
                title="Архитектура и модель"
                desc="Общие сущности, подключение поставщиков, границы ответственности, что мы не строим."
              />
              <DeepDiveLink
                href={`${BASE}/autonomous-future`}
                title="Автономное будущее"
                desc="Девять технологий: зрелость в мире и в России, ограничения, что резервировать сейчас."
              />
              <DeepDiveLink
                href={`${BASE}/infrastructure`}
                title="Ресурсы и инфраструктура"
                desc="Три масштаба, формулы расчёта, локальный узел площадки и прямой ответ про GPU."
              />
              <DeepDiveLink
                href={`${BASE}/economics`}
                title="Экономика и измерение"
                desc="Дерево эффекта, формулы, метод baseline, тестирование, государственная повестка."
              />
              <DeepDiveLink
                href={`${BASE}/evidence`}
                title="Доказательная база"
                desc="Двадцать пять записей: источник, дата, статус, уровень уверенности, ограничения."
              />
            </div>
          </div>
        </section>

        {/* ── 16 · СЛЕДУЮЩИЙ ШАГ ────────────────────────────── */}
        <section className="kdl-section" id="next-step">
          <div className="kdl-wrap">
            <span className="kdl-eyebrow">16 · Следующий шаг</span>
            <h2 className="kdl-h2" style={{ fontSize: "clamp(30px,3.6vw,50px)", maxWidth: "16ch" }}>
              Этап 0 — совместное обследование
            </h2>
            <p className="kdl-lead">
              Сначала фиксируем реальный процесс и baseline. После этого принимаем решение, какие компоненты
              действительно нужно создавать, какие — интегрировать, а какие не нужны вообще.
            </p>

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 48 }}>
              <div className="kdl-card">
                <h3 className="kdl-h3">Что нужно от вас</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    items={[
                      "Возможность пройти один реальный рейс от заказа до закрытия",
                      "Доступ к одному действующему терминалу",
                      "Обезличенные данные по рейсам и операциям узла за 1–3 месяца",
                      "Назначенный ответственный со стороны компании",
                    ]}
                  />
                </div>
              </div>
              <div className="kdl-card">
                <h3 className="kdl-h3">Что получаете на выходе</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    items={[
                      "Измеренная картина потерь времени по направлению",
                      "Ранжирование драйверов экономического эффекта",
                      "Заключение: строить систему двора или внедрять готовую",
                      "Письменная граница ответственности систем",
                      "Техническое задание, пригодное для любого подрядчика",
                    ]}
                  />
                </div>
              </div>
              <div className="kdl-card">
                <h3 className="kdl-h3">Чего мы не просим сейчас</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    items={[
                      "Решения по концепции",
                      "Бюджета на разработку",
                      "Выбора поставщика техники",
                      "Подписания рамочного договора",
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 44 }}>
              <Callout wide variant="quiet">
                Стоимость разработки системы в этом документе не приводится намеренно. Назвать её до
                обследования означало бы придумать число. Стоимость последующих этапов определяется составом
                интеграций, объёмом данных, числом узлов и ресурсов, требованиями безопасности и границами
                пилота — то есть именно тем, что выясняется на первом этапе.
              </Callout>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  )
}
