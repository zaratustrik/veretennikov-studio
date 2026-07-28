// Схема мини-анкеты презентации «Соболёк».
// Единая точка правды: по ней рендерится форма, санитизируется вход
// на сервере и собирается итоговый markdown.

export type SbQuestion =
  | { id: string; type: "multi"; label: string; options: readonly string[]; other?: boolean }
  | { id: string; type: "single"; label: string; options: readonly string[]; other?: boolean }
  | { id: string; type: "text"; label: string; placeholder?: string }
  | { id: string; type: "textarea"; label: string; placeholder?: string };

export type SbSection = {
  id: string;
  title: string;
  note?: string;
  questions: readonly SbQuestion[];
};

/**
 * Ответы анкеты: multi → string[]; single/text/textarea → string.
 * Свободный текст варианта «другое» хранится под ключом `<id>__other`.
 */
export type SbAnswers = Record<string, string | string[]>;

export const SB_SCHEMA_VERSION = 1;

export const sections: readonly SbSection[] = [
  {
    id: "usage",
    title: "Где будет использоваться Соболёк?",
    note: "Отметьте всё, что актуально — даже если это планы на будущее.",
    questions: [
      {
        id: "usage_where",
        type: "multi",
        label: "Площадки и носители",
        options: [
          "Сайт",
          "Мобильное приложение",
          "Социальные сети",
          "Презентации",
          "Видеоролики",
          "Наружная реклама",
          "Печатная продукция",
          "Мероприятия",
          "Интерактивные экраны",
        ],
        other: true,
      },
    ],
  },
  {
    id: "materials",
    title: "Какие материалы требуются на первом этапе?",
    questions: [
      {
        id: "materials_first",
        type: "multi",
        label: "Состав первого этапа",
        options: [
          "Статичные изображения",
          "Набор поз",
          "Набор эмоций",
          "Полноценная 3D-модель",
          "Скелетный риг",
          "Лицевая мимика",
          "Готовые анимации",
          "Исходные файлы",
          "Руководство по использованию",
        ],
      },
    ],
  },
  {
    id: "actions",
    title: "Какие действия персонажа наиболее важны?",
    questions: [
      {
        id: "actions_key",
        type: "multi",
        label: "Действия и жесты",
        options: [
          "Приветствует пользователя",
          "Указывает на элемент интерфейса",
          "Держит смартфон или планшет",
          "Показывает QR-код",
          "Держит карту",
          "Показывает жест «отлично»",
          "Поздравляет",
          "Показывает медаль или кубок",
          "Смотрит на часы",
          "Выражает поддержку",
          "Радуется начислению баллов",
        ],
      },
    ],
  },
  {
    id: "clothing",
    title: "Одежда",
    note: "Базовый спортивный комплект — кепка, футболка, жилет, шорты, кроссовки.",
    questions: [
      {
        id: "clothing_sets",
        type: "multi",
        label: "Какие комплекты одежды нужны?",
        options: [
          "Только базовый спортивный комплект",
          "Летний вариант",
          "Демисезонный вариант",
          "Зимний вариант",
          "Одежда для отдельных мероприятий",
        ],
      },
    ],
  },
  {
    id: "tech",
    title: "Техническое использование",
    note: "Если пока нет ответа — выбирайте «Пока не решили», это нормально.",
    questions: [
      {
        id: "tech_realtime",
        type: "single",
        label: "Нужна ли модель для сайта или приложения в реальном времени?",
        options: ["Да, нужна", "Нет, только рендеры и анимации", "Пока не решили"],
      },
      {
        id: "tech_engine",
        type: "multi",
        label: "Планируется ли использование игровых или веб-сред?",
        options: ["Unity", "Unreal Engine", "WebGL (в браузере)", "Пока не планируется"],
        other: true,
      },
      {
        id: "tech_sources",
        type: "single",
        label: "Нужны ли полностью редактируемые исходники?",
        options: [
          "Да, нужны исходные рабочие файлы",
          "Достаточно экспортированных форматов",
          "Пока не решили",
        ],
      },
      {
        id: "tech_formats",
        type: "text",
        label: "Какие форматы файлов необходимы?",
        placeholder: "Например: FBX, glTF, PNG-рендеры — или «нужна консультация»",
      },
      {
        id: "tech_who_animates",
        type: "single",
        label: "Кто будет в дальнейшем создавать новые позы и анимации?",
        options: [
          "Команда Движения",
          "Внешний подрядчик",
          "Автор маскота",
          "Пока не решили",
        ],
      },
    ],
  },
  {
    id: "org",
    title: "Организация согласования",
    questions: [
      {
        id: "org_person",
        type: "text",
        label: "Ответственное лицо",
        placeholder: "Имя и роль в проекте",
      },
      {
        id: "org_decision",
        type: "text",
        label: "Кто принимает итоговое решение по персонажу?",
        placeholder: "Например: руководитель Движения, рабочая группа",
      },
      {
        id: "org_brandbook",
        type: "single",
        label: "Есть ли утверждённый брендбук?",
        options: ["Да, есть", "В разработке", "Нет"],
      },
      {
        id: "org_colors",
        type: "single",
        label: "Есть ли точные фирменные цвета?",
        options: [
          "Да, есть точные коды цветов",
          "Цвета есть, но кодов нет",
          "Нужно предложить палитру",
        ],
      },
      {
        id: "org_logos",
        type: "single",
        label: "Требуется ли размещение логотипов на одежде?",
        options: ["Да, требуется", "Нет", "Обсудим отдельно"],
      },
      {
        id: "org_deadline",
        type: "text",
        label: "Ориентировочный срок запуска",
        placeholder: "Например: к декабрю 2026 или «не определён»",
      },
      {
        id: "org_comments",
        type: "textarea",
        label: "Дополнительные комментарии",
        placeholder: "Всё, что важно учесть: пожелания, ограничения, вопросы",
      },
    ],
  },
];

export const allQuestions: readonly SbQuestion[] = sections.flatMap((s) => s.questions);

export function findQuestion(id: string): SbQuestion | undefined {
  return allQuestions.find((q) => q.id === id);
}
