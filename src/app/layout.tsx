import type { Metadata } from "next";
import localFont from "next/font/local";
import { STIX_Two_Text } from "next/font/google";
import "./globals.css";
import { AnimationProvider } from "@/context/AnimationContext";
import { WorksProvider } from "@/context/WorksContext";
import { ExhibitionsProvider } from "@/context/ExhibitionsContext";
import { ThemeProvider } from "@/context/theme-provider";
import { InfoProvider } from "@/context/InfoContext";
import { NavProvider } from "@/context/NavContext";
import { UIProvider } from "@/context/UIContext";
import { IndexProvider } from "@/context/IndexContext";
import { NavSlotProvider } from "@/context/NavSlotContext";
import ESNav from "@/components/ESNav";
// The "under construction" overlay (UnderConstruction) is off for now.
import ESScreenSaver from "@/components/ESScreenSaver";

import NavWrapper from "@/components/NavWrapper";
import InkBleedFilter from "@/components/InkBleedFilter";

import ContentWrapper from "@/components/ContentWrapper";

import { CarouselProvider } from "@/context/CarouselContext";

import { ActivityProvider } from "@/context/ActivityContext";
import { getRecentActivity } from "../../lib/sanity";
import DesktopNav from "@/components/DesktopNav";

const areal = localFont({
  src: [
    {
      path: "../../public/fonts/ABCAreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCAreal-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCAreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCAreal-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCAreal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCAreal-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-areal",
});

const arealMono = localFont({
  src: [
    {
      path: "../../public/fonts/ABCArealMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCArealMono-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCArealMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCArealMono-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCArealMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCArealMono-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-arealMono",
});

// GT Alpina (trial) — one family per width/cut, each with Thin–Bold and
// italics. preload: false so the many files only load when a class is used.
const gtAlpina = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Standard-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Standard-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpina",
  preload: false,
});

const gtAlpinaCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Condensed-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpinaCondensed",
  preload: false,
});

const gtAlpinaExtended = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Extended-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Extended-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpinaExtended",
  preload: false,
});

const gtAlpinaFine = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Standard-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpinaFine",
  preload: false,
});

const gtAlpinaFineCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Condensed-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpinaFineCondensed",
  preload: false,
});

const gtAlpinaFineExtended = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Fine-Extended-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpinaFineExtended",
  preload: false,
});

const gtAlpinaTypewriter = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Thin-Trial.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Thin-Italic-Trial.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Light-Italic-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Regular-Italic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Medium-Italic-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Alpina-Typewriter-Bold-Italic-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gtAlpinaTypewriter",
  preload: false,
});

// GT America Compressed — Regular, Medium, Bold, Black (no italics).
const gtAmericaCompressed = localFont({
  src: [
    {
      path: "../../public/fonts/GT-America-Compressed-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-America-Compressed-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-America-Compressed-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-America-Compressed-Black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gtAmericaCompressed",
  preload: false,
});

// GT America Condensed — Black only.
const gtAmericaCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/GT-America-Condensed-Black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gtAmericaCondensed",
  preload: false,
});

// FM FreeSerif (font-fm). OTF for now.
const fm = localFont({
  src: "../../public/fonts/FM-FreeSerif.otf",
  variable: "--font-fm",
  preload: false,
});

// Alte Haas Grotesk (font-alteHaas): regular and bold.
const alteHaas = localFont({
  src: [
    {
      path: "../../public/fonts/altehaasgroteskregular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/altehaasgroteskbold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-alteHaas",
});

// Gensco (font-gensco).
const gensco = localFont({
  src: "../../public/fonts/gensco-webfont.woff2",
  variable: "--font-gensco",
});

// STIX Two Text (Google Fonts) — the site's text face (font-stix). A
// variable font: every weight 400–700, plus italics.
const stixTwoText = STIX_Two_Text({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-stix",
});

export const metadata: Metadata = {
  title: "elinorsilow.com",
  description: "The artist known as Elinor Silow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const updates = await getRecentActivity(20);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${areal.variable} ${arealMono.variable} ${gtAlpina.variable} ${gtAlpinaCondensed.variable} ${gtAlpinaExtended.variable} ${gtAlpinaFine.variable} ${gtAlpinaFineCondensed.variable} ${gtAlpinaFineExtended.variable} ${gtAlpinaTypewriter.variable} ${gtAmericaCompressed.variable} ${gtAmericaCondensed.variable} ${fm.variable} ${gensco.variable} ${alteHaas.variable} ${stixTwoText.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // A new key: the site has no theme toggle now, so it follows the
          // device; a choice saved by the old toggle ("theme") would keep
          // overriding that.
          storageKey="es-theme"
          disableTransitionOnChange
        >
          <WorksProvider>
            <ExhibitionsProvider>
              <InfoProvider>
                <NavProvider>
                  <UIProvider>
                    <IndexProvider>
                      <ActivityProvider updates={updates}>
                        <NavSlotProvider>
                          <AnimationProvider>
                            {/* Column shadow overlay — fixed, covers full viewport */}

                            <CarouselProvider>
                              <InkBleedFilter />
                              <ESNav />
                              <ESScreenSaver />
                              {children}
                            </CarouselProvider>
                          </AnimationProvider>
                        </NavSlotProvider>
                      </ActivityProvider>
                    </IndexProvider>
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
