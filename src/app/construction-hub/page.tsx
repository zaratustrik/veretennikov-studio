import type { Metadata } from "next"
import Hub from "@/components/construction-hub/Hub"
import "./hub.css"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: { absolute: "Строим практику — рабочая площадка организаторов" },
  description: "Площадка подготовки конференции об ИИ в строительстве при поддержке Уральской торгово-промышленной палаты.",
  robots: { index: false, follow: false, noarchive: true, nocache: true, nosnippet: true },
  alternates: { canonical: null },
}
// Private meeting content is fetched only after a verified server session.
// The unauthenticated HTML/RSC payload contains no board data or invitations.
export default function Page() { return <Hub /> }
