import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s13;

/**
 * The slide carries four blocks — when to step in, the route, the
 * principle and what the ninety days test — so the photograph is
 * narrowed to a third and the text runs in two columns underneath a
 * shared headline. The route is a plain flow of steps, not a diagram:
 * it is read once and does not need drawing.
 */
export default function Slide13({ total }: { total: number }) {
  return (
    <Slide index={13} total={total} tone="sheet" label={s.title} bare>
      <div className="grid h-full min-h-[100dvh] w-full grid-cols-12">
        <div className="col-span-12 flex flex-col justify-center px-[6vw] py-[2vh] md:col-span-8 md:pr-[3vw]">
          <Reveal>
            <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="deck-eyebrow deck-accent mt-2">{s.kicker}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="deck-h-sm mt-2 max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.3rem)]">
              {s.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-body deck-secondary mt-[6px] max-w-[64ch]">{s.lead}</p>
          </Reveal>

          <div className="mt-2 grid grid-cols-12 gap-x-7 gap-y-3">
            {/* Когда подключаться */}
            <div className="col-span-12 lg:col-span-7">
              <Reveal delay={0.16}>
                <p className="deck-eyebrow deck-secondary deck-hairline border-t pt-2">
                  {s.whenTitle}
                </p>
              </Reveal>
              <Stagger className="mt-2 flex flex-col gap-[5px]">
                {s.when.map((w) => (
                  <StaggerItem key={w.n}>
                    <div className="flex gap-4">
                      <span className="deck-rubric deck-secondary shrink-0 pt-[2px] tabular-nums opacity-55">
                        {w.n}
                      </span>
                      <div>
                        <h3 className="text-[14.5px] font-medium leading-snug">{w.h}</h3>
                        <p className="deck-body deck-secondary mt-[2px] max-w-[52ch]">
                          {w.t}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* Что проверяем за 90 дней */}
            <div className="col-span-12 lg:col-span-5">
              <Reveal delay={0.2}>
                <p className="deck-eyebrow deck-accent deck-hairline border-t pt-2">
                  {s.checkTitle}
                </p>
              </Reveal>
              <Stagger className="mt-2 flex flex-col gap-[5px]">
                {s.checks.map((c) => (
                  <StaggerItem key={c.h}>
                    <div>
                      <h3 className="text-[14.5px] font-medium leading-snug">{c.h}</h3>
                      <p className="deck-body deck-secondary mt-[2px] max-w-[40ch]">
                        {c.t}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          {/* Маршрут */}
          <div className="mt-[6px]">
            <Reveal delay={0.22}>
              <p className="deck-eyebrow deck-secondary deck-hairline border-t pt-2">
                {s.routeTitle}
              </p>
            </Reveal>
            <Stagger className="mt-[6px] flex flex-wrap items-center gap-x-2 gap-y-0">
              {s.route.map((step, i) => (
                <StaggerItem key={step}>
                  <span className="flex items-center gap-2">
                    <span className="deck-body">{step}</span>
                    {i < s.route.length - 1 && (
                      <span aria-hidden className="deck-secondary opacity-40">
                        →
                      </span>
                    )}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Принцип и итог — в одну строку, иначе экран не помещается
              на ноутбуке 1366×768 */}
          <div className="deck-hairline mt-[6px] grid grid-cols-12 gap-x-7 gap-y-1 border-t pt-[6px]">
            <div className="col-span-12 lg:col-span-7">
              <Reveal delay={0.26}>
                <p className="deck-h-sm max-w-[48ch]">{s.principle}</p>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:self-start lg:pt-[3px]">
              <Reveal delay={0.28}>
                <p className="deck-body deck-secondary max-w-[42ch]">{s.closing}</p>
              </Reveal>
            </div>
          </div>
        </div>

        <DeckImage
          src="/deck/sospp/pilot.png"
          alt="Небольшая группа за столом разбирает конкретные ситуации и выстраивает маршрут"
          objectPosition="44% 52%"
          sizes="(max-width: 768px) 100vw, 34vw"
          className="relative col-span-12 h-[30vh] md:col-span-4 md:h-full"
        />
      </div>
    </Slide>
  );
}
