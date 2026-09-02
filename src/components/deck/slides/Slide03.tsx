import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s03;

/**
 * The ecosystem photograph is the argument here, so it gets half the
 * screen and no text on top: a plant at the centre, institutions around
 * it, connections already drawn.
 */
export default function Slide03({ total }: { total: number }) {
  return (
    <Slide index={3} total={total} tone="sheet" label={s.title} bare>
      <div className="grid h-full min-h-[100dvh] w-full grid-cols-12">
        <div className="col-span-12 flex flex-col justify-center px-[6vw] py-[5vh] md:col-span-6 md:pr-[3vw]">
          <Reveal>
            <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="deck-h mt-5 max-w-[12ch]">{s.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="deck-lead deck-secondary mt-5 max-w-[38ch]">{s.lead}</p>
          </Reveal>

          <Stagger className="deck-hairline mt-5 border-t">
            {s.actors.map((a) => (
              <StaggerItem key={a.name}>
                <div className="deck-hairline-soft grid grid-cols-12 gap-x-4 border-b py-[9px]">
                  <span className="col-span-5 text-[14px] font-medium leading-snug">
                    {a.name}
                  </span>
                  <span className="deck-body deck-secondary col-span-7">{a.role}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.26}>
            <p className="deck-h-sm deck-accent mt-5 max-w-[34ch]">{s.kicker}</p>
          </Reveal>
        </div>

        <DeckImage
          src="/deck/sospp/ecosystem.png"
          alt="Круглый стол: в центре макет завода, вокруг — связанные с ним компетенции и институты"
          objectPosition="center 46%"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="relative col-span-12 h-[38vh] md:col-span-6 md:h-full"
        />
      </div>
    </Slide>
  );
}
