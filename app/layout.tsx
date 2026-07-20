import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TeresaPublicChat } from "@/components/integrations/TeresaPublicChat";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { getDefaultMetadata } from "@/lib/metadata";
import "@/styles/globals.css";

export { getDefaultMetadata as metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-black font-sans text-white antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <div className="flex min-h-screen">
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <TeresaPublicChat />
        </div>
      </body>
    </html>
  );
}
