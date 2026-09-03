import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s02;

export default function Slide02({ total }: { total: number }) {
  return (
    <Slide index={2} total={total} tone="sheet" label={s.title}>
      <div aria-hidden className="deck-diag" />
      <div className="col-span-12 md:col-span-5">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[13ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-7 max-w-[40ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <Stagger className="grid grid-cols-2 gap-x-8 gap-y-6">
          {s.facts.map((f) => (
            <StaggerItem key={f.n}>
              <div className="deck-hairline border-t pt-4">
                <p className="deck-num deck-brass">{f.n}</p>
                <p className="deck-eyebrow mt-2">{f.h}</p>
                <p className="deck-body deck-secondary mt-3 max-w-[32ch]">{f.t}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <div className="deck-accent-rule mt-8 border-l-2 pl-6">
            <p className="deck-eyebrow deck-accent">{s.irr.h}</p>
            <p className="deck-body deck-secondary mt-3 max-w-[62ch]">{s.irr.t}</p>
          </div>
        </Reveal>
      </div>

      <div className="col-span-12">
        <Reveal delay={0.26}>
          <p className="deck-h-sm deck-hairline mt-2 max-w-[52ch] border-t pt-7">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
