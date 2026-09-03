import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s09;

export default function Slide09({ total }: { total: number }) {
  return (
    <Slide index={9} total={total} tone="sheet-2" label={s.title} tight>
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[20ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-6 max-w-[50ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12 mt-4 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
        <div>
          <Reveal delay={0.16}>
            <p className="deck-eyebrow deck-secondary">{s.has.h}</p>
          </Reveal>
          <Stagger className="mt-4 flex flex-col">
            {s.has.items.map((t) => (
              <StaggerItem key={t}>
                <p className="deck-hairline deck-body border-t py-3">{t}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div>
          <Reveal delay={0.22}>
            <p className="deck-eyebrow deck-accent">{s.adds.h}</p>
          </Reveal>
          <Stagger className="mt-4 flex flex-col">
            {s.adds.items.map((t) => (
              <StaggerItem key={t}>
                <p className="deck-accent-rule deck-body border-t py-3">{t}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <div className="col-span-12 md:col-span-8">
        <Reveal delay={0.32}>
          <p className="deck-h-sm deck-hairline mt-1 max-w-[54ch] border-t pt-5">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
