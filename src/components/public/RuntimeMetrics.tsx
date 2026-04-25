import { prisma } from "@/lib/db";

function formatDeployTime(date: Date): string {
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const mm = months[date.getUTCMonth()];
  const yyyy = date.getUTCFullYear();
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  return `${dd} ${mm} ${yyyy}, ${hh}:${min} UTC`;
}

export default async function RuntimeMetrics() {
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "local-dev").slice(0, 7);
  const branch = process.env.VERCEL_GIT_COMMIT_REF || "main";
  const region = process.env.VERCEL_REGION || "local";

  const deployTime = process.env.VERCEL_DEPLOYMENT_ID
    ? formatDeployTime(new Date())
    : formatDeployTime(new Date());

  const totalCases = await prisma.case.count().catch(() => 0);
  const publicCases = await prisma.case.count({ where: { isPublic: true } }).catch(() => 0);

  const rows: Array<[string, string]> = [
    ["build", sha],
    ["branch", branch],
    ["deployed", deployTime],
    ["region", region],
    ["cases", `${publicCases} / ${totalCases} public`],
    ["stack", "next 16 · prisma 7"],
    ["runtime", "edge"],
  ];

  return (
    <aside
      aria-label="Runtime metrics"
      className="font-mono text-[11px] leading-[1.9] text-[var(--text-3)] hidden lg:block"
    >
      <div className="flex items-center gap-2 mb-3 text-[var(--text-2)]">
        <span className="block w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
        <span className="tracking-[0.18em] uppercase text-[10px]">live</span>
      </div>
      <dl className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-[var(--text-3)]">{k}</dt>
            <dd className="text-[var(--text-2)]">{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
