import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/sospp";

const s = deck.s01;

export default function Slide01({ total }: { total: number }) {
  return (
    <Slide index={1} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-accent">{deck.meetingLabel}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="deck-h mt-6 max-w-[19ch]">{s.title}</h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-8 max-w-[46ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
        <Stagger className="flex flex-col">
          {s.reasons.map((r) => (
            <StaggerItem key={r.n}>
              <div className="deck-hairline-soft flex gap-5 border-t py-4">
                <span className="deck-rubric deck-secondary pt-[3px] tabular-nums">
                  {r.n}
                </span>
                <p className="deck-body deck-secondary max-w-[38ch]">{r.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12">
        <Reveal delay={0.24}>
          <p className="deck-h-sm deck-hairline mt-2 max-w-[42ch] border-t pt-8">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
