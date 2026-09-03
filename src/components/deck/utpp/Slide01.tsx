import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/utpp";

const s = deck.s01;

export default function Slide01({ total }: { total: number }) {
  return (
    <Slide
      index={1}
      total={total}
      tone="graphite"
      label={s.title}
      bare
      counterOnLight
    >
      <DeckImage
        src="/deck/utpp/01-discussion-to-measure.webp"
        alt="Обсуждение за столом, сходящееся в измерительный прибор"
        className="deck-bleed absolute inset-0"
        objectPosition="62% center"
        scrim="left"
        sizes="100vw"
        priority
      />

      <div className="relative z-10 grid w-full grid-cols-12 gap-x-6 gap-y-8 px-[6vw] py-[11vh] md:py-[9vh]">
        <div className="col-span-12 md:col-span-6">
          <Reveal>
            <p className="deck-eyebrow deck-accent">{deck.meetingLabel}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="deck-h mt-7 max-w-[15ch]">{s.title}</h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="deck-lead mt-8 max-w-[44ch] opacity-90">{s.lead}</p>
          </Reveal>

          <Stagger className="mt-10 flex flex-col">
            {s.notes.map((r) => (
              <StaggerItem key={r.n}>
                <div className="deck-hairline-soft flex gap-5 border-t py-[10px]">
                  <span className="deck-rubric deck-brass pt-[3px] tabular-nums">
                    {r.n}
                  </span>
                  <p className="deck-body max-w-[46ch] opacity-80">{r.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.28}>
            <p className="deck-h-sm deck-accent-rule mt-9 max-w-[40ch] border-l-2 pl-6">
              {s.kicker}
            </p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
