import { MeetingDeck } from "@/components/kit-proposal/meeting/MeetingDeck"

import "./meeting.css"

export const metadata = {
  title: "Режим показа — ТК КИТ",
}

/**
 * Meeting Mode — визуальное сопровождение живого разговора на большом экране.
 * Наследует layout раздела: гарнитуру, метаданные noindex и проверку доступа,
 * если она включена. Собственных правок конфигурации не требует.
 *
 * Подробный документ остаётся на /presentation/kit-digital-logistics и
 * этим режимом не затрагивается.
 */
export default function MeetingPage() {
  return <MeetingDeck />
}
