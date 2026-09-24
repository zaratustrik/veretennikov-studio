import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AttributionCapture from "@/components/public/AttributionCapture";
import SiteMotion from "@/components/public/SiteMotion";
import { Source_Serif_4 } from "next/font/google";
import "@/components/public/studio.css";

const siteDisplay = Source_Serif_4({
  variable: "--font-sitev21-display",
  subsets: ["latin", "cyrillic"],
  axes: ["opsz"],
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`studio-site ${siteDisplay.variable}`}>
      <a className="studio-skip" href="#main-content">Перейти к содержимому</a>
      <AttributionCapture />
      <SiteMotion />
      <Header />
      <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
