import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Lobby do Titiltei",
  description:
    "O Lobby do Titiltei — módulos, matchups, builds, análises e coaching por Titiltei, Rank 1 Challenger BR.",
  openGraph: {
    title: "Lobby do Titiltei",
    description: "O Lobby do Titiltei — suba de elo com Shaco.",
    siteName: "Lobby do Titiltei",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
