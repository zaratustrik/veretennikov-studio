import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s02;

/**
 * A split rather than a full bleed: three factors with consequences is
 * six blocks of text, and text over faces fails the television test.
 * The photograph keeps full height on the left; the argument sits on a
 * solid graphite field where it stays legible from across a room.
 */
export default function Slide02({ total }: { total: number }) {
  return (
    <Slide index={2} total={total} tone="graphite" label={s.title} bare>
      <div className="grid h-full min-h-[100dvh] w-full grid-cols-12">
        <DeckImage
          src="/deck/sospp/cost-of-error.png"
          alt="Руководители предприятия обсуждают инвестиционное решение; за стеклом — производственный цех"
          objectPosition="46% 44%"
          sizes="(max-width: 768px) 100vw, 44vw"
          priority
          className="relative col-span-12 h-[32vh] md:col-span-5 md:h-full"
        />

        <div className="col-span-12 flex flex-col justify-center px-[6vw] py-[4.5vh] md:col-span-7 md:pl-[3.5vw]">
          <Reveal>
            <p className="deck-eyebrow deck-accent">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h mt-3 max-w-[17ch]">{s.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-lead deck-secondary mt-3 max-w-[46ch]">{s.lead}</p>
          </Reveal>

          <Stagger className="deck-hairline mt-4 flex flex-col border-t">
            {s.factors.map((f) => (
              <StaggerItem key={f.n}>
                <div className="deck-hairline-soft grid grid-cols-12 gap-x-5 border-b py-[8px]">
                  <span className="deck-rubric deck-secondary col-span-2 tabular-nums opacity-55 sm:col-span-1">
                    {f.n}
                  </span>
                  <div className="col-span-10 sm:col-span-5">
                    <h3 className="text-[15px] font-medium leading-snug">{f.h}</h3>
                    <p className="deck-body deck-secondary mt-1 max-w-[34ch] opacity-70">
                      {f.t}
                    </p>
                    {f.src && (
                      <p className="deck-secondary mt-1 font-mono text-[10px] uppercase leading-tight tracking-[0.12em] opacity-45">
                        {f.src}
                      </p>
                    )}
                  </div>
                  <p className="deck-body col-span-12 max-w-[38ch] sm:col-span-6 sm:self-center">
                    {f.c}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.26}>
            <p className="deck-h-sm mt-4 max-w-[42ch]">{s.kicker}</p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
