"use client"

import Image from "next/image"
import { Reveal, Scene } from "../primitives"
import { deck } from "../content.ru"

/**
 * Титр падает третьим экраном, а не первым: сначала крючок и тезис,
 * потом название. Приём из кино — зритель уже внутри темы, когда
 * узнаёт, как она называется.
 */
export default function TitleCard({ index, total }: { index: number; total: number }) {
  return (
    <Scene id="title" tone="ivory" label="Титр мастер-класса" index={index} total={total}>
      <div className="utpp-title">
        <Reveal>
          <p className="utpp-eyebrow">{deck.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="utpp-h1 utpp-title-h1">{deck.title}</h1>
        </Reveal>

        <Reveal delay={0.14}>
          <ol className="utpp-title-words">
            {deck.words.map((w, i) => (
              <li key={w}>
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{w}</b>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="utpp-lead utpp-title-lead">{deck.lead}</p>
        </Reveal>

        <Reveal delay={0.26}>
          <footer className="utpp-title-foot">
            <Image
              src="/utpp/utpp-logo-ink.png"
              alt="Уральская торгово-промышленная палата"
              width={144}
              height={54}
              className="utpp-title-mark"
              priority
            />
            <div>
              <p className="utpp-note">{deck.event}</p>
              <p className="utpp-note utpp-title-author">{deck.author}</p>
            </div>
          </footer>
        </Reveal>
      </div>
    </Scene>
  )
}
