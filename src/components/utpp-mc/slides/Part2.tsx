"use client"

import { Head, In, Slide } from "../primitives"
import { localLlm, marketEast, marketWorld, modelProductApi, photos } from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   06 — Модель, продукт и API

   Слайд снимает путаницу, из-за которой разговор о выборе
   превращается в спор ни о чём. Столбец «кто выбирает» важнее
   определений: он сразу расставляет зоны ответственности.
   ════════════════════════════════════════════════════════════ */

export function ModelProductApi({ index, total, active, beat }: P) {
  return (
    <Slide
      id={modelProductApi.id}
      tone="ivory"
      label={modelProductApi.label}
      index={index}
      total={total}
      active={active}
    >
      <Head
        eyebrow={modelProductApi.eyebrow}
        title={modelProductApi.title}
        lead={modelProductApi.lead}
        wide
      />

      <div className="utpp-mpa">
        {modelProductApi.layers.map((l, i) => (
          <div key={l.key} className="utpp-beat utpp-mpa-col" data-on={beat >= i}>
            <p className="utpp-num">{String(i + 1).padStart(2, "0")}</p>
            <p className="utpp-mpa-name">{l.name}</p>
            <p className="utpp-mpa-what">{l.what}</p>
            <p className="utpp-mpa-example">{l.example}</p>
            <p className="utpp-mpa-who">{l.who}</p>
          </div>
        ))}
      </div>

      <p className="utpp-beat utpp-key utpp-mpa-key" data-on={beat >= 2}>
        {modelProductApi.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   07 — Международные системы

   Намеренно без вердикта «лучший». Для руководителя полезнее
   увидеть, что все четыре решают один класс задач по-разному,
   и что версия устареет раньше, чем закончится мастер-класс.
   ════════════════════════════════════════════════════════════ */

export function MarketWorld({ index, total, active }: P) {
  return (
    <Slide
      id={marketWorld.id}
      tone="ink"
      label={marketWorld.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={marketWorld.eyebrow} title={marketWorld.title} lead={marketWorld.lead} wide />

      <div className="utpp-market">
        {marketWorld.vendors.map((v, i) => (
          <In key={v.vendor} d={i + 2} className="utpp-market-col">
            <p className="utpp-market-vendor">{v.vendor}</p>
            <p className="utpp-market-product">{v.product}</p>
            <p className="utpp-market-models">{v.models}</p>
            <ul className="utpp-market-plus">
              {v.strong.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <ul className="utpp-market-minus">
              {v.weak.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </In>
        ))}
      </div>

      <In d={7}>
        <p className="utpp-warn utpp-market-note">{marketWorld.note}</p>
      </In>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   08 — Китай и Россия

   Два разных смысла: у китайских систем это открытые веса,
   у российских — юрисдикция и расчёты. Именно эти два свойства
   и определяют выбор для организации, а не позиция в рейтинге.
   ════════════════════════════════════════════════════════════ */

export function MarketEast({ index, total, active }: P) {
  return (
    <Slide
      id={marketEast.id}
      tone="ink"
      label={marketEast.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={marketEast.eyebrow} title={marketEast.title} wide />

      <div className="utpp-east">
        {marketEast.groups.map((g, gi) => (
          <In key={g.region} d={gi + 2} className="utpp-east-group">
            <p className="utpp-east-region">{g.region}</p>
            <p className="utpp-small utpp-east-hint">{g.hint}</p>

            <div className="utpp-east-vendors">
              {g.vendors.map((v) => (
                <div key={v.vendor} className="utpp-east-col">
                  <p className="utpp-market-vendor">{v.vendor}</p>
                  <p className="utpp-market-models">{v.models}</p>
                  <ul className="utpp-market-plus">
                    {v.strong.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <ul className="utpp-market-minus">
                    {v.weak.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </In>
        ))}
      </div>

      <In d={5}>
        <p className="utpp-key utpp-east-key">{marketEast.key}</p>
      </In>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   09 — Облачная и локальная модель

   Обязательный блок для этой аудитории: вопрос «а наши данные
   куда уходят» звучит на каждом выступлении. Предупреждение внизу
   не декоративное — локальное размещение само по себе ничего
   не гарантирует.
   ════════════════════════════════════════════════════════════ */

export function LocalLlm({ index, total, active, beat }: P) {
  const cols = [
    { key: "cloud", data: localLlm.cloud, accent: false },
    { key: "local", data: localLlm.local, accent: true },
  ]

  return (
    <Slide
      id={localLlm.id}
      tone="sheet"
      label={localLlm.label}
      index={index}
      total={total}
      active={active}
      cut={photos.serverRoom}
    >
      <Head eyebrow={localLlm.eyebrow} title={localLlm.title} wide />

      <div className="utpp-local">
        <div className="utpp-vs utpp-local-vs">
          <div className="utpp-beat utpp-vs-col" data-on={beat >= 0}>
            <p className="utpp-vs-name">{cols[0]!.data.name}</p>
            <p className="utpp-vs-text">{cols[0]!.data.what}</p>
            <ul>
              {cols[0]!.data.plus.map((s) => (
                <li key={s} data-sign="plus">
                  {s}
                </li>
              ))}
              {cols[0]!.data.minus.map((s) => (
                <li key={s} data-sign="minus">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="utpp-vs-mid" aria-hidden="true">
            или
          </div>

          <div className="utpp-beat utpp-vs-col" data-accent="true" data-on={beat >= 1}>
            <p className="utpp-vs-name">{cols[1]!.data.name}</p>
            <p className="utpp-vs-text">{cols[1]!.data.what}</p>
            <ul>
              {cols[1]!.data.plus.map((s) => (
                <li key={s} data-sign="plus">
                  {s}
                </li>
              ))}
              {cols[1]!.data.minus.map((s) => (
                <li key={s} data-sign="minus">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="utpp-beat utpp-local-why" data-on={beat >= 2}>
          <p className="utpp-note">Когда локальная модель оправдана</p>
          <ul className="utpp-list">
            {localLlm.why.map((w) => (
              <li key={w.n}>
                <span className="utpp-list-n">{w.n}</span>
                <b>{w.text}</b>
              </li>
            ))}
          </ul>
          <p className="utpp-local-hybrid">{localLlm.hybrid}</p>
        </div>
      </div>

      <p className="utpp-beat utpp-warn utpp-local-warn" data-on={beat >= 2}>
        {localLlm.warn}
      </p>
    </Slide>
  )
}
