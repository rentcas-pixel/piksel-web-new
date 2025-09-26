import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalSidebar from "@/components/GlobalSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "PIKSEL - LED Ekranų Reklama Lietuvoje",
  description: "Profesionalūs LED ekranų reklamos sprendimai Lietuvoje. Kokybiškos reklamos paslaugos naudojant moderniausią technologiją.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
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
