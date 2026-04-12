import type { Metadata } from "next";
import { Nunito, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SoundProvider } from "@/providers/SoundProvider";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nihongo Ninja - Learn Japanese!",
  description: "A fun Japanese language learning game for kids. Learn hiragana, katakana, and vocabulary through interactive games!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${notoJp.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-body">
        <ThemeProvider>
          <SoundProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <footer className="py-kid-4 text-center text-body-sm text-text-muted border-t border-border">
              <p>Nihongo Ninja - Learn Japanese the fun way!</p>
            </footer>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
