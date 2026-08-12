import { PageFooter } from "@/components/kit-proposal/PageFooter"
import { EffectTree } from "@/components/kit-proposal/diagrams/DeepDiagrams"
import {
  BackToNarrative,
  Bullets,
  Callout,
  ConfidenceBadge,
  Figure,
  SectionHead,
  SourceRef,
} from "@/components/kit-proposal/shared"

import economicsJson from "@/data/kit-proposal/economics.json"
import type { EffectDriver } from "@/types/kit-proposal"

export const metadata = { title: "Экономика и измерение — ТК КИТ" }

const drivers = economicsJson as unknown as (EffectDriver & { note?: string })[]

export default function EconomicsPage() {
  return (
    <>
      <div className="kdl-wrap kdl-dd-head">
        <BackToNarrative anchor="stages" />
        <SectionHead
          eyebrow="Подробности · экономика"
          title="Экономика и измерение"
          lead="В этом разделе нет ни одной цифры эффекта — и это принципиально. Есть дерево драйверов, формулы, метод построения базового замера и способ проверки результата."
        />
      </div>

      <main>
        <section className="kdl-section">
          <div className="kdl-wrap">
            <Callout wide>
              Назвать процент экономии до того, как измерен ваш процесс, — значит придумать число. Любая
              цифра, полученная таким способом, разрушит доверие ко всему остальному документу.
            </Callout>

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 40 }}>
              <div>
                <h3 className="kdl-h3">Почему рыночные оценки к вам не применимы напрямую</h3>
                <p className="kdl-body" style={{ marginTop: 14 }}>
                  Публично заявляется снижение операционных расходов на 15–20 % на маршрутах длиннее 700 км
                  <SourceRef id="SRC-24" />. Эти оценки относятся к другой модели перевозки: полная загрузка,
                  длинное плечо, сравнение с одиночным водителем.
                </p>
                <p className="kdl-body" style={{ marginTop: 14 }}>
                  В «Грузопроводе» водители уже работают посменно, а простой на отдых уже устранён
                  <SourceRef id="SRC-02" />. То есть часть эффекта, который обычно приписывают беспилотникам,{" "}
                  <strong>компания уже получила</strong> — организационным решением, без всякой автономности.
                </p>
                <p className="kdl-body" style={{ marginTop: 14 }}>
                  Мы используем эти оценки только как верхнюю границу правдоподобия: если наш расчёт на ваших
                  данных даст эффект выше рыночного, значит в расчёте ошибка.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="hypothesis" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Где в сети сборных грузов лежат деньги
                </h3>
                <p
                  style={{
                    marginTop: 14,
                    fontFamily: "var(--kdl-font-mono)",
                    fontSize: 13,
                    background: "var(--kdl-surface-2)",
                    padding: "14px 16px",
                    borderRadius: 4,
                    lineHeight: 1.6,
                  }}
                >
                  себестоимость м³ = обработка в узлах
                  <br />
                  &nbsp;&nbsp;+ магистраль ÷ загрузка
                  <br />
                  &nbsp;&nbsp;+ первая и последняя миля
                </p>
                <p className="kdl-body" style={{ marginTop: 14, fontSize: 15 }}>
                  Автономность влияет только на второе слагаемое, причём лишь на его трудовую часть. При 300+
                  городах и 35 000+ отправлений ежедневно <SourceRef id="SRC-01" /> значительная доля затрат
                  находится в узлах — там, куда беспилотник не достаёт.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Это гипотеза, и она проверяется на первом этапе. Но именно она определяет порядок
                  приоритетов.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Дерево эффекта"
              title="Десять драйверов, девять из которых не требуют беспилотников"
            />
            <div style={{ marginTop: 36 }} className="kdl-svg-scroll">
              <Figure caption="Откуда берётся эффект">
                <EffectTree />
              </Figure>
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Формулы"
              title="Как считается каждый драйвер"
              lead="Для каждого — формула, необходимые данные, метод базового замера и срок, с которого эффект вообще можно измерять."
            />

            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
              {drivers.map((d) => (
                <article className="kdl-card kdl-card--pad" key={d.id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontFamily: "var(--kdl-font-display)",
                        fontSize: 18,
                        fontWeight: 600,
                        color: d.direction === "down" ? "var(--kdl-h-a)" : "var(--kdl-accent-deep)",
                      }}
                    >
                      {d.direction === "down" ? "↓" : "↑"}
                    </span>
                    <h3 className="kdl-h3">{d.title}</h3>
                  </div>

                  <p
                    style={{
                      marginTop: 14,
                      fontFamily: "var(--kdl-font-mono)",
                      fontSize: 12.5,
                      background: "var(--kdl-surface-2)",
                      padding: "12px 14px",
                      borderRadius: 4,
                      lineHeight: 1.6,
                      color: "var(--kdl-ink)",
                      overflowX: "auto",
                    }}
                  >
                    {d.formula}
                  </p>

                  <div
                    style={{
                      marginTop: 16,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                      gap: 18,
                    }}
                  >
                    <div>
                      <div className="kdl-attr-k">Какие данные нужны</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {d.needs}
                      </p>
                    </div>
                    <div>
                      <div className="kdl-attr-k">Базовый замер</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {d.baseline}
                      </p>
                    </div>
                    <div>
                      <div className="kdl-attr-k">Когда измеримо</div>
                      <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
                        {d.whenMeasurable}
                      </p>
                    </div>
                  </div>

                  {d.note ? (
                    <p className="kdl-small" style={{ marginTop: 14, color: "var(--kdl-st-hypothesis)" }}>
                      {d.note}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Метод"
              title="Как не обмануть себя при измерении эффекта"
              lead="Без этих правил любой результат пилота будет оспорен — и справедливо."
            />

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 36 }}>
              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Правила измерения</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    items={[
                      "Базовый замер строится на факте, а не на нормативах: нас интересует, как есть, а не как должно быть",
                      "Единица наблюдения — визит в узел и плечо, а не рейс целиком, иначе эффекты смешиваются",
                      "Все распределения с перцентилями: деньги теряются в хвосте, а не в среднем",
                      "Контрольная группа обязательна: сопоставимое направление без системы в тот же период",
                      "Базовый замер фиксируется письменно и подписывается до старта",
                      "Изменение процесса и изменение системы разделяются: часть эффекта даёт сам факт измерения",
                      "Отрицательный результат фиксируется так же тщательно, как положительный",
                      "Эффекты разных драйверов не суммируются без проверки на двойной счёт",
                    ]}
                  />
                </div>
              </div>

              <div>
                <h3 className="kdl-h3">Критерии приёмки — без чисел</h3>
                <p className="kdl-body" style={{ marginTop: 14 }}>
                  Формулировки задаются сейчас, конкретные значения — после базового замера. Это не уклонение
                  от обязательств, а условие того, чтобы обязательства были выполнимыми.
                </p>
                <div style={{ marginTop: 18 }}>
                  <Bullets
                    items={[
                      "Не менее X % событий фиксируются автоматически, без ручного ввода",
                      "Сравнение плана и факта доступно по каждому плечу",
                      "Цепочка ответственности за груз не имеет неучтённых разрывов",
                      "Оператор видит отклонение не позднее N минут после его возникновения",
                      "Показатели рассчитываются автоматически, без выгрузок в таблицы",
                      "Потеря связи не блокирует разрешённые операции узла",
                      "Новый поставщик ресурса подключается адаптером без изменения модели данных",
                    ]}
                  />
                </div>
              </div>
            </div>

            <h3 className="kdl-h3" style={{ marginTop: 52 }}>
              Тестирование
            </h3>
            <div className="kdl-grid kdl-grid--4" style={{ marginTop: 20 }}>
              {[
                {
                  t: "Программное",
                  items: ["Модульное и интеграционное", "Проверка контрактов интеграций", "Нагрузочное", "Безопасность", "Отказоустойчивость", "Сверка данных после сбоя"],
                },
                {
                  t: "Операционное",
                  items: ["Теневой режим", "Параллельная работа со старым процессом", "Ограниченный пилот", "Контрольная группа", "Разбор каждого отклонения"],
                },
                {
                  t: "Узел",
                  items: ["Моделирование пропускной способности", "Прогон вхолостую", "Ручной обходной путь", "Отключение связи", "Отказ оборудования", "Пиковая нагрузка"],
                },
                {
                  t: "Автономный ресурс",
                  items: ["Тестовый контур поставщика", "Симулятор", "Закрытая территория", "Работа под наблюдением", "Ограниченный маршрут", "Постепенное расширение"],
                },
              ].map((b) => (
                <div className="kdl-card" key={b.t}>
                  <h4 style={{ fontFamily: "var(--kdl-font-display)", fontSize: 15, fontWeight: 500 }}>
                    {b.t}
                  </h4>
                  <div style={{ marginTop: 12 }}>
                    <Bullets dense items={b.items} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Отдельный слой"
              title="Государственная и отраслевая повестка"
              lead="Это не часть расчёта окупаемости. Смешивать её с экономикой проекта — значит обесценить и то, и другое."
            />

            <div className="kdl-grid kdl-grid--3" style={{ marginTop: 36 }}>
              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Действующее
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 14.5 }}>
                  Экспериментальный правовой режим по беспилотным грузоперевозкам действует до 12 ноября 2028
                  года и распространяется на Свердловскую область <SourceRef id="SRC-08" />. В России
                  действуют государственные стандарты на беспилотный транспорт, программа стандартизации
                  рассчитана до 2030 года <SourceRef id="SRC-23" />.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="question" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Требует проверки применимости
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 14.5 }}>
                  Региональные налоговые преференции для приоритетных инвестиционных проектов
                  <SourceRef id="SRC-25" />, меры поддержки роботизации и беспилотных авиационных систем
                  <SourceRef id="SRC-20" />. Механизмы существуют, но пороги по объёму вложений и отраслевые
                  критерии мы не проверяли — и не будем утверждать, что они применимы.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="hypothesis" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Стратегическое позиционирование
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 14.5 }}>
                  Проект потенциально соответствует нескольким направлениям государственной технологической
                  повестки и мог бы рассматриваться как региональная демонстрационная площадка автономной
                  логистики. Это гипотеза, требующая отдельного разговора с региональными институтами, а не
                  готовый аргумент.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 36 }}>
              <Callout wide variant="quiet">
                Формулировка, которой мы придерживаемся: проект потенциально соответствует нескольким
                направлениям государственной технологической повестки; применимость конкретных инструментов
                требует отдельной проверки условий участия. Фразы «компания получит государственную
                поддержку» в этом документе нет и не будет, пока условия не проверены.
              </Callout>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  )
}
