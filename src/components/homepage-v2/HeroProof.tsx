"use client";

import Image from "next/image";
import { useState } from "react";

const HERO_IMAGE = "/blog/mikrokomandy-i-budushchee-avtomatizacii-machine-building.webp";

export default function HeroProof() {
  const [paused, setPaused] = useState(false);

  return (
    <figure className="hpv2-proof" data-paused={paused ? "true" : "false"}>
      <Image
        src={HERO_IMAGE}
        alt="Редакционная иллюстрация: специалисты анализируют показатели промышленного производства"
        fill
        priority
        sizes="(max-width: 899px) calc(100vw - 40px), (max-width: 1299px) 52vw, 680px"
      />
      <div className="hpv2-proof__veil" aria-hidden="true" />
      <svg
        className="hpv2-proof__signal"
        viewBox="0 0 720 600"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path className="hpv2-signal-line hpv2-signal-line--one" d="M0 460C155 438 224 278 363 298C502 318 554 174 720 133" />
        <path className="hpv2-signal-line hpv2-signal-line--two" d="M18 522C198 498 273 390 412 408C551 426 612 338 720 310" />
        <circle className="hpv2-signal-node hpv2-signal-node--one" cx="363" cy="298" r="6" />
        <circle className="hpv2-signal-node hpv2-signal-node--two" cx="554" cy="174" r="6" />
      </svg>
      <div className="hpv2-proof__index" aria-hidden="true">
        <span>INPUT / CONTEXT</span>
        <span>01—04</span>
      </div>
      <figcaption className="hpv2-proof__caption">
        <span className="hpv2-status hpv2-status--light hpv2-status--context">EDITORIAL CONTEXT</span>
        <span>Человек · данные · производство</span>
      </figcaption>
      <button
        className="hpv2-proof__pause"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        {paused ? "Продолжить сигнал" : "Пауза сигнала"}
      </button>
    </figure>
  );
}
