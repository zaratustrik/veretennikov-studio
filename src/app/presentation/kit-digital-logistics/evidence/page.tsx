import { PageFooter } from "@/components/kit-proposal/PageFooter"
import { BackToNarrative, Bullets, Callout, SectionHead } from "@/components/kit-proposal/shared"

import sourcesJson from "@/data/kit-proposal/sources.json"
import type { Source } from "@/types/kit-proposal"

export const metadata = { title: "Доказательная база — ТК КИТ" }

const sources = sourcesJson as unknown as Source[]

const CONF_COLOR: Record<string, string> = {
  HIGH: "var(--kdl-st-confirmed)",
  MEDIUM: "var(--kdl-st-hypothesis)",
  LOW: "var(--kdl-st-question)",
}

const CONF_LABEL: Record<string, string> = {
  HIGH: "Высокая",
  MEDIUM: "Средняя",
  LOW: "Низкая",
}

export default function EvidencePage() {
  return (
    <>
      <div className="kdl-wrap kdl-dd-head">
        <BackToNarrative />
        <SectionHead
          eyebrow="Подробности · доказательная база"
          title="Источники, даты, статусы"
          lead="Каждое существенное внешнее утверждение документа — с источником, датой события, датой проверки, текущим статусом и уровнем уверенности."
        />
      </div>

      <main>
        <section className="kdl-section kdl-section--tight">
          <div className="kdl-wrap">
            <Callout wide variant="quiet">
              Все записи проверены 12 августа 2026 года. Наличие публикации не означает, что проект
              существует сейчас, — поэтому у каждой записи указан отдельный статус: действующий факт,
              исторический факт, объявлено, планируется, эксплуатируется. Там, где статус подтвердить не
              удалось, это сказано прямо.
            </Callout>
          </div>
        </section>

        <section className="kdl-section kdl-section--tight">
          <div className="kdl-wrap">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sources.map((s) => (
                <article className="kdl-card kdl-card--pad" key={s.id} id={s.id}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span className="kdl-toc-n" style={{ color: "var(--kdl-accent-deep)" }}>
                      {s.id}
                    </span>
                    <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span className="kdl-flag">{s.status}</span>
                      <span
                        className="kdl-flag"
                        style={{ color: CONF_COLOR[s.confidence], background: "transparent", border: `1px solid ${CONF_COLOR[s.confidence]}` }}
                      >
                        Уверенность: {CONF_LABEL[s.confidence]}
                      </span>
                    </span>
                  </div>

                  <p className="kdl-body" style={{ marginTop: 12, color: "var(--kdl-ink)", fontSize: 15.5 }}>
                    {s.claim}
                  </p>

                  <div
                    style={{
                      marginTop: 18,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
                      gap: 14,
                    }}
                  >
                    <div>
                      <div className="kdl-attr-k">Источник</div>
                      <p className="kdl-body" style={{ marginTop: 4, fontSize: 13.5 }}>
                        {s.publisher}
                      </p>
                    </div>
                    <div>
                      <div className="kdl-attr-k">Дата события</div>
                      <p className="kdl-body" style={{ marginTop: 4, fontSize: 13.5 }}>
                        {s.eventDate}
                      </p>
                    </div>
                    <div>
                      <div className="kdl-attr-k">Проверено</div>
                      <p className="kdl-body" style={{ marginTop: 4, fontSize: 13.5 }}>
                        {s.checkedAt}
                      </p>
                    </div>
                    <div>
                      <div className="kdl-attr-k">Ссылка</div>
                      <p style={{ marginTop: 4, fontSize: 13, wordBreak: "break-all" }}>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.url.replace(/^https?:\/\//, "").slice(0, 46)}
                            {s.url.length > 54 ? "…" : ""}
                          </a>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>

                  {s.note ? (
                    <p
                      className="kdl-small"
                      style={{
                        marginTop: 16,
                        paddingTop: 14,
                        borderTop: "1px solid var(--kdl-line)",
                        color: "var(--kdl-ink-2)",
                      }}
                    >
                      {s.note}
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
              eyebrow="Ограничения"
              title="Что мы не проверили и где можем ошибаться"
              lead="Перечень приводится намеренно. Документ, в котором нет раздела об ограничениях, обычно скрывает их, а не не имеет."
            />

            <div className="kdl-grid kdl-grid--2" style={{ marginTop: 36 }}>
              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Ограничения исследования</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    items={[
                      "Внутренняя ИТ-архитектура компании нам недоступна. Всё, что сказано о ней, — гипотезы из открытых данных",
                      "Прямых свидетельств использования конкретной учётной или транспортной системы мы не нашли — и ничего о них не утверждаем",
                      "Наличие складской системы подтверждено только упоминанием в материалах компании: вендор, охват и функциональность неизвестны",
                      "Публичных описаний программных интерфейсов у российских поставщиков автономной техники не найдено ни у одного",
                      "Условия участия в экспериментальном правовом режиме мы не читали в полном тексте постановления",
                      "Пороги и отраслевые критерии мер государственной поддержки не проверялись",
                    ]}
                  />
                </div>
              </div>

              <div className="kdl-card kdl-card--pad">
                <h3 className="kdl-h3">Что мы отдельно перепроверили на актуальность</h3>
                <div style={{ marginTop: 14 }}>
                  <Bullets
                    items={[
                      "Внедрение автоматической маршрутизации — статус подтверждён четырьмя изданиями, срок тиражирования указан компанией",
                      "Экспериментальный правовой режим — реквизиты постановления и срок действия",
                      "Федеральный закон о высокоавтоматизированных транспортных средствах — статус на август 2026: не внесён в Госдуму",
                      "Проект логистического хаба — статус «объявлено»: соглашение о сопровождении подписано, публикаций о начале работ не найдено",
                      "Показатели компании — считаны напрямую с официального сайта в день подготовки документа",
                    ]}
                  />
                </div>
                <p className="kdl-small" style={{ marginTop: 16 }}>
                  Отдельно: проект хаба мы намеренно не используем как опору планирования. Все этапы до
                  третьего развёртываются на действующем терминале.
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
