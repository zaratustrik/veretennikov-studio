import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import Detail from "../Detail";
import { deck } from "@/data/decks/utpp";

const s = deck.appendix;

export default function SlideAppendix({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  return (
    <Slide
      index={index}
      total={total}
      tone="sheet-2"
      label={s.title}
      counterLabel="ИСТОЧНИКИ"
      tight
    >
      <div className="col-span-12 md:col-span-3">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h-sm mt-4 max-w-[14ch] text-[clamp(1.5rem,2.4vw,2rem)]">
            {s.title}
          </h2>
        </Reveal>
        <Stagger className="mt-5 flex flex-col gap-3">
          {s.method.map((m) => (
            <StaggerItem key={m}>
              <p className="deck-body deck-secondary max-w-[40ch] text-[0.82em] leading-relaxed">
                {m}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-6">
          <Detail title={s.open.title} body={s.open.items.join(" ")} />
          <Detail title={s.excluded.title} body={s.excluded.items.join(" ")} />
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 md:col-start-5">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">Источники</p>
        </Reveal>
        <Stagger className="deck-hairline mt-3 grid grid-cols-1 border-t md:grid-cols-2 md:gap-x-10">
          {s.sources.map((src) => (
            <StaggerItem key={src.c}>
              <div className="deck-hairline-soft border-b py-[7px]">
                <p className="deck-body text-[0.82em] leading-snug">{src.c}</p>
                <p className="deck-body deck-secondary text-[0.76em] leading-snug opacity-75">
                  {src.s}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Slide>
  );
}
