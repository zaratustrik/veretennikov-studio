export default function VerifyRequestPage() {
  return (
    <div className="mx-auto px-8 py-24" style={{ maxWidth: 480 }}>
      <p className="eyebrow mb-8" style={{ color: "var(--cobalt)" }}>
        ● Письмо отправлено
      </p>

      <h1
        className="display mb-6"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.022em",
          animation: "none",
        }}
      >
        Проверьте <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>почту.</span>
      </h1>

      <p className="text-[var(--ink-2)] leading-[1.7] text-[15px] mb-4">
        В письме — ссылка для входа. Откройте её в этом же браузере.
      </p>
      <p className="text-[var(--ink-3)] text-[13px] leading-[1.6]">
        Ссылка действует 24 часа. Если письмо не пришло — проверьте папку «Спам»
        или попробуйте отправить заново.
      </p>
    </div>
  )
}
