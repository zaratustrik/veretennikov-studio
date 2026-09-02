import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import Detail from "../Detail";
import { deck } from "@/data/decks/sospp";

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
      <div className="col-span-12 md:col-span-4">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h-sm mt-4 max-w-[14ch] text-[clamp(1.7rem,2.8vw,2.4rem)]">
            {s.title}
          </h2>
        </Reveal>
        <Stagger className="mt-4 flex flex-col gap-2">
          {s.method.map((m) => (
            <StaggerItem key={m}>
              <p className="deck-body deck-secondary max-w-[42ch]">{m}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12 md:col-span-7 md:col-start-6">
        <Stagger className="deck-hairline border-t">
          {s.sources.map((src) => (
            <StaggerItem key={src.c}>
              <div className="deck-hairline-soft grid grid-cols-12 gap-x-4 border-b py-[6px]">
                <span className="deck-body col-span-12 sm:col-span-5">{src.c}</span>
                <span className="deck-body deck-secondary col-span-12 opacity-75 sm:col-span-7">
                  {src.s}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-4">
          <Detail title={s.excluded.title} body={s.excluded.items.join(" ")} />
        </div>
      </div>
    </Slide>
  );
}
