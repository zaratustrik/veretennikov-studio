"use client";

import type {
  MapAuditConclusion,
  MapAuditData,
  MapAuditFinding,
  MapAuditModels,
  MapAuditOption,
  MapAuditRatingLink,
  MapAuditRole,
  MapAuditStep,
} from "@/types/investment-climate";
import { CONFIDENCE_LABELS, Reveal, Section, StatusBadge } from "./shared";
import { SectionReturnLink } from "./SectionReturnLink";

/* ── Словари статусов: цвет всегда сопровождается словом ──────────── */

const ROLE_STATUS_META: Record<MapAuditRole["status"], { label: string; color: string }> = {
  works: { label: "Роль выполняется", color: "var(--ic-s-keep)" },
  limited: { label: "Выполняется с ограничениями", color: "var(--ic-s-improve)" },
};

/** Метка обоснованности варианта: ключ — формулировка из данных. */
function groundedMeta(grounded: string): { label: string; color: string } {
  const g = grounded.trim().toLowerCase();
  if (g.startsWith("подтверждён")) {
    return { label: "Обоснование подтверждено", color: "var(--ic-s-keep)" };
  }
  if (g.startsWith("условно")) {
    return { label: "Обоснование условное", color: "var(--ic-s-improve)" };
  }
  return { label: "Аудитом не подтверждено", color: "var(--ic-s-nodata)" };
}

/** Число из строки вида «4,31 (группа D)» — для сравнительной шкалы. */
function parseScore(value: string): number | null {
  const match = value.match(/\d+[.,]?\d*/);
  if (!match) return null;
  const num = Number.parseFloat(match[0].replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

/* ── Шапка раздела: объект, дата, метод и ограничение сразу ───────── */

function AuditHeader({ meta }: { meta: MapAuditData["meta"] }) {
  return (
    <Reveal>
      <div className="ic-level-fact p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="ic-h3">{meta.title}</h3>
          <p className="text-[12.5px] text-[var(--ic-ink-2)]">
            Дата проверки: {meta.checkedAt}
          </p>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed">
          <span className="font-semibold">Объект проверки: </span>
          {meta.object}
        </p>
        <div className="mt-4 grid gap-2.5 md:grid-cols-2">
          <div
            className="rounded-xl border px-4 py-3"
            style={{
              borderColor: "color-mix(in srgb, var(--ic-s-new) 40%, transparent)",
              background: "color-mix(in srgb, var(--ic-s-new) 7%, transparent)",
            }}
            role="note"
            aria-label="Метод проверки"
          >
            <StatusBadge color="var(--ic-s-new)" label="Метод проверки" />
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
              {meta.method}
            </p>
          </div>
          <div
            className="rounded-xl border px-4 py-3"
            style={{
              borderColor: "color-mix(in srgb, var(--ic-s-improve) 45%, transparent)",
              background: "color-mix(in srgb, var(--ic-s-improve) 9%, transparent)",
            }}
            role="note"
            aria-label="Ограничение проверки"
          >
            <StatusBadge color="var(--ic-s-improve)" label="Ограничение проверки" />
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
              {meta.limitation}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Текущее назначение: три роли ─────────────────────────────────── */

function RolesGrid({ roles }: { roles: MapAuditRole[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {roles.map((role, i) => {
        const sm = ROLE_STATUS_META[role.status];
        return (
          <Reveal key={role.id} delay={Math.min(i * 0.05, 0.2)}>
            <article className="ic-card flex h-full flex-col gap-2 p-4">
              <StatusBadge color={sm.color} label={sm.label} />
              <h4 className="text-[14.5px] font-semibold leading-snug">
                {role.title}
              </h4>
              <p className="text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
                {role.state}
              </p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ── Результаты проверки: величина + подпись + пояснение ──────────── */

function FindingCard({ finding }: { finding: MapAuditFinding }) {
  const isGap = finding.level === "gap";
  return (
    <article
      className={`${isGap ? "ic-card" : "ic-level-fact"} flex h-full flex-col gap-1.5 p-4`}
    >
      <p className="ic-level-caption">{finding.label}</p>
      <p
        className="text-[24px] font-bold leading-8"
        style={isGap ? { color: "var(--ic-s-nodata)" } : undefined}
      >
        {finding.value}
      </p>
      <p className="text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
        {finding.detail}
      </p>
      {finding.note ? (
        <p className="text-[12.5px] leading-relaxed text-[var(--ic-ink-2)]">
          <span className="font-semibold text-[var(--ic-ink)]">Уточнение: </span>
          {finding.note}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {isGap ? (
          <StatusBadge color="var(--ic-s-nodata)" label="Не измерено" />
        ) : null}
        <StatusBadge
          color={isGap ? "var(--ic-s-nodata)" : "var(--ic-s-new)"}
          label={`Доказательность: ${CONFIDENCE_LABELS[finding.confidence]}`}
        />
      </div>
    </article>
  );
}

/* ── Главный вывод ────────────────────────────────────────────────── */

function ConclusionCard({ conclusion }: { conclusion: MapAuditConclusion }) {
  return (
    <Reveal>
      <article className="ic-level-conclusion p-5">
        <p className="ic-level-caption">Главный вывод</p>
        <p className="mt-2 text-[15px] leading-relaxed">{conclusion.text}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ic-ink-2)]">
          {conclusion.attribution}
        </p>
        <div className="mt-3">
          <StatusBadge
            color="var(--ic-s-new)"
            label={`Доказательность: ${CONFIDENCE_LABELS[conclusion.confidence]}`}
          />
        </div>
      </article>
    </Reveal>
  );
}

/* ── Связь с показателем Национального рейтинга ───────────────────── */

function RatingLinkCard({ link }: { link: MapAuditRatingLink }) {
  const MIN = 4.2;
  const MAX = 5.0;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - MIN) / (MAX - MIN)) * 100));
  const so = parseScore(link.so);
  const target = parseScore(link.target);
  const rfAvg = parseScore(link.rfAvg);

  return (
    <Reveal>
      <div className="ic-card p-5">
        <p className="ic-level-caption">Показатель дорожной карты</p>
        <h4 className="mt-1 text-[14.5px] font-semibold leading-snug">
          {link.indicator}
        </h4>

        {so !== null ? (
          <div
            className="mt-4"
            role="img"
            aria-label={`Оценка региона ${link.so}, цель ${link.target}, среднероссийское значение ${link.rfAvg}`}
          >
            <div className="relative h-2 rounded-full bg-[var(--ic-line)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${pct(so)}%`, background: "var(--ic-accent)" }}
                aria-hidden
              />
              {target !== null ? (
                <span
                  aria-hidden
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--ic-accent)] bg-[var(--ic-surface)]"
                  style={{ left: `${pct(target)}%` }}
                />
              ) : null}
              {rfAvg !== null ? (
                <span
                  aria-hidden
                  className="absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pct(rfAvg)}%`, background: "var(--ic-s-remove)" }}
                />
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[var(--ic-ink-2)]">
          <span>
            <strong className="text-[var(--ic-ink)]">{link.so}</strong> — оценка
            региона
          </span>
          <span>{link.target} — цель</span>
          <span>{link.rfAvg} — среднее по России</span>
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed">{link.text}</p>
        <p className="mt-2 text-[12px] text-[var(--ic-ink-2)]">
          Источник: {link.source}
        </p>

        <div
          className="mt-4 rounded-xl border px-4 py-3"
          style={{
            borderColor: "color-mix(in srgb, var(--ic-s-improve) 45%, transparent)",
            background: "color-mix(in srgb, var(--ic-s-improve) 9%, transparent)",
          }}
          role="note"
          aria-label="Ограничение вывода о связи с рейтингом"
        >
          <StatusBadge color="var(--ic-s-improve)" label="Гипотеза, не расчёт" />
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
            {link.caution}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Схема моделей: два порядка работы и разделение ролей ─────────── */

function FlowRow({
  title,
  steps,
  accent,
}: {
  title: string;
  steps: string[];
  accent: boolean;
}) {
  return (
    <div>
      <p className="ic-level-caption">{title}</p>
      <ol
        className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-2"
        aria-label={title}
      >
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            <span
              className="flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12.5px] leading-snug"
              style={{
                borderColor: accent
                  ? "color-mix(in srgb, var(--ic-accent) 40%, var(--ic-line))"
                  : "var(--ic-line)",
                background: accent
                  ? "color-mix(in srgb, var(--ic-accent) 5%, var(--ic-surface))"
                  : "var(--ic-surface)",
              }}
            >
              <span className="text-[11px] font-bold text-[var(--ic-ink-2)]">
                {i + 1}
              </span>
              {step}
            </span>
            {i < steps.length - 1 ? (
              <span aria-hidden className="text-[13px] text-[var(--ic-ink-2)]">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ModelsScheme({ models }: { models: MapAuditModels }) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Reveal>
          <div className="ic-card flex flex-col gap-5 p-5">
            <FlowRow
              title={models.current.title}
              steps={models.current.steps}
              accent={false}
            />
            <div
              aria-hidden
              className="h-px w-full"
              style={{ background: "var(--ic-line)" }}
            />
            <FlowRow
              title={models.possible.title}
              steps={models.possible.steps}
              accent
            />
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="ic-card h-full p-5">
            <p className="ic-level-caption">{models.split.title}</p>
            <ul className="mt-2">
              {models.split.items.map((item) => (
                <li
                  key={item.role}
                  className="border-t border-[var(--ic-line)] py-2 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <p className="text-[13.5px] font-semibold leading-snug">
                    {item.role}
                  </p>
                  <p className="text-[12.5px] leading-snug text-[var(--ic-ink-2)]">
                    {item.task}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
        {models.note}
      </p>
    </>
  );
}

/* ── Варианты развития: показаны все шесть ────────────────────────── */

function OptionCard({ option }: { option: MapAuditOption }) {
  const gm = groundedMeta(option.grounded);
  return (
    <article className="ic-card flex h-full flex-col gap-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ic-surface-2)] text-[12px] font-bold text-[var(--ic-ink-2)]">
          {option.id}
        </span>
        <StatusBadge color={gm.color} label={gm.label} title={option.grounded} />
      </div>
      <h4 className="text-[14.5px] font-semibold leading-snug">{option.title}</h4>
      <p className="text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
        {option.essence}
      </p>
      <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 border-t border-[var(--ic-line)] pt-2.5 text-[12.5px] text-[var(--ic-ink-2)]">
        <div>
          <dt className="font-semibold">Польза инвестору</dt>
          <dd>{option.investor}</dd>
        </div>
        <div>
          <dt className="font-semibold">Влияние на оценку</dt>
          <dd>{option.rating}</dd>
        </div>
        <div>
          <dt className="font-semibold">Сложность</dt>
          <dd>{option.complexity}</dd>
        </div>
        <div>
          <dt className="font-semibold">Срок</dt>
          <dd>{option.term}</dd>
        </div>
      </dl>
      {option.note ? (
        <p className="text-[12.5px] leading-relaxed text-[var(--ic-ink-2)]">
          {option.note}
        </p>
      ) : null}
    </article>
  );
}

/* ── Рекомендуемые следующие шаги (уровень «предложение») ─────────── */

function StepCard({ step }: { step: MapAuditStep }) {
  return (
    <article className="ic-level-proposal flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ic-accent)] text-[13px] font-bold text-white">
          {step.n}
        </span>
        <StatusBadge color="var(--ic-s-new)" label={`Решение: ${step.decision}`} />
      </div>
      <h4 className="text-[14.5px] font-semibold leading-snug">{step.title}</h4>
      <dl className="mt-auto flex flex-col gap-0.5 text-[12.5px] text-[var(--ic-ink-2)]">
        <div className="flex gap-1">
          <dt className="font-semibold">Срок:</dt>
          <dd>{step.term}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-semibold">Основание:</dt>
          <dd>{step.why}</dd>
        </div>
      </dl>
    </article>
  );
}

function StepsGrid({ steps }: { steps: MapAuditStep[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {steps.map((step, i) => (
        <Reveal key={step.n} delay={Math.min(i * 0.05, 0.25)}>
          <StepCard step={step} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * MapAuditBlock — раздел «Инвестиционная карта: аудит».
 *
 * Управленческий режим (compact): шапка проверки, главный вывод, связь с
 * показателем рейтинга и рекомендуемые шаги. Подробный режим: дополнительно
 * текущее назначение, результаты проверки, схема моделей, все шесть вариантов
 * развития, вопросы для решения и перечень материалов аудита.
 */
export function MapAuditBlock({
  audit,
  compact = false,
  onOverview,
  onPackage,
  onExpand,
}: {
  audit: MapAuditData;
  compact?: boolean;
  onOverview: () => void;
  onPackage: () => void;
  onExpand?: () => void;
}) {
  if (compact) {
    return (
      <Section
        id="map-audit"
        title="Инвестиционная карта: аудит"
        lead="Кратко: чем является карта сегодня по результатам проверки, главный вывод, связь с показателем Национального рейтинга и ближайшие шаги. Полный разбор — в подробном анализе."
      >
        <AuditHeader meta={audit.meta} />

        <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-start">
          <ConclusionCard conclusion={audit.conclusion} />
          <RatingLinkCard link={audit.ratingLink} />
        </div>

        <h3 className="ic-h3 mb-3 mt-8">Рекомендуемые следующие шаги</h3>
        <StepsGrid steps={audit.nextSteps} />

        {onExpand ? (
          <Reveal className="ic-no-print mt-6">
            <button
              type="button"
              onClick={onExpand}
              className="text-[13.5px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
            >
              Полный разбор аудита: результаты проверки, схема моделей, шесть
              вариантов развития →
            </button>
          </Reveal>
        ) : null}

        <SectionReturnLink onOverview={onOverview} onPackage={onPackage} />
      </Section>
    );
  }

  return (
    <Section
      id="map-audit"
      title="Инвестиционная карта: аудит"
      lead="Технический, пользовательский и управленческий разбор региональной инвестиционной карты: что измерено, что измерить не удалось, какой вывод следует из измерений и какие варианты развития обоснованы результатами проверки."
      wide
    >
      <AuditHeader meta={audit.meta} />

      {/* ── Текущее назначение ── */}
      <h3 className="ic-h3 mb-3 mt-8">Текущее назначение системы</h3>
      <RolesGrid roles={audit.roles} />

      {/* ── Результаты проверки ── */}
      <h3 className="ic-h3 mb-3 mt-10">Результаты проверки</h3>
      <p className="ic-section-lead">
        Восемь наблюдений. Нейтральной плашкой показаны измеренные значения,
        серой — то, что измерить из среды проверки не удалось.
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {audit.findings.map((finding, i) => (
          <Reveal key={finding.id} delay={Math.min(i * 0.04, 0.24)}>
            <FindingCard finding={finding} />
          </Reveal>
        ))}
      </div>

      {/* ── Главный вывод и связь с рейтингом ── */}
      <h3 className="ic-h3 mb-3 mt-10">Главный вывод</h3>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <ConclusionCard conclusion={audit.conclusion} />
        <RatingLinkCard link={audit.ratingLink} />
      </div>

      {/* ── Схема моделей ── */}
      <h3 className="ic-h3 mb-3 mt-10">Порядок работы: сейчас и возможный</h3>
      <ModelsScheme models={audit.models} />

      {/* ── Варианты развития: все шесть ── */}
      <h3 className="ic-h3 mb-3 mt-10">Варианты развития</h3>
      <p className="ic-section-lead">
        Показаны все шесть рассмотренных вариантов, включая те, основания
        которых проверка не подтвердила. Метка обоснованности стоит на каждой
        карточке.
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {audit.options.map((option, i) => (
          <Reveal key={option.id} delay={Math.min(i * 0.04, 0.2)}>
            <OptionCard option={option} />
          </Reveal>
        ))}
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
        Отдельно о варианте 5 «Технологическая модернизация платформы»: ни одно
        из оснований для замены платформы проверкой не подтверждено — вариант
        приведён для полноты перечня.
      </p>

      {/* ── Следующие шаги ── */}
      <h3 className="ic-h3 mb-3 mt-10">Рекомендуемые следующие шаги</h3>
      <StepsGrid steps={audit.nextSteps} />

      {/* ── Вопросы для управленческого решения ── */}
      <h3 className="ic-h3 mb-3 mt-10">Вопросы для управленческого решения</h3>
      <Reveal>
        <ol className="ic-card overflow-hidden">
          {audit.openQuestions.map((question, i) => (
            <li
              key={question}
              className="flex gap-3 border-t border-[var(--ic-line)] px-5 py-3 text-[13.5px] leading-relaxed first:border-t-0"
            >
              <span className="font-bold text-[var(--ic-accent)]">{i + 1}</span>
              {question}
            </li>
          ))}
        </ol>
      </Reveal>

      {/* ── Материалы аудита ── */}
      <h3 className="ic-h3 mb-3 mt-10">Материалы аудита</h3>
      <Reveal>
        <p className="text-[13px] text-[var(--ic-ink-2)]">
          Перечень документов аналитического корпуса. Это не ссылки на внешние
          ресурсы: документы хранятся в аналитическом корпусе проверки.
        </p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {audit.documents.map((doc) => (
            <li key={doc.id} className="ic-level-fact px-4 py-3">
              <p className="text-[13.5px] font-semibold leading-snug">{doc.title}</p>
              <p className="mt-0.5 break-all text-[12px] text-[var(--ic-ink-2)]">
                {doc.file}
              </p>
              <p className="mt-1 text-[11.5px] text-[var(--ic-s-nodata)]">
                в аналитическом корпусе
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <SectionReturnLink onOverview={onOverview} onPackage={onPackage} />
    </Section>
  );
}
