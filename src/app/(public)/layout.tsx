import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import PageTransition from "@/components/public/PageTransition";
import AttributionCapture from "@/components/public/AttributionCapture";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AttributionCapture />
      <Header />
      <main className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
