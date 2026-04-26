import type { Metadata } from "next";
import FadeIn from "@/components/public/FadeIn";

export const metadata: Metadata = { title: "Связаться" };

const CONTACTS = [
  {
    label: "Telegram",
    value: "@VeretennikovINFO",
    href: "https://t.me/VeretennikovINFO",
    note: "Быстрее всего",
  },
  {
    label: "Email",
    value: "houser@yandex.ru",
    href: "mailto:houser@yandex.ru",
    note: null,
  },
  {
    label: "Телефон",
    value: "+7 922 613 01 54",
    href: "tel:+79226130154",
    note: null,
  },
  {
    label: "База",
    value: "Екатеринбург",
    href: null,
    note: "Работаем по всей России",
  },
];

const TYPES = [
  "AI-автоматизация",
  "Корпоративный фильм",
  "Презентационный ролик",
  "VFX / Motion",
  "3D / CGI",
  "Синтез",
  "Консалтинг",
];

const TIMELINES = ["Срочно (до 1 недели)", "2–4 недели", "Месяц и более"];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 border-b border-[var(--border)]">
        <FadeIn>
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
            Контакт
          </p>
          <h1
            className="font-medium tracking-[-0.03em] text-[var(--text-1)] max-w-xl"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.05 }}
          >
            Расскажите о задаче.{" "}
            <span className="text-[var(--text-2)]">Разберёмся вместе.</span>
          </h1>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-16 md:gap-24">

          {/* Left: direct contacts */}
          <FadeIn>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
                Прямые контакты
              </p>
              <div className="flex flex-col gap-6">
                {CONTACTS.map(({ label, value, href, note }) => (
                  <div key={label} className="border-b border-[var(--border)] pb-6">
                    <p className="text-xs font-mono text-[var(--text-3)] mb-1.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[var(--text-1)] hover:text-white transition-colors text-base font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[var(--text-1)] text-base font-medium">
                        {value}
                      </p>
                    )}
                    {note && (
                      <p className="text-xs text-[var(--text-3)] mt-1">{note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: brief form */}
          <FadeIn delay={0.1}>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
                Краткий бриф
              </p>

              {/* TODO: подключить API-маршрут /api/contact с Resend */}
              <form
                action="mailto:houser@yandex.ru"
                method="get"
                encType="text/plain"
                className="flex flex-col gap-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-[var(--text-3)] mb-2">
                    Имя / Компания
                  </label>
                  <input
                    type="text"
                    name="from"
                    placeholder="Иван Петров, ООО «Пример»"
                    className="w-full bg-transparent border border-[var(--border)] rounded-lg px-4 py-3 text-[16px] md:text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[#3A3A3A] transition-colors"
                  />
                </div>

                {/* Task type */}
                <div>
                  <label className="block text-xs font-mono text-[var(--text-3)] mb-3">
                    Тип задачи
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 border border-[var(--border)] rounded-full cursor-pointer hover:border-[#3A3A3A] hover:text-[var(--text-1)] text-[var(--text-2)] transition-colors has-[:checked]:border-[var(--text-2)] has-[:checked]:text-[var(--text-1)]"
                      >
                        <input
                          type="checkbox"
                          name="type"
                          value={t}
                          className="sr-only"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-xs font-mono text-[var(--text-3)] mb-3">
                    Сроки
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINES.map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 border border-[var(--border)] rounded-full cursor-pointer hover:border-[#3A3A3A] hover:text-[var(--text-1)] text-[var(--text-2)] transition-colors has-[:checked]:border-[var(--text-2)] has-[:checked]:text-[var(--text-1)]"
                      >
                        <input
                          type="radio"
                          name="timeline"
                          value={t}
                          className="sr-only"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono text-[var(--text-3)] mb-2">
                    Опишите задачу
                  </label>
                  <textarea
                    name="body"
                    rows={4}
                    placeholder="Что нужно сделать, в каком контексте, есть ли примеры..."
                    className="w-full bg-transparent border border-[var(--border)] rounded-lg px-4 py-3 text-[16px] md:text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[#3A3A3A] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors self-start"
                >
                  Отправить →
                </button>

                <p className="text-xs text-[var(--text-3)]">
                  Или напишите напрямую в{" "}
                  <a
                    href="https://t.me/VeretennikovINFO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors underline underline-offset-2"
                  >
                    Telegram
                  </a>{" "}
                  — там быстрее.
                </p>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
