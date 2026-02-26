import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnimationProvider } from "@/context/AnimationContext";
import { WorksProvider } from "@/context/WorksContext";
import { ExhibitionsProvider } from "@/context/ExhibitionsContext";
import { ThemeProvider } from "@/context/theme-provider";
import { InfoProvider } from "@/context/InfoContext";
import { NavProvider } from "@/context/NavContext";
import { UIProvider } from "@/context/UIContext";

import MobileNavButton from "@/components/MobileNavButton";

import BodyClassManager from "@/components/BodyClassManager";
import DesktopNav from "@/components/DesktopNav";

import { CarouselProvider } from "@/context/CarouselContext";

const directorMono = localFont({
  src: "assets/fonts/Director-Regular.ttf",
  variable: "--font-directorMono",
});

const directorBold = localFont({
  src: "assets/fonts/Director-Bold.woff",
  variable: "--font-directorBold",
});

const directorLight = localFont({
  src: "assets/fonts/Director-Light.ttf",
  variable: "--font-directorLight",
});

const gintoNordBlack = localFont({
  src: "assets/fonts/Ginto Nord Black.ttf",
  variable: "--font-gintoNordBlack",
});

const gintoBlack = localFont({
  src: "assets/fonts/Ginto Black.ttf",
  variable: "--font-gintoBlack",
});

const gintoBlackItalic = localFont({
  src: "assets/fonts/Ginto Black Italic.ttf",
  variable: "--font-gintoBlackItalic",
});

const gintoRegular = localFont({
  src: "assets/fonts/Ginto Regular.ttf",
  variable: "--font-gintoRegular",
});

const gintoRegularItalic = localFont({
  src: "assets/fonts/Ginto Regular Italic.ttf",
  variable: "--font-gintoRegularItalic",
});

const gintoMedium = localFont({
  src: "assets/fonts/Ginto Medium.ttf",
  variable: "--font-gintoMedium",
});

const EBGaramond = localFont({
  src: "assets/fonts/EBGaramond12-Regular.woff",
  variable: "--font-EBGaramond",
});

const EBGaramondItalic = localFont({
  src: "assets/fonts/EBGaramond12-Italic.woff",
  variable: "--font-EBGaramondItalic",
});

const EBGaramondAC = localFont({
  src: "assets/fonts/EBGaramond12-AllSC.woff",
  variable: "--font-EBGaramondAC",
});

const libreBaskerville = localFont({
  src: "assets/fonts/LibreBaskerville-Regular.otf",
  variable: "--font-libreBaskerville",
});

const libreBaskervilleBold = localFont({
  src: "assets/fonts/LibreBaskerville-Bold.otf",
  variable: "--font-libreBaskervilleBold",
});

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

const neueHaas = localFont({
  src: "assets/fonts/NHaasGroteskTXPro-55Rg.ttf",
  variable: "--font-neueHaas",
});

const pressura = localFont({
  src: "assets/fonts/gt-pressura-mono-regular.woff",
  variable: "--font-pressura",
});

const pressuraLight = localFont({
  src: "assets/fonts/gt-pressura-mono-light.woff",
  variable: "--font-pressuraLight",
});

export const metadata: Metadata = {
  title: "elinorsilow.com",
  description: "The artist known as Elinor Silow",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${libreBaskervilleBold.variable} ${libreBaskerville.variable} ${timesNewerRoman.variable} ${timesNewerRomanItalic.variable} ${timesNewerRomanBold.variable}  ${neueHaas.variable}   ${pressura.variable} ${pressuraLight.variable} ${EBGaramond.variable} ${EBGaramondItalic.variable} ${EBGaramondAC.variable} ${gintoNordBlack.variable} ${gintoBlack.variable} ${gintoBlackItalic.variable} ${gintoRegular.variable}  ${gintoRegularItalic.variable} ${gintoMedium.variable} ${directorMono.variable} ${directorBold.variable} ${directorLight.variable}   antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WorksProvider>
            <ExhibitionsProvider>
              <InfoProvider>
                <NavProvider>
                  <UIProvider>
                    <AnimationProvider>
                      <BodyClassManager />
                      <DesktopNav />
                      <MobileNavButton />

                      <CarouselProvider>
                        {children} {modal}
                      </CarouselProvider>
                    </AnimationProvider>
                  </UIProvider>
                </NavProvider>
              </InfoProvider>
            </ExhibitionsProvider>
          </WorksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
