"use client"

import Image from "next/image"
import { Reveal, Scene } from "../primitives"
import { finale } from "../content.ru"

/**
 * Финал. Никакого «спасибо за внимание»: последним на экране остаётся
 * утверждение, ради которого собран весь мастер-класс, и второй,
 * более тихий смысл — человек остаётся в центре ответственности.
 */
export default function Finale({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={finale.id}
      tone="ivory"
      label={finale.sceneLabel}
      index={index}
      total={total}
    >
      <div className="utpp-finale">
        <Reveal>
          <p className="utpp-statement utpp-finale-main">{finale.statement}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="utpp-finale-quiet">{finale.quiet}</p>
        </Reveal>

        <Reveal delay={0.34}>
          <footer className="utpp-finale-foot">
            <Image
              src="/utpp/utpp-logo-ink.png"
              alt="Уральская торгово-промышленная палата"
              width={144}
              height={54}
              className="utpp-title-mark"
            />
            <div>
              <p className="utpp-note">{finale.event}</p>
              <p className="utpp-note utpp-title-author">
                {finale.author} · {finale.studio}
              </p>
            </div>
          </footer>
        </Reveal>
      </div>
    </Scene>
  )
}
