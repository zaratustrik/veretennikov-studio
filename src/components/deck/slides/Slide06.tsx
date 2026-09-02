import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s06;

/**
 * The photograph is itself a split composition — management on the left,
 * production on the right — so it runs as a band across the top and the
 * two blocks sit under their own halves. The enterprise contour is
 * given roughly two thirds of the width — it is the offer; the Union's
 * own apparatus is a further application of the same competence. The
 * proportion is compositional and is deliberately not stated as a
 * number: it was never a split of resources.
 */
export default function Slide06({ total }: { total: number }) {
  return (
    <Slide index={6} total={total} tone="sheet" label={s.title} bare>
      <div className="flex h-full min-h-[100dvh] w-full flex-col">
        <DeckImage
          src="/deck/sospp/two-contours.png"
          alt="Слева — управленческая команда с данными, справа — инженеры на производстве; две половины связаны"
          objectPosition="center 45%"
          sizes="100vw"
          className="relative h-[26vh] w-full shrink-0 md:h-[30vh]"
        />

        <div className="flex flex-1 flex-col justify-center px-[6vw] py-[4vh]">
          <Reveal>
            <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h-sm mt-3 max-w-[26ch]">{s.title}</h2>
          </Reveal>

          <div className="mt-6 grid grid-cols-12 gap-x-6 gap-y-7">
            {/* Основной контур — предприятия */}
            <div className="col-span-12 md:col-span-7">
              <Reveal delay={0.12}>
                <div className="deck-hairline border-t pt-4">
                  <p className="deck-eyebrow deck-accent">{s.main.tag}</p>
                  <h3 className="deck-h-sm mt-2 max-w-[24ch]">{s.main.name}</h3>
                  <p className="deck-body deck-secondary mt-2 max-w-[46ch]">
                    {s.main.lead}
                  </p>
                </div>
              </Reveal>
              <Stagger className="mt-4 grid grid-cols-1 gap-x-6 gap-y-[6px] sm:grid-cols-2">
                {s.main.items.map((it) => (
                  <StaggerItem key={it}>
                    <p className="deck-body flex max-w-[36ch] gap-3">
                      <span aria-hidden className="deck-secondary select-none opacity-45">
                        —
                      </span>
                      <span>{it}</span>
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* Дополнительный контур — аппарат Союза */}
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <Reveal delay={0.18}>
                <div className="deck-hairline-soft border-t pt-4">
                  <p className="deck-eyebrow deck-secondary">{s.side.tag}</p>
                  <h3 className="mt-2 max-w-[22ch] text-[16px] font-medium leading-snug">
                    {s.side.name}
                  </h3>
                  <p className="deck-body deck-secondary mt-2 max-w-[38ch]">
                    {s.side.lead}
                  </p>
                </div>
              </Reveal>
              <Stagger className="mt-4 flex flex-col gap-[6px]">
                {s.side.items.map((it) => (
                  <StaggerItem key={it}>
                    <p className="deck-body deck-secondary max-w-[38ch]">{it}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <Reveal delay={0.26}>
            <p className="deck-body deck-secondary deck-hairline mt-6 max-w-[62ch] border-t pt-5">
              {s.kicker}
            </p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
