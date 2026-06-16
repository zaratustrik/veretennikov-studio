import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"
import HeroVideo from "./HeroVideo"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SECTIONS = [
  {
    href: "/prodyuser",
    title: "Для продюсера",
    blurb: "Проект за 5 минут: hook, причины, бюджетная формула, 7 реплик, one-pager.",
    icon: "★",
  },
  {
    href: "/sezon",
    title: "Сезон",
    blurb: "Две арки 8+8, десять опорных точек, передача эстафеты Хозяйка → Полоз.",
    icon: "◆",
  },
  {
    href: "/serii",
    title: "16 серий",
    blurb: "Карточки всех эпизодов: мотив, комедия, мистика, твист, social-слой.",
    icon: "▦",
  },
  {
    href: "/geroi",
    title: "Герои",
    blurb: "Хочет · нужно · комедия · арка — от Ильи и Леры до Петровича.",
    icon: "☺",
  },
  {
    href: "/mir",
    title: "Мир и правила",
    blurb: "Медь против золота: Хозяйка, Лера, Полоз, межа, штольня, лимиты.",
    icon: "⛰",
  },
  {
    href: "/tvisty",
    title: "Твисты и закладки",
    blurb: "Что зритель видит в серии 1 и понимает в серии 8. Все пэйоффы.",
    icon: "↯",
  },
  {
    href: "/graf",
    title: "Контроль сезона",
    blurb: "Приборная панель: лента двух арок, счётчик закладок, ядро связей, досье героев.",
    icon: "✳",
  },
  {
    href: "/dokumenty",
    title: "Документы",
    blurb: "Все 14 рабочих документов разработки — от ядра до graph-аудита.",
    icon: "≣",
  },
]

export default async function PortalHome({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data) notFound()
  const base = `/b/${token}`

  return (
    <main>
      {/* hero */}
      <header className="bgv-veins">
        <div className="relative mx-auto flex max-w-[1160px] flex-col-reverse gap-9 px-5 pb-14 pt-12 md:grid md:grid-cols-[1.3fr_minmax(280px,380px)] md:items-center md:gap-10 md:pb-20 md:pt-20">
          <div className="relative">
            <p className="bgv-kicker">
              {data.meta.format} · {data.meta.version} · {data.meta.date}
            </p>
            <h1 className="bgv-display mt-4 text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[1.05]">
              <span className="bgv-title-gradient">{data.meta.title}</span>
              <span className="mt-1 block text-[0.55em] font-normal text-[var(--mal-text-2)]">
                {data.meta.subtitle}
              </span>
            </h1>
            <p className="mt-6 max-w-[640px] text-[1.02rem] leading-[1.75] text-[var(--mal-text-2)]">
              {data.hero.logline}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {data.facts.map((f) => (
                <span key={f} className="bgv-chip">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {data.meta.hero_video ? (
            <HeroVideo
              src={data.meta.hero_video}
              posterWebp={data.meta.hero_poster_webp}
              posterJpg={data.meta.hero_poster_jpg || ""}
              label={`${data.meta.title} — тизер`}
            />
          ) : (
            <div className="relative hidden md:block">
              <div className="bgv-ember mx-auto" />
            </div>
          )}
        </div>
        <div className="bgv-glowline" />
      </header>

      <div className="mx-auto max-w-[1160px] px-5">
        {/* formula */}
        <section className="mx-auto max-w-[860px] py-12 text-center md:py-16">
          <p className="bgv-kicker">Формула сериала</p>
          <p className="bgv-quote mt-4 text-[clamp(1.05rem,2.2vw,1.35rem)] leading-[1.7]">
            «{data.hero.formula}»
          </p>
          <p className="mt-6 text-[0.92rem] text-[var(--mal-text-3)]">
            Тема: {data.hero.theme}
          </p>
          <p className="mt-2 text-[0.92rem] text-[#ecd9a8]">
            {data.hero.tone_rule}
          </p>
        </section>

        {/* two arcs strip */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="bgv-card p-6">
            <p className="bgv-kicker text-[#8fe6bd]">
              {data.season.arc1.range} · малахит
            </p>
            <h2 className="bgv-h2 mt-2">{data.season.arc1.title}</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--mal-text-2)]">
              {data.season.arc1.question} {data.season.arc1.engine}.
            </p>
            <p className="mt-2 text-[0.85rem] text-[var(--mal-text-3)]">
              Комедия: {data.season.arc1.comedy.toLowerCase()}.
            </p>
          </div>
          <div className="bgv-card bgv-card--gold p-6">
            <p className="bgv-kicker text-[#ecd9a8]">
              {data.season.arc2.range} · золото
            </p>
            <h2 className="bgv-h2 mt-2">{data.season.arc2.title}</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--mal-text-2)]">
              {data.season.arc2.question} {data.season.arc2.engine}.
            </p>
            <p className="mt-2 text-[0.85rem] text-[var(--mal-text-3)]">
              Комедия: {data.season.arc2.comedy.toLowerCase()}.
            </p>
          </div>
        </section>

        {/* sections grid */}
        <section className="py-14">
          <p className="bgv-kicker mb-5">Разделы карты</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={`${base}${s.href}`} className="bgv-card block p-5">
                <div className="flex items-start gap-4">
                  <span className="bgv-num" aria-hidden>
                    {s.icon}
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--mal-text)]">
                      {s.title}
                    </span>
                    <span className="mt-1 block text-[0.85rem] leading-snug text-[var(--mal-text-3)]">
                      {s.blurb}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Внутренний статус-борд (meta.status_line + todo) сознательно НЕ рендерится:
            страницу показывают внешним продюсерам. Рабочий статус живет в
            knowledge/series_reboot (план 14, ответ 15) и в data.json. */}
        <div className="pb-10" />
      </div>
    </main>
  )
}
