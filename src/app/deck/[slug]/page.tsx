import { notFound } from "next/navigation";
import type { Metadata } from "next";

import DeckShell from "@/components/deck/DeckShell";
import Slide01 from "@/components/deck/slides/Slide01";
import Slide02 from "@/components/deck/slides/Slide02";
import Slide03 from "@/components/deck/slides/Slide03";
import Slide04 from "@/components/deck/slides/Slide04";
import Slide05 from "@/components/deck/slides/Slide05";
import Slide06 from "@/components/deck/slides/Slide06";
import Slide07 from "@/components/deck/slides/Slide07";
import Slide08 from "@/components/deck/slides/Slide08";
import Slide09 from "@/components/deck/slides/Slide09";
import Slide10 from "@/components/deck/slides/Slide10";
import Slide11 from "@/components/deck/slides/Slide11";
import Slide12 from "@/components/deck/slides/Slide12";
import Slide13 from "@/components/deck/slides/Slide13";
import Slide14 from "@/components/deck/slides/Slide14";
import SlideAppendix from "@/components/deck/slides/SlideAppendix";

import { deck } from "@/data/decks/sospp";

const DECKS = { [deck.slug]: deck } as const;

export function generateStaticParams() {
  return Object.keys(DECKS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = DECKS[slug as keyof typeof DECKS];
  if (!d) return { title: "Не найдено" };

  return {
    title: d.title,
    description: d.subtitle,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function DeckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = DECKS[slug as keyof typeof DECKS];
  if (!d) notFound();

  const total = d.totalSlides;

  return (
    <DeckShell total={total}>
      <Slide01 total={total} />
      <Slide02 total={total} />
      <Slide03 total={total} />
      <Slide04 total={total} />
      <Slide05 total={total} />
      <Slide06 total={total} />
      <Slide07 total={total} />
      <Slide08 total={total} />
      <Slide09 total={total} />
      <Slide10 total={total} />
      <Slide11 total={total} />
      <Slide12 total={total} />
      <Slide13 total={total} />
      <Slide14 total={total} />
      <SlideAppendix index={15} total={total} />
    </DeckShell>
  );
}
