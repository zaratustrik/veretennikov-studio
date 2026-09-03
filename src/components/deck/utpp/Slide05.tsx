import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/utpp";

const s = deck.s05;

export default function Slide05({ total }: { total: number }) {
  return (
    <Slide index={5} total={total} tone="sheet" label={s.title} bare>
      <div className="flex w-full flex-1 flex-col md:flex-row">
        {/* Потоки входят слева и сходятся на одном селекторе.
            Кадр держит левый край без полей — как разворот. */}
        <div className="relative h-[26vh] w-full shrink-0 md:h-auto md:w-[36%]">
          <DeckImage
            src="/deck/utpp/05-choose-one-process.webp"
            alt="Несколько потоков работы, сходящихся на одном селекторе"
            className="absolute inset-0"
            objectPosition="72% center"
            sizes="(max-width: 768px) 100vw, 36vw"
          />
        </div>

        <div className="flex w-full flex-col justify-center px-[6vw] py-[7vh] md:w-[64%] md:px-[4vw] md:py-[3.5vh]">
          <Reveal>
            <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h mt-4 max-w-[17ch]">{s.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-lead deck-secondary mt-4 max-w-[56ch]">
              {s.lead}
            </p>
          </Reveal>

          <Stagger className="mt-5 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
            {s.candidates.map((c) => (
              <StaggerItem key={c.n}>
                <div className="deck-hairline flex gap-4 border-t py-2">
                  <span className="deck-rubric deck-brass pt-[3px] tabular-nums">
                    {c.n}
                  </span>
                  <div>
                    <p className="deck-h-sm max-w-[24ch]">{c.h}</p>
                    <p className="deck-body deck-secondary mt-1 max-w-[34ch]">
                      {c.t}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.24}>
            <div className="mt-5">
              <p className="deck-eyebrow deck-secondary">{s.proof.h}</p>
              <div className="deck-hairline mt-3 border-t">
                {s.proof.items.map((p) => (
                  <div
                    key={p.who}
                    className="deck-hairline-soft grid grid-cols-12 gap-x-4 border-b py-[4px]"
                  >
                    <span className="deck-body col-span-12 sm:col-span-4">
                      {p.who}
                    </span>
                    <span className="deck-body deck-secondary col-span-12 sm:col-span-5">
                      {p.what}
                    </span>
                    <span className="deck-body deck-accent col-span-12 sm:col-span-3">
                      {p.res}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="deck-body deck-accent-rule mt-5 max-w-[54ch] border-l-2 pl-5">
              {s.kicker}
            </p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
