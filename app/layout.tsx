import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Suppress TypeScript error about missing type declarations for CSS side-effect import
// @ts-ignore
import "./globals.css";
import { cn } from "@/lib/utils";
import {ConvexClientProvider} from "./convex-client-provider";
import { Toaster } from "react-hot-toast";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextStore",
    template: "%s | NextStore",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
          <Toaster/>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
