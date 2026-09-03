import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/utpp";

const s = deck.s08;

export default function Slide08({ total }: { total: number }) {
  return (
    <Slide index={8} total={total} tone="sheet" label={s.title} bare>
      <div className="flex w-full flex-1 flex-col md:flex-row">
        <div className="relative h-[26vh] w-full shrink-0 md:h-auto md:w-[38%]">
          <DeckImage
            src="/deck/utpp/08-executive-questions.webp"
            alt="Руководитель за столом решений, вокруг — круги открытых вопросов"
            className="absolute inset-0"
            objectPosition="46% center"
            sizes="(max-width: 768px) 100vw, 38vw"
          />
        </div>

        <div className="flex w-full flex-col justify-center px-[6vw] py-[7vh] md:w-[62%] md:px-[4vw] md:py-[6vh]">
          <Reveal>
            <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h mt-4 max-w-[16ch]">{s.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-lead deck-secondary mt-5 max-w-[44ch]">
              {s.lead}
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <Reveal delay={0.16}>
                <p className="deck-eyebrow deck-secondary">{s.specialist.h}</p>
              </Reveal>
              <Stagger className="mt-3 flex flex-col">
                {s.specialist.items.map((t) => (
                  <StaggerItem key={t}>
                    <p className="deck-hairline-soft deck-body deck-secondary border-t py-[9px] opacity-70">
                      {t}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="sm:col-span-7">
              <Reveal delay={0.22}>
                <p className="deck-eyebrow deck-accent">{s.executive.h}</p>
              </Reveal>
              <Stagger className="mt-3 flex flex-col">
                {s.executive.items.map((t) => (
                  <StaggerItem key={t}>
                    <p className="deck-accent-rule deck-body border-t py-[9px]">
                      {t}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <Reveal delay={0.3}>
            <p className="deck-body deck-secondary deck-hairline mt-7 max-w-[70ch] border-t pt-5">
              {s.observation}
            </p>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="deck-h-sm mt-5 max-w-[58ch]">{s.kicker}</p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
