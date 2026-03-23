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

import BodyClassManager from "@/components/BodyClassManager";
import NavWrapper from "@/components/NavWrapper";
import NavSpacer from "@/components/NavSpacer";

import { CarouselProvider } from "@/context/CarouselContext";

const bookish = localFont({
  src: "assets/fonts/Bookish-Book-TRIAL.otf",
  variable: "--font-bookish",
});

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

const universNextPro = localFont({
  src: [
    { path: "assets/fonts/UniversNextPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "assets/fonts/UniversNextPro-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-universNextPro",
});

const universNextProExt = localFont({
  src: [
    { path: "assets/fonts/UniversNextPro-Ext.ttf", weight: "400", style: "normal" },
    { path: "assets/fonts/UniversNextPro-ExtItalic.ttf", weight: "400", style: "italic" },
    { path: "assets/fonts/UniversNextPro-MediumExt.ttf", weight: "500", style: "normal" },
    { path: "assets/fonts/UniversNextPro-MediumExtIt.ttf", weight: "500", style: "italic" },
    { path: "assets/fonts/UniversNextPro-HeavyExt.ttf", weight: "800", style: "normal" },
    { path: "assets/fonts/UniversNextPro-HeavyExtIt.ttf", weight: "800", style: "italic" },
  ],
  variable: "--font-universNextProExt",
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
        className={`${EBGaramond.variable} ${EBGaramondItalic.variable} ${EBGaramondAC.variable} ${directorMono.variable} ${directorBold.variable} ${directorLight.variable} ${bookish.variable} ${universNextPro.variable} ${universNextProExt.variable} antialiased`}
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
                      {/* Column shadow overlay — fixed, covers full viewport */}
                      <div className="fixed inset-0 pointer-events-none z-[5] hidden lg:grid lg:grid-cols-2">
                        <div className="shadow-[var(--shadow-col-left)]" />
                        <div className="shadow-[var(--shadow-col-right)]" />
                      </div>
                      <NavWrapper />

                      {/* <div className="fixed top-0 left-0 w-full h-8 bg-gradient-to-b from-background to-background/0 z-50 pointer-events-none" />
                      <div className="fixed bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-background/0 z-50 pointer-events-none" /> */}
                      <CarouselProvider>
                        <NavSpacer />
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
