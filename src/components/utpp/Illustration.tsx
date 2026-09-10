import Image from "next/image"

/**
 * Иллюстрация раздела.
 *
 * Собственный компонент, а не DeckImage: тот несёт параллакс и градиентные
 * шторки, спроектированные под полноэкранную деку. Здесь — документ:
 * изображение стоит спокойно, без наложений и без перекраски фильтрами.
 *
 * Фон иллюстраций совпадает с бумагой страницы, поэтому рамка не нужна —
 * достаточно воздуха вокруг.
 */
export default function Illustration({
  src,
  alt,
  ratio = "4-3",
  priority = false,
  sizes = "(max-width: 1023px) 100vw, 46vw",
}: {
  src: string
  alt: string
  ratio?: "4-3" | "16-9"
  priority?: boolean
  sizes?: string
}) {
  const [w, h] = ratio === "16-9" ? [1672, 941] : [1448, 1086]

  return (
    <figure className={`utpp-page-figure utpp-page-figure--${ratio}`}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="utpp-page-figure-img"
      />
    </figure>
  )
}
