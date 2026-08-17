import { PageFooter } from "@/components/kit-proposal/PageFooter"
import { MaturityMatrix, YardProcess } from "@/components/kit-proposal/diagrams/DeepDiagrams"
import {
  BackToNarrative,
  Callout,
  ConfidenceBadge,
  Figure,
  SectionHead,
  SourceRef,
} from "@/components/kit-proposal/shared"

import technologiesJson from "@/data/kit-proposal/technologies.json"
import type { Technology } from "@/types/kit-proposal"

export const metadata = { title: "Автономное будущее — ТК КИТ" }

const techs = technologiesJson as unknown as Technology[]

const GROUPS: { id: Technology["group"]; title: string; lead: string }[] = [
  {
    id: "ready",
    title: "Уже промышленно применимо или близко",
    lead: "Работает в коммерческой эксплуатации. Ограничения — организационные и климатические, а не технологические.",
  },
  {
    id: "developing",
    title: "Развивается",
    lead: "Работает у пионеров. Экономика и правовая рамка ещё формируются.",
  },
  {
    id: "horizon",
    title: "Перспектива",
    lead: "Реалистично, но не в горизонте ближайших этапов. Резервируем в модели, не строим.",
  },
]

function TechCard({ t }: { t: Technology }) {
  return (
    <article className="kdl-card" style={{ height: "100%" }}>
      <h3 className="kdl-h3">{t.title}</h3>
      <p className="kdl-body" style={{ marginTop: 10, fontSize: 14.5 }}>
        {t.what}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <span className="kdl-flag">Мир: {t.maturityWorld}</span>
        <span className="kdl-flag" data-on={!t.maturityRu.startsWith("Промышленная") && !t.maturityRu.startsWith("Коммерческая")}>
          Россия: {t.maturityRu.split(":")[0]}
        </span>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="kdl-attr-k">Где работает</div>
        <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
          {t.whereWorks} {t.source ? <SourceRef id={t.source} /> : null}
        </p>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="kdl-attr-k">Что даёт КИТ</div>
        <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
          {t.forKit}
        </p>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="kdl-attr-k">Ограничения</div>
        <p className="kdl-body" style={{ marginTop: 5, fontSize: 14 }}>
          {t.limits}
        </p>
      </div>

      <div className="kdl-stage-standalone" style={{ marginTop: 18, borderRadius: 4 }}>
        <h4>Что резервировать в ИТ сейчас</h4>
        <p style={{ fontSize: 14 }}>{t.reserve}</p>
      </div>
    </article>
  )
}

export default function AutonomousFuturePage() {
  return (
    <>
      <div className="kdl-wrap kdl-dd-head">
        <BackToNarrative anchor="horizons" />
        <SectionHead
          eyebrow="Подробности · автономное будущее"
          title="Девять технологий и трезвый взгляд на каждую"
          lead="Не фантастика и не отказ от темы. Для каждой технологии — зрелость в мире и в России, реальные ограничения и один практический вывод: что нужно заложить в модель сейчас, чтобы потом не переделывать."
        />
      </div>

      <main>
        <section className="kdl-section">
          <div className="kdl-wrap">
            <div className="kdl-svg-scroll">
              <Figure
                caption="Зрелость и горизонт"
                note="Ключевое наблюдение: автономность двора и складская робототехника зрелее и ближе, чем магистральные беспилотники. Первый проход нашей работы этого не учитывал — акцент был почти целиком на магистрали."
              >
                <MaturityMatrix />
              </Figure>
            </div>
          </div>
        </section>

        {GROUPS.map((g) => {
          const items = techs.filter((t) => t.group === g.id)
          if (!items.length) return null
          return (
            <section className="kdl-section" key={g.id}>
              <div className="kdl-wrap">
                <SectionHead eyebrow={g.title} title={g.title} lead={g.lead} />
                <div className="kdl-grid kdl-grid--3" style={{ marginTop: 36 }}>
                  {items.map((t) => (
                    <TechCard key={t.id} t={t} />
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Автономный двор"
              title="Вероятно, это придёт раньше магистрали"
              lead="Закрытая территория не подпадает под дорожное регулирование, а объект автоматизации — полуприцеп в узле, то есть тот же объект, что и в сборной перевозке."
            />

            <div style={{ marginTop: 36 }} className="kdl-svg-scroll">
              <Figure caption="Процесс двора: одинаков для человека и для робота">
                <YardProcess />
              </Figure>
            </div>

            <div style={{ marginTop: 40 }}>
              <Callout wide>
                Практический вывод, который стоит применить уже сейчас:{" "}
                <strong>автоматизируемость сцепки должна стать одним из критериев закупки полуприцепов и
                тягачей</strong>. Техника, приобретаемая в 2026–2027 годах, будет работать тогда, когда
                автономный двор станет доступен <SourceRef id="SRC-15" />.
              </Callout>
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Последняя миля"
              title="Терминал как точка запуска разных исполнителей"
              lead="Veeroute уже отвечает на вопрос «кто и куда едет». Сам исполнитель со временем может меняться."
            />

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 36 }}>
              <div>
                <p className="kdl-body">
                  Терминал — единственное место в цепочке, где груз физически разукрупняется до отдельных
                  мест. Это и делает его естественной точкой запуска любых исполнителей: курьера, партнёра,
                  постамата, робота, автономного фургона, а в отдалённой перспективе — беспилотника.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  Важно быть честными в оценке: тротуарный робот несёт единицы килограммов, и массовую
                  доставку сборных грузов он не закроет. Закрывается сегмент лёгких отправлений — и его нужно
                  уметь выделять.
                </p>
                <p className="kdl-body" style={{ marginTop: 16 }}>
                  При этом сама модель «выбор исполнителя по стоимости и пригодности» даёт эффект{" "}
                  <strong>до появления любого робота</strong>: выбор между курьером, партнёром и постаматом —
                  это реальная задача сегодняшнего дня.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <ConfidenceBadge level="confirmed" />
                <h3 className="kdl-h3" style={{ marginTop: 12 }}>
                  Это не футурология
                </h3>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Роботы последней мили — единственная автономная технология, которая в России уже находится
                  в промышленной эксплуатации в масштабе: 500 машин по итогам первого квартала 2026 года и
                  более 260 тысяч доставок во втором квартале <SourceRef id="SRC-17" />.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Весь этот объём принадлежит экосистеме доставки еды и продуктов, а не сборных грузов. Но
                  технологический и регуляторный барьер уже пройден кем-то другим — и это меняет оценку
                  сроков.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Оценка вариантов"
              title="Четыре уровня, которые нельзя смешивать"
              lead="Применяется при сравнении любого поставщика, в том числе зарубежного. Это четыре разных статуса, а не один."
            />

            <div className="kdl-grid kdl-grid--4" style={{ marginTop: 36 }}>
              {[
                { n: "01", t: "Технологически существует", d: "Технология работает и подтверждена внедрениями." },
                { n: "02", t: "Коммерчески доступно", d: "Можно купить: есть продукт, цена, поставка и сервис." },
                { n: "03", t: "Может эксплуатироваться в РФ", d: "Ввоз, сертификация, поддержка, запчасти, правовой режим." },
                { n: "04", t: "Может работать на дорогах общего пользования РФ", d: "Отдельный и самый жёсткий барьер." },
              ].map((s) => (
                <div className="kdl-card" key={s.n}>
                  <span className="kdl-toc-n">{s.n}</span>
                  <h3 style={{ fontFamily: "var(--kdl-font-display)", fontSize: 15.5, fontWeight: 500, marginTop: 8 }}>
                    {s.t}
                  </h3>
                  <p className="kdl-body" style={{ marginTop: 8, fontSize: 14 }}>
                    {s.d}
                  </p>
                </div>
              ))}
            </div>

            <p className="kdl-body" style={{ marginTop: 32 }}>
              Практическое следствие: техника, безупречная по первым двум уровням, может быть полностью
              неприменима по четвёртому. Зарубежные решения — включая китайские — реалистичны прежде всего
              там, где четвёртый уровень не применяется: во дворе, на складе, на закрытой территории. Для
              дорог общего пользования решающими становятся сертификация, регистрация данных и роль оператора
              дистанционной поддержки, которую вводит готовящийся федеральный закон <SourceRef id="SRC-09" />.
            </p>

            <div style={{ marginTop: 32 }}>
              <Callout wide variant="quiet">
                Отдельно про зимнюю эксплуатацию. Ни один известный нам поставщик автономных терминальных
                тягачей не имеет подтверждённых внедрений в климате с устойчивыми отрицательными
                температурами: все известные площадки находятся в тёплых или умеренных зонах. Для проекта на
                Урале это должно быть отсекающим критерием при выборе, а не примечанием.
              </Callout>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  )
}
