import { cookies } from "next/headers"

import AccessGate from "./AccessGate"
import ProjectDocument from "@/components/utpp/ProjectDocument"
import { accessCode, isAuthorized, UTPP_PAGE_COOKIE } from "@/lib/utpp/gate"

/**
 * Точка контроля доступа.
 *
 * Проверка стоит здесь, а НЕ в layout.tsx, и это существенно.
 *
 * Layout получает страницу как уже созданный элемент `children`. Даже если
 * layout решит его не показывать, Next всё равно рендерит сегмент страницы
 * и сериализует результат в RSC-payload, который уезжает в HTML внутри
 * <script>. Проверено на этой же странице: при закрытом гейте `curl /utpp`
 * возвращал весь текст документа — в разметке его не было, а в payload был.
 *
 * Когда проверка стоит в самой странице, компонент документа просто не
 * вызывается, и сериализовать нечего.
 */
export default async function UtppPage() {
  const secret = accessCode()

  // Код не задан — материал открыт по прямой ссылке.
  // Индексация всё равно закрыта: X-Robots-Tag, метатег, robots.txt, sitemap.
  if (!secret) return <ProjectDocument />

  const store = await cookies()
  if (!isAuthorized(store.get(UTPP_PAGE_COOKIE)?.value, secret)) {
    return <AccessGate />
  }

  return <ProjectDocument />
}
