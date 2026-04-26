import { signIn } from "@/lib/auth"

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="mx-auto px-5 md:px-8 py-24" style={{ maxWidth: 480 }}>
      <p className="eyebrow mb-8">Admin · Sign in</p>

      <h1
        className="display mb-6"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.022em",
          animation: "none",
        }}
      >
        Вход по магической <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>ссылке.</span>
      </h1>

      <p className="text-[var(--ink-2)] leading-[1.7] mb-10 text-[15px]">
        Введите email — мы отправим письмо со ссылкой для входа.
        Доступ ограничен одним адресом владельца студии.
      </p>

      <SignInForm searchParams={searchParams} />
    </div>
  )
}

async function SignInForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  async function handleSignIn(formData: FormData) {
    "use server"
    const email = formData.get("email") as string
    if (!email) return
    await signIn("resend", {
      email,
      redirectTo: "/admin",
    })
  }

  return (
    <form action={handleSignIn} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] mb-2 uppercase"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="strana.vfx@gmail.com"
          className="w-full px-4 py-3 bg-[var(--paper)] border border-[var(--ink-3)] text-[var(--ink)] text-[15px] focus:outline-none focus:border-[var(--cobalt)] transition-colors"
          style={{ borderRadius: 2 }}
        />
      </div>

      <button
        type="submit"
        className="w-full px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
      >
        Отправить ссылку →
      </button>

      {error && (
        <p
          className="text-[12px] text-[var(--cobalt)] mt-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {error === "AccessDenied"
            ? "Этот email не имеет доступа в админку."
            : `Ошибка: ${error}`}
        </p>
      )}
    </form>
  )
}
