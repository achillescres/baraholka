import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from '@/widgets/header/ui/Header';

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Барахолка",
  description: "Платформа для покупки и продажи товаров",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main className="min-h-screen bg-gray-50">
        {children}
        </main>
      </body>
    </html>
  );
}
