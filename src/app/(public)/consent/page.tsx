import type { Metadata } from "next";
import Link from "next/link";
import { PD_CONSENT_STAMP } from "@/lib/pd";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Текст согласия на обработку персональных данных, которое посетитель даёт при отправке форм на сайте veretennikov.info.",
  alternates: { canonical: "/consent" },
  robots: { index: true, follow: true },
};

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[var(--ink-2)] leading-[1.7] mb-4 text-[15px]">
      {children}
    </p>
  );
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-[var(--ink-2)] text-[15px] leading-[1.6] marker:text-[var(--ink-3)]">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

function Fill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono"
      style={{
        border: "1.5px dashed var(--cobalt)",
        color: "var(--cobalt)",
        padding: "1px 8px",
        borderRadius: 3,
        fontSize: "0.9em",
        whiteSpace: "nowrap",
      }}
    >
      [ЗАПОЛНИТЬ: {children}]
    </span>
  );
}

export default function ConsentPage() {
  return (
    <section className="border-b border-[var(--rule)]">
      <div
        className="mx-auto px-5 md:px-8"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
          <span className="eyebrow">Документ</span>
          <span className="eyebrow text-center hidden md:block">152-ФЗ</span>
          <span className="eyebrow text-right">Версия {PD_CONSENT_STAMP}</span>
        </div>

        <div className="pt-14 pb-20 max-w-[820px]">
          <h1
            className="display"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.022em",
              marginBottom: "20px",
              animation: "none",
            }}
          >
            Согласие на обработку персональных данных
          </h1>
          <p className="text-[var(--ink-3)] text-[14px] font-mono mb-2">
            Редакция {PD_CONSENT_STAMP} · применяется к формам сайта
            https://veretennikov.info
          </p>

          <P>
            Я, действуя свободно, своей волей и в своём интересе, отмечая
            соответствующий пункт при отправке формы на сайте
            https://veretennikov.info (далее — «Сайт»), даю согласие оператору
            персональных данных — <Fill>ФИО полностью</Fill>,{" "}
            <Fill>статус: ИП / самозанятый</Fill>, <Fill>ИНН</Fill> (далее —
            «Оператор», контакт: strana.vfx@gmail.com) — на обработку моих
            персональных данных на условиях, изложенных ниже.
          </P>

          <h2 className="display" style={{ fontSize: "1.35rem", marginTop: 40, marginBottom: 14, animation: "none" }}>
            1. Состав персональных данных
          </h2>
          <P>
            Данные, которые я сам указываю в отправляемой форме: имя; должность;
            адрес электронной почты; номер телефона; имя пользователя Telegram;
            удобное время для звонка; сведения о компании, проекте и задаче,
            изложенные мной в полях формы.
          </P>

          <h2 className="display" style={{ fontSize: "1.35rem", marginTop: 40, marginBottom: 14, animation: "none" }}>
            2. Цели обработки
          </h2>
          <UL
            items={[
              "связь со мной по оставленному обращению и обсуждение задачи;",
              "подготовка предложения и, при обоюдном решении, заключение договора.",
            ]}
          />
          <P>
            Согласие не распространяется на рекламные рассылки — их Сайт не
            ведёт; при их появлении будет запрошено отдельное согласие.
          </P>

          <h2 className="display" style={{ fontSize: "1.35rem", marginTop: 40, marginBottom: 14, animation: "none" }}>
            3. Действия с данными и способы обработки
          </h2>
          <P>
            Сбор, запись, систематизация, накопление, хранение, уточнение,
            извлечение, использование, блокирование, удаление, уничтожение — с
            использованием средств автоматизации. База данных размещена на
            территории Российской Федерации (инфраструктура Yandex Cloud).
            Передача данных третьим лицам для их собственных целей и
            трансграничная передача не осуществляются.
          </P>

          <h2 className="display" style={{ fontSize: "1.35rem", marginTop: 40, marginBottom: 14, animation: "none" }}>
            4. Срок действия согласия
          </h2>
          <P>
            Согласие действует до достижения целей обработки либо до его
            отзыва, но не более 3 (трёх) лет с даты последнего взаимодействия.
            Дата, время и версия принятого согласия фиксируются вместе с
            отправленной формой.
          </P>

          <h2 className="display" style={{ fontSize: "1.35rem", marginTop: 40, marginBottom: 14, animation: "none" }}>
            5. Порядок отзыва
          </h2>
          <P>
            Согласие можно отозвать в любой момент, направив письмо на
            strana.vfx@gmail.com с адреса, указанного в форме, либо приложив
            сведения, позволяющие найти обращение. Данные будут удалены или
            обезличены не позднее 30 дней, если закон не требует их дальнейшего
            хранения. Отзыв не влияет на законность обработки до момента
            отзыва.
          </P>

          <P>
            Подробности обработки — в{" "}
            <Link
              href="/privacy"
              className="text-[var(--cobalt)] underline underline-offset-2"
            >
              Политике обработки персональных данных
            </Link>
            .
          </P>
        </div>
      </div>
    </section>
  );
}
