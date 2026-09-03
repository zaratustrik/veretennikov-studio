import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/utpp";

const s = deck.s03;

function Column({
  h,
  items,
  accent = false,
  delay = 0,
}: {
  h: string;
  items: readonly string[];
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div>
      <Reveal delay={delay}>
        <p
          className={`deck-eyebrow ${accent ? "deck-accent" : "deck-secondary"}`}
        >
          {h}
        </p>
      </Reveal>
      <Stagger className="mt-4 flex flex-col">
        {items.map((t) => (
          <StaggerItem key={t}>
            <p
              className={`deck-body border-t py-[10px] ${
                accent
                  ? "deck-accent-rule"
                  : "deck-hairline-soft deck-secondary"
              }`}
            >
              {t}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export default function Slide03({ total }: { total: number }) {
  return (
    <Slide index={3} total={total} tone="graphite" label={s.title} tight>
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-4 max-w-[20ch]">{s.title}</h2>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
        <Reveal delay={0.1}>
          <p className="deck-body deck-secondary max-w-[42ch]">{s.lead}</p>
        </Reveal>
      </div>

      {/* Диптих: слева бумажный оборот, справа связанное знание.
          Стоит ровно там, где текст расходится на две колонки. */}
      <div className="col-span-12">
        <Reveal delay={0.1}>
          <DeckImage
            src="/deck/utpp/03-form-to-content.webp"
            alt="Слева бумажный архив и формы, справа связанная сеть знания"
            className="deck-plate relative h-[19.5vh] w-full min-h-[140px]"
            objectPosition="center 44%"
            sizes="100vw"
          />
        </Reveal>
      </div>

      <div className="col-span-12 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        <Column h={s.before.h} items={s.before.items} delay={0.18} />
        <Column h={s.after.h} items={s.after.items} accent delay={0.24} />
      </div>

      <div className="col-span-12 md:col-span-8">
        <Reveal delay={0.3}>
          <p className="deck-h-sm deck-hairline mt-1 max-w-[50ch] border-t pt-6">
            {s.kicker}
          </p>
        </Reveal>
      </div>

      <div className="col-span-12 md:col-span-3 md:col-start-10 md:self-end">
        <Reveal delay={0.36}>
          <p className="deck-body deck-secondary max-w-[36ch] opacity-80">
            {s.context}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
