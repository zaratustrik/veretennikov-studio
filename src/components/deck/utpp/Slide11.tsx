import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s11;

export default function Slide11({ total }: { total: number }) {
  return (
    <Slide index={11} total={total} tone="sheet" label={s.title}>
      <div className="col-span-12 md:col-span-4">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[14ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-6 max-w-[36ch]">{s.lead}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="deck-hairline mt-10 border-t pt-5">
            <p className="deck-eyebrow deck-secondary">{s.limits.h}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {s.limits.items.map((t) => (
                <li key={t} className="deck-body deck-secondary max-w-[38ch]">
                  <span aria-hidden className="mr-2 opacity-40">—</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-7 md:col-start-6">
        <Stagger className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          {s.can.map((c) => (
            <StaggerItem key={c.n}>
              <div className="deck-hairline border-t pt-4">
                <span className="deck-rubric deck-brass tabular-nums">
                  {c.n}
                </span>
                <h3 className="deck-h-sm mt-3 max-w-[20ch]">{c.h}</h3>
                <p className="deck-body deck-secondary mt-3 max-w-[36ch]">{c.t}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Slide>
  );
}
