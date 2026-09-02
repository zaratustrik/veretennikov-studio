import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/sospp";

const s = deck.s14;

/** Typographic close. No photograph, no «спасибо за внимание». */
export default function Slide14({ total }: { total: number }) {
  return (
    <Slide index={14} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12 md:col-span-5">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>

        <Stagger className="mt-6 flex flex-col gap-1">
          {s.negations.map((n) => (
            <StaggerItem key={n}>
              <p className="deck-h-sm deck-secondary opacity-45">
                <span className="strike-deck">{n}</span>
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <h2 className="deck-h mt-8 max-w-[12ch]">{s.title}</h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <Stagger className="deck-hairline flex flex-col border-t">
          {s.decisions.map((dcn) => (
            <StaggerItem key={dcn.n}>
              <div className="deck-hairline-soft flex gap-6 border-b py-6">
                <span className="deck-rubric deck-accent shrink-0 pt-1 tabular-nums">
                  {dcn.n}
                </span>
                <div>
                  <h3 className="deck-h-sm max-w-[24ch]">{dcn.h}</h3>
                  <p className="deck-body deck-secondary mt-2 max-w-[46ch]">{dcn.t}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12 md:col-span-9">
        <Reveal delay={0.3}>
          <p className="deck-h-sm max-w-[46ch]">{s.closing}</p>
        </Reveal>
      </div>

      <div className="col-span-12">
        <div className="deck-hairline-soft mt-4 flex flex-wrap items-baseline justify-between gap-4 border-t pt-5">
          <span className="deck-rubric deck-secondary opacity-70">{s.signature}</span>
          <span className="deck-rubric deck-secondary opacity-70">{deck.footer.left}</span>
        </div>
      </div>
    </Slide>
  );
}
