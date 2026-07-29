"use client";

import Link from "next/link";
import { chapters } from "./content.ru";

type Props = {
  active: string;
};

export default function ChapterNavigation({ active }: Props) {
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="mc-nav" aria-label="Главы мастер-класса">
      <Link className="mc-nav-brand" href="/">
        Veretennikov <span>· ИИ в работе</span>
      </Link>
      <div className="mc-nav-chapters">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className="mc-nav-link"
            data-active={active === ch.id}
            onClick={() => jump(ch.id)}
          >
            {ch.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
