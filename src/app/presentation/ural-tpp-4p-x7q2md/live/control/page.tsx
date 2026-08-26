import Control from "@/components/utpp-mc/live/Control"
import { controlToken } from "../../gate"

export const dynamic = "force-dynamic"

/**
 * Пульт ведущего. Лежит внутри закрытого раздела, поэтому наследует
 * парольную защиту деки: отдельного механизма не заводим.
 */
export default function LiveControlPage() {
  const secret = process.env.UTPP_MC_PASSWORD
  return <Control controlToken={secret ? controlToken(secret) : null} />
}
