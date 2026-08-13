import Image from "next/image"

/**
 * Изображения набора — концептуальные визуализации в фирменной стилистике
 * ТК КИТ, а не съёмка существующих объектов. Там, где кадр может быть принят
 * за документальную фотографию, подпись `concept` обязательна.
 */
export type KitImageName =
  | "highway-terminal"
  | "trailer-executors"
  | "terminal-dusk"
  | "control-room"
  | "hub-ecosystem"

const NATIVE = { w: 1672, h: 941 }

/**
 * Индивидуальная точка фокуса. Горизонталь важна при узком экране, вертикаль —
 * при широкой полосе. Значения подобраны по содержанию каждого кадра:
 * у операционного центра нельзя срезать верх видеостены, у сцены хаба —
 * дрон в левом верхнем углу.
 */
const FOCUS: Record<KitImageName, string> = {
  "highway-terminal": "62% 50%",
  "trailer-executors": "50% 50%",
  "terminal-dusk": "40% 58%",
  "control-room": "34% 38%",
  "hub-ecosystem": "46% 44%",
}

const ALT: Record<KitImageName, string> = {
  "highway-terminal":
    "Магистральный тягач в фирменной ливрее на трассе на рассвете, справа — терминал с погрузочными доками",
  "trailer-executors":
    "Полуприцеп в центре площадки, вокруг четыре разных исполнителя: магистральный тягач, терминальный тягач, автономный дворовый тягач и ещё один тягач",
  "terminal-dusk":
    "Терминал в сумерках: тягач выезжает с площадки, справа доки с полуприцепами и дворовый тягач",
  "control-room":
    "Операционный центр: видеостена с показателями перевозок, операторы за рабочими местами, за окном — площадка с техникой",
  "hub-ecosystem":
    "Площадка хаба на закате: магистральный тягач, мобильный робот с паллетой, терминальный тягач и доставочный дрон в одном кадре",
}

/**
 * Крупная editorial-иллюстрация. Пропорции меняются по ширине экрана,
 * чтобы главный объект не выпадал из кадра на мобильном.
 */
/**
 * Кадры, смысл которых держится на полной композиции: полуприцеп с четырьмя
 * исполнителями вокруг, видеостена операционного центра, сцена хаба со всеми
 * типами исполнителей сразу. Обрезка по бокам на узком экране превратила бы
 * их в бессмыслицу, поэтому на мобильном они остаются в исходных пропорциях,
 * пусть и мельче.
 */
const NEVER_CROP: KitImageName[] = ["trailer-executors", "control-room", "hub-ecosystem"]

export function EditorialImage({
  name,
  caption,
  concept,
  ratio = "wide",
  priority,
}: {
  name: KitImageName
  caption?: string
  /** Пометка «концептуальная визуализация» — для кадров, которые можно принять за реальный объект. */
  concept?: boolean
  ratio?: "wide" | "band" | "square-ish"
  priority?: boolean
}) {
  return (
    <figure
      className="kdl-img"
      data-ratio={ratio}
      data-nocrop={NEVER_CROP.includes(name) ? "true" : undefined}
    >
      <div className="kdl-img-frame">
        <Image
          src={`/kit/${name}.webp`}
          alt={ALT[name]}
          width={NATIVE.w}
          height={NATIVE.h}
          sizes="(max-width: 760px) 100vw, (max-width: 1180px) 100vw, 1320px"
          style={{ objectPosition: FOCUS[name] }}
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
        {concept ? (
          <span className="kdl-img-tag">Концептуальная визуализация</span>
        ) : null}
      </div>
      {caption ? <figcaption className="kdl-img-cap">{caption}</figcaption> : null}
    </figure>
  )
}

/** Полноэкранный Hero: изображение на фоне, содержимое поверх. */
export function HeroImage({ children }: { children: React.ReactNode }) {
  return (
    <header className="kdl-hero kdl-hero--img">
      <Image
        className="kdl-hero-bg"
        src="/kit/highway-terminal.webp"
        alt=""
        aria-hidden="true"
        width={NATIVE.w}
        height={NATIVE.h}
        sizes="100vw"
        priority
      />
      <div className="kdl-hero-veil" aria-hidden="true" />
      <div className="kdl-wrap kdl-hero-body">{children}</div>
      <span className="kdl-hero-tag">Концептуальная визуализация</span>
    </header>
  )
}
