import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalSidebar from "@/components/GlobalSidebar";
import StructuredData from "@/components/StructuredData";
import { ToastProvider } from "@/components/ui/Toast";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "PIKSEL - LED Reklamos Tinklas ir Lyderis Lietuvoje | Reklama Lauke",
  description: "PIKSEL - didžiausias LED ekranų reklamos tinklas Lietuvoje. Profesionalūs LED reklamos ekranai Vilniuje, Kaune, Klaipėdoje ir kituose miestuose. Reklama lauke su aukšta kokybe ir strateginėmis vietomis. LED reklamos lyderiai ir tinklas Lietuvoje.",
  keywords: [
    "reklama ekranuose",
    "reklama led ekrane",
    "led ekranai",
    "lauko ekranai",
    "reklamos tinklas",
    "lauko reklamos tinklas",
    "video ekranai",
    "LED reklamos tinklas Lietuvoje",
    "LED reklamos lyderiai",
    "reklama lauke",
    "LED ekranai Lietuvoje",
    "LED reklama Vilnius",
    "LED reklama Kaunas",
    "LED reklama Klaipėda",
    "outdoor advertising Lithuania",
    "LED screen advertising",
    "didžiausias LED tinklas",
    "ryškių ekranų tinklas",
    "LED reklamos paslaugos",
    "reklamos ekranai",
    "LED ekranų reklama"
  ],
  alternates: {
    canonical: "https://piksel.lt",
  },
  openGraph: {
    title: "PIKSEL - LED Reklamos Tinklas ir Lyderis Lietuvoje",
    description: "PIKSEL - didžiausias LED ekranų reklamos tinklas Lietuvoje. Profesionalūs LED reklamos ekranai su aukšta kokybe ir strateginėmis vietomis. Reklama lauke Vilniuje, Kaune, Klaipėdoje.",
    url: "https://piksel.lt",
    siteName: "PIKSEL",
    images: [
      {
        url: "https://piksel.lt/sliede-1.jpeg",
        width: 1200,
        height: 630,
        alt: "PIKSEL LED reklamos ekranas - LED reklamos tinklas Lietuvoje",
      },
    ],
    locale: "lt_LT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIKSEL - LED Reklamos Tinklas ir Lyderis Lietuvoje",
    description: "PIKSEL - didžiausias LED ekranų reklamos tinklas Lietuvoje. Reklama lauke su aukšta kokybe.",
    images: ["https://piksel.lt/sliede-1.jpeg"],
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    shortcut: '/favicon.svg?v=2',
    apple: '/favicon.svg?v=2',
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
        <StructuredData />
      </head>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ToastProvider>
          <GlobalSidebar />
          <Navigation />
          <main>
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
