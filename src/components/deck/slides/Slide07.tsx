import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/sospp";

const s = deck.s07;

/** Typographic by design: this is the slide the room should remember. */
export default function Slide07({ total }: { total: number }) {
  return (
    <Slide index={7} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h-sm deck-secondary mt-4 max-w-[34ch] text-[clamp(1.1rem,1.6vw,1.4rem)]">
            {s.title}
          </h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-9">
        <Reveal delay={0.1}>
          <p className="deck-h max-w-[26ch] text-[clamp(1.7rem,3.2vw,3rem)] leading-[1.14]">
            {s.statements[0]}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-7 md:col-start-4">
        <Reveal delay={0.16}>
          <p className="deck-lead deck-secondary deck-hairline max-w-[54ch] border-t pt-6">
            {s.statements[1]}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12">
        <Reveal delay={0.2}>
          <p className="deck-eyebrow deck-accent">{s.whyTitle}</p>
        </Reveal>
        <Stagger className="deck-hairline mt-4 grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-4">
          {s.why.map((w) => (
            <StaggerItem key={w.n}>
              <div className="deck-hairline-soft h-full border-r px-5 py-5 first:pl-0">
                <span className="deck-rubric deck-secondary block tabular-nums opacity-60">
                  {w.n}
                </span>
                <p className="deck-body mt-2 max-w-[26ch]">{w.t}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Slide>
  );
}
