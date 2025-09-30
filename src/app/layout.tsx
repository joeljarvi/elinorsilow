import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnimationProvider } from "@/context/AnimationContext";
import { WorksProvider } from "@/context/WorksContext";
import { ExhibitionsProvider } from "@/context/ExhibitionsContext";
import { ThemeProvider } from "@/context/theme-provider";

const timesNewerRoman = localFont({
  src: "assets/fonts/TimesNewerRoman-Regular.woff",
  variable: "--font-Times-Newer-Roman",
});

const timesNewerRomanItalic = localFont({
  src: "assets/fonts/TimesNewerRoman-Italic.woff",
  variable: "--font-Times-Newer-Roman-Italic",
});

const timesNewerRomanBold = localFont({
  src: "assets/fonts/TimesNewerRoman-Bold.woff",
  variable: "--font-Times-Newer-Roman-Bold",
});

const newEdge666UltraBoldRounded = localFont({
  src: "assets/fonts/NewEdge666-UltraBoldRounded.woff",
  variable: "--font-NewEdge666-Ultra-Bold-Rounded",
});

const newEdge666UltraLightRounded = localFont({
  src: "assets/fonts/NewEdge666-UltraLightRounded.woff",
  variable: "--font-NewEdge666-Ultra-Light-Rounded",
});

const neueHaas = localFont({
  src: "assets/fonts/NHaasGroteskTXPro-55Rg.ttf",
  variable: "--font-neueHaas",
});

const monument = localFont({
  src: "assets/fonts/MonumentGrotesk-Regular.otf",
  variable: "--font-monument",
});

export const metadata: Metadata = {
  title: "elinorsilow.com",
  description: "The artist known as Elinor Silow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${timesNewerRoman.variable} ${timesNewerRomanItalic.variable} ${timesNewerRomanBold.variable} ${newEdge666UltraBoldRounded.variable} ${newEdge666UltraLightRounded.variable} ${neueHaas.variable} ${monument.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WorksProvider>
            <ExhibitionsProvider>
              <AnimationProvider>{children}</AnimationProvider>
            </ExhibitionsProvider>
          </WorksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
