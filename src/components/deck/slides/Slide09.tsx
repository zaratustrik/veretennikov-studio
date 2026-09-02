import Reveal from "@/components/motion/Reveal";
import Slide from "../Slide";
import LevelsDiagram from "../LevelsDiagram";
import { deck } from "@/data/decks/sospp";

const s = deck.s09;

/**
 * A pure schema, no photograph. The hierarchy is the message: the Union
 * is not one node among vendors — it sits above the case.
 */
export default function Slide09({ total }: { total: number }) {
  return (
    <Slide index={9} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12 md:col-span-4">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[11ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-body deck-secondary mt-6 max-w-[38ch]">{s.lead}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="deck-h-sm deck-hairline mt-8 max-w-[26ch] border-t pt-6">
            {s.kicker}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-7 md:col-start-6 md:self-center">
        <LevelsDiagram
          l1={s.l1}
          l1note={s.l1note}
          l2={s.l2}
          l2note={s.l2note}
          ring={s.ring}
        />
      </div>
    </Slide>
  );
}
