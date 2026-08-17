import { MeetingEntry } from "@/components/kit-proposal/meeting/AccessGate"

import "./meeting.css"

export const metadata = {
  // absolute отменяет глобальный шаблон "%s — Veretennikov Studio":
  // на встрече заголовок вкладки виден на общем экране, и отправитель там
  // должен быть тот же, что на титульном экране.
  title: { absolute: "ТК КИТ · режим показа" },
}

/**
 * Meeting Mode — визуальное сопровождение живого разговора на большом экране.
 * Наследует layout раздела: гарнитуру, метаданные noindex и проверку доступа,
 * если она включена. Собственных правок конфигурации не требует.
 *
 * Перед показом открывается экран ввода кода встречи — небольшой жест
 * перед началом разговора, не механизм защиты.
 *
 * Подробный документ остаётся на /presentation/kit-digital-logistics и
 * этим режимом не затрагивается.
 */
export default function MeetingPage() {
  return <MeetingEntry />
}
