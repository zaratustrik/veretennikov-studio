import Link from "next/link";

/**
 * Veretennikov Studio wordmark. Shared component (no client code) —
 * usable in both server and client trees. Extracted from Header + Footer.
 */
export default function Wordmark({
  asLink = true,
  className = "",
}: {
  asLink?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <span className="text-[15px] font-medium tracking-[-0.01em] text-[var(--ink)] transition-colors duration-[var(--dur-2)] group-hover:text-[var(--cobalt)]">
        Veretennikov
      </span>
      <span className="text-[15px] tracking-[-0.01em] text-[var(--ink-3)]">
        Studio
      </span>
    </>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label="Veretennikov Studio — на главную"
        className={`group flex items-baseline gap-1.5 ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return <p className={`flex items-baseline gap-1.5 ${className}`}>{inner}</p>;
}
