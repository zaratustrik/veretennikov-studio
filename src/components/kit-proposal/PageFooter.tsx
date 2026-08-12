import { logoutAction } from "@/app/presentation/kit-digital-logistics/auth"

import metaJson from "@/data/kit-proposal/meta.json"
import type { Meta } from "@/types/kit-proposal"

const meta = metaJson as unknown as Meta

export function PageFooter() {
  return (
    <footer className="kdl-foot">
      <div className="kdl-wrap">
        <p style={{ fontSize: 14, maxWidth: "60ch" }}>
          Закрытый проектный документ. Содержит рабочие гипотезы, которые требуют подтверждения на стороне
          ТК КИТ. Не является офертой и не содержит стоимости разработки: она определяется после этапа
          обследования.
        </p>

        <div className="kdl-foot-grid">
          <div>
            <div style={{ color: "#f2f5f9", fontWeight: 500 }}>{meta.author}</div>
            <div style={{ marginTop: 4 }}>{meta.authorRole}</div>
          </div>
          <div>
            {meta.contact.map((c) => (
              <div key={c.label} style={{ marginBottom: 4 }}>
                {c.label}: <a href={c.href}>{c.value}</a>
              </div>
            ))}
          </div>
          <div>
            <div>Данные проверены: {meta.checkedAt}</div>
            <div style={{ marginTop: 4 }}>{meta.stamp}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <form action={logoutAction}>
              <button type="submit" className="kdl-logout">
                Завершить сессию
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
