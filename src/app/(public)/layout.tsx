import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AttributionCapture from "@/components/public/AttributionCapture";
import "@/components/public/studio.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="studio-site">
      <a className="studio-skip" href="#main-content">Перейти к содержимому</a>
      <AttributionCapture />
      <Header />
      <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
