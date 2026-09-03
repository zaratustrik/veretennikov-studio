import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s13;

export default function Slide13({ total }: { total: number }) {
  return (
    <Slide index={13} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12 md:col-span-5">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-6 max-w-[12ch]">{s.title}</h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <Stagger className="flex flex-col">
          {s.questions.map((q) => (
            <StaggerItem key={q.n}>
              <div className="deck-hairline flex gap-6 border-t py-6">
                <span className="deck-ring deck-rubric deck-accent mt-[2px] shrink-0">
                  {q.n}
                </span>
                <p className="deck-h-sm max-w-[34ch]">{q.t}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12">
        <Reveal delay={0.3}>
          <p className="deck-lead deck-hairline mt-6 max-w-[58ch] border-t pt-7">
            {s.kicker}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12 mt-8 flex flex-wrap justify-between gap-4">
        <Reveal delay={0.38}>
          <p className="deck-eyebrow deck-secondary">{deck.footer.left}</p>
        </Reveal>
        <Reveal delay={0.42}>
          <p className="deck-eyebrow deck-secondary">{deck.footer.right}</p>
        </Reveal>
      </div>
    </Slide>
  );
}
