import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import prisma from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pengaturan = await prisma.pengaturan.findUnique({
    where: { id: 1 },
    select: { logoWebsite: true },
  });

  return (
    <>
      <Header logoUrl={pengaturan?.logoWebsite || undefined} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
