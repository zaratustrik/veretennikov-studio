import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import PageTransition from "@/components/public/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
