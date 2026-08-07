import { SbImage } from "@/components/sobolek/SbImage";
import { IMAGES, IMAGES_2D } from "@/lib/sobolek/images";

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

const D2_TILES = [
  { image: IMAGES_2D.neutral, caption: "Нейтральная поза" },
  { image: IMAGES_2D.wave, caption: "Приветствие" },
  { image: IMAGES_2D.thumbs, caption: "Жест «отлично»" },
  { image: IMAGES_2D.open, caption: "Открытый жест" },
  { image: IMAGES_2D.head, caption: "Голова анфас" },
  { image: IMAGES_2D.hands, caption: "Варианты кистей" },
] as const;

const PRICING: {
  title: string;
  desc: string;
  result: string;
  hours: number;
  price: string;
}[] = [
  {
    title: "Согласование 2D-канона",
    desc: "Фиксация упрощённого векторного стиля: пропорции, палитра, детали мордочки, кистей и хвоста — единый лист сверки с утверждённым 3D-образом.",
    result: "Утверждённый лист 2D-стиля",
    hours: 8,
    price: "20 000",
  },
  {
    title: "Векторный мастер-персонаж",
    desc: "Чистовая отрисовка в кривых (Adobe Illustrator): каждый элемент — отдельный управляемый слой, готовый к анимации.",
    result: "Мастер-файл персонажа в кривых",
    hours: 20,
    price: "50 000",
  },
  {
    title: "Библиотека ракурсов и жестов",
    desc: "Положения головы (анфас, три четверти, профиль), шесть сменных кистей — от открытой ладони до жеста «отлично», базовые позы.",
    result: "Библиотека для всех будущих анимаций",
    hours: 14,
    price: "35 000",
  },
  {
    title: "Анимационный риг",
    desc: "Сборка управляемого персонажа в After Effects: тело, повороты головы, мимика — моргание, улыбка, брови, взгляд.",
    result: "Персонаж, готовый к анимации",
    hours: 18,
    price: "45 000",
  },
  {
    title: "Первая анимация и внедрение",
    desc: "Цикл «приветствие»: дыхание, покачивание хвоста, взмах лапой. Экспорт в Lottie, проверка на разных устройствах и браузерах, установка на сайт.",
    result: "Живой Соболёк на страницах сайта",
    hours: 12,
    price: "30 000",
  },
  {
    title: "Пакет анимаций помощника",
    desc: "Ещё три цикла: указание на элемент интерфейса, жест «отлично», радость достижению.",
    result: "Четыре готовые анимации суммарно",
    hours: 14,
    price: "35 000",
  },
  {
    title: "Передача материалов",
    desc: "Исходники Illustrator и After Effects, Lottie-файлы для сайта, видео-превью, краткое руководство по использованию и созданию новых анимаций.",
    result: "Полный комплект исходников",
    hours: 8,
    price: "20 000",
  },
];

/* ── Страница ─────────────────────────────────────────────────────── */

export default function SobolekPage() {
  return (
    <main className="overflow-x-clip">
      {/* 1. Первый экран */}
      <header className="sb-hero relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <Eyebrow>Урал: за медицину здорового долголетия</Eyebrow>
            <h1 className="sb-heading text-[34px] font-extrabold leading-[1.08] sm:text-[46px] lg:text-[52px]">
              Соболёк — цифровой помощник Движения
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--sb-teal-deep)]">
              Образ утверждён. Предлагаем план его воплощения: выразительный 3D —
              для иллюстраций и видео, лёгкий анимированный 2D-помощник — для сайта
              и приложения.
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
              Соболёк станет постоянным спутником пользователя платформы: встретит,
              подскажет, поддержит и поздравит — оставаясь одним и тем же персонажем
              в любом носителе.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#predlozhenie"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--sb-teal)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--sb-teal-deep)]"
              >
                Этапы и стоимость
              </a>
              <a
                href="#voploshcheniya"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--sb-line)] bg-white px-7 text-[15px] font-semibold text-[var(--sb-brown)] transition-colors hover:border-[var(--sb-teal-soft)]"
              >
                Как это устроено
              </a>
            </div>
          </div>
          <div className="order-1 mx-auto w-full max-w-85 sm:max-w-95 lg:order-2 lg:max-w-110">
            {/* Видео вписано в фон секции без рамки; края растушёваны масками */}
            <div className="sb-hero-mask-x" role="img" aria-label={IMAGES.hero.alt}>
              <video
                className="sb-hero-mask-y sb-motion-only h-auto w-full"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/sobolek/hero-poster.webp"
                width={856}
                height={1072}
                aria-hidden="true"
              >
                <source src="/sobolek/hero-video.mp4" type="video/mp4" />
              </video>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sobolek/hero-poster.webp"
                alt=""
                width={856}
                height={1072}
                fetchPriority="high"
                decoding="async"
                className="sb-hero-mask-y sb-static-only h-auto w-full"
                aria-hidden="true"
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
            Соболёк — полноценный фирменный персонаж, который последовательно
            используется на сайте, в мобильном приложении, коммуникационных
            материалах и анимации — с единым обликом и характером во всех носителях.
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

      {/* 3. Утверждённое визуальное направление */}
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
              Утверждённый рендер: Соболёк с планшетом
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
              Предоставленный исходный образ стал отправной точкой. В утверждённой
              версии сохранены фирменные цвета, спортивный характер и дружелюбие,
              при этом образ адаптирован для полноценного производства и анимации.
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
          <SectionTitle>Рабочее превью объёмного образа</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Ранняя проверка формы: тело, голова, хвост, одежда и обувь прорабатываются
            как отдельные элементы. На базе этой модели создаются рендеры для
            иллюстраций, презентаций и видеороликов — как ролик в начале страницы.
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
        </div>
      </section>

      {/* 6. Два воплощения */}
      <section id="voploshcheniya" className="scroll-reveal border-t border-[var(--sb-line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Предложение по внедрению</Eyebrow>
          <SectionTitle>Один персонаж — два воплощения</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Утверждённый 3D-образ остаётся основой бренда. А чтобы Соболёк жил прямо
            на страницах сайта и в приложении, предлагаем создать его точную 2D-копию
            в векторе — лёгкого анимированного помощника.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-[var(--sb-cream)] p-6 sm:p-8">
              <h3 className="sb-heading mb-3 text-lg font-bold">3D-Соболёк — лицо Движения</h3>
              <ul className="space-y-3">
                <Check>Иллюстрации и обложки для сайта и соцсетей</Check>
                <Check>Презентации, печатная и выставочная продукция</Check>
                <Check>Видеоролики и заставки — как ролик в начале этой страницы</Check>
                <Check>Максимальная выразительность: объём, шерсть, свет</Check>
              </ul>
            </div>
            <div className="rounded-2xl bg-[var(--sb-teal-tint)] p-6 sm:p-8">
              <h3 className="sb-heading mb-3 text-lg font-bold">2D-Соболёк — помощник в интерфейсе</h3>
              <ul className="space-y-3">
                <Check>Живёт на страницах сайта и в приложении: встречает, подсказывает, поздравляет</Check>
                <Check>Векторная графика: идеальная чёткость на любом экране</Check>
                <Check>Анимация в формате Lottie: десятки килобайт вместо десятков мегабайт</Check>
                <Check>Плавная работа даже на недорогих телефонах</Check>
              </ul>
            </div>
          </div>

          <div className="mt-8 max-w-4xl rounded-2xl border border-[var(--sb-line)] bg-white/70 p-6 sm:p-7">
            <h3 className="sb-heading mb-3 text-base font-bold">
              Почему для сайта — вектор, а не 3D в браузере
            </h3>
            <p className="text-[14px] leading-relaxed text-[var(--sb-gray)]">
              Технологии WebGL позволяют показывать объёмные сцены прямо на странице —
              это эффектно, но у подхода есть цена: большие файлы, заметная нагрузка на
              процессор и батарею, а на части устройств и браузеров поддержка нестабильна.
              Lottie-анимация лишена этих ограничений: она весит как одна фотография,
              масштабируется без потери качества и не мешает скорости сайта — что важно и
              для пользователей, и для поисковых систем. Тот же принцип используют крупные
              цифровые сервисы: выразительные рендеры — в оформлении, лёгкий вектор — в
              интерфейсе.
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--sb-gray)]">
              2D-версия строится по паспорту персонажа: те же пропорции, палитра, одежда
              и характер. Соболёк остаётся полностью узнаваемым.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Эскизы 2D-версии */}
      <section className="scroll-reveal border-t border-[var(--sb-line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>2D-направление</Eyebrow>
          <SectionTitle>Первые эскизы 2D-версии</SectionTitle>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Поисковые эскизы упрощённого стиля — основа для чистовой векторной
            отрисовки. Уже видно главное: характер и узнаваемость сохраняются
            при заметно более простой графике.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {D2_TILES.map(({ image, caption }) => (
              <figure key={image.name}>
                <div className="overflow-hidden rounded-2xl bg-[#2a2723]">
                  <SbImage
                    image={image}
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-2.5 text-center text-sm text-[var(--sb-gray)]">
                  {caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[14px] leading-relaxed text-[var(--sb-gray)]">
            Это рабочий поисковый этап: в чистовой векторной версии детали будут
            аккуратно выровнены по паспорту персонажа — единый нос, кисти,
            усы и фирменная палитра.
          </p>
        </div>
      </section>

      {/* 8. Сценарии применения */}
      <section className="scroll-reveal border-t border-[var(--sb-line)]">
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

      {/* 9. Этапы и стоимость */}
      <section id="predlozhenie" className="scroll-reveal border-t border-[var(--sb-line)] bg-[var(--sb-teal-tint)]/50">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Этапы и стоимость</Eyebrow>
          <SectionTitle>Создание 2D-помощника</SectionTitle>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--sb-gray)]">
            Ставка — 2 500 ₽/час. Работа идёт поэтапно: каждый этап завершается
            показом и утверждением, в стоимость включены две итерации правок.
            Ответы вашей анкеты учтены в составе работ.
          </p>

          <div className="mt-10 space-y-4">
            {PRICING.map((stage, i) => (
              <div
                key={stage.title}
                className="rounded-2xl border border-[var(--sb-line)] bg-white/80 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="idx text-sm text-[var(--sb-teal-deep)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="sb-heading text-lg font-bold">{stage.title}</h3>
                  </div>
                  <p className="text-[15px] font-bold text-[var(--sb-brown)] whitespace-nowrap">
                    {stage.price} ₽
                    <span className="ml-2 text-[13px] font-normal text-[var(--sb-gray)]">
                      · {stage.hours} ч
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--sb-gray)]">{stage.desc}</p>
                <p className="mt-2 text-[13px] text-[var(--sb-teal-deep)]">
                  Результат: {stage.result}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 rounded-2xl bg-[var(--sb-brown)] px-6 py-5 text-white">
            <p className="sb-heading text-lg font-bold text-white">Итого</p>
            <p className="text-lg font-bold">
              235 000 ₽ <span className="text-[13px] font-normal opacity-70">· 94 часа</span>
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            <Check>Оплата поэтапная — по факту утверждения каждого этапа</Check>
            <Check>Срок производства — 5–6 недель плюс время согласований</Check>
            <Check>
              Дальнейшее развитие — по запросу: дополнительный анимационный цикл
              4–6 часов, новые эмоции и позы 1–2 часа за позицию
            </Check>
            <Check>
              Правки сверх двух итераций и изменение утверждённых решений — по ставке
              2 500 ₽/час по предварительному согласованию
            </Check>
          </ul>
        </div>
      </section>

      {/* 10. Что дальше */}
      <section className="scroll-reveal border-t border-[var(--sb-line)]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Что дальше</Eyebrow>
          <SectionTitle>Три шага до живого Соболька на сайте</SectionTitle>
          <ol className="mt-10 space-y-4">
            {[
              {
                title: "Утвердить направление и смету",
                text: "Подтверждение этого предложения — достаточно ответа в любом удобном канале.",
              },
              {
                title: "Согласовать 2D-канон",
                text: "Один короткий показ: лист сверки 2D-стиля с утверждённым 3D-образом.",
              },
              {
                title: "Производство",
                text: "Первая анимация появляется на сайте примерно через три недели после старта; далее — пакет анимаций и передача материалов.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-[var(--sb-line)] bg-white/70 p-5 sm:p-6"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-none rotate-45 items-center justify-center rounded-lg border border-[var(--sb-teal-soft)] bg-[var(--sb-teal-tint)]"
                >
                  <span className="-rotate-45 text-sm font-bold text-[var(--sb-teal-deep)]">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="sb-heading text-base font-bold">{step.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--sb-gray)]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl bg-[var(--sb-cream)] p-6 text-center sm:p-8">
            <p className="text-[15px] text-[var(--sb-brown)]">
              Обсудить предложение:
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:strana.vfx@gmail.com"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--sb-teal)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--sb-teal-deep)]"
              >
                Написать на почту
              </a>
              <a
                href="https://t.me/VeretennikovINFO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--sb-line)] bg-white px-7 text-[15px] font-semibold text-[var(--sb-brown)] transition-colors hover:border-[var(--sb-teal-soft)]"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-[var(--sb-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-[13px] text-[var(--sb-gray)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Veretennikov Studio — разработка персонажа, 3D и анимация</p>
          <p>Страница доступна только по прямой ссылке и не индексируется</p>
        </div>
      </footer>
    </main>
  );
}
