import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { AppStateProvider } from "@/lib/state/app-state";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pace-nutrition.vercel.app"),
  title: "Pace - food diary & meal logger",
  description:
    "Pace is a calm, photo-first food diary. Snap a meal, log it in seconds, and keep a tidy record of what you eat.",
  applicationName: "Pace",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pace - food diary & meal logger",
    description:
      "A calm, photo-first food diary. Snap a meal, log it in seconds, and keep a tidy record of what you eat.",
    url: "/",
    siteName: "Pace",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Pace",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full text-ink font-body">
        <PwaRegister />
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
