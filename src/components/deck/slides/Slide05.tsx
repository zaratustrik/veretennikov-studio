import Reveal from "@/components/motion/Reveal";
import Slide from "../Slide";
import CycleDiagram from "../CycleDiagram";
import { deck } from "@/data/decks/sospp";

const s = deck.s05;

/** Deliberately without a photograph: the deck needs room to breathe here. */
export default function Slide05({ total }: { total: number }) {
  return (
    <Slide index={5} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-6 max-w-[19ch]">{s.title}</h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
        <Reveal delay={0.12}>
          <p className="deck-body deck-secondary max-w-[42ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12">
        <Reveal delay={0.18}>
          <p className="deck-h-sm deck-hairline max-w-[54ch] border-t pt-8">
            {s.conclusion}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12 mt-4">
        <CycleDiagram steps={s.cycle} />
      </div>
    </Slide>
  );
}
