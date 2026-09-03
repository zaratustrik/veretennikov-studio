import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/utpp";

const s = deck.s10;

export default function Slide10({ total }: { total: number }) {
  return (
    <Slide index={10} total={total} tone="graphite" label={s.title} tight>
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-4 max-w-[18ch]">{s.title}</h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
        <Reveal delay={0.1}>
          <p className="deck-lead deck-secondary max-w-[40ch]">{s.lead}</p>
        </Reveal>
      </div>

      {/* Поток данных проходит через классы допуска и расходится
          по разным контурам хранения. Схема, а не иллюстрация. */}
      <div className="col-span-12">
        <Reveal delay={0.14}>
          <DeckImage
            src="/deck/utpp/10-data-zones.webp"
            alt="Поток данных, проходящий через классы допуска к разным контурам хранения"
            className="deck-plate relative h-[17vh] w-full min-h-[120px]"
            objectPosition="center 42%"
            sizes="100vw"
          />
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-5">
        <Stagger className="deck-hairline flex flex-col border-t">
          {s.scope.map((t) => (
            <StaggerItem key={t}>
              <p className="deck-hairline-soft deck-body border-b py-[8px]">
                {t}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="col-span-12 grid grid-cols-1 gap-x-10 gap-y-5 md:col-span-6 md:col-start-7 md:grid-cols-2">
        {s.split.map((b, i) => (
          <Reveal key={b.h} delay={0.24 + i * 0.07}>
            <div
              className={`border-t pt-4 ${
                i === 0 ? "deck-accent-rule" : "deck-hairline"
              }`}
            >
              <p
                className={`deck-eyebrow ${
                  i === 0 ? "deck-accent" : "deck-secondary"
                }`}
              >
                {b.h}
              </p>
              <p className="deck-body deck-secondary mt-3 max-w-[44ch]">
                {b.t}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="col-span-12 md:col-span-9">
        <Reveal delay={0.38}>
          <p className="deck-h-sm deck-hairline mt-1 max-w-[62ch] border-t pt-6">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
