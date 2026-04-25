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
          className="mx-auto px-8 h-10 flex items-center justify-between"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--ink-3)]">
            <span style={{ color: "var(--cobalt)" }}>●</span>{" "}
            <span className="ml-1">{session.user?.email}</span>
          </span>
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
