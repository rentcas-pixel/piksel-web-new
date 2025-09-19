import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalSidebar from "@/components/GlobalSidebar";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Ryškių ekranų tinklas",
  description: "Profesionalūs LED reklamos ekranai Lietuvoje. Reklama ekranuose Vilniuje, Kaune, Klaipėdoje. LED reklama su aukšta kokybe ir strateginiais vietomis.",
  keywords: "LED ekranai, reklama ekranuose, led reklama, reklamos ekranai, LED reklamos ekranai Lietuvoje",
  openGraph: {
    title: "Ryškių ekranų tinklas",
    description: "Profesionalūs LED reklamos ekranai Lietuvoje. Reklama ekranuose su aukšta kokybe.",
    url: "https://nextjs-table-app-stable.vercel.app",
    siteName: "PIKSEL",
    images: [
      {
        url: "https://nextjs-table-app-stable.vercel.app/sliede-1.jpeg",
        width: 1200,
        height: 630,
        alt: "LED reklamos ekranas Vilniaus centre - reklama ekranuose",
      },
    ],
    locale: "lt_LT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryškių ekranų tinklas",
    description: "Profesionalūs LED reklamos ekranai Lietuvoje. Reklama ekranuose su aukšta kokybe.",
    images: ["https://nextjs-table-app-stable.vercel.app/sliede-1.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <head>
        <StructuredData
          type="organization"
          name="PIKSEL"
          description="Profesionalūs LED reklamos ekranai Lietuvoje. Reklama ekranuose su aukšta kokybe ir strateginiais vietomis."
          url="https://nextjs-table-app-stable.vercel.app"
          logo="https://nextjs-table-app-stable.vercel.app/Piksel-logo-black-2023.png"
          contactPoint={{
            telephone: "+37069066633",
            contactType: "customer service"
          }}
          address={{
            addressLocality: "Vilnius",
            addressCountry: "LT"
          }}
          services={[
            "LED reklamos ekranai",
            "Reklama ekranuose",
            "Lauko reklama",
            "LED reklama"
          ]}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <GlobalSidebar />
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
