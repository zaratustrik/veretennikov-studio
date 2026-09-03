import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s04;

export default function Slide04({ total }: { total: number }) {
  return (
    <Slide index={4} total={total} tone="sheet-2" label={s.title} tight>
      <div aria-hidden className="deck-diag" />
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[16ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-7 max-w-[48ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12 mt-6">
        <Stagger className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
          {s.loops.map((l) => (
            <StaggerItem key={l.n}>
              <div className="deck-hairline flex h-full flex-col border-t pt-5">
                <span className="deck-ring deck-brass deck-rubric">{l.n}</span>
                <h3 className="deck-h-sm mt-4 max-w-[16ch]">{l.h}</h3>
                <p className="deck-body deck-secondary mt-4 max-w-[36ch]">{l.t}</p>
                <p className="deck-eyebrow deck-accent mt-auto pt-6">{l.m}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12 md:col-span-8">
        <Reveal delay={0.3}>
          <p className="deck-h-sm deck-hairline mt-4 max-w-[46ch] border-t pt-7">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
