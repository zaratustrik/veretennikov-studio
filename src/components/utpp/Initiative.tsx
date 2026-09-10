import Reveal from "@/components/motion/Reveal"
import type { Initiative as InitiativeType } from "@/types/utpp"

import Details from "./Details"
import Illustration from "./Illustration"
import Qualification from "./Qualification"
import SectionQuestions from "./SectionQuestions"

/**
 * Раздел одной инициативы. Единый шаблон для всех пяти: одинаковый ритм
 * делает страницу документом, а не набором мини-лендингов.
 *
 * Номер в исходном перечне УТПП виден всегда, включая мобильную ширину, —
 * чтобы читателю не приходилось сверяться со своим листом.
 */
export default function Initiative({ data }: { data: InitiativeType }) {
  return (
    <section id={data.id} className="utpp-page-section utpp-page-initiative">
      <Reveal>
        <p className="utpp-page-eyebrow">
          <span className="utpp-page-num">№{data.sourceNumber}</span>
          <span className="utpp-page-num-note">в перечне УТПП</span>
        </p>
        <h2 className="utpp-page-h2">{data.title}</h2>
      </Reveal>

      <div className="utpp-page-split">
        <div className="utpp-page-split-text">
          <Reveal delay={0.05}>
            <p className="utpp-page-lead">{data.situation}</p>

            <dl className="utpp-page-dl">
              <dt>Цель</dt>
              <dd>{data.goal}</dd>

              <dt>Что намереваемся сделать</dt>
              <dd>{data.intent}</dd>

              <dt>Эффект</dt>
              <dd>{data.effect}</dd>

              <dt>Кому помогает</dt>
              <dd>{data.helps}</dd>
            </dl>
          </Reveal>
        </div>

        <div className="utpp-page-split-media">
          <Reveal delay={0.1}>
            <Illustration src={data.image.src} alt={data.image.alt} />
          </Reveal>
        </div>
      </div>

      {data.qualification ? <Qualification data={data.qualification} /> : null}

      <Reveal>
        <div className="utpp-page-scope">
          <div className="utpp-page-scope-col">
            <h3 className="utpp-page-h4">Входит в первую версию</h3>
            <ul className="utpp-page-list">
              {data.scope.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="utpp-page-scope-col utpp-page-scope-col--muted">
            <h3 className="utpp-page-h4">Пока не входит</h3>
            <ul className="utpp-page-list">
              {data.scope.excluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Details
        groups={[
          { title: "Какие данные и документы нужны", items: data.details.data },
          { title: "Какое участие требуется от Палаты", items: data.details.participation },
          { title: "От чего зависит", items: data.details.dependencies },
          {
            title: "Что будем измерять — после базового замера",
            items: data.details.measure,
          },
          { title: "Что ещё нужно проверить", items: data.details.hypotheses },
        ]}
      />

      <SectionQuestions sectionId={data.id} />
    </section>
  )
}
