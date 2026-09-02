import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s10;

/**
 * Editorial spread: the conversation on the left, the director's question
 * and what he gets for it on the right. The last of the permitted answers
 * is the one that proves the independence, so it carries the copper.
 */
export default function Slide10({ total }: { total: number }) {
  return (
    <Slide index={10} total={total} tone="sheet" label={s.title} bare>
      <div className="grid h-full min-h-[100dvh] w-full grid-cols-12">
        <div className="col-span-12 flex flex-col justify-center px-[6vw] py-[7vh] md:col-span-7 md:pr-[3vw]">
          <Reveal>
            <p className="deck-eyebrow deck-accent">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h-sm mt-4 max-w-[28ch] text-[clamp(1.6rem,2.8vw,2.5rem)]">
              {s.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-body deck-secondary mt-4 max-w-[58ch]">{s.situation}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="deck-h-sm deck-hairline mt-5 max-w-[30ch] border-l-2 pl-5">
              {s.question}
            </p>
          </Reveal>

          <div className="mt-7 grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 sm:col-span-7">
              <Reveal delay={0.2}>
                <p className="deck-eyebrow deck-secondary">Что проверяем</p>
              </Reveal>
              <Stagger className="mt-3 flex flex-col gap-[6px]">
                {s.checks.map((c) => (
                  <StaggerItem key={c}>
                    <p className="deck-body flex max-w-[44ch] gap-3">
                      <span aria-hidden className="deck-secondary select-none opacity-45">
                        —
                      </span>
                      <span>{c}</span>
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="col-span-12 sm:col-span-5">
              <Reveal delay={0.24}>
                <p className="deck-eyebrow deck-secondary">Допустимые ответы</p>
              </Reveal>
              <Stagger className="mt-3 flex flex-col gap-[5px]">
                {s.answers.map((a, i) => (
                  <StaggerItem key={a}>
                    <p
                      className={
                        i === s.answers.length - 1
                          ? "deck-lead deck-accent font-medium"
                          : "deck-body deck-secondary"
                      }
                    >
                      {a}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.28}>
                <p className="deck-body deck-secondary deck-hairline mt-4 max-w-[40ch] border-t pt-4">
                  {s.proof}
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.32}>
            <p className="deck-secondary deck-hairline-soft mt-6 max-w-[70ch] border-t pt-3 text-[12px] leading-relaxed opacity-60">
              {s.commercial}
            </p>
          </Reveal>
        </div>

        <DeckImage
          src="/deck/sospp/review.png"
          alt="Директор и независимый советник обсуждают чертежи и расчёты перед решением"
          objectPosition="42% center"
          sizes="(max-width: 768px) 100vw, 42vw"
          className="relative col-span-12 h-[34vh] md:col-span-5 md:h-full"
        />
      </div>
    </Slide>
  );
}
