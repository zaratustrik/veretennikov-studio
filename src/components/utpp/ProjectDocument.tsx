import Reveal from "@/components/motion/Reveal"
import AnswersPanel from "@/components/utpp/AnswersPanel"
import AnswersProvider from "@/components/utpp/AnswersProvider"
import CoreDiagram from "@/components/utpp/CoreDiagram"
import Illustration from "@/components/utpp/Illustration"
import Initiative from "@/components/utpp/Initiative"
import SectionQuestions from "@/components/utpp/SectionQuestions"
import SectionRail from "@/components/utpp/SectionRail"
import {
  answersSection,
  contextBar,
  core,
  dependencies,
  hero,
  initiatives,
  nextStep,
  resources,
  sections,
} from "@/lib/utpp/content"

/**
 * Закрытая проектная страница УТПП.
 *
 * Одна непрерывная лента, без переключателя «презентация / анкета». Уточнения
 * встроены в разделы, к которым относятся: страница остаётся документом,
 * а не превращается в анкету с предисловием.
 *
 * Разделы — серверные, интерактивных островов четыре: навигация, раскрытие
 * подробностей, вопросы и сводка. Провайдер ответов оборачивает ленту,
 * но текст при этом остаётся серверным: он приходит внутрь как children.
 */
export default function ProjectDocument() {
  return (
    <AnswersProvider>
      {/* Полоса контекста */}
      <div className="utpp-page-context">
        <div className="utpp-page-context-inner">
          <span className="utpp-page-context-label">{contextBar.label}</span>
          <span className="utpp-page-context-org">{contextBar.org}</span>
        </div>
      </div>

      <div className="utpp-page-shell">
        <SectionRail sections={sections} />

        <main className="utpp-page-main" id="utpp-page-main">
          {/* ── Первый экран ─────────────────────────────────────── */}
          <section id="start" className="utpp-page-section utpp-page-hero">
            <p className="utpp-page-eyebrow">{hero.eyebrow}</p>
            <h1 className="utpp-page-h1">{hero.title}</h1>
            <p className="utpp-page-subtitle">{hero.subtitle}</p>
            <p className="utpp-page-lead">{hero.lead}</p>

            <ol className="utpp-page-toc">
              {hero.list.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    <span className="utpp-page-toc-num">№{item.n}</span>
                    <span className="utpp-page-toc-title">{item.title}</span>
                    <span className="utpp-page-toc-note">{item.note}</span>
                  </a>
                </li>
              ))}
            </ol>

            <div className="utpp-page-actions">
              <a className="utpp-page-btn" href={hero.actions.primary.href}>
                {hero.actions.primary.label}
              </a>
              <a className="utpp-page-btn-ghost" href={hero.actions.secondary.href}>
                {hero.actions.secondary.label}
              </a>
            </div>

            <Illustration
              src={hero.image.src}
              alt={hero.image.alt}
              ratio="16-9"
              priority
              sizes="(max-width: 1023px) 100vw, 900px"
            />

            <div className="utpp-page-duo">
              <div>
                <h2 className="utpp-page-h4">{hero.pilot.title}</h2>
                <p>{hero.pilot.text}</p>
              </div>
              <div>
                <h2 className="utpp-page-h4">{hero.principle.title}</h2>
                <p>{hero.principle.text}</p>
              </div>
            </div>
          </section>

          {/* ── Общее ядро ───────────────────────────────────────── */}
          <section id="core" className="utpp-page-section">
            <Reveal>
              <p className="utpp-page-eyebrow">{core.eyebrow}</p>
              <h2 className="utpp-page-h2">{core.title}</h2>
              <p className="utpp-page-lead">{core.lead}</p>
            </Reveal>

            <Reveal delay={0.05}>
              <CoreDiagram />
            </Reveal>

            <Reveal>
              <div className="utpp-page-duo">
                <div>
                  <h3 className="utpp-page-h4">{core.notWhat.title}</h3>
                  <ul className="utpp-page-list">
                    {core.notWhat.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="utpp-page-h4">{core.practice.title}</h3>
                  <ul className="utpp-page-list">
                    {core.practice.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <SectionQuestions sectionId="core" />
          </section>

          {/* ── Пять инициатив ───────────────────────────────────── */}
          {initiatives.map((initiative) => (
            <Initiative key={initiative.id} data={initiative} />
          ))}

          {/* ── Зависимости ──────────────────────────────────────── */}
          <section id="dependencies" className="utpp-page-section">
            <Reveal>
              <p className="utpp-page-eyebrow">{dependencies.eyebrow}</p>
              <h2 className="utpp-page-h2">{dependencies.title}</h2>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="utpp-page-blocks">
                {dependencies.blocks.map((block) => (
                  <div key={block.title} className="utpp-page-block">
                    <h3 className="utpp-page-h4">{block.title}</h3>
                    <p>{block.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h3 className="utpp-page-h4">{dependencies.matrix.title}</h3>
              <div className="utpp-page-tablewrap">
                <table className="utpp-page-table">
                  <thead>
                    <tr>
                      <th scope="col">Что нужно от ядра</th>
                      {dependencies.matrix.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dependencies.matrix.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        {row.values.map((value, i) => (
                          <td key={dependencies.matrix.columns[i]}>
                            <span
                              className={
                                value === 2
                                  ? "utpp-page-dot utpp-page-dot--strong"
                                  : value === 1
                                    ? "utpp-page-dot"
                                    : "utpp-page-dot utpp-page-dot--none"
                              }
                            >
                              {value === 2
                                ? "критично"
                                : value === 1
                                  ? "нужно"
                                  : "не требуется"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="utpp-page-note">{dependencies.matrix.note}</p>
              <p className="utpp-page-note">{dependencies.later}</p>
            </Reveal>

            <SectionQuestions sectionId="dependencies" />
          </section>

          {/* ── Что нужно от Палаты ──────────────────────────────── */}
          <section id="resources" className="utpp-page-section">
            <Reveal>
              <p className="utpp-page-eyebrow">{resources.eyebrow}</p>
              <h2 className="utpp-page-h2">{resources.title}</h2>
              <p className="utpp-page-lead">{resources.lead}</p>

              {resources.groups.map((group) => (
                <div key={group.title} className="utpp-page-resgroup">
                  <h3 className="utpp-page-h4">{group.title}</h3>
                  <ul className="utpp-page-checklist">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <p className="utpp-page-note">{resources.note}</p>
            </Reveal>

            <SectionQuestions sectionId="resources" />
          </section>

          {/* ── Ваши ответы ──────────────────────────────────────── */}
          <section id="answers" className="utpp-page-section">
            <Reveal>
              <p className="utpp-page-eyebrow">{answersSection.eyebrow}</p>
              <h2 className="utpp-page-h2">{answersSection.title}</h2>
            </Reveal>

            <AnswersPanel
              copy={{
                empty: answersSection.empty,
                nameLabel: answersSection.nameLabel,
                namePlaceholder: answersSection.namePlaceholder,
                nameHint: answersSection.nameHint,
                privacy: answersSection.privacy,
                submit: answersSection.submit,
                submitting: answersSection.submitting,
                skippedTitle: answersSection.skippedTitle,
                skippedNote: answersSection.skippedNote,
                successTitle: answersSection.successTitle,
                successText: answersSection.successText,
                errorText: answersSection.errorText,
                download: answersSection.download,
                again: answersSection.again,
                againNote: answersSection.againNote,
              }}
            />
          </section>

          {/* ── Следующий шаг ────────────────────────────────────── */}
          <section id="next" className="utpp-page-section utpp-page-next">
            <Reveal>
              <p className="utpp-page-eyebrow">{nextStep.eyebrow}</p>
              <h2 className="utpp-page-h2">{nextStep.title}</h2>
              <p className="utpp-page-lead">{nextStep.text}</p>
              <p className="utpp-page-note">{nextStep.note}</p>
            </Reveal>

            <Reveal delay={0.05}>
              <Illustration
                src={nextStep.image.src}
                alt={nextStep.image.alt}
                ratio="16-9"
                sizes="(max-width: 1023px) 100vw, 900px"
              />
            </Reveal>

              <SectionQuestions sectionId="next" />
            </section>
        </main>
      </div>
    </AnswersProvider>
  )
}
