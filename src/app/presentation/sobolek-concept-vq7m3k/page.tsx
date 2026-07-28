import { SbImage } from "@/components/sobolek/SbImage";
import { SobolekForm } from "@/components/sobolek/SobolekForm";
import { IMAGES } from "@/lib/sobolek/images";

/* ── Мелкие строительные блоки страницы ───────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--sb-teal-deep)]">
      <span className="sb-diamond" aria-hidden />
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="sb-heading text-[26px] font-extrabold leading-tight sm:text-[34px]">
      {children}
    </h2>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--sb-gray)]">
      <span className="sb-diamond mt-2 !h-[7px] !w-[7px]" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

function Figure({
  children,
  caption,
  className,
}: {
  children: React.ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-[var(--sb-line)] bg-white">
        {children}
      </div>
      <figcaption className="mt-2.5 text-center text-sm text-[var(--sb-gray)]">{caption}</figcaption>
    </figure>
  );
}

/* ── Данные разделов ──────────────────────────────────────────────── */

const CHARACTER_QUALITIES = [
  "Заботливый цифровой помощник, а не абстрактный талисман",
  "Привлекателен для детей, взрослых и старшей аудитории",
  "Дружелюбный, но не чрезмерно детский",
  "Спортивный и энергичный — в характере Движения",
  "Современный, но не карикатурный",
  "Узнаваем именно как соболь",
  "Одинаково хорошо работает в статике и в анимации",
];

const VISUAL_FEATURES = [
  "Молочно-белая шерсть",
  "Тёмный кончик пушистого хвоста",
  "Бирюзово-голубые глаза",
  "Округлая мордочка",
  "Крупные, но не гипертрофированные глаза",
  "Фирменная бело-бирюзовая одежда",
  "Геометрические элементы айдентики на одежде",
  "Хорошо читаемый силуэт",
];

const DIRECTION_REASONS = [
  "Образ вызывает доверие — мягкая пластика, открытая мимика, спокойные цвета",
  "Выглядит современно и естественно вписывается в цифровую среду",
  "Сохраняет связь с реальным соболем: форма мордочки, округлые уши, вытянутый силуэт",
  "Не считывается как «просто мышь, кот или лиса»",
  "Длинный хвост с тёмным кончиком становится частью фирменного силуэта",
  "Персонаж уверенно держит планшет, смартфон, карту, медаль и другой реквизит",
];

const STAGES: { title: string; items: string[] }[] = [
  {
    title: "Утверждение мастер-образа",
    items: [
      "Финализация формы головы и пропорций",
      "Хвост, цвет шерсти",
      "Одежда и обувь",
      "Фирменные геометрические элементы",
    ],
  },
  {
    title: "Паспорт персонажа",
    items: [
      "Фронтальный вид, профиль, вид сзади, три четверти",
      "A-поза",
      "Крупные изображения головы, хвоста, лап и подушечек",
      "Цветовая палитра и правила пропорций",
    ],
  },
  {
    title: "Создание мастер-модели",
    items: [
      "Моделирование персонажа, одежды и обуви",
      "Стилизованная шерсть",
      "Материалы и текстуры",
      "Проверка силуэта",
    ],
  },
  {
    title: "Подготовка к позированию и анимации",
    items: [
      "Скелетный риг: пальцы, хвост, уши",
      "Глаза, брови, мимика рта",
      "Проверка деформаций",
    ],
  },
  {
    title: "Эмоции и жесты",
    items: [
      "Радость, восторг, удивление, задумчивость",
      "Лёгкая грусть, сочувствие, гордость, благодарность",
      "Приветствие, указание направления, жест «отлично», поздравление пользователя",
    ],
  },
  {
    title: "Реквизит и пользовательские сценарии",
    items: [
      "Смартфон, планшет, QR-код",
      "Карта, медаль, кубок, часы, указатель",
      "Начисление баллов и уведомления платформы",
    ],
  },
  {
    title: "Гайд по использованию",
    items: [
      "Допустимые ракурсы, пропорции, палитра",
      "Одежда и мимика",
      "Правила изменения поз и недопустимые искажения персонажа",
    ],
  },
];

const SCENARIOS = [
  "Приветствие нового пользователя",
  "Подсказка в интерфейсе",
  "Напоминание о мероприятии",
  "Поздравление с достижением",
  "Начисление баллов",
  "Предложение пройти обследование",
  "Объяснение работы сервиса",
  "Сообщение о новом маршруте или активности",
  "Сопровождение QR-сценария",
  "Публикации и социальные сети",
  "Видеоролики и анимация",
  "Печатные и выставочные материалы",
];

const DELIVERABLES = [
  "Утверждённая мастер-модель",
  "Модель без одежды",
  "Комплект базовой одежды",
  "Материалы и текстуры",
  "Скелетный и лицевой риг",
  "Набор эмоций",
  "Набор интерфейсных поз",
  "Реквизит",
  "Статичные рендеры",
  "Короткие анимационные циклы",
  "Исходные рабочие файлы",
  "Экспортированные форматы",
  "Руководство по использованию персонажа",
];

/* ── Страница ─────────────────────────────────────────────────────── */

export default function SobolekPage() {
  return (
    <main className="overflow-x-clip">
      {/* 1. Первый экран */}
      <header className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <Eyebrow>Урал: за медицину здорового долголетия</Eyebrow>
            <h1 className="sb-heading text-[34px] font-extrabold leading-[1.08] sm:text-[46px] lg:text-[52px]">
              Соболёк — цифровой помощник Движения
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--sb-teal-deep)]">
              Предлагаемое направление разработки фирменного 3D-маскота для платформы
              «Урал: за медицину здорового долголетия»
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
              Соболёк должен стать постоянным визуальным сопровождающим пользователя:
              помогать ориентироваться в сервисах, поддерживать, мотивировать и делать
              взаимодействие с платформой более понятным и доброжелательным.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#anketa"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--sb-teal)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--sb-teal-deep)]"
              >
                Заполнить анкету
              </a>
              <a
                href="#ponimanie"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--sb-line)] bg-white px-7 text-[15px] font-semibold text-[var(--sb-brown)] transition-colors hover:border-[var(--sb-teal-soft)]"
              >
                Смотреть концепцию
              </a>
            </div>
          </div>
          <div className="order-1 mx-auto w-full max-w-105 lg:order-2 lg:max-w-none">
            <div className="rounded-3xl bg-[var(--sb-cream)] p-5 sm:p-8">
              <SbImage
                image={IMAGES.hero}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 90vw"
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Наше понимание персонажа */}
      <section id="ponimanie" className="scroll-reveal border-t border-[var(--sb-line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Наше понимание персонажа</Eyebrow>
          <SectionTitle>Не разовая иллюстрация, а постоянный персонаж платформы</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Мы предлагаем создать полноценного фирменного персонажа, который будет
            последовательно использоваться на сайте, в мобильном приложении,
            коммуникационных материалах и анимации — с единым обликом и характером
            во всех носителях.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-[var(--sb-cream)] p-6 sm:p-8">
              <h3 className="sb-heading mb-5 text-lg font-bold">Характер</h3>
              <ul className="space-y-3">
                {CHARACTER_QUALITIES.map((item) => (
                  <Check key={item}>{item}</Check>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[var(--sb-teal-tint)] p-6 sm:p-8">
              <h3 className="sb-heading mb-5 text-lg font-bold">Визуальные особенности</h3>
              <ul className="space-y-3">
                {VISUAL_FEATURES.map((item) => (
                  <Check key={item}>{item}</Check>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Предлагаемое визуальное направление */}
      <section className="scroll-reveal border-t border-[var(--sb-line)] bg-white/60">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="mx-auto w-full max-w-105 lg:max-w-none">
            <div className="rounded-3xl bg-[var(--sb-cream)] p-5 sm:p-8">
              <SbImage
                image={IMAGES.direction}
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 90vw"
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-center text-sm text-[var(--sb-gray)]">
              Основной утверждённый рендер: Соболёк с планшетом
            </p>
          </div>
          <div>
            <Eyebrow>Визуальное направление</Eyebrow>
            <SectionTitle>Почему выбран именно такой образ</SectionTitle>
            <ul className="mt-7 space-y-3.5">
              {DIRECTION_REASONS.map((item) => (
                <Check key={item}>{item}</Check>
              ))}
            </ul>
            <p className="mt-7 max-w-xl rounded-2xl border border-[var(--sb-teal-soft)] bg-[var(--sb-teal-tint)] p-5 text-[14px] leading-relaxed text-[var(--sb-gray)]">
              Предоставленный исходный образ стал отправной точкой. В предлагаемой версии
              сохранены фирменные цвета, спортивный характер и дружелюбие, при этом образ
              адаптирован для полноценного 3D-производства и дальнейшей анимации.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Паспорт персонажа */}
      <section className="scroll-reveal border-t border-[var(--sb-line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Паспорт персонажа</Eyebrow>
          <SectionTitle>Единый образ во всех будущих материалах</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Паспорт фиксирует пропорции, ракурсы и базовую анатомию персонажа. Именно он
            гарантирует, что Соболёк останется одним и тем же — в каждой новой иллюстрации,
            позе и анимации, у любого исполнителя.
          </p>
          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-3">
            <Figure caption="Вид спереди">
              <SbImage
                image={IMAGES.passportFront}
                sizes="(min-width: 640px) 30vw, 90vw"
                className="h-auto w-full"
              />
            </Figure>
            <Figure caption="A-поза для моделирования">
              <SbImage
                image={IMAGES.passportApose}
                sizes="(min-width: 640px) 30vw, 90vw"
                className="h-auto w-full"
              />
            </Figure>
            <Figure caption="Базовая анатомия персонажа">
              <SbImage
                image={IMAGES.passportAnatomy}
                sizes="(min-width: 640px) 30vw, 90vw"
                className="h-auto w-full"
              />
            </Figure>
            <Figure caption="Вид спереди, сзади и 3/4 — вариант с шарфом" className="sm:col-span-3">
              <SbImage
                image={IMAGES.passportTurnaround}
                sizes="(min-width: 1152px) 1088px, 92vw"
                className="h-auto w-full"
              />
            </Figure>
          </div>
        </div>
      </section>

      {/* 5. Предварительная 3D-модель */}
      <section className="scroll-reveal border-t border-[var(--sb-line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Предварительная 3D-модель</Eyebrow>
          <SectionTitle>Рабочее превью направления</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Это ранняя проверка формы, а не окончательная производственная модель. Она
            создаётся на базе утверждённого паспорта; тело, голова, хвост, лапы, одежда
            и обувь прорабатываются как отдельные элементы.
          </p>
          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <Figure caption="Скульпт: проверка пропорций и силуэта">
              <SbImage
                image={IMAGES.modelSculpt}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="h-auto w-full"
              />
            </Figure>
            <Figure caption="Полигональная сетка">
              <SbImage
                image={IMAGES.modelWireframe}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="h-auto w-full"
              />
            </Figure>
            <Figure caption="Разбивка модели на элементы" className="sm:max-lg:col-span-2">
              <SbImage
                image={IMAGES.modelParts}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 92vw, 90vw"
                className="h-auto w-full"
              />
            </Figure>
          </div>
          <ul className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            <Check>Геометрия строится так, чтобы персонажу можно было менять позы</Check>
            <Check>Кисти проектируются под корректное удержание предметов</Check>
            <Check>Хвост сохраняет форму и хорошо работает в анимации</Check>
            <Check>Лицо готовится под выразительную мимику</Check>
          </ul>
        </div>
      </section>

      {/* 6. Как будет создаваться маскот */}
      <section className="scroll-reveal border-t border-[var(--sb-line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Процесс</Eyebrow>
          <SectionTitle>Как будет создаваться маскот</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Работа разбита на последовательные этапы: каждый закрывается согласованием,
            чтобы дальше двигаться без переделок.
          </p>
          <ol className="mt-10 space-y-4">
            {STAGES.map((stage, i) => (
              <li
                key={stage.title}
                className="grid gap-3 rounded-2xl border border-[var(--sb-line)] bg-white/70 p-5 sm:grid-cols-[180px_1fr] sm:gap-6 sm:p-6"
              >
                <div className="flex items-center gap-3 sm:items-start">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 flex-none rotate-45 items-center justify-center rounded-lg bg-[var(--sb-teal-tint)] border border-[var(--sb-teal-soft)]"
                  >
                    <span className="-rotate-45 text-sm font-bold text-[var(--sb-teal-deep)]">
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--sb-teal-deep)]">
                    Этап {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="sb-heading text-lg font-bold">{stage.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {stage.items.map((item) => (
                      <Check key={item}>{item}</Check>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Возможные сценарии применения */}
      <section className="scroll-reveal border-t border-[var(--sb-line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Сценарии применения</Eyebrow>
          <SectionTitle>Где Соболёк начнёт работать сразу</SectionTitle>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCENARIOS.map((s) => (
              <div
                key={s}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-[var(--sb-line)] bg-white px-4 py-3"
              >
                <span className="sb-diamond !h-[7px] !w-[7px]" aria-hidden />
                <span className="text-[14px] leading-snug text-[var(--sb-brown)]">{s}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[14px] leading-relaxed text-[var(--sb-gray)]">
            Важная граница: Соболёк помогает ориентироваться в сервисах и мотивирует,
            но не даёт медицинских рекомендаций и не заменяет врача.
          </p>
        </div>
      </section>

      {/* 8. Что может входить в итоговый комплект */}
      <section className="scroll-reveal border-t border-[var(--sb-line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Итоговый комплект</Eyebrow>
          <SectionTitle>Что может входить в передаваемые материалы</SectionTitle>
          <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((d) => (
              <Check key={d}>{d}</Check>
            ))}
          </ul>
          <p className="mt-9 max-w-3xl rounded-2xl bg-[var(--sb-cream)] p-5 text-[14px] leading-relaxed text-[var(--sb-gray)]">
            Окончательный состав комплекта определяется после заполнения анкеты и
            согласования технических сценариев использования персонажа.
          </p>
        </div>
      </section>

      {/* 9. Мини-анкета */}
      <section id="anketa" className="scroll-reveal border-t border-[var(--sb-line)] bg-[var(--sb-teal-tint)]/50">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Мини-анкета</Eyebrow>
          <SectionTitle>Что важно согласовать перед стартом</SectionTitle>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Шесть коротких разделов — ответы помогут точно определить состав работ
            и первого комплекта материалов. Заполнение занимает несколько минут;
            на вопросы без готового ответа можно смело отвечать «пока не решили».
          </p>
          <div className="mt-10">
            <SobolekForm />
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-[var(--sb-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-[13px] text-[var(--sb-gray)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Veretennikov Studio — разработка персонажа и 3D-производство</p>
          <p>Страница доступна только по прямой ссылке и не индексируется</p>
        </div>
      </footer>
    </main>
  );
}
