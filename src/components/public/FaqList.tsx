"use client";

import AnimatedAccordion from "@/components/motion/AnimatedAccordion";

/**
 * FAQ list — renders a question/answer array as animated accordions.
 * Replaces the native <details> blocks on product pages with a smooth
 * height-animated expand/collapse. The first item is open by default.
 */
export default function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <>
      {items.map((item, i) => (
        <AnimatedAccordion
          key={item.question}
          question={item.question}
          defaultOpen={i === 0}
        >
          {item.answer}
        </AnimatedAccordion>
      ))}
    </>
  );
}
