import Image from "next/image";
import Link from "next/link";
import CtaLink from "@/components/public/CtaLink";
import CapabilityAtlas from "./CapabilityAtlas";
import CooperationPlate from "./CooperationPlate";
import HeroProof from "./HeroProof";
import HomepageMotion from "./HomepageMotion";
import PhysicalAILoop from "./PhysicalAILoop";
import PgmFallbackPlate from "./PgmFallbackPlate";
import VisualEngineeringFallback from "./VisualEngineeringFallback";
import "./homepage-v2.css";

const PGM_IMAGE =
  "https://kinescopecdn.net/c0199d68-af23-48c2-8604-76530c1ffb01/posters/f149dbce-820b-4639-be59-acb20f4ff3de/md/019c6b0e-df16-7e28-baa1-2c0db25c51ea.jpg";
const BELOYARSK_IMAGE =
  "https://kinescopecdn.net/c0199d68-af23-48c2-8604-76530c1ffb01/posters/652f809f-cb12-490e-bb5c-52c5ff51cfa3/md/d9f58162-a58c-40ad-8681-d24b90556b35.jpg";
const HUMAN_CONTEXT_IMAGE = "/blog/mikrokomandy-i-budushchee-avtomatizacii-industrial-engineers.webp";

const ENTRY_POINTS = [
  {
    index: "01",
    title: "Слишком много ручной работы",
    text: "Найдём повторяющийся процесс, посчитаем потери и проверим, где автоматизация действительно окупается.",
    href: "/diagnostika",
    link: "Начать с диагностики",
  },
  {
    index: "02",
    title: "Нужен цифровой продукт",
    text: "Соберём логику, данные и интерфейс в работающий MVP — без разрыва между исследованием и разработкой.",
    href: "/cases",
    link: "Смотреть цифровые проекты",
  },
  {
    index: "03",
    title: "Технологию сложно объяснить",
    text: "Переведём устройство продукта или производства в фильм, 3D-модель, интерактив или их комбинацию.",
    href: "/production",
    link: "Смотреть визуальные проекты",
  },
] as const;

const PROCESS = [
  ["01", "Разобрать", "Контекст, ограничения и критерий полезного результата.", "Карта задачи", "Есть предмет для работы"],
  ["02", "Проверить", "Данные, пользователи, технология и экономика решения.", "Гипотеза + baseline", "GO / ADJUST / STOP"],
  ["03", "Собрать", "Прототип, визуальный тест или работающий пилот.", "Работающий контур", "Проверено на сценарии"],
  ["04", "Внедрить", "Интеграции, документация, обучение и запуск.", "Версия в среде", "Команда может работать"],
  ["05", "Развивать", "Наблюдение за эффектом и следующая версия продукта.", "Измеренный эффект", "Следующая версия"],
] as const;

export default function HomepageV2() {
  return (
    <div className="hpv2-root">
      <HomepageMotion />
      <section className="hpv2-hero hpv2-wrap" aria-labelledby="hpv2-hero-title" data-reveal>
        <div className="hpv2-kicker-row">
          <span>VERETENNIKOV STUDIO / EKATERINBURG</span>
          <span>AI · SYSTEMS · VISUAL ENGINEERING</span>
        </div>
        <div className="hpv2-hero__grid">
          <div className="hpv2-hero__copy">
            <p className="hpv2-eyebrow">Студия сложных решений</p>
            <h1 id="hpv2-hero-title">
              Сложную задачу —<br />
              <em>в работающую систему.</em>
            </h1>
            <p className="hpv2-lead">
              Соединяем стратегию, ИИ, разработку и визуальный язык. От первой гипотезы — до результата, которым пользуются люди.
            </p>
            <div className="hpv2-actions">
              <CtaLink
                className="hpv2-button"
                href="/razbor"
                goalName="razbor_cta"
                goalParams={{ place: "homepage_v2_hero" }}
              >
                Обсудить задачу <span aria-hidden="true">↗</span>
              </CtaLink>
              <a className="hpv2-arrow-link" href="#hpv2-work">
                Смотреть проекты <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hpv2-fineprint">Первый разговор — 40 минут · без обязательств</p>
          </div>
          <HeroProof />
        </div>
      </section>

      <aside className="hpv2-proofbar" aria-label="Опыт студии">
        <div className="hpv2-wrap hpv2-proofbar__inner">
          <p><strong>12 лет</strong><span>в промышленной и корпоративной среде</span></p>
          <ul aria-label="Клиенты разных направлений">
            <li>Белоярская АЭС</li>
            <li>Ростелеком</li>
            <li>УБРиР</li>
            <li>Технэкс</li>
          </ul>
        </div>
      </aside>

      <section className="hpv2-section hpv2-wrap" aria-labelledby="hpv2-entry-title" data-reveal>
        <div className="hpv2-heading-grid">
          <p className="hpv2-eyebrow">01 / Точки входа</p>
          <div>
            <h2 id="hpv2-entry-title">Начинаем не с технологии.<br /><em>Начинаем с задачи.</em></h2>
            <p>Три частые ситуации, в которых студия помогает собрать решение целиком.</p>
          </div>
        </div>
        <div className="hpv2-entry-grid">
          {ENTRY_POINTS.map((entry) => (
            <article className="hpv2-entry" key={entry.index} data-reveal>
              <span className="hpv2-entry__index">{entry.index}</span>
              <h3>{entry.title}</h3>
              <p>{entry.text}</p>
              <Link className="hpv2-arrow-link" href={entry.href}>{entry.link} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="hpv2-work" className="hpv2-section hpv2-work" aria-labelledby="hpv2-work-title" data-reveal>
        <div className="hpv2-wrap">
          <div className="hpv2-heading-grid hpv2-heading-grid--light">
            <p className="hpv2-eyebrow">02 / Selected work</p>
            <div>
              <h2 id="hpv2-work-title">Не перечень услуг.<br /><em>Следы реальной работы.</em></h2>
              <Link className="hpv2-arrow-link" href="/cases">Все проекты <span aria-hidden="true">↗</span></Link>
            </div>
          </div>

          <div className="hpv2-projects">
            <Link className="hpv2-project hpv2-project--lead" href="/show/industrial-cooperation" data-reveal>
              <div className="hpv2-project__visual hpv2-cooperation" aria-label="Схема цифрового сервиса промышленной кооперации">
                <div className="hpv2-project__topline"><span className="hpv2-status hpv2-status--designed">MVP / SCHEMATIC</span><span>DESIGNED EXPLANATION</span></div>
                <CooperationPlate />
              </div>
              <div className="hpv2-project__copy">
                <p>Промышленная кооперация</p>
                <h3>Из свободного запроса — в проверяемый подбор партнёров.</h3>
                <span>Разобрать проект <b aria-hidden="true">↗</b></span>
              </div>
            </Link>

            <Link className="hpv2-project" href="/show/9vn3wPsEmvYiF3VibYT6ha" data-reveal>
              <div className="hpv2-project__visual hpv2-project__visual--pgm">
                <PgmFallbackPlate />
                <Image src={PGM_IMAGE} alt="Кадр из фильма о парогенераторе ПГм-15" fill sizes="(max-width: 799px) calc(100vw - 40px), 46vw" />
                <div className="hpv2-project__topline"><span className="hpv2-status hpv2-status--light">REAL PROJECT</span><span>3D / CGI</span></div>
              </div>
              <div className="hpv2-project__copy">
                <p>Парогенератор ПГм-15</p>
                <h3>Показать процесс, который невозможно снять камерой.</h3>
                <span>Смотреть проект <b aria-hidden="true">↗</b></span>
              </div>
            </Link>

            <Link className="hpv2-project hpv2-project--wide" href="/show/belojarskaya-aes" data-reveal>
              <div className="hpv2-project__visual hpv2-project__visual--beloyarsk">
                <VisualEngineeringFallback />
                <Image src={BELOYARSK_IMAGE} alt="Кадр из корпоративного фильма Белоярской АЭС" fill sizes="(max-width: 799px) calc(100vw - 40px), 62vw" />
                <div className="hpv2-project__topline"><span className="hpv2-status hpv2-status--light">REAL PROJECT</span><span>FILM + VFX</span></div>
              </div>
              <div className="hpv2-project__copy">
                <p>Белоярская АЭС</p>
                <h3>Технология, история и люди — в одном промышленном фильме.</h3>
                <span>Смотреть проект <b aria-hidden="true">↗</b></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="hpv2-section hpv2-wrap" aria-labelledby="hpv2-capabilities-title" data-reveal>
        <div className="hpv2-heading-grid">
          <p className="hpv2-eyebrow">03 / Capabilities</p>
          <div>
            <h2 id="hpv2-capabilities-title">Четыре направления.<br /><em>Одна инженерная логика.</em></h2>
            <p>Выберите контур, чтобы увидеть роль студии и ожидаемый тип результата.</p>
          </div>
        </div>
        <CapabilityAtlas />
      </section>

      <section className="hpv2-section hpv2-process" aria-labelledby="hpv2-process-title" data-reveal>
        <div className="hpv2-wrap">
          <div className="hpv2-heading-grid">
            <p className="hpv2-eyebrow">04 / How we work</p>
            <div>
              <h2 id="hpv2-process-title">Сначала уменьшаем неизвестность.<br /><em>Потом наращиваем решение.</em></h2>
              <p>Каждый этап заканчивается артефактом и решением: идти дальше, изменить курс или остановиться.</p>
            </div>
          </div>
          <ol className="hpv2-process__list">
            {PROCESS.map(([index, title, description, artifact, gate]) => (
              <li key={index} data-reveal>
                <div className="hpv2-process__index"><span>{index}</span><i aria-hidden="true" /></div>
                <div className="hpv2-process__step">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <dl>
                  <div><dt>Артефакт</dt><dd>{artifact}</dd></div>
                  <div><dt>Gate</dt><dd>{gate}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hpv2-section hpv2-wrap" aria-labelledby="hpv2-practice-title" data-reveal>
        <div className="hpv2-heading-grid">
          <p className="hpv2-eyebrow">05 / Studio in practice</p>
          <div>
            <h2 id="hpv2-practice-title">Система может жить<br /><em>на экране и в физическом мире.</em></h2>
          </div>
        </div>
        <div className="hpv2-practice">
          <article className="hpv2-practice__rd" data-reveal>
            <div className="hpv2-practice__meta"><span>PHYSICAL AI</span><span className="hpv2-status hpv2-status--rd">R&D SCHEMATIC</span></div>
            <PhysicalAILoop />
            <h3>Из сигнала — в подсказку оператору.</h3>
            <p>Исследуем сценарии машинного зрения и работы с оборудованием. Это направление R&D, а не готовый продукт.</p>
            <Link className="hpv2-arrow-link" href="/lab">Лаборатория студии <span aria-hidden="true">↗</span></Link>
          </article>
          <article className="hpv2-practice__visual" data-reveal>
            <div className="hpv2-practice__image hpv2-practice__image--fallback">
              <VisualEngineeringFallback />
              <Image src={BELOYARSK_IMAGE} alt="3D-кадр промышленного оборудования из фильма Белоярской АЭС" fill sizes="(max-width: 799px) calc(100vw - 40px), 48vw" />
              <div className="hpv2-technical-overlay" aria-hidden="true">
                <span className="hpv2-technical-overlay__reticle" />
                <span className="hpv2-technical-overlay__axis">TECH / 03</span>
                <span className="hpv2-technical-overlay__note">FRAME + 3D + VFX</span>
              </div>
            </div>
            <div className="hpv2-practice__meta"><span>VISUAL ENGINEERING</span><span className="hpv2-status">REAL PROJECT</span></div>
            <h3>Сделать невидимую технологию понятной.</h3>
            <p>Промышленная съёмка, 3D и интерактив остаются самостоятельным направлением студии.</p>
            <Link className="hpv2-arrow-link" href="/production">Смотреть направление <span aria-hidden="true">↗</span></Link>
          </article>
        </div>
      </section>

      <section className="hpv2-section hpv2-human" aria-labelledby="hpv2-human-title" data-reveal>
        <div className="hpv2-wrap hpv2-human__grid">
          <div className="hpv2-human__image">
            <Image src={HUMAN_CONTEXT_IMAGE} alt="Редакционная иллюстрация: инженеры обсуждают данные в производственной среде" fill sizes="(max-width: 799px) calc(100vw - 40px), 52vw" />
            <span>EDITORIAL CONTEXT / PEOPLE AT WORK</span>
          </div>
          <div className="hpv2-human__copy">
            <p className="hpv2-eyebrow">06 / Human layer</p>
            <h2 id="hpv2-human-title">Технологии работают,<br /><em>когда их принимают люди.</em></h2>
            <p>Поэтому в проекте важны не только модель, интерфейс или кадр, но и контекст команды: кто принимает решение, кто работает с системой и что меняется в его дне.</p>
            <blockquote>«За результат отвечает не набор подрядчиков, а одна студия — от смысла до запуска».</blockquote>
            <p className="hpv2-human__note">Студия под руководством Анатолия Веретенникова · Екатеринбург / Россия</p>
            <Link className="hpv2-arrow-link" href="/about">О студии <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="hpv2-contact" aria-labelledby="hpv2-contact-title" data-reveal>
        <div className="hpv2-wrap hpv2-contact__grid">
          <div>
            <p className="hpv2-eyebrow">07 / Следующий шаг</p>
            <h2 id="hpv2-contact-title">Принесите сложную задачу.<br /><em>Разложим её на первый шаг.</em></h2>
          </div>
          <div>
            <p>За 40 минут разберём контекст, ограничения и возможный формат работы. После разговора — короткое письменное резюме.</p>
            <CtaLink
              className="hpv2-button hpv2-button--light"
              href="/razbor"
              goalName="razbor_cta"
              goalParams={{ place: "homepage_v2_final" }}
            >
              Обсудить задачу <span aria-hidden="true">↗</span>
            </CtaLink>
            <Link className="hpv2-arrow-link" href="/brief">Уже есть вводные? Перейти к брифу <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
