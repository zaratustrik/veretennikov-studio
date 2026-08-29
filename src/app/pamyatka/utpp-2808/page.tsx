import CopyBlock from "@/components/pamyatka/CopyBlock"
import SummarySheet from "@/components/pamyatka/SummarySheet"
import TaskPicker from "@/components/pamyatka/TaskPicker"
import {
  PROMPT_DOCUMENT,
  PROMPT_MASTER,
  TOOLS,
} from "@/components/pamyatka/content.ru"

const COMMITTEE_URL = "https://uralcci.com/about/commissions/14/"

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h13m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14m0 0 5-5m-5 5-5-5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PamyatkaPage() {
  return (
    <main>
      {/* ── 00. Обращение ─────────────────────────────────────── */}
      <section className="pm-section pm-section--first">
        <div className="pm-wrap">
          <p className="pm-hello">Персональная памятка · август 2026</p>
          <h1 className="pm-h1">Татьяна Юрьевна, добрый день.</h1>
          <p className="pm-lead">
            После нашего разговора в Уральской ТПП я собрал для Вас небольшую памятку.
            Без технических терминов и специальных команд — только несколько вещей,
            которые можно попробовать в работе уже сейчас.
          </p>
          <div className="pm-cta-row">
            <a className="pm-cta" href="#nachalo">
              Начать с одного документа
              <ArrowRight />
            </a>
            <span className="pm-cta-note">5 минут · ничего устанавливать не нужно</span>
          </div>
        </div>
      </section>

      {/* ── 01. Главная демонстрация ──────────────────────────── */}
      <section className="pm-section" id="nachalo">
        <div className="pm-wrap">
          <p className="pm-eyebrow">01 · С чего начать</p>
          <h2 className="pm-h2">Большой документ → одна страница для руководителя</h2>
          <p>
            Самое простое и самое полезное, что умеет ИИ, — быстро читать. Вот живой
            пример на документе, который лежит в материалах Вашего Комитета.
          </p>

          <div className="pm-ba">
            <div>
              <p className="pm-ba-label">Было</p>
              <div className="pm-doc">
                <p className="pm-doc-title">
                  Стратегия развития строительной отрасли и жилищно-коммунального
                  хозяйства Российской Федерации на период до 2030 года с прогнозом
                  до 2035 года
                </p>
                <p className="pm-doc-meta">
                  Утверждена распоряжением Правительства РФ от 31 октября 2022 г.
                  № 3268-р. Четырнадцать разделов и приложение с целевыми показателями.
                </p>
                <p className="pm-doc-size">
                  <b>92</b> страницы
                </p>
              </div>
            </div>

            <p className="pm-arrow">
              <ArrowDown />
              Одна просьба к ИИ
            </p>

            <div>
              <p className="pm-ba-label">Стало</p>
              <SummarySheet />
            </div>
          </div>

          <p className="pm-source">
            Это публичный документ, размещённый в материалах Вашего Комитета{" "}
            <a href={COMMITTEE_URL} target="_blank" rel="noopener noreferrer">
              на сайте Уральской ТПП
            </a>
            . Вот что получается, если попросить ИИ сначала подготовить управленческую
            выжимку. Все цифры выше сверены с текстом документа вручную.
          </p>

          <h3 className="pm-h3" style={{ marginTop: "44px" }}>
            Попробуйте со своим документом
          </h3>
          <ol className="pm-steps">
            <li>Откройте ChatGPT.</li>
            <li>Нажмите «+» рядом с полем ввода и прикрепите PDF или Word.</li>
            <li>Скопируйте текст ниже и вставьте туда же.</li>
            <li>Отправьте.</li>
          </ol>

          <CopyBlock text={PROMPT_DOCUMENT} id="pm-text-main" />

          <p className="pm-muted" style={{ marginTop: "18px" }}>
            Если Вы уже пользуетесь другим ИИ-помощником, эти же формулировки можно
            использовать и там.
          </p>
        </div>
      </section>

      {/* ── 02. Выберите задачу ───────────────────────────────── */}
      <section className="pm-section">
        <div className="pm-wrap">
          <p className="pm-eyebrow">02 · Что ещё попробовать</p>
          <h2 className="pm-h2">Что нужно сделать?</h2>
          <p>
            Ещё три вещи, которые стоит попробовать на этой неделе. Выберите задачу —
            покажу готовый текст, который можно скопировать и отправить.
          </p>
          <TaskPicker />
        </div>
      </section>

      {/* ── 03. Голос ─────────────────────────────────────────── */}
      <section className="pm-section">
        <div className="pm-wrap">
          <p className="pm-eyebrow">03 · Не обязательно печатать</p>
          <h2 className="pm-h2">Можно просто рассказать</h2>
          <p>
            Иногда удобнее вообще ничего не печатать. Нажмите микрофон и расскажите
            задачу так же, как рассказали бы помощнику.
          </p>
          <p>И одна фраза, которая заменяет собой все остальные подсказки:</p>

          <div className="pm-master">
            <p className="pm-master-text">«{PROMPT_MASTER}»</p>
            <CopyBlock text={PROMPT_MASTER} bare />
          </div>

          <p className="pm-muted" style={{ marginTop: "18px" }}>
            С этой фразы можно начинать любую задачу: помощник сам спросит то, чего
            ему не хватает, и Вам не придётся заранее продумывать формулировку.
          </p>
        </div>
      </section>

      {/* ── 04. Что можно загружать ───────────────────────────── */}
      <section className="pm-section">
        <div className="pm-wrap">
          <p className="pm-eyebrow">04 · Что можно загружать</p>
          <h2 className="pm-h2">Три корзины</h2>

          <div className="pm-baskets">
            <div className="pm-basket pm-basket--ok">
              <p className="pm-basket-title">Можно спокойно</p>
              <ul className="pm-list">
                <li>Публичные и нормативные документы</li>
                <li>Опубликованные материалы Комитета</li>
                <li>Статьи, обзоры, аналитику</li>
                <li>Собственные публичные тезисы и выступления</li>
              </ul>
            </div>

            <div className="pm-basket pm-basket--care">
              <p className="pm-basket-title">Сначала обезличить</p>
              <ul className="pm-list">
                <li>Договоры и проекты договоров</li>
                <li>Коммерческие предложения</li>
                <li>Деловую переписку</li>
                <li>Внутренние отчёты</li>
              </ul>
              <p className="pm-muted" style={{ marginTop: "12px" }}>
                Замените названия на «Компания А», «Подрядчик Б», уберите ФИО, номера
                договоров, адреса и реквизиты — всё, что не нужно для самой задачи.
                Для разбора условий этого достаточно.
              </p>
            </div>

            <div className="pm-basket pm-basket--no">
              <p className="pm-basket-title">Без отдельного решения лучше не загружать</p>
              <ul className="pm-list">
                <li>Паспорта и персональные данные</li>
                <li>Данные покупателей и сотрудников</li>
                <li>Закрытую финансовую информацию</li>
                <li>Материалы под коммерческой тайной</li>
                <li>Незавершённые переговоры и споры</li>
              </ul>
            </div>
          </div>

          <div className="pm-rule-box">
            <p>
              <span className="pm-strong">Одно правило вместо инструкции.</span> Если бы
              этот документ случайно увидел посторонний: ничего страшного — можно;
              неприятно — обезличьте; серьёзная проблема — не загружайте.
            </p>
          </div>
        </div>
      </section>

      {/* ── 05. Инструменты ───────────────────────────────────── */}
      <section className="pm-section">
        <div className="pm-wrap">
          <p className="pm-eyebrow">05 · Что и когда может понадобиться</p>
          <h2 className="pm-h2">Инструмент выбирается под задачу</h2>
          <p>
            Не по рейтингам и не по моде. Вот как это выглядит на Ваших направлениях —
            от того, что работает сразу, до того, что понадобится не скоро.
          </p>

          <div className="pm-tools">
            {TOOLS.map((tool) => (
              <div className="pm-tool" key={tool.task}>
                <div className="pm-tool-tags">
                  {tool.tags.map((tag) => (
                    <span className="pm-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="pm-tool-task">{tool.task}</p>
                <p className="pm-tool-need">
                  <ArrowRight />
                  <span>{tool.need}</span>
                </p>
                <p className="pm-tool-when">{tool.when}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: "24px" }}>
            <span className="pm-strong">
              Вам не нужно осваивать всё это сразу. Для начала достаточно одного
              ИИ-помощника и одной реальной задачи.
            </span>
          </p>
        </div>
      </section>

      {/* ── 06. Что дальше ────────────────────────────────────── */}
      <section className="pm-section">
        <div className="pm-wrap">
          <p className="pm-eyebrow">06 · Что дальше</p>
          <h2 className="pm-h2">Для начала этого достаточно</h2>
          <p>
            Если помощником пользоваться регулярно, позже удобно завести отдельные
            рабочие пространства — по одному на каждое направление:
          </p>
          <div className="pm-spaces">
            <span className="pm-space">Комитет</span>
            <span className="pm-space">Строительные проекты</span>
            <span className="pm-space">Компания</span>
          </div>
          <p>Тогда не придётся каждый раз объяснять всё заново.</p>

          <div className="pm-signoff">
            <p>
              Если что-то не заработает или результат окажется не тем — напишите мне,
              я подскажу, как лучше сформулировать задачу.
            </p>
            <p>
              А если позже появятся повторяющиеся задачи, за которыми помощник должен
              следить регулярно, это можно спокойно настроить отдельно.
            </p>
            <div className="pm-contacts">
              <a
                className="pm-contact"
                href="https://t.me/VeretennikovINFO"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
              <a className="pm-contact" href="tel:+79226130154">
                +7 922 613-01-54
              </a>
            </div>
            <p className="pm-muted" style={{ marginTop: "22px" }}>
              Если часть этих задач у Вас готовит помощник — просто перешлите ему эту
              страницу: те же приёмы работают и при подготовке материалов для Вас.
            </p>
          </div>
        </div>
      </section>

      <footer className="pm-footer">
        <div className="pm-wrap">
          <p>
            Страница сделана лично для Вас, открывается только по прямой ссылке
            и не индексируется поисковыми системами. Анатолий Веретенников,
            Екатеринбург.
          </p>
        </div>
      </footer>
    </main>
  )
}
