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
        {/* Load AniCore fonts: Sora (display), Manrope (body), IBM Plex Mono (utility) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
