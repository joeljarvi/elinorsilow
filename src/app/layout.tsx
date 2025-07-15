import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnimationProvider } from "@/context/AnimationContext";

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
    <html lang="en">
      <body
        className={`${timesNewerRoman.variable} ${timesNewerRomanItalic.variable} ${timesNewerRomanBold.variable} ${newEdge666UltraBoldRounded.variable} antialiased`}
      >
        <AnimationProvider>{children}</AnimationProvider>
      </body>
    </html>
  );
}
