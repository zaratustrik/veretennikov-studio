import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Slide from "../Slide";
import Detail from "../Detail";
import DeckImage from "../DeckImage";
import { deck } from "@/data/decks/sospp";

const s = deck.s04;

/**
 * The photograph runs as a wide band under the text: a director at the
 * centre, offers coming at him from both sides. Cropped to a fragment so
 * it reads as part of the page, not as an illustration under a caption.
 */
export default function Slide04({ total }: { total: number }) {
  return (
    <Slide index={4} total={total} tone="sheet-2" label={s.title} bare>
      <div className="flex h-full min-h-[100dvh] w-full flex-col">
        <div className="flex flex-1 flex-col justify-center px-[6vw] pb-4 pt-[3.5vh]">
          <div className="grid grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 md:col-span-8">
              <Reveal>
                <p className="deck-eyebrow deck-secondary">{s.eyebrow}</p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="deck-h mt-4 max-w-[18ch]">{s.title}</h2>
              </Reveal>
            </div>

            {s.columns.map((c, ci) => (
              <div
                key={c.label}
                className={
                  ci === 0
                    ? "col-span-12 md:col-span-5"
                    : "col-span-12 md:col-span-5 md:col-start-7"
                }
              >
                <Reveal delay={0.1 + ci * 0.06}>
                  <p className="deck-eyebrow deck-hairline border-t pt-3">
                    <span className={ci === 1 ? "deck-accent" : "deck-secondary"}>
                      {c.label}
                    </span>
                  </p>
                </Reveal>
                <Stagger className="mt-3 flex flex-col gap-[7px]">
                  {c.items.map((it) => (
                    <StaggerItem key={it}>
                      <p
                        className={
                          ci === 1
                            ? "deck-lead max-w-[34ch]"
                            : "deck-lead deck-secondary max-w-[34ch] opacity-65"
                        }
                      >
                        {it}
                      </p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}

            <div className="col-span-12 md:col-span-9">
              <Reveal delay={0.22}>
                <p className="deck-h-sm deck-hairline max-w-[52ch] border-t pt-4">
                  {s.statement}
                </p>
              </Reveal>
              <Reveal delay={0.26}>
                <p className="deck-body deck-secondary mt-3 max-w-[64ch]">
                  {s.evidence}
                </p>
              </Reveal>
            </div>

            <div className="col-span-12 md:col-span-9">
              <Detail title={s.detail.title} body={s.detail.body} />
            </div>
          </div>
        </div>

        <DeckImage
          src="/deck/sospp/gap.png"
          alt="Директор за столом, вокруг — предложения, устройства и эксперты"
          objectPosition="center 34%"
          sizes="100vw"
          className="relative h-[20vh] w-full shrink-0 md:h-[16vh]"
        />
      </div>
    </Slide>
  );
}
