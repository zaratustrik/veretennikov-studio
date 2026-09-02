import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/sospp";

const s = deck.s12;

export default function Slide12({ total }: { total: number }) {
  return (
    <Slide index={12} total={total} tone="sheet-2" label={s.title}>
      <div className="col-span-12 md:col-span-3">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[9ch]">{s.title}</h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-9">
        <Stagger className="deck-hairline grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it) => (
            <StaggerItem key={it.n}>
              <div className="deck-hairline-soft h-full border-b border-r px-5 py-4">
                <span className="deck-rubric deck-accent block tabular-nums">{it.n}</span>
                <h3 className="mt-2 text-[15px] font-medium leading-snug">{it.h}</h3>
                <p className="deck-body deck-secondary mt-1 max-w-[34ch]">{it.t}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Two data contours — the answer to «кто увидит наши цифры» */}
      <div className="col-span-12 md:col-span-9 md:col-start-4">
        <Reveal delay={0.2}>
          <div className="deck-hairline border-t pt-4">
            <p className="deck-eyebrow deck-accent">{s.dataTitle}</p>
            <p className="deck-lead mt-2 max-w-[56ch]">{s.dataLead}</p>
          </div>
        </Reveal>

        <div className="mt-4 grid grid-cols-12 gap-x-6 gap-y-4">
          {[s.dataEnterprise, s.dataUnion].map((c, i) => (
            <div
              key={c.h}
              className={i === 0 ? "col-span-12 sm:col-span-6" : "col-span-12 sm:col-span-6"}
            >
              <Reveal delay={0.24 + i * 0.05}>
                <p
                  className={
                    i === 1
                      ? "deck-eyebrow deck-accent deck-hairline-soft border-t pt-3"
                      : "deck-eyebrow deck-secondary deck-hairline-soft border-t pt-3"
                  }
                >
                  {c.h}
                </p>
              </Reveal>
              <Stagger className="mt-2 flex flex-col gap-[4px]">
                {c.items.map((it) => (
                  <StaggerItem key={it}>
                    <p
                      className={
                        i === 1
                          ? "deck-body max-w-[38ch]"
                          : "deck-body deck-secondary max-w-[38ch] opacity-70"
                      }
                    >
                      {it}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}
