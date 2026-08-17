import { ChapterNav } from "@/components/kit-proposal/ChapterNav"
import { ControlTowerMock } from "@/components/kit-proposal/ControlTowerMock"
import { EditorialImage, HeroImage } from "@/components/kit-proposal/EditorialImage"
import { HorizonToggle } from "@/components/kit-proposal/HorizonToggle"
import { JourneyStrip } from "@/components/kit-proposal/JourneyStrip"
import { PageFooter } from "@/components/kit-proposal/PageFooter"
import { Reveal } from "@/components/kit-proposal/Reveal"
import { StageCard } from "@/components/kit-proposal/StageCard"
import {
  ArchitectureMap,
  CargoLadder,
  LayerGap,
  RoadmapStrip,
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
import stagesJson from "@/data/kit-proposal/stages.json"
import statsJson from "@/data/kit-proposal/stats.json"
import systemsJson from "@/data/kit-proposal/systems.json"

import type {
  Capability,
  Chapter,
  JourneyStep,
  Meta,
  Question,
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
const questions = questionsJson as unknown as Question[]

const BASE = "/presentation/kit-digital-logistics"

// На главной странице показываем только те показатели, которые объясняют
// масштаб задачи. Возраст компании, число стран и сотрудников к делу
// не относятся — они остаются в разделе доказательной базы.
const SCALE_STATS = stats.filter((s) =>
  ["35 000+", "80 000+", "300+", "350 000 м²"].includes(s.value),
)

export default function KitProposalPage() {
  return (
    <>
      <ChapterNav chapters={chapters} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <HeroImage>
        <p className="kdl-hero-eyebrow">ТК КИТ · проектное предложение</p>
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
      </HeroImage>

      <main>
        {/* ── 01 · ЗА 60 СЕКУНД ─────────────────────────────── */}
        <section className="kdl-section" id="summary">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="01 · За 60 секунд"
              title="Если дальше читать некогда"
            />

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 40 }}>
              <Reveal>
                <div className="kdl-card kdl-card--pad" style={{ height: "100%" }}>
                  <span className="kdl-toc-n">01</span>
                  <h3 className="kdl-h3" style={{ marginTop: 8 }}>
                    Что предлагаем
                  </h3>
                  <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                    Создать цифровой контур управления магистральной логистикой — если
                    обследование подтвердит, что эти функции сегодня не закрыты
                    существующими системами.
                  </p>
                  <p
                    style={{
                      marginTop: 16,
                      fontFamily: "var(--kdl-font-mono)",
                      fontSize: 12.5,
                      lineHeight: 1.9,
                      color: "var(--kdl-accent-ink)",
                      background: "var(--kdl-surface-2)",
                      borderRadius: 4,
                      padding: "14px 16px",
                    }}
                  >
                    магистральное плечо
                    <br />→ полуприцеп
                    <br />→ узел
                    <br />→ исполнитель
                    <br />→ план и факт
                    <br />→ экономика
                  </p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="kdl-card kdl-card--pad" style={{ height: "100%" }}>
                  <span className="kdl-toc-n">02</span>
                  <h3 className="kdl-h3" style={{ marginTop: 8 }}>
                    Что получает КИТ
                  </h3>
                  <div style={{ marginTop: 14 }}>
                    <Bullets
                      items={[
                        "Единый план и факт по магистральному плечу",
                        "Видимость полуприцепа в любой момент",
                        "Непрерывную историю ответственности за груз",
                        "Расчётное время прибытия и раннее отклонение",
                        "Прозрачность узла и его пропускной способности",
                        "Накопленную историю операций как собственный актив",
                        "Основу, к которой позже подключаются автономные исполнители",
                      ]}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="kdl-card kdl-card--pad" style={{ height: "100%" }}>
                  <span className="kdl-toc-n">03</span>
                  <h3 className="kdl-h3" style={{ marginTop: 8 }}>
                    Как начинаем
                  </h3>
                  <div style={{ marginTop: 14 }}>
                    <Bullets
                      items={[
                        "Проходим вместе один реальный рейс — от заказа до закрытия",
                        "Берём одно направление и один действующий терминал",
                        "Смотрим реальные исторические данные за 1–3 месяца",
                        "Фиксируем baseline и определяем, что действительно нужно создавать",
                      ]}
                    />
                  </div>
                  <p
                    className="kdl-small"
                    style={{ marginTop: 18, color: "var(--kdl-accent-deep)" }}
                  >
                    Это Этап 0. Отдельный, законченный, с собственным результатом.
                  </p>
                </div>
              </Reveal>
            </div>

            <p
              className="kdl-small"
              style={{
                marginTop: 28,
                paddingTop: 18,
                borderTop: "1px solid var(--kdl-line)",
                maxWidth: "94ch",
              }}
            >
              Мы не заменяем работающие системы, не разрабатываем сам беспилотный автомобиль
              и не определяем объём разработки до обследования.
            </p>
          </div>
        </section>

        {/* ── 02 · ОДИН РЕЙС ────────────────────────────────── */}
        <section className="kdl-section" id="journey">
          <div className="kdl-wrap kdl-wrap--wide">
            <div className="kdl-wrap" style={{ padding: 0, maxWidth: 1180 }}>
              <SectionHead
                eyebrow="02 · Один рейс как цифровой объект"
                title="Что система должна знать на каждом шаге"
                lead="Девять шагов одного рейса. На каждом — восемь атрибутов: план, исполнитель, событие, время, ответственность, факт, отклонение, стоимость. Выберите шаг."
              />
              <p className="kdl-small" style={{ marginTop: 18, maxWidth: "78ch" }}>
                Отмеченные атрибуты — это то, что мы планируем уточнить на обследовании.
                Мы не видели ваших внутренних систем и не делаем вывода, что этих данных
                нет: возможно, часть из них уже собирается.
              </p>
            </div>

            <div style={{ marginTop: 36 }}>
              <JourneyStrip steps={journey} />
            </div>
          </div>
        </section>

        {/* ── 03 · ЧТО МОЖЕТ ВОЙТИ В КОНТУР ─────────────────── */}
        <section className="kdl-section" id="capabilities">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="03 · Что может войти в цифровой контур"
              title="Шесть блоков вместо двадцати модулей"
              lead="Итоговый состав определяется после Этапа 0. Возможно, часть этих функций уже существует в системах КИТ — тогда блок не создаётся, а подключается."
            />

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 44 }}>
              {capabilities.map((c, i) => (
                <Reveal key={c.id} delay={i * 50}>
                  <article className="kdl-card kdl-card--pad" style={{ height: "100%" }}>
                    <span className="kdl-toc-n">{c.n}</span>
                    <h3 className="kdl-h3" style={{ marginTop: 8 }}>
                      {c.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "var(--kdl-accent-deep)",
                        marginTop: 4,
                        fontFamily: "var(--kdl-font-display)",
                      }}
                    >
                      {c.ru}
                    </p>

                    <p className="kdl-body" style={{ marginTop: 16, fontSize: 14.5 }}>
                      {c.what}
                    </p>

                    <div style={{ marginTop: 18 }}>
                      <div className="kdl-attr-k">Что это даёт</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {c.effect}
                      </p>
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

            <p className="kdl-small" style={{ marginTop: 26 }}>
              Данные, интеграции и технические ограничения по каждому блоку — в разделе{" "}
              <a href={`${BASE}/architecture`}>«Архитектура и модель»</a>.
            </p>
          </div>
        </section>

        {/* ── 04 · CONTROL TOWER ────────────────────────────── */}
        <section className="kdl-section kdl-section--ink" id="control-tower">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="04 · Единая операционная картина"
              title="Control Tower — это не ещё один дашборд"
            />

            <div style={{ marginTop: 36 }}>
              <EditorialImage
                name="control-room"
                concept
                caption="Ценность этого экрана не в графиках и не в карте. Она в одном: увидеть отклонение раньше, чем оно станет срывом срока перед клиентом."
              />
            </div>

            <div style={{ marginTop: 44 }}>
              <p className="kdl-statement kdl-statement--wide">
                Сложная архитектура должна давать оператору простой ответ: где прямо
                сейчас требуется вмешательство.
              </p>
            </div>

            <div style={{ marginTop: 40 }}>
              <ControlTowerMock />
            </div>

            <p
              className="kdl-small"
              style={{ marginTop: 22, color: "var(--kdl-on-dark-2)", maxWidth: "76ch" }}
            >
              Если на увиденное нельзя отреагировать конкретным действием — это отчёт,
              а не управление. Поэтому главный экран строится вокруг исключений,
              а не вокруг сводных показателей.
            </p>
          </div>
        </section>

        {/* ── 05 · ПОЛЬЗА БЕЗ ВАТС ──────────────────────────── */}
        <section className="kdl-section" id="without-av">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="05 · Польза без беспилотников"
              title="Что КИТ получает, даже если ВАТС появятся позже"
            />

            <div className="kdl-split" style={{ marginTop: 40 }}>
              <div className="kdl-card kdl-card--pad">
                <div style={{ marginTop: 2 }}>
                  <Bullets
                    items={[
                      "Воспроизводимое планирование магистральных плеч",
                      "Сравнение плана и факта по каждому плечу",
                      "Видимость полуприцепа и непрерывная история ответственности",
                      "Расчётное время прибытия как измеряемая величина",
                      "Аналитика простоев и эффективность узла",
                      "Управление исключениями вместо телефонных звонков",
                      "История операций как накопленный актив",
                      "Фактическая экономика плеча",
                    ]}
                  />
                </div>
              </div>

              <div>
                <p className="kdl-statement">
                  Автономность — стратегический upside, а не единственная причина
                  создавать цифровую основу.
                </p>
                <p className="kdl-body" style={{ marginTop: 22 }}>
                  Девять из десяти драйверов экономического эффекта, которые мы описали,
                  работают на существующем парке и существующих терминалах. Только один
                  требует появления беспилотной техники.
                </p>
                <p className="kdl-body" style={{ marginTop: 14 }}>
                  Это и есть проверка честности предложения: если убрать из него
                  автономное будущее целиком, остальное должно продолжать окупаться.
                </p>
                <p className="kdl-small" style={{ marginTop: 18 }}>
                  Формулы и метод измерения —{" "}
                  <a href={`${BASE}/economics`}>«Экономика и измерение»</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06 · ДВА ГОРИЗОНТА ────────────────────────────── */}
        <section className="kdl-section" id="horizons">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="06 · Два горизонта"
              title="Ядро не меняется — меняется исполнитель"
              lead="Появление нового типа исполнителя добавляет запись в реестр ресурсов и переходник к его системе. Оно не переписывает ядро."
            />

            <div style={{ marginTop: 36 }}>
              <EditorialImage
                name="hub-ecosystem"
                concept
                caption="Водитель, складской робот, терминальный тягач и дрон в одной сцене. Каждый приходит в своё время и по своим правилам — общей остаётся задача, грузовая единица и история ответственности."
              />
            </div>

            <div style={{ marginTop: 44 }}>
              <HorizonToggle />
            </div>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 44 }}>
              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Что происходит, когда беспилотник появляется</h3>
                <p
                  style={{
                    marginTop: 14,
                    fontFamily: "var(--kdl-font-mono)",
                    fontSize: 13,
                    lineHeight: 1.7,
                    background: "var(--kdl-surface-2)",
                    borderRadius: 4,
                    padding: "14px 16px",
                  }}
                >
                  Было: задача → тягач с водителем
                  <br />
                  Стало: задача → подбор по способностям → автономный тягач
                </p>
                <p className="kdl-body" style={{ marginTop: 16, fontSize: 15 }}>
                  Не меняются заказ, груз, полуприцеп, задача, ответственность, событие,
                  показатели и экономика. Меняются исполнитель и переходник к его системе.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Неочевидное: двор созреет раньше магистрали
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Автономные терминальные тягачи уже работают без водителей безопасности
                  в европейских портах <SourceRef id="SRC-14" />, а их объект — полуприцеп
                  в узле — то есть тот же объект, что и в сборной перевозке.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Закрытая территория не подпадает под дорожное регулирование — поэтому
                  этот класс ближе по срокам, чем магистральные беспилотники.
                </p>
                <p className="kdl-small" style={{ marginTop: 16 }}>
                  Девять технологий с оценкой зрелости —{" "}
                  <a href={`${BASE}/autonomous-future`}>«Автономное будущее»</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 · ЧТО УЖЕ ЕСТЬ ─────────────────────────────── */}
        <section className="kdl-section" id="what-exists">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="07 · Граница решения"
              title="Где заканчивается существующее и может начинаться новое"
              lead="Ниже — только то, что видно по открытым источникам на 12 августа 2026 года. Это не описание вашей компании, а способ обозначить границу: что мы точно не предлагаем трогать и где, по нашей гипотезе, остаётся незакрытая зона."
            />

            <div style={{ marginTop: 40 }}>
              <StatGrid items={SCALE_STATS} />
              <p className="kdl-small" style={{ marginTop: 16 }}>
                Четыре показателя приведены с одной целью — объяснить, почему задача
                решается не в таблице <SourceRef id="SRC-01" />
              </p>
            </div>

            <div style={{ marginTop: 48 }}>
              <div className="kdl-tablewrap">
                <table className="kdl-table">
                  <thead>
                    <tr>
                      <th style={{ width: "26%" }}>Система</th>
                      <th>Что известно</th>
                      <th style={{ width: "18%" }}>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systems.map((s) => (
                      <tr key={s.name}>
                        <td>
                          {s.name}
                          <span
                            style={{
                              display: "block",
                              fontSize: 12.5,
                              color: "var(--kdl-ink-3)",
                              marginTop: 3,
                            }}
                          >
                            {s.kind}
                          </span>
                        </td>
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

            <div style={{ marginTop: 48 }} className="kdl-svg-scroll">
              <Figure
                caption="Где проходит граница"
                note="Синим — то, что может стать предметом разработки. Серым пунктиром — чужие системы, которые мы не переписываем."
              >
                <ArchitectureMap />
              </Figure>
            </div>

            <div style={{ marginTop: 44 }}>
              <Callout wide>
                Мы не предлагаем заменить работающие системы. Veeroute остаётся
                планировщиком города, склад — за своей системой, машина — за поставщиком.
                Какая часть <strong>магистрального</strong> планирования уже
                автоматизирована — один из ключевых вопросов Этапа 0.
              </Callout>
            </div>
          </div>
        </section>

        {/* ── 08 · ПОЧЕМУ СЕЙЧАС ────────────────────────────── */}
        <section className="kdl-section" id="why-now">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="08 · Почему сейчас"
              title="Три линии сходятся в одной точке во времени"
              lead="Аргумент не в том, что «наступает эра беспилотников». Аргумент в том, что три независимых процесса — операционный, инфраструктурный и технологический — впервые оказались в одной фазе."
            />

            <div style={{ marginTop: 44 }} className="kdl-svg-scroll">
              <Figure
                caption="Совпадение трёх линий"
                note="Операционная: компания уже переходит от ручного планирования к инструментам на данных — автоматическая маршрутизация городской доставки в эксплуатации с июля 2026 [5], переход на электронные перевозочные документы [6]. Инфраструктурная: М-12 дошла до Урала, Свердловская область включена в экспериментальный правовой режим до ноября 2028 года [8] [12]. Технологическая: двор, складская робототехника и роботы последней мили уже в промышленной эксплуатации, тогда как федеральный закон о беспилотном транспорте не принят пятый год подряд [9]."
              >
                <WhyNowTimelines />
              </Figure>
            </div>

            <div style={{ marginTop: 40 }}>
              <p className="kdl-statement kdl-statement--wide">
                Цифровую основу выгоднее строить до прихода новых исполнителей,
                а не после.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10 · КЛЮЧЕВАЯ ГИПОТЕЗА ────────────────────────── */}
        <section className="kdl-section" id="hypothesis">
          <div className="kdl-wrap">
            <SectionHead eyebrow="09 · Ключевая гипотеза" title="Формулируем как гипотезу, а не как вывод" />

            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <ConfidenceBadge level="hypothesis" />
            </div>

            <div style={{ marginTop: 20 }}>
              <Callout wide>
                Между клиентским и учётным ядром компании и специализированными системами
                может отсутствовать единый операционный слой, покрывающий
                магистральные плечи, партии груза, передачу ответственности, узел перевалки
                и будущих автономных исполнителей.
              </Callout>
            </div>

            <p className="kdl-body" style={{ marginTop: 24, maxWidth: "72ch" }}>
              <strong>Существует ли он и в каком виде — вопрос обследования, а не наш
              вывод.</strong>{" "}
              Мы не видели внутренних систем компании и не делаем заключений об их
              устройстве по открытым публикациям.
            </p>

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
                  После профильного совещания руководство компании самостоятельно
                  обратилось с запросом о возможной разработке информационной системы для
                  будущей модели перевозок и автономной логистики.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Это не публичный факт и не письменное техническое задание. Но это значит,
                  что функциональный разрыв существует{" "}
                  <strong>с точки зрения самого руководства</strong>. Наша задача —
                  установить его природу, а не додумать её за вас.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Как проверим</h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Пройдём один реальный магистральный рейс на ваших экранах и посмотрим,
                  где принимается решение о плече, где хранится план, где фиксируется его
                  изменение, где живёт полуприцеп, где записана передача исполнения и где
                  сравниваются план и факт.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Если всё это найдётся в существующих системах — гипотеза не
                  подтвердится, и проект сократится до интеграций. Такой исход мы считаем
                  нормальным результатом, а не неудачей.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11 · ПОЛУПРИЦЕП И ГРУЗ ────────────────────────── */}
        <section className="kdl-section" id="trailer">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="10 · Груз и его путь"
              title="Исполнители меняются. Грузовая единица остаётся"
            />

            <div className="kdl-split" style={{ marginTop: 40 }}>
              <EditorialImage
                name="trailer-executors"
                concept
                caption="Полуприцеп — единственный объект, который непрерывно существует через все смены тягача, водителя и перевозчика."
              />

              <div>
                <p className="kdl-body">
                  Тягач, водитель, перевозчик и — в будущем — поставщик автономности
                  меняются на каждом плече. Полуприцеп с грузом проходит через все эти
                  смены как одна и та же единица.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  Поэтому объектом учёта должен быть он, а не рейс. Что система должна
                  знать:
                </p>
                <div style={{ marginTop: 16 }}>
                  <Bullets
                    items={[
                      "Где находится — в том числе после расцепки",
                      "Что внутри: какие отправления и какие места",
                      "Кем принят и кем передан, с точным временем",
                      "В каком состоянии и цела ли пломба",
                      "Какая задача выполняется сейчас и кто следующий исполнитель",
                    ]}
                  />
                </div>
                <p className="kdl-small" style={{ marginTop: 20 }}>
                  Мы называем это <strong>непрерывной историей ответственности</strong>.
                  В технических разделах встречается англоязычный термин{" "}
                  <span style={{ fontFamily: "var(--kdl-font-mono)" }}>trailer custody</span> —
                  это то же самое.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--kdl-line)" }}>
              <div className="kdl-split">
                <div>
                  <h3 className="kdl-h3">Груз — не только полуприцеп</h3>
                  <p className="kdl-body" style={{ marginTop: 14 }}>
                    Система должна видеть груз не только как полуприцеп, но и до уровня
                    отдельного места. Сегодня магистрали достаточно первого. Завтра
                    последней миле нужно второе.
                  </p>
                  <p className="kdl-body" style={{ marginTop: 14 }}>
                    Это позволяет позже передать конкретное место курьеру, постамату,
                    роботу, автономному фургону или беспилотнику — и уже сегодня
                    сравнивать фактическую стоимость этих каналов между собой.
                  </p>
                  <p className="kdl-small" style={{ marginTop: 16 }}>
                    Полная модель данных —{" "}
                    <a href={`${BASE}/architecture`}>«Архитектура и модель»</a>.
                  </p>
                </div>

                <Figure caption="Уровни грузовой единицы">
                  <CargoLadder />
                </Figure>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12 · ЭТАПЫ ────────────────────────────────────── */}
        <section className="kdl-section" id="stages">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="11 · Этапы"
              title="Поэтапно и останавливаемо"
              lead="Каждый этап заканчивается решением: продолжить, скорректировать или остановиться. Никаких многолетних обязательств с первого дня."
            />

            <div style={{ marginTop: 40 }} className="kdl-svg-scroll">
              <Figure caption="Шесть этапов и точки принятия решения">
                <RoadmapStrip />
              </Figure>
            </div>

            <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 12 }}>
              {stages.slice(0, 2).map((s, i) => (
                <StageCard key={s.id} stage={s} defaultOpen={i === 0} compact />
              ))}
            </div>

            <div className="kdl-grid kdl-grid--4" style={{ marginTop: 20 }}>
              {stages.slice(2).map((s) => (
                <div className="kdl-stage-mini" key={s.id}>
                  <span className="kdl-stage-mini-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.lead}</p>
                </div>
              ))}
            </div>

            <p className="kdl-small" style={{ marginTop: 20 }}>
              Полные карточки этапов 2–5 со всеми критериями приёмки, интеграциями и
              рисками — в разделе{" "}
              <a href={`${BASE}/implementation`}>«Этапы и риски подробно»</a>.
            </p>

            <div style={{ marginTop: 52, paddingTop: 40, borderTop: "1px solid var(--kdl-line)" }}>
              <div className="kdl-split">
                <div>
                  <h3 className="kdl-h3">Почему проект разбит на этапы</h3>
                  <p className="kdl-body" style={{ marginTop: 14 }}>
                    Не из осторожности ради осторожности. Есть пять вещей, которых мы
                    сегодня не знаем и знать не можем — и каждая способна изменить объём
                    работ в разы.
                  </p>
                  <div style={{ marginTop: 18 }}>
                    <Bullets
                      items={[
                        "Внутренний ИТ-ландшафт компании нам недоступен",
                        "Качество и полнота исторических данных неизвестны",
                        "Сроки интеграции с существующими системами непредсказуемы заранее",
                        "Зрелость беспилотной техники меняется быстрее, чем пишутся планы",
                        "Нормативная база в движении: закон о беспилотном транспорте не принят",
                      ]}
                    />
                  </div>
                </div>

                <div className="kdl-card kdl-card--pad">
                  <h3 className="kdl-h3">Что это значит на практике</h3>
                  <p className="kdl-body" style={{ marginTop: 14, fontSize: 15 }}>
                    В карточке каждого этапа последним идёт блок «что остаётся, если
                    следующий этап не запускается». Этап, который нельзя остановить без
                    потери вложенного, спроектирован неправильно.
                  </p>
                  <p className="kdl-small" style={{ marginTop: 16 }}>
                    Одиннадцать рисков с ответами —{" "}
                    <a href={`${BASE}/implementation`}>в разделе реализации</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 13 · ВОПРОСЫ ──────────────────────────────────── */}
        <section className="kdl-section kdl-section--ink" id="questions">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="12 · Вопросы к КИТ"
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

            <div className="kdl-bigq">
              <span className="kdl-eyebrow">И один вопрос, который важнее остальных</span>
              <p className="kdl-bigq-t">
                Когда вы говорите о новой информационной системе — какое решение вы
                сегодня вынуждены принимать вручную и что хотели бы видеть на экране
                вместо этого?
              </p>
              <p className="kdl-small" style={{ marginTop: 18, color: "var(--kdl-on-dark-2)" }}>
                Ответ на него может определить содержание проекта точнее, чем всё
                остальное в этом документе.
              </p>
            </div>
          </div>
        </section>

        {/* ── DEEP DIVES ────────────────────────────────────── */}
        <section className="kdl-section kdl-section--tight">
          <div className="kdl-wrap">
            <span className="kdl-eyebrow">Подробности</span>
            <h2 className="kdl-h2" style={{ marginBottom: 12 }}>
              За этими десятью минутами
            </h2>
            <p className="kdl-lead" style={{ marginBottom: 30, marginTop: 0 }}>
              Основная страница намеренно проще, чем проект. Всё, что в неё не поместилось,
              лежит здесь.
            </p>
            <div className="kdl-ddlinks">
              <DeepDiveLink
                href={`${BASE}/meeting`}
                title="Режим показа"
                desc="Семь экранов для разговора на большом экране: как поняли задачу, непрерывная работа ресурса, что оптимизируем, механика, оператор, масштаб, первый этап."
              />
              <DeepDiveLink
                href={`${BASE}/architecture`}
                title="Архитектура и модель"
                desc="Общие сущности, подключение поставщиков, полная иерархия груза, границы ответственности, что мы не строим."
              />
              <DeepDiveLink
                href={`${BASE}/implementation`}
                title="Этапы и риски подробно"
                desc="Все шесть этапов с критериями приёмки, интеграциями и показателями. Одиннадцать рисков с ответами."
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

        {/* ── 14 · СЛЕДУЮЩИЙ ШАГ ────────────────────────────── */}
        <section className="kdl-section" id="next-step">
          <div className="kdl-wrap">
            <span className="kdl-eyebrow">13 · Следующий шаг</span>
            <h2 className="kdl-h2" style={{ fontSize: "clamp(30px,3.6vw,50px)", maxWidth: "16ch" }}>
              Этап 0 — совместное обследование
            </h2>

            <div className="kdl-split" style={{ marginTop: 36 }}>
              <div>
                <p className="kdl-lead" style={{ marginTop: 0 }}>
                  Вместе проходим один реальный рейс. Смотрим реальные системы. Берём одно
                  направление. Фиксируем baseline.
                </p>
                <p className="kdl-body" style={{ marginTop: 20 }}>
                  После этого решаем, что действительно нужно разрабатывать, что —
                  интегрировать, а что не нужно вообще. Проект после Этапа 0 может стать{" "}
                  <strong>меньше</strong>, а не обязательно больше.
                </p>
              </div>

              <div className="kdl-grid kdl-grid--2">
                <div className="kdl-card">
                  <h3 className="kdl-h3" style={{ fontSize: 17 }}>
                    Что нужно от вас
                  </h3>
                  <div style={{ marginTop: 12 }}>
                    <Bullets
                      dense
                      items={[
                        "Пройти один реальный рейс от заказа до закрытия",
                        "Доступ к одному действующему терминалу",
                        "Обезличенные данные за 1–3 месяца",
                        "Назначенный ответственный со стороны компании",
                      ]}
                    />
                  </div>
                </div>
                <div className="kdl-card">
                  <h3 className="kdl-h3" style={{ fontSize: 17 }}>
                    Что получаете на выходе
                  </h3>
                  <div style={{ marginTop: 12 }}>
                    <Bullets
                      dense
                      items={[
                        "Измеренная картина потерь времени",
                        "Ранжирование драйверов эффекта",
                        "Письменная граница ответственности систем",
                        "Техническое задание, пригодное для любого подрядчика",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 44 }}>
              <Callout wide variant="quiet">
                Стоимость разработки в этом документе не приводится намеренно. Назвать её
                до обследования означало бы придумать число: она определяется составом
                интеграций, объёмом данных, числом узлов и границами пилота — то есть
                именно тем, что выясняется на первом этапе.
              </Callout>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  )
}
