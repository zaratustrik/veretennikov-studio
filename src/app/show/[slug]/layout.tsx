import PublicLayout from "@/app/(public)/layout";

export default function ShowLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}