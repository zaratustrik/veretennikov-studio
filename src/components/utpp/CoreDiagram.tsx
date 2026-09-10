/**
 * Схема общего информационного ядра.
 *
 * Инлайн-SVG, а не растровая картинка и не библиотека диаграмм: здесь точные
 * связи и подписи, их нужно уметь читать, искать по странице и печатать.
 *
 * Две раскладки в одном компоненте — широкая и узкая; переключение через CSS,
 * без замера ширины в JS, поэтому компонент остаётся серверным.
 *
 * Доступность: role="img" с осмысленным aria-label плюс текстовое описание
 * связей рядом — оно же остаётся единственным содержанием, если SVG
 * не отрисовался.
 */

const LABEL =
  "Организация связана с контактными лицами и ролями, с членством и взносами, " +
  "с взаимодействиями. Из взаимодействий вырастают лиды, заявления, " +
  "мероприятия и участие, задачи и решения."

function Node({
  x,
  y,
  w,
  h,
  text,
  strong = false,
}: {
  x: number
  y: number
  w: number
  h: number
  text: string
  strong?: boolean
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2}
        fill="var(--utpp-page-paper)"
        stroke={strong ? "var(--utpp-page-ink-3)" : "var(--utpp-page-rule)"}
        strokeWidth={strong ? 1.4 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fill="var(--utpp-page-ink)"
        style={{ fontWeight: strong ? 500 : 400 }}
      >
        {text}
      </text>
    </g>
  )
}

function Link({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="var(--utpp-page-steel)"
      strokeWidth={1.25}
      strokeLinecap="round"
    />
  )
}

export default function CoreDiagram() {
  return (
    <div className="utpp-page-diagram">
      {/* Широкая раскладка */}
      <svg
        className="utpp-page-diagram-wide"
        viewBox="0 0 760 300"
        role="img"
        aria-label={LABEL}
        preserveAspectRatio="xMidYMid meet"
      >
        <Node x={8} y={126} w={168} h={48} text="Организация" strong />

        <Link d="M176 150 H 214 V 44 H 252" />
        <Link d="M176 150 H 214 V 150 H 252" />
        <Link d="M176 150 H 214 V 256 H 252" />

        <Node x={252} y={20} w={196} h={48} text="Контакты и роли" />
        <Node x={252} y={126} w={196} h={48} text="Членство и взносы" />
        <Node x={252} y={232} w={196} h={48} text="Взаимодействия" strong />

        <Link d="M448 256 H 486 V 44 H 524" />
        <Link d="M448 256 H 486 V 114 H 524" />
        <Link d="M448 256 H 486 V 186 H 524" />
        <Link d="M448 256 H 486 V 256 H 524" />

        <Node x={524} y={22} w={228} h={44} text="Лиды" />
        <Node x={524} y={92} w={228} h={44} text="Заявления" />
        <Node x={524} y={164} w={228} h={44} text="Мероприятия и участие" />
        <Node x={524} y={234} w={228} h={44} text="Задачи и решения" />
      </svg>

      {/* Узкая раскладка: та же схема в один столбец */}
      <svg
        className="utpp-page-diagram-narrow"
        viewBox="0 0 320 560"
        role="img"
        aria-label={LABEL}
        preserveAspectRatio="xMidYMid meet"
      >
        <Node x={60} y={8} w={200} h={44} text="Организация" strong />
        <Link d="M160 52 V 76" />

        <Node x={20} y={76} w={280} h={40} text="Контакты и роли" />
        <Link d="M160 116 V 140" />
        <Node x={20} y={140} w={280} h={40} text="Членство и взносы" />
        <Link d="M160 180 V 204" />
        <Node x={20} y={204} w={280} h={44} text="Взаимодействия" strong />

        <Link d="M160 248 V 272 H 40 V 296" />
        <Link d="M160 248 V 272 H 280 V 296" />
        <Link d="M160 248 V 296" />

        <Node x={20} y={296} w={280} h={40} text="Лиды" />
        <Link d="M160 336 V 360" />
        <Node x={20} y={360} w={280} h={40} text="Заявления" />
        <Link d="M160 400 V 424" />
        <Node x={20} y={424} w={280} h={40} text="Мероприятия и участие" />
        <Link d="M160 464 V 488" />
        <Node x={20} y={488} w={280} h={40} text="Задачи и решения" />
      </svg>

      <p className="utpp-page-diagram-caption">{LABEL}</p>
    </div>
  )
}
