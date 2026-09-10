import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/anicore/Header";
import { Footer } from "@/components/anicore/Footer";
import { BackToTop } from "@/components/anicore/BackToTop";

export const metadata: Metadata = {
  title: "AniCore — The Living Anime Index",
  description: "AniCore is a living anime index unified across Kitsu, TVDB, TMDB, AniList, and MyAnimeList.",
  icons: { icon: "/favicon.svg" },
};

const themeInit = `
(function() {
  try {
    var t = localStorage.getItem('anicore-theme');
    if (!t) t = 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
