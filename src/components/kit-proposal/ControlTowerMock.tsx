/**
 * Концептуальный экран операционной картины. Данные демонстрационные —
 * это иллюстрация того, какой вопрос экран должен закрывать, а не
 * утверждение о существующих у КИТ данных.
 */
export function ControlTowerMock() {
  const rows: { k: string; v: string; s?: "ok" | "risk" }[] = [
    { k: "Полуприцеп", v: "TR-1842" },
    { k: "Груз", v: "68,4 м³ · 11 отправлений" },
    { k: "Текущий исполнитель", v: "Тягач 541 · водитель на смене" },
    { k: "Следующая передача", v: "22:40 · узел ЕКБ" },
    { k: "Расчётное прибытие", v: "22:27", s: "ok" },
    { k: "Отклонение от плана", v: "+11 мин", s: "risk" },
    { k: "Слот на площадке", v: "A-14" },
    { k: "Ответственность", v: "Перевозчик ЕК-2 · принято 14:05" },
  ]

  return (
    <div className="kdl-ct">
      <div className="kdl-ct-bar">
        <span className="kdl-ct-route">Москва → Екатеринбург</span>
        <span style={{ fontSize: 12, color: "#64748b" }}>17 активных плеч</span>
        <span className="kdl-ct-tag">Concept UI · демонстрационные данные</span>
      </div>

      <div className="kdl-ct-grid">
        <div className="kdl-ct-pane">
          <div className="kdl-ct-h">Состояние направления</div>
          <div className="kdl-ct-stat" data-s="ok">
            <span>По плану</span>
            <b>12</b>
          </div>
          <div className="kdl-ct-stat" data-s="risk">
            <span>Под угрозой</span>
            <b>3</b>
          </div>
          <div className="kdl-ct-stat" data-s="late">
            <span>Опаздывают</span>
            <b>2</b>
          </div>
          <div className="kdl-ct-stat">
            <span>Требует решения</span>
            <b>1</b>
          </div>
        </div>

        <div className="kdl-ct-pane">
          <div className="kdl-ct-h">Требует решения прямо сейчас</div>
          <div className="kdl-ct-rows">
            {rows.map((r) => (
              <div className="kdl-ct-row" key={r.k}>
                <span className="kdl-ct-k">{r.k}</span>
                <span className="kdl-ct-v" data-s={r.s}>
                  {r.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kdl-ct-foot">
        Экран отвечает на один вопрос: что требует вмешательства до того, как отклонение станет срывом срока.
        Если на увиденное невозможно отреагировать конкретным действием — это отчёт, а не управление.
      </div>
    </div>
  )
}
