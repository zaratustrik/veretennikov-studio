import Image from "next/image"

const NATIVE = { w: 1672, h: 941 }

export type KitImage = "highway-terminal" | "trailer-executors" | "terminal-dusk" | "control-room" | "hub-ecosystem"

const ALT: Record<KitImage, string> = {
  "highway-terminal": "Магистральный тягач на трассе, справа терминал с погрузочными доками",
  "trailer-executors": "Полуприцеп на площадке, вокруг разные тягачи-исполнители",
  "terminal-dusk": "Терминал в сумерках: тягач на выезде, доки с полуприцепами, дворовый тягач",
  "control-room": "Операционный центр: видеостена с показателями перевозок и рабочие места операторов",
  "hub-ecosystem": "Площадка хаба: магистральный тягач, мобильный робот с паллетой, терминальный тягач",
}

/** Фон титульного экрана. Изображение сильно затемнено: заголовок важнее. */
export function HeroBackdrop({ name }: { name: KitImage }) {
  return (
    <>
      <div className="kdm-hero-bg">
        <Image
          src={`/kit/${name}.webp`}
          alt=""
          aria-hidden="true"
          width={NATIVE.w}
          height={NATIVE.h}
          sizes="100vw"
          priority
        />
      </div>
      <div className="kdm-hero-veil" aria-hidden="true" />
    </>
  )
}

/** Карточка контура эффекта: изображение-акцент + тезис + перечень тем. */
export function Zone({
  n,
  title,
  lead,
  tags,
  image,
  isLead,
}: {
  n: string
  title: string
  lead: string
  tags: string[]
  image: KitImage
  isLead?: boolean
}) {
  return (
    <article className="kdm-zone" data-lead={isLead ? "true" : undefined}>
      <div className="kdm-zone-img">
        <Image
          src={`/kit/${image}.webp`}
          alt={ALT[image]}
          width={NATIVE.w}
          height={NATIVE.h}
          sizes="(max-width: 1000px) 100vw, 520px"
          loading="lazy"
        />
      </div>
      <div className="kdm-zone-body">
        <span className="kdm-zone-n">{n}</span>
        <h3 className="kdm-zone-t">{title}</h3>
        <p className="kdm-zone-l">{lead}</p>
        <div className="kdm-zone-tags">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </article>
  )
}
