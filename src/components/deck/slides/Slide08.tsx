import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import Detail from "../Detail";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s08;

/**
 * The independence rule is the answer to the Union's sharpest question,
 * so it stays visible on the slide instead of hiding inside the details.
 */
export default function Slide08({ total }: { total: number }) {
  return (
    <Slide index={8} total={total} tone="sheet-2" label={s.title} bare>
      <div className="grid h-full min-h-[100dvh] w-full grid-cols-12">
        <DeckImage
          src="/deck/sospp/on-site.png"
          alt="Независимый советник с планшетом рядом с командой предприятия непосредственно в цехе"
          objectPosition="38% center"
          sizes="(max-width: 768px) 100vw, 46vw"
          className="relative col-span-12 order-1 h-[34vh] md:order-none md:col-span-5 md:h-full"
        />

        <div className="col-span-12 flex flex-col justify-center px-[6vw] py-[3.5vh] md:col-span-7 md:pl-[3vw]">
          <Reveal>
            <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h mt-3 max-w-[14ch]">{s.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-body deck-secondary mt-3 max-w-[52ch]">{s.subtitle}</p>
          </Reveal>

          <Stagger className="deck-hairline mt-4 grid grid-cols-1 border-t sm:grid-cols-3">
            {s.stages.map((st) => (
              <StaggerItem key={st.n}>
                <div className="deck-hairline-soft h-full border-b border-r px-3 py-[7px]">
                  <span className="deck-rubric deck-secondary block tabular-nums opacity-55">
                    {st.n}
                  </span>
                  <span className="deck-body mt-[2px] block leading-snug">{st.h}</span>
                  <span className="deck-secondary mt-[3px] block text-[11px] leading-snug opacity-50">
                    {st.sub}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.22}>
            <div className="mt-3">
              <p className="deck-eyebrow deck-accent">{s.ruleTitle}</p>
              <p className="deck-h-sm mt-2 max-w-[40ch]">{s.rule}</p>
              <p className="deck-body deck-secondary mt-2 max-w-[62ch]">
                {s.ruleItems.join(" · ")}
              </p>
            </div>
          </Reveal>

          <div className="mt-2">
            <Detail title={s.detail.title} body={s.detail.body} />
          </div>
        </div>
      </div>
    </Slide>
  );
}
