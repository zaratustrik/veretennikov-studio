const FLOWS: Record<string, [string, string, string]> = {
  "/diagnostika": ["Один рабочий процесс", "Замер времени и разбор данных", "Карта изменений и решение о пилоте"],
  "/services/ai-knowledge-base": ["Документы компании", "Поиск подходящих фрагментов", "Ответ со ссылкой на источник"],
  "/services/ai-agents": ["Задача и правила", "Агент готовит результат", "Человек подтверждает действие"],
  "/services/document-processing": ["Письма, заявки, документы", "Извлечение и проверка данных", "Запись в систему или проверка человеком"],
  "/services/data-reporting": ["Данные из рабочих систем", "Единые правила и показатели", "Отчёт и сигнал об отклонении"],
};

export default function ServiceMechanism({ slug }: { slug: string }) {
  const steps = FLOWS[slug];
  if (!steps) return null;
  return <figure className="studio-path" aria-label="Как устроено решение">
    <p className="eyebrow">Как это работает</p>
    <ol>{steps.map((step, index) => <li key={step}><span aria-hidden="true">0{index + 1}</span>{step}</li>)}</ol>
    <figcaption>Принцип работы. Источники данных и границы проверки определяем для вашей задачи.</figcaption>
  </figure>;
}
