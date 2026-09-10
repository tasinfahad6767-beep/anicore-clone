import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/anicore/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniCore — The Living Anime Index",
  description: "A living anime index unified across Kitsu, TVDB, TMDB, AniList, and MyAnimeList. Self-hosted, fast, no ads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
