import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

/**
 * Markdown renderer styled in the Editorial Engineering language.
 * Shared component (no client code) — used by the public article page
 * and the admin live preview. Raw HTML is not rendered (no rehype-raw);
 * rehype-sanitize is kept as defence in depth.
 */

const components: Components = {
  h1: ({ children }) => (
    <h2 className="h2 text-h2 mt-s8 mb-s4 first:mt-0">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="h2 text-h2 mt-s8 mb-s4 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="h3 text-h3 mt-s7 mb-s3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-s4 text-[var(--ink-2)] leading-[var(--lh-relaxed)]">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-[var(--cobalt)] underline underline-offset-2 decoration-[var(--cobalt)]/40 hover:decoration-[var(--cobalt)] transition-colors"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="my-s4 pl-s5 list-disc marker:text-[var(--ink-3)] space-y-s2 text-[var(--ink-2)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-s4 pl-s5 list-decimal marker:text-[var(--ink-3)] space-y-s2 text-[var(--ink-2)]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-[var(--lh-relaxed)]">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-s5 pl-s5 border-l-2 border-[var(--cobalt)] h3 text-h3 italic text-[var(--ink)]">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--ink)]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="my-s8 border-0 border-t border-[var(--rule)]" />,
  pre: ({ children }) => (
    <pre className="my-s5 p-s4 overflow-x-auto rounded-[4px] bg-[var(--ink)] text-[var(--paper-1)] text-[0.85em] leading-[var(--lh-normal)] [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.875em] rounded-[2px] bg-[var(--paper-2)] px-1.5 py-0.5 text-[var(--ink)]">
      {children}
    </code>
  ),
  img: ({ src, alt }) => (
    // Markdown images carry no intrinsic dimensions — a plain <img> is the
    // pragmatic choice over next/image here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      loading="lazy"
      className="my-s6 w-full rounded-[4px] border border-[var(--rule)]"
    />
  ),
  table: ({ children }) => (
    <div className="my-s5 overflow-x-auto">
      <table className="w-full border-collapse text-[0.9em]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-[var(--rule)] px-s3 py-s2 text-left font-mono text-[0.8em] uppercase tracking-wide text-[var(--ink-3)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-[var(--rule)] px-s3 py-s2 text-[var(--ink-2)]">
      {children}
    </td>
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
