/**
 * Концептуальный экран операционной картины. Данные демонстрационные —
 * это иллюстрация того, какой вопрос экран должен закрывать, а не
 * утверждение о существующих у КИТ данных.
 *
 * Экран сознательно построен вокруг исключений, а не вокруг сводных
 * показателей: ценность в том, чтобы увидеть отклонение раньше, чем оно
 * станет срывом срока.
 */
export function ControlTowerMock() {
  const rows: { k: string; v: string; s?: "ok" | "risk" }[] = [
    { k: "Направление", v: "Москва → Екатеринбург" },
    { k: "Груз", v: "68,4 м³ · 11 отправлений" },
    { k: "Текущий исполнитель", v: "Тягач 541 · водитель на смене" },
    { k: "Расчётное прибытие", v: "22:27", s: "risk" },
    { k: "План", v: "22:16" },
    { k: "Отклонение", v: "+11 мин", s: "risk" },
    { k: "Следующий узел", v: "EK2 · передача в 22:40" },
    { k: "Слот", v: "A-14" },
    { k: "Ответственность", v: "Перевозчик ЕК-2 · принято 14:05" },
  ]

  return (
    <div className="kdl-ct">
      <div className="kdl-ct-bar">
        <span className="kdl-ct-route">Москва → Екатеринбург</span>
        <span style={{ fontSize: 12, color: "#64748b" }}>17 активных плеч</span>
        <span className="kdl-ct-tag">Concept UI · пример интерфейса</span>
      </div>

      <div className="kdl-ct-grid">
        <div className="kdl-ct-pane">
          <div className="kdl-ct-h">Состояние направления</div>
          <div className="kdl-ct-stat" data-s="ok">
            <span>По плану</span>
            <b>12</b>
          </div>
          <div className="kdl-ct-stat" data-s="risk">
            <span>Под риском</span>
            <b>3</b>
          </div>
          <div className="kdl-ct-stat" data-s="late">
            <span>Опоздание</span>
            <b>2</b>
          </div>
          <div className="kdl-ct-stat">
            <span>Требует решения</span>
            <b>1</b>
          </div>
        </div>

        <div className="kdl-ct-pane">
          <div className="kdl-ct-h">Полуприцеп TR-1842 · требует решения</div>
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
        Отклонение +11 минут само по себе не критично. Критично то, что при передаче
        в 22:40 следующий тягач уйдёт в рейс с опозданием, а по этому направлению
        компания обещает клиенту компенсацию за срыв срока. Экран показывает это
        сейчас, а не в отчёте следующего дня.
      </div>
    </div>
  )
}
