import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/sospp";

const s = deck.s11;

/**
 * Not a biography slide. Five functions, one readiness line and a short
 * footnote of what already stands behind the proposal.
 */
export default function Slide11({ total }: { total: number }) {
  return (
    <Slide index={11} total={total} tone="graphite" label={s.title}>
      <div className="col-span-12 md:col-span-4">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[12ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="deck-lead deck-hairline mt-8 max-w-[38ch] border-t pt-6">
            {s.readiness}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-7 md:col-start-6">
        <Stagger className="deck-hairline flex flex-col border-t">
          {s.items.map((it) => (
            <StaggerItem key={it.n}>
              <div className="deck-hairline-soft grid grid-cols-12 gap-x-5 border-b py-4">
                <span className="deck-rubric deck-secondary col-span-2 tabular-nums opacity-60 sm:col-span-1">
                  {it.n}
                </span>
                <h3 className="col-span-10 text-[15px] font-medium leading-snug sm:col-span-4">
                  {it.h}
                </h3>
                <p className="deck-body deck-secondary col-span-12 sm:col-span-7">
                  {it.t}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.28}>
          <p className="deck-body deck-secondary mt-5 max-w-[70ch] opacity-70">
            {s.basis}
          </p>
        </Reveal>
      </div>

      {/* Честная граница компетенции: производственную экспертизу мы не
          подменяем, а добираем под конкретный кейс. */}
      <div className="col-span-12">
        <Reveal delay={0.32}>
          <div className="deck-hairline grid grid-cols-12 gap-x-6 gap-y-2 border-t pt-4">
            <p className="deck-eyebrow deck-accent col-span-12 md:col-span-3">
              {s.expertiseTitle}
            </p>
            <p className="deck-body deck-secondary col-span-12 max-w-[88ch] md:col-span-9">
              {s.expertise}
            </p>
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}
