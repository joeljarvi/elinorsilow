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
import UnderConstruction from "@/components/UnderConstruction";

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

const baskervilleNeo = localFont({
  src: [
    {
      path: "../../public/fonts/BaskervilleNeo-Text.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-baskervilleNeo",
});

// Caslon Ionic (trial) — only the Bold cut is included, so it's used for
// every weight.
const caslonIonic = localFont({
  src: [
    {
      path: "../../public/fonts/CaslonIonic-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-caslonIonic",
});

const caslonIonicRounded = localFont({
  src: [
    {
      path: "../../public/fonts/CaslonIonicRounded-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-caslonIonicRounded",
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

// Edict Text (trial) — Book, Regular, Medium. Book is the lightest cut, so
// it's registered as 300 (font-light).
const edictText = localFont({
  src: [
    {
      path: "../../public/fonts/EdictTextTrial-Book.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/EdictTextTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/EdictTextTrial-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-edictText",
  preload: false,
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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  const updates = await getRecentActivity(20);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${areal.variable} ${arealMono.variable} ${baskervilleNeo.variable} ${caslonIonic.variable} ${caslonIonicRounded.variable} ${gtAlpina.variable} ${gtAlpinaCondensed.variable} ${gtAlpinaExtended.variable} ${gtAlpinaFine.variable} ${gtAlpinaFineCondensed.variable} ${gtAlpinaFineExtended.variable} ${gtAlpinaTypewriter.variable} ${gtAmericaCompressed.variable} ${gtAmericaCondensed.variable} ${edictText.variable} ${stixTwoText.variable} antialiased`}
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
                    <IndexProvider>
                      <ActivityProvider updates={updates}>
                        <NavSlotProvider>
                          <AnimationProvider>
                            {/* Column shadow overlay — fixed, covers full viewport */}

                            <CarouselProvider>
                              <InkBleedFilter />
                              <ESNav />
                              <UnderConstruction />
                              {children} {modal}
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
