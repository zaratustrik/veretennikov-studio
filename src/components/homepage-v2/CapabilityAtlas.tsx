"use client";

import Link from "next/link";
import { useState } from "react";

type CapabilityId = "ai" | "systems" | "physical" | "visual";

const CAPABILITIES = [
  {
    id: "ai",
    index: "01",
    title: "ИИ и автоматизация",
    label: "OPERATIONS",
    status: "PRODUCTION",
    description:
      "Разбираем рабочий процесс, находим измеримую точку эффекта и внедряем ИИ туда, где он снимает ручную нагрузку.",
    result: "Диагностика → пилот → внедрение",
    examples: ["Базы знаний", "ИИ-агенты", "Документы и заявки"],
    href: "/services",
  },
  {
    id: "systems",
    index: "02",
    title: "Цифровые продукты",
    label: "SYSTEMS",
    status: "PRODUCTION",
    description:
      "Проектируем интерфейс, данные и логику как одну систему — от внутреннего инструмента до отраслевой платформы.",
    result: "Прототип → продукт → развитие",
    examples: ["B2B-платформы", "Личные кабинеты", "Интеграции"],
    href: "/cases",
  },
  {
    id: "physical",
    index: "03",
    title: "Physical AI",
    label: "R&D",
    status: "R&D",
    description:
      "Исследуем контур, где ИИ получает данные из физической среды и помогает оператору принимать решение. Направление пока в стадии R&D.",
    result: "Сенсор → модель → человек",
    examples: ["Машинное зрение", "Сигналы оборудования", "Human-in-the-loop"],
    href: "/lab",
  },
  {
    id: "visual",
    index: "04",
    title: "Визуальная инженерия",
    label: "MEDIA",
    status: "12 YEARS",
    description:
      "Показываем сложные технологии через промышленную съёмку, 3D, интерактив и понятную драматургию.",
    result: "Смысл → образ → коммуникация",
    examples: ["Промышленное видео", "3D / CGI", "Интерактив"],
    href: "/production",
  },
] as const;

function CapabilitySignal({ id }: { id: CapabilityId }) {
  if (id === "systems") {
    return (
      <svg viewBox="0 0 540 330" role="presentation">
        <text x="24" y="34" className="hpv2-svg-kicker">SYSTEM MAP / PRODUCT</text>
        <path d="M102 164H214M326 164H426M270 104V62M270 226V268" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <g className="hpv2-atlas-visual__source">
          <rect x="28" y="117" width="74" height="94" rx="2" />
          <path d="M45 139H85M45 158H78M45 177H89" />
          <text x="30" y="235">DATA</text>
        </g>
        <g className="hpv2-atlas-visual__core">
          <rect x="214" y="104" width="112" height="122" rx="2" />
          <rect x="230" y="121" width="80" height="88" rx="1" />
          <circle cx="270" cy="165" r="19" />
          <text x="229" y="249">PRODUCT CORE</text>
        </g>
        <g className="hpv2-atlas-visual__outputs">
          <rect x="426" y="75" width="88" height="54" rx="2" />
          <rect x="426" y="138" width="88" height="54" rx="2" />
          <rect x="426" y="201" width="88" height="54" rx="2" />
          <text x="443" y="107">WEB</text><text x="443" y="170">API</text><text x="443" y="233">OPS</text>
        </g>
        <path d="M326 164H379V102H426M379 164H426M379 164V228H426" className="hpv2-flowline hpv2-flowline--secondary" pathLength="1" />
      </svg>
    );
  }

  if (id === "physical") {
    return (
      <svg viewBox="0 0 540 330" role="presentation">
        <text x="24" y="34" className="hpv2-svg-kicker">R&D LOOP / PHYSICAL AI</text>
        <path d="M92 166H205C230 166 230 119 255 119H305" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <path d="M363 119H409C434 119 434 166 459 166" className="hpv2-flowline hpv2-flowline--primary hpv2-flowline--delay" pathLength="1" />
        <path d="M459 218C459 276 92 276 92 218" className="hpv2-flowline hpv2-flowline--feedback" pathLength="1" />
        <g className="hpv2-atlas-visual__source">
          <circle cx="92" cy="166" r="48" /><circle cx="92" cy="166" r="25" />
          <path d="M72 166H112M92 146V186" /><text x="57" y="239">SENSOR</text>
        </g>
        <g className="hpv2-atlas-visual__core">
          <rect x="255" y="78" width="108" height="112" rx="2" />
          <path d="M276 105H342M276 129H332M276 153H320" /><text x="273" y="214">MODEL</text>
        </g>
        <g className="hpv2-atlas-visual__outputs">
          <rect x="426" y="118" width="90" height="100" rx="2" />
          <circle cx="452" cy="151" r="10" /><path d="M439 184C443 166 461 166 465 184M477 145H501M477 165H495M477 185H505" />
          <text x="435" y="242">OPERATOR</text>
        </g>
        <text x="207" y="296" className="hpv2-svg-note">FEEDBACK / HUMAN OVERRIDE</text>
      </svg>
    );
  }

  if (id === "visual") {
    return (
      <svg viewBox="0 0 540 330" role="presentation">
        <text x="24" y="34" className="hpv2-svg-kicker">VISUAL SYSTEM / EXPLANATION</text>
        <path d="M108 164H188M286 164H368M454 164H510" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <g className="hpv2-atlas-visual__source">
          <path d="M36 108H108V220H36Z" /><circle cx="72" cy="150" r="19" /><path d="M49 198L67 174L82 187L96 168" />
          <text x="42" y="246">SUBJECT</text>
        </g>
        <g className="hpv2-atlas-visual__core">
          <circle cx="237" cy="164" r="49" /><circle cx="237" cy="164" r="24" /><path d="M237 101V115M237 213V227M174 164H188M286 164H300" />
          <text x="207" y="246">CAPTURE</text>
        </g>
        <g className="hpv2-atlas-visual__outputs">
          <rect x="368" y="104" width="86" height="120" rx="2" />
          <path d="M382 186L401 154L417 175L441 139M382 204H441" /><text x="377" y="247">3D / STORY</text>
          <path d="M486 137L516 164L486 191Z" />
        </g>
        <text x="24" y="299" className="hpv2-svg-note">MEANING</text><text x="440" y="299" className="hpv2-svg-note">AUDIENCE</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 540 330" role="presentation">
      <text x="24" y="34" className="hpv2-svg-kicker">OPERATING ROUTE / AI</text>
      <path d="M112 164H205M315 164H405" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
      <path d="M450 214C450 278 258 278 258 224" className="hpv2-flowline hpv2-flowline--feedback" pathLength="1" />
      <g className="hpv2-atlas-visual__source">
        <rect x="28" y="111" width="84" height="106" rx="2" />
        <path d="M46 137H94M46 158H85M46 179H96M46 200H76" /><text x="38" y="244">WORKFLOW</text>
      </g>
      <g className="hpv2-atlas-visual__core">
        <rect x="205" y="105" width="110" height="119" rx="2" />
        <circle cx="260" cy="164" r="31" /><path d="M237 164H283M260 141V187" /><text x="221" y="248">AI / RULES</text>
      </g>
      <g className="hpv2-atlas-visual__outputs">
        <rect x="405" y="113" width="94" height="102" rx="2" />
        <path d="M424 141H480M424 164H468M424 187H457" /><circle cx="485" cy="187" r="5" />
        <text x="416" y="241">DECISION</text>
      </g>
      <text x="199" y="294" className="hpv2-svg-note">MEASURE / REVIEW / ADJUST</text>
    </svg>
  );
}

export default function CapabilityAtlas() {
  const [activeId, setActiveId] = useState<CapabilityId>("ai");
  const active = CAPABILITIES.find((capability) => capability.id === activeId) ?? CAPABILITIES[0];

  return (
    <div className="hpv2-atlas">
      <div className="hpv2-atlas__nav" aria-label="Направления студии">
        {CAPABILITIES.map((capability) => (
          <button
            key={capability.id}
            className="hpv2-atlas__tab"
            type="button"
            aria-pressed={active.id === capability.id}
            aria-controls="hpv2-capability-panel"
            onClick={() => setActiveId(capability.id)}
          >
            <span className="hpv2-atlas__index">{capability.index}</span>
            <span className="hpv2-atlas__name">{capability.title}</span>
            <span className="hpv2-atlas__label">{capability.label}</span>
          </button>
        ))}
      </div>

      <div id="hpv2-capability-panel" className="hpv2-atlas__panel" aria-live="polite">
        <div className="hpv2-atlas__signal" data-mode={active.id} key={`signal-${active.id}`} aria-hidden="true">
          <CapabilitySignal id={active.id} />
          <span className="hpv2-atlas__readout"><b>{active.index}</b>{active.result}</span>
        </div>
        <div className="hpv2-atlas__copy" key={active.id}>
          <div className="hpv2-atlas__meta">
            <span>{active.label}</span>
            <span>{active.status}</span>
          </div>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <ul>
            {active.examples.map((example) => <li key={example}>{example}</li>)}
          </ul>
          <Link className="hpv2-arrow-link" href={active.href}>
            Смотреть направление <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
