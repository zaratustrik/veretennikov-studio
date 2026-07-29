import type { Metadata } from "next";
import "./masterclass.css";

export const metadata: Metadata = {
  title: "ИИ в работе — практический мастер-класс по методике 4П",
  description:
    "Практический мастер-класс о том, как понимать возможности ИИ, правильно поручать задачи, проверять результат и превращать разовые запросы в повторяемые процессы и агентов.",
  alternates: { canonical: "/ai-masterclass" },
  openGraph: {
    title: "ИИ в работе — мастер-класс по методике 4П",
    description:
      "Понять · Поручить · Проверить · Перестроить. Интерактивная версия корпоративного мастер-класса.",
    type: "article",
    locale: "ru_RU",
  },
};

export default function MasterclassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mc-root">{children}</div>;
}
