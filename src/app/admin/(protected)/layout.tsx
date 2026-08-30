import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/admin/signin")

  async function handleSignOut() {
    "use server"
    await signOut({ redirectTo: "/admin/signin" })
  }

  return (
    <>
      <div className="border-b border-[var(--rule)] bg-[var(--paper-1)]">
        <div
          className="mx-auto px-5 md:px-8 h-10 flex items-center justify-between"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="flex items-center gap-5 min-w-0">
            <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)] shrink-0">
              <span style={{ color: "var(--cobalt)" }}>●</span>{" "}
              <span className="ml-1 hidden sm:inline">{session.user?.email}</span>
            </span>
            <nav className="flex items-center gap-4 font-mono text-[11px] tracking-[0.06em] uppercase">
              <Link href="/admin" className="text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors">Кейсы</Link>
              <Link href="/admin/posts" className="text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors">Статьи</Link>
              <Link href="/admin/leads" className="text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors">Обращения</Link>
              <Link href="/admin/briefs" className="text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors">Брифы</Link>
            </nav>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors uppercase"
            >
              выйти
            </button>
          </form>
        </div>
      </div>

      {children}
    </>
  )
}
