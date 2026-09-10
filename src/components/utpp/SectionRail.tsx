"use client"

import { useEffect, useState } from "react"

import type { SectionMeta } from "@/types/utpp"

import { useAnswers } from "./AnswersProvider"

/**
 * Навигация по разделам.
 *
 * Десктоп — вертикальная рейка слева, за пределами колонки контента.
 * Планшет и телефон — липкая верхняя полоса с текущим разделом и списком.
 *
 * Активный раздел определяется IntersectionObserver по заголовкам; без
 * внешних библиотек и без обработчика scroll.
 *
 * Прогресс появляется только после первого ответа: до этого «0 из 11»
 * читалось бы как объём предстоящей работы.
 */
export default function SectionRail({ sections }: { sections: SectionMeta[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "")
  const [open, setOpen] = useState(false)
  const { answered, total, hydrated } = useAnswers()

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null)

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      // Верхняя треть вьюпорта: раздел считается текущим, когда его заголовок
      // подошёл к верху, а не когда он занял весь экран.
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [sections])

  const current = sections.find((s) => s.id === active) ?? sections[0]
  const index = sections.findIndex((s) => s.id === active) + 1
  const showProgress = hydrated && answered > 0

  return (
    <>
      {/* Десктоп */}
      <nav className="utpp-page-rail" aria-label="Разделы документа">
        <ol className="utpp-page-rail-list">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`utpp-page-rail-link${
                  section.id === active ? " is-active" : ""
                }`}
                aria-current={section.id === active ? "true" : undefined}
              >
                {section.nav}
              </a>
            </li>
          ))}
        </ol>

        {showProgress ? (
          <p className="utpp-page-rail-progress" aria-live="polite">
            Отвечено {answered} из {total}
          </p>
        ) : null}
      </nav>

      {/* Планшет и телефон */}
      <div className="utpp-page-railbar">
        <button
          type="button"
          className="utpp-page-railbar-toggle"
          aria-expanded={open}
          aria-controls="utpp-page-railbar-list"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="utpp-page-railbar-current">{current?.nav}</span>
          <span className="utpp-page-railbar-count">
            {index} / {sections.length}
          </span>
        </button>

        {/* Подпись обязательна: рядом уже стоит счётчик разделов «N / 11»,
            и два одинаковых по форме числа читались бы как одно и то же. */}
        {showProgress ? (
          <p className="utpp-page-railbar-progress" aria-live="polite">
            ответов {answered}
          </p>
        ) : null}

        {open ? (
          <ol id="utpp-page-railbar-list" className="utpp-page-railbar-list">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={section.id === active ? "is-active" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {section.nav}
                </a>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </>
  )
}
