import type { Metadata } from "next";
import "./deck.css";

/**
 * Decks are closed working documents: full-screen, no site chrome,
 * excluded from indexing at both the metadata and robots.txt level.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1">{children}</div>;
}
