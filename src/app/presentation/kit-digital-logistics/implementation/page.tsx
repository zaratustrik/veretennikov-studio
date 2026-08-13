import { PageFooter } from "@/components/kit-proposal/PageFooter"
import { StageCard } from "@/components/kit-proposal/StageCard"
import { RoadmapStrip } from "@/components/kit-proposal/diagrams/CoreDiagrams"
import {
  BackToNarrative,
  Callout,
  Figure,
  SectionHead,
} from "@/components/kit-proposal/shared"

import risksJson from "@/data/kit-proposal/risks.json"
import stagesJson from "@/data/kit-proposal/stages.json"
import type { Risk, Stage } from "@/types/kit-proposal"

export const metadata = { title: "Этапы и риски — ТК КИТ" }

const stages = stagesJson as unknown as Stage[]
const risks = risksJson as unknown as Risk[]

export default function ImplementationPage() {
  return (
    <>
      <div className="kdl-wrap kdl-dd-head">
        <BackToNarrative anchor="stages" />
        <SectionHead
          eyebrow="Подробности · реализация"
          title="Этапы и риски"
          lead="Полные карточки всех шести этапов и одиннадцать рисков с ответами. На основной странице этого намеренно нет: там достаточно логики движения, здесь — детали для тех, кто будет это исполнять."
        />
      </div>

      <main>
        <section className="kdl-section kdl-section--tight">
          <div className="kdl-wrap">
            <div className="kdl-svg-scroll">
              <Figure caption="Шесть этапов и точки принятия решения">
                <RoadmapStrip />
              </Figure>
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Карточки этапов"
              title="Одинаковая структура у каждого этапа"
              lead="Задача · что создаём · что получает КИТ · что требуется от КИТ · ресурсы · данные · интеграции · тестирование · критерии приёмки · показатели · риски — и обязательный последний блок."
            />

            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
              {stages.map((s, i) => (
                <StageCard key={s.id} stage={s} defaultOpen={i === 0} />
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <Callout wide>
                В каждой карточке последним идёт блок «что остаётся, если следующий этап
                не запускается». Этап, который нельзя остановить без потери вложенного,
                спроектирован неправильно.
              </Callout>
            </div>
          </div>
        </section>

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Риски"
              title="Одиннадцать рисков и что мы с ними делаем"
              lead="Мы их не прячем и не превращаем в страшилку. Риск без ответа — это не честность, а безответственность."
            />

            <div className="kdl-tablewrap" style={{ marginTop: 36 }}>
              <table className="kdl-table">
                <thead>
                  <tr>
                    <th style={{ width: "46%" }}>Риск</th>
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

        <section className="kdl-section">
          <div className="kdl-wrap">
            <SectionHead
              eyebrow="Приёмка"
              title="Как проверяется, что этап действительно сделан"
              lead="Формулировки задаются сейчас, конкретные значения — после базового замера. Это не уклонение от обязательств, а условие того, чтобы обязательства были выполнимыми."
            />

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 36 }}>
              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Не «система создана», а измеримый результат</h3>
                <ul className="kdl-list" style={{ marginTop: 14 }}>
                  <li>Не менее X % событий фиксируются автоматически, без ручного ввода</li>
                  <li>Сравнение плана и факта доступно по каждому плечу</li>
                  <li>История ответственности не имеет неучтённых разрывов</li>
                  <li>Оператор видит отклонение не позднее N минут после возникновения</li>
                  <li>Показатели рассчитываются автоматически, без выгрузок в таблицы</li>
                  <li>Потеря связи не блокирует разрешённые операции узла</li>
                  <li>
                    Новый поставщик ресурса подключается переходником без изменения модели
                    данных
                  </li>
                </ul>
                <p className="kdl-small" style={{ marginTop: 16 }}>
                  Значения X и N определяются после Этапа 0 — на данных, а не на ощущениях.
                </p>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Отдельный критерий, который важнее остальных</h3>
                <p className="kdl-body" style={{ marginTop: 14, fontSize: 15 }}>
                  Операторы работают <strong>в</strong> системе, а не параллельно ей.
                  Отсутствие дублирующих журналов — формальный пункт приёмки.
                </p>
                <p className="kdl-body" style={{ marginTop: 12, fontSize: 15 }}>
                  Если персонал продолжает вести учёт в тетради, переделывается интерфейс,
                  а не убеждаются люди. Система, которую обходят, не даёт данных — а без
                  данных не работает ничего из описанного выше.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  )
}
