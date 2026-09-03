import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s12;

export default function Slide12({ total }: { total: number }) {
  return (
    <Slide index={12} total={total} tone="sheet-2" label={s.title}>
      <div aria-hidden className="deck-diag" />
      <div className="col-span-12 md:col-span-8">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[24ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-6 max-w-[46ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12 mt-6">
        <Stagger className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-4">
          {s.steps.map((st, i) => (
            <StaggerItem key={st.n}>
              <div
                className={`flex h-full flex-col border-t pt-5 ${
                  i === 0 ? "deck-accent-rule" : "deck-hairline"
                }`}
              >
                <span
                  className={`deck-ring deck-rubric ${
                    i === 0 ? "deck-accent" : "deck-brass"
                  }`}
                >
                  {st.n}
                </span>
                <h3 className="deck-h-sm mt-4 max-w-[16ch]">{st.h}</h3>
                <p className="deck-body deck-secondary mt-4 max-w-[34ch]">
                  {st.t}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12 md:col-span-8">
        <Reveal delay={0.34}>
          <p className="deck-h-sm deck-hairline mt-4 max-w-[52ch] border-t pt-7">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
