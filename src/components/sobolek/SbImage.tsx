import type { SobolekImage } from "@/lib/sobolek/images";

type Props = {
  image: SobolekImage;
  /** Атрибут sizes — под конкретное место в вёрстке */
  sizes: string;
  /** true только для хиро: eager + fetchpriority=high */
  priority?: boolean;
  className?: string;
};

/**
 * Статичная картинка презентации: заранее подготовленные WebP-файлы
 * трёх ширин, честный srcset и интринсик-размеры против layout shift.
 * next/image не используется намеренно: файлы уже оптимизированы,
 * рантайм-оптимизатор здесь не нужен.
 */
export function SbImage({ image, sizes, priority, className }: Props) {
  const srcSet = image.widths.map((w) => `/sobolek/${image.name}-${w}.webp ${w}w`).join(", ");
  const largest = image.widths[image.widths.length - 1];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/sobolek/${image.name}-${largest}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
