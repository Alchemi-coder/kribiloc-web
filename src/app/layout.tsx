import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KribiLoc — Location immobilière vérifiée à Kribi",
  description:
    "Trouvez votre logement idéal à Kribi. Annonces vérifiées sur le terrain, recherche par quartier, certification de confiance. Publiez gratuitement.",
  openGraph: {
    title: "KribiLoc — Location immobilière vérifiée à Kribi",
    description:
      "Trouvez votre logement idéal à Kribi. Annonces vérifiées, recherche par quartier, certification terrain.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-[#111315]">
        {/* Vraie barre de progression de chargement liée aux requêtes réseau Next.js */}
        <NextTopLoader 
          color="#e4002b" 
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          crawl={true} 
          showSpinner={false} 
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #e4002b,0 0 5px #e4002b" 
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
