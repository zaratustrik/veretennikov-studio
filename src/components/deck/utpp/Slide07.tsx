import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import Detail from "../Detail";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/utpp";

const s = deck.s07;

export default function Slide07({ total }: { total: number }) {
  return (
    <Slide index={7} total={total} tone="graphite" label={s.title} tight>
      <div className="col-span-12 md:col-span-7">
        <Reveal>
          <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="deck-h mt-5 max-w-[21ch]">{s.title}</h2>
        </Reveal>

        <Stagger className="mt-8 flex flex-col gap-4">
          {s.quotes.map((q) => (
            <StaggerItem key={q}>
              <p className="deck-h-sm deck-accent-rule max-w-[30ch] border-l-2 pl-6">
                «{q}»
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.26}>
          <p className="deck-lead deck-hairline mt-7 max-w-[46ch] border-t pt-5">
            {s.body}
          </p>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-3 max-w-[46ch]">
            <Detail title={s.detail.title} body={s.detail.body} />
          </div>
        </Reveal>
      </div>

      {/* Один вопрос — и веер компетенций, к которым он может вести. */}
      <div className="col-span-12 md:col-span-4 md:col-start-9">
        <Reveal delay={0.16}>
          <DeckImage
            src="/deck/utpp/07-situation-to-expert.webp"
            alt="Вопрос человека, расходящийся стрелками к разным специалистам"
            className="deck-plate relative h-[30vh] w-full min-h-[200px] md:h-[45vh]"
            objectPosition="center 38%"
            sizes="(max-width: 768px) 100vw, 34vw"
          />
        </Reveal>
      </div>

      <div className="col-span-12">
        <Reveal delay={0.38}>
          <p className="deck-h-sm deck-hairline mt-2 max-w-[62ch] border-t pt-6">
            {s.kicker}
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
