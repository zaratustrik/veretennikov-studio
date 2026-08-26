/**
 * Таксономия live-финала мастер-класса Уральской ТПП.
 *
 * Два уровня и шкала:
 *
 *   направление  — 9 карточек, отвечают на «где вы работаете»;
 *   процесс      — 8 карточек, ОБЩИХ для всех направлений;
 *   граница      — шкала из 5 ступеней «сделает сам ↔ решаю только я».
 *
 * Процессы намеренно общие. Если бы у каждого направления был свой
 * список, получилось бы девять несвязанных веточек. Общий слой даёт
 * схождение: один и тот же узел загорается от ВЭД, экспертизы и работы
 * с членами — и это видно глазами, без всякой аналитики.
 *
 * Подписи-уточнения адаптированы под направление: вопрос на телефоне
 * должен звучать про работу конкретного человека, а не вообще.
 *
 * Формулировки проверены на пересечения: деловые миссии отнесены
 * к мероприятиям, а не к ВЭД, чтобы карточки не спорили между собой.
 */

export type DirId =
  | "ved"
  | "expertise"
  | "members"
  | "events"
  | "education"
  | "gov"
  | "legal"
  | "territory"
  | "management"

export type ProcId =
  | "find-info"
  | "understand-request"
  | "find-expert"
  | "prepare-doc"
  | "correspondence"
  | "organize-people"
  | "control"
  | "repeat"

/** 1 — отдать целиком · 5 — решение только за человеком. */
export type AiRole = 1 | 2 | 3 | 4 | 5

export type Direction = {
  id: DirId
  /** Короткое имя для узла на большом экране. */
  short: string
  /** Полное имя на карточке телефона. */
  title: string
  /** Уточнение под заголовком карточки. */
  hint: string
}

export type Process = {
  id: ProcId
  short: string
  title: string
}

export const DIRECTIONS: Direction[] = [
  {
    id: "ved",
    short: "ВЭД",
    title: "Внешнеэкономическая деятельность",
    hint: "экспорт, импорт, зарубежные рынки",
  },
  {
    id: "expertise",
    short: "Экспертиза",
    title: "Экспертиза и сертификация",
    hint: "оценка, испытания, происхождение товара",
  },
  {
    id: "members",
    short: "Члены Палаты",
    title: "Работа с членами Палаты",
    hint: "обращения, услуги, преференции",
  },
  {
    id: "events",
    short: "Мероприятия",
    title: "Мероприятия и деловые миссии",
    hint: "форумы, выставки, поездки",
  },
  {
    id: "education",
    short: "Обучение",
    title: "Обучение и консалтинг",
    hint: "программы, семинары, акселераторы",
  },
  {
    id: "gov",
    short: "Органы власти",
    title: "Работа с органами власти",
    hint: "ОРВ, экспертиза актов, советы",
  },
  {
    id: "legal",
    short: "Право и споры",
    title: "Право и разрешение споров",
    hint: "договоры, арбитраж, медиация",
  },
  {
    id: "territory",
    short: "Территории",
    title: "Территориальные подразделения",
    hint: "филиалы и представительства",
  },
  {
    id: "management",
    short: "Управление",
    title: "Руководство и управление",
    hint: "планирование, координация, отчётность",
  },
]

export const PROCESSES: Process[] = [
  { id: "find-info", short: "Найти информацию", title: "Найти и собрать информацию" },
  { id: "understand-request", short: "Понять запрос", title: "Понять, что человеку нужно" },
  { id: "find-expert", short: "Найти специалиста", title: "Найти нужного специалиста" },
  { id: "prepare-doc", short: "Подготовить документ", title: "Подготовить документ" },
  { id: "correspondence", short: "Переписка", title: "Переписка и согласование" },
  { id: "organize-people", short: "Собрать людей", title: "Организовать и собрать людей" },
  { id: "control", short: "Проконтролировать", title: "Проконтролировать и не забыть" },
  { id: "repeat", short: "Одно и то же", title: "Снова делать то же самое" },
]

/**
 * Уточнения к процессам под каждое направление. Два-четыре слова:
 * ровно столько, чтобы человек узнал свою работу, и не столько,
 * чтобы начать читать.
 */
export const PROCESS_HINTS: Record<DirId, Record<ProcId, string>> = {
  ved: {
    "find-info": "требования стран, рынки, пошлины",
    "understand-request": "что на самом деле нужно предприятию",
    "find-expert": "кто в Палате ведёт это направление",
    "prepare-doc": "пакет на сертификат, контракт",
    correspondence: "с партнёрами и контрагентами",
    "organize-people": "переговоры и встречи сторон",
    control: "сроки поставок и документов",
    repeat: "однотипные запросы по странам",
  },
  expertise: {
    "find-info": "нормы, стандарты, методики",
    "understand-request": "что именно нужно проверить",
    "find-expert": "кто проведёт эту экспертизу",
    "prepare-doc": "акт, заключение, отчёт",
    correspondence: "с заявителем и ведомствами",
    "organize-people": "выезд, осмотр, комиссия",
    control: "сроки и статус заключений",
    repeat: "похожие заключения раз за разом",
  },
  members: {
    "find-info": "какие услуги и практика у Палаты",
    "understand-request": "с чем на самом деле пришёл человек",
    "find-expert": "кому передать обращение",
    "prepare-doc": "предложение, письмо, договор",
    correspondence: "с членами Палаты",
    "organize-people": "знакомства и деловые контакты",
    control: "статус обращения, не потерять",
    repeat: "похожие обращения",
  },
  events: {
    "find-info": "площадки, программы, участники",
    "understand-request": "чего ждёт участник от события",
    "find-expert": "спикеры и модераторы",
    "prepare-doc": "программа, приглашения, материалы",
    correspondence: "с участниками и партнёрами",
    "organize-people": "собрать нужных людей в зале",
    control: "регистрация, логистика, сроки",
    repeat: "каждое мероприятие с нуля",
  },
  education: {
    "find-info": "содержание программ и практики",
    "understand-request": "чему предприятию нужно научиться",
    "find-expert": "преподаватель под задачу",
    "prepare-doc": "программа, раздатка, отчёт",
    correspondence: "со слушателями и заказчиками",
    "organize-people": "набор группы",
    control: "расписание и посещаемость",
    repeat: "одни и те же материалы заново",
  },
  gov: {
    "find-info": "проекты актов, позиции ведомств",
    "understand-request": "в чём суть проблемы бизнеса",
    "find-expert": "кто даст экспертное мнение",
    "prepare-doc": "заключение, позиция, письмо",
    correspondence: "с органами власти",
    "organize-people": "совещания и рабочие группы",
    control: "сроки рассмотрения",
    repeat: "повторяющиеся замечания",
  },
  legal: {
    "find-info": "практика, нормы, прецеденты",
    "understand-request": "в чём существо спора",
    "find-expert": "арбитр, медиатор, эксперт",
    "prepare-doc": "договор, претензия, документы дела",
    correspondence: "со сторонами спора",
    "organize-people": "заседания и примирение",
    control: "процессуальные сроки",
    repeat: "типовые договоры и претензии",
  },
  territory: {
    "find-info": "что и как делают в центре",
    "understand-request": "с чем пришло местное предприятие",
    "find-expert": "кто в Палате поможет по этому",
    "prepare-doc": "документы по услуге",
    correspondence: "с предприятиями и центром",
    "organize-people": "местные встречи и события",
    control: "статусы по своим клиентам",
    repeat: "одни и те же вопросы на местах",
  },
  management: {
    "find-info": "данные для решения",
    "understand-request": "что на самом деле просят",
    "find-expert": "кому поручить",
    "prepare-doc": "справка, отчёт, презентация",
    correspondence: "согласования и переписка",
    "organize-people": "совещания и координация",
    control: "исполнение поручений",
    repeat: "регулярная отчётность",
  },
}

export type AiStep = { value: AiRole; title: string }

/**
 * Шкала сознательно не имеет «правильного» конца: пятая ступень
 * такая же полноценная, как первая. Значение задаёт радиус узла
 * процесса на большом экране — чем меньше, тем ближе к ядру.
 */
export const AI_SCALE: AiStep[] = [
  { value: 1, title: "Сделает сам — я проверю результат" },
  { value: 2, title: "Подготовит первый вариант" },
  { value: 3, title: "Найдёт и разложит информацию" },
  { value: 4, title: "Только подскажет — делаю я" },
  { value: 5, title: "Здесь решаю только я" },
]

export const DIR_BY_ID = new Map(DIRECTIONS.map((d) => [d.id, d]))
export const PROC_BY_ID = new Map(PROCESSES.map((p) => [p.id, p]))

export function isDirId(v: unknown): v is DirId {
  return typeof v === "string" && DIR_BY_ID.has(v as DirId)
}

export function isProcId(v: unknown): v is ProcId {
  return typeof v === "string" && PROC_BY_ID.has(v as ProcId)
}

export function isAiRole(v: unknown): v is AiRole {
  return v === 1 || v === 2 || v === 3 || v === 4 || v === 5
}
