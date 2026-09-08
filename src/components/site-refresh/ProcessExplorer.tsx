"use client";

import { useState } from "react";

const scenarios = [
  { name: "Заявки и документы", before: "Письмо → ручной перенос → поиск ответственного", input: "Входящее письмо", middle: "Извлечь данные", output: "Проверить и направить", title: "От входящего письма — к задаче в системе.", description: "ИИ разбирает документ, заполняет поля и предлагает маршрут. Сотрудник проверяет спорные случаи.", measure: "Что измеряем: время обработки и долю исправлений.", href: "/services/document-processing", glyph: "document" },
  { name: "Знания компании", before: "Вопрос → поиск по папкам → вопрос коллеге", input: "Вопрос сотрудника", middle: "Найти источник", output: "Ответ со ссылкой", title: "От вопроса — к ответу по вашим документам.", description: "База знаний находит нужный фрагмент и показывает источник. Доступ к ответу зависит от прав сотрудника.", measure: "Что измеряем: точность ответа и время поиска.", href: "/services/ai-knowledge-base", glyph: "knowledge" },
  { name: "Данные и системы", before: "Выгрузки → таблицы вручную → отчёт с задержкой", input: "Рабочие системы", middle: "Согласовать данные", output: "Общий отчёт", title: "От разрозненных данных — к общей картине.", description: "Связываем источники и правила расчёта. Руководитель видит согласованные показатели; ИИ добавляем там, где он нужен.", measure: "Что измеряем: время подготовки и расхождения данных.", href: "/services/data-reporting", glyph: "data" },
];

export function FlowIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {kind === "document" ? <><path d="M17 8h22l10 10v38H17zM39 8v12h10M24 29h18M24 36h18M24 43h9"/><path d="m36 46 5 5 11-13"/></> : kind === "knowledge" ? <><path d="M10 13h18v38H10zM36 13h18v38H36zM17 21h4M43 21h4M17 29h4M43 29h4"/><path d="M28 32h8M32 28v8"/></> : <><rect x="7" y="10" width="18" height="14"/><rect x="7" y="40" width="18" height="14"/><rect x="40" y="24" width="18" height="16"/><path d="M25 17h7v30h-7M32 32h8"/></>}
  </svg>;
}

export default function ProcessExplorer({ origin }: { origin: string }) {
  const [active, setActive] = useState(0);
  const item = scenarios[active];
  return <div className="sr-explorer">
    <div className="sr-scenarios" role="group" aria-label="Выберите процесс">
      {scenarios.map((s, i) => <button key={s.name} type="button" aria-pressed={active === i} aria-controls="scenario-detail" onClick={() => setActive(i)}>
        <FlowIcon kind={s.glyph}/><span>{s.name}</span><span aria-hidden="true">↗</span>
      </button>)}
    </div>
    <div id="scenario-detail" className="sr-scenario-detail" aria-live="polite" aria-atomic="true">
      <div className="sr-before"><span className="sr-label">Сейчас</span><p>{item.before}</p></div>
      <div className="sr-after"><span className="sr-label">С системой</span><ol>{[item.input,item.middle,item.output].map((step,i)=><li key={i}><span className="sr-step-index">0{i+1}</span>{step}</li>)}</ol></div>
      <div className="sr-scenario-copy"><div><h3>{item.title}</h3><p>{item.description}</p></div><div><p className="sr-measure">{item.measure}</p><a className="sr-text-link" href={`${origin}${item.href}`}>Подробнее о решении <span aria-hidden="true">↗</span></a></div></div>
    </div>
  </div>;
}
