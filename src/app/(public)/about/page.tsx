import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/public/FadeIn";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "О подходе",
  description:
    "Анатолий Веретенников — продюсер, основатель студии. Работаем с государственными и крупными частными клиентами с 2014 года.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/about`,
    title: "О подходе — Veretennikov Studio",
    description:
      "Анатолий Веретенников и студия Veretennikov Studio — кто мы и как работаем.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
};

const CLIENTS = [
  "Ростелеком",
  "Уральские Авиалинии",
  "Белоярская АЭС",
  "СКБ Контур",
  "УБРиР",
  "УрФУ им. Бориса Ельцина",
  "Промэлектроника",
  "Таркет",
];

export default function AboutPage() {
  const jsonLd = breadcrumbListSchema([
    { name: "Главная", url: SITE_URL },
    { name: "О подходе", url: `${SITE_URL}/about` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-20 border-b border-[var(--border)]">
        <FadeIn>
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
            О студии
          </p>
          <h1
            className="font-medium tracking-[-0.03em] text-[var(--text-1)] mb-0"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
          >
            Veretennikov Studio
          </h1>
          <p className="text-[var(--text-2)] mt-3 text-sm tracking-wide font-mono">
            AI · Видеопродакшн · Синтез · Екатеринбург
          </p>
        </FadeIn>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-b border-[var(--border)]">
        <div className="grid md:grid-cols-[1fr_400px] gap-16 md:gap-24">
          <FadeIn>
            <div className="flex flex-col gap-6 text-[var(--text-2)] leading-[1.8]" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}>
              <p>
                Студию основал Анатолий Веретенников — продюсер, режиссёр,
                AI-разработчик. Мы занимаемся двумя вещами, которые редко
                сочетает одна команда: строим AI-системы для бизнеса и снимаем
                корпоративные фильмы.
              </p>
              <p>
                Началось с видео. Режиссура, монтаж, VFX, сценарий. Потом
                появились задачи, которые видео не решало — нужна была система.
                Потом появились системы, которые никто не понимал — нужна была
                история. Так сложилась студия с двойной экспертизой.
              </p>
              <p>
                Большинство компаний нанимают разных подрядчиков для этих двух
                задач. Контекст теряется на стыке. Качество падает на обеих
                сторонах. Мы работаем иначе: один проект, один бриф, одна
                команда — и система, и история о ней.
              </p>
              <p>
                Работаем с крупными организациями, где решения принимают
                медленно, а результат проверяется долго. Это воспитывает
                ответственность за каждый проект.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-8">
              {/* Producer */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-3">
                  Продюсер
                </p>
                <p className="text-sm text-[var(--text-1)] font-medium mb-1">
                  Анатолий Веретенников
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Продакшн", "Режиссура", "AI-разработка", "VFX"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-2)] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-3">
                  Команда
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Разработчики",
                    "Операторы",
                    "Монтажёры",
                    "Дизайнеры",
                    "Сценаристы",
                    "3D / CGI",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-2)] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-2">
                  База
                </p>
                <p className="text-sm text-[var(--text-2)]">Екатеринбург</p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[var(--text-2)] animate-pulse" />
                <span className="text-sm text-[var(--text-2)]">
                  Открыты для новых проектов
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Clients */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-b border-[var(--border)]">
        <FadeIn>
          <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
            Среди клиентов
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {CLIENTS.map((name) => (
              <span
                key={name}
                className="text-sm text-[var(--text-2)]"
              >
                {name}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Personal statement */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-b border-[var(--border)]">
        <FadeIn>
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
              Позиция
            </p>
            <blockquote
              className="font-medium tracking-[-0.025em] text-[var(--text-1)] mb-6"
              style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)", lineHeight: 1.3 }}
            >
              "Продюсер отвечает за результат.
              Команда его создаёт."
            </blockquote>
            <p className="text-sm text-[var(--text-2)] leading-relaxed">
              Анатолий Веретенников как продюсер берёт на себя ответственность
              за каждый проект — за сроки, качество и соответствие задаче.
              Разработчики, операторы, монтажёры, дизайнеры — создают продукт.
              Это не размывает ответственность, это правильное разделение ролей.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <FadeIn>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              Написать нам
            </Link>
            <Link
              href="/manifesto"
              className="px-7 py-3.5 border border-[var(--border-mid)] text-[var(--text-2)] text-sm rounded-full hover:text-[var(--text-1)] hover:border-[#3A3A3A] transition-colors"
            >
              Читать манифест →
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
