import Reveal from "@/components/motion/Reveal"
import type { Qualification as QualificationType } from "@/types/utpp"

/**
 * Слой предварительной квалификации организации внутри блока обращений.
 *
 * Три вещи, которые этот блок обязан удержать:
 *  ① развести право вступить, соответствие целевой аудитории, риск-индикаторы
 *    и собственно решение — их легко перепутать, и путаница даёт ощущение,
 *    что система «решает за Палату»;
 *  ② показать статусы, среди которых нет «принят» и «отклонён»;
 *  ③ показать ход проверки схемой, а не картинкой: здесь важны точные шаги.
 *
 * Схема сделана разметкой, а не SVG и не генеративным изображением: шесть
 * подписей должны переноситься, искаться поиском по странице и читаться
 * скринридером как нумерованный список.
 */
export default function Qualification({ data }: { data: QualificationType }) {
  return (
    <div className="utpp-page-qual">
      <Reveal>
        <h3 className="utpp-page-h3">{data.title}</h3>
        <p className="utpp-page-lead">{data.lead}</p>
      </Reveal>

      <Reveal>
        <dl className="utpp-page-terms">
          {data.distinctions.map((item) => (
            <div key={item.term} className="utpp-page-term">
              <dt>{item.term}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal>
        <div className="utpp-page-flowblock">
          <h4 className="utpp-page-h4">{data.flow.title}</h4>

          <ol className="utpp-page-flow">
            {data.flow.steps.map((step, i) => (
              <li key={step.label} className="utpp-page-flow-step">
                <span className="utpp-page-flow-num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="utpp-page-flow-label">{step.label}</span>
                <span className="utpp-page-flow-note">{step.note}</span>
              </li>
            ))}
          </ol>

          <p className="utpp-page-note">{data.flow.note}</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="utpp-page-statuses">
          <h4 className="utpp-page-h4">Что показывает проверка</h4>

          <ul className="utpp-page-statuslist">
            {data.statuses.map((status) => (
              <li key={status.label}>
                <span className="utpp-page-status-label">{status.label}</span>
                <span className="utpp-page-status-note">{status.note}</span>
              </li>
            ))}
          </ul>

          <p className="utpp-page-note">{data.statusesNote}</p>
        </div>
      </Reveal>
    </div>
  )
}
