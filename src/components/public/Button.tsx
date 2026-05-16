import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full " +
  "transition-colors duration-[var(--dur-2)] ease-[var(--ease-out)] " +
  "active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink-2)]",
  secondary:
    "border border-[var(--ink-3)] text-[var(--ink)] hover:bg-[var(--paper-1)]",
  ghost: "text-[var(--ink-2)] hover:text-[var(--ink)]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-7 py-3.5 text-[14px]",
  lg: "px-7 py-4 text-[15px]",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type Props =
  | (BaseProps & { href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        "href" | "className"
      >)
  | (BaseProps & { href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        "className"
      >);

/**
 * Polymorphic CTA. Renders <Link> when `href` is set, otherwise <button>.
 * Shared component — no client code, safe in server and client trees.
 */
export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (typeof rest.href === "string") {
    const { href, ...anchorRest } = rest;
    return (
      <Link href={href} className={cls} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest: ButtonHTMLAttributes<HTMLButtonElement> = rest;
  return (
    <button className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
