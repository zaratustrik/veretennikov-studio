import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import { deck } from "@/data/decks/utpp";

const s = deck.s06;

function Chain({ steps }: { steps: readonly string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span className="deck-eyebrow tracking-[0.1em] normal-case">
            {step}
          </span>
          {i < steps.length - 1 && (
            <span aria-hidden className="deck-secondary text-[11px] opacity-45">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Slide06({ total }: { total: number }) {
  return (
    <Slide index={6} total={total} tone="sheet-2" label={s.title} tight>
      <div className="col-span-12 md:col-span-8">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[18ch]">{s.title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="deck-lead deck-secondary mt-6 max-w-[52ch]">{s.lead}</p>
        </Reveal>
      </div>

      <div className="col-span-12 mt-4 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {s.cases.map((c, i) => (
          <Reveal key={c.tag} delay={0.16 + i * 0.08}>
            <div className="deck-hairline border-t pt-5">
              <div className="flex items-baseline gap-4">
                <span className="deck-num deck-brass">{c.tag}</span>
                <h3 className="deck-h-sm max-w-[18ch]">{c.h}</h3>
              </div>

              <Chain steps={c.chain} />

              <p className="deck-body deck-secondary mt-3 max-w-[46ch]">
                {c.note}
              </p>

              <p className="deck-eyebrow deck-secondary mt-5">Что измеряем</p>
              <Stagger className="mt-3 flex flex-col">
                {c.metrics.map((m) => (
                  <StaggerItem key={m}>
                    <p className="deck-hairline-soft deck-body border-t py-[6px]">
                      {m}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="col-span-12 md:col-span-9">
        <Reveal delay={0.34}>
          <p className="deck-h-sm deck-hairline mt-1 max-w-[62ch] border-t pt-5">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
