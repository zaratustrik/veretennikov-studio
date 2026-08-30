"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { goal } from "@/lib/metrika";

/**
 * Ссылка-CTA, которая заодно ставит цель в Метрике.
 *
 * Нужна, чтобы серверные страницы не превращались в клиентские целиком
 * ради одного onClick: клиентская граница проходит по самой кнопке.
 * Если согласия на аналитику нет, goal() молча ничего не делает.
 */
export default function CtaLink({
  href,
  goalName,
  goalParams,
  className,
  style,
  children,
  target,
  rel,
}: {
  href: string;
  goalName: string;
  goalParams?: Record<string, unknown>;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  target?: string;
  rel?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

  if (external) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        target={target}
        rel={rel}
        onClick={() => goal(goalName, goalParams)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={() => goal(goalName, goalParams)}
    >
      {children}
    </Link>
  );
}
