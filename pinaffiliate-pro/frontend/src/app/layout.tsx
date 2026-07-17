import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "PinAffiliate Pro — Create Pins, Add Affiliate Links, Earn More",
    template: "%s | PinAffiliate Pro",
  },
  description:
    "The all-in-one workspace for Pinterest creators and affiliate marketers to publish pins, attach affiliate links, and track what actually earns.",
  metadataBase: new URL("https://pinaffiliatepro.com"),
  openGraph: {
    title: "PinAffiliate Pro",
    description: "Create pins. Add affiliate links. Earn more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PinAffiliate Pro",
    description: "Create pins. Add affiliate links. Earn more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER_ID && (
          <Script
            src="https://media.ethicalads.io/media/client/ethicalads.min.js"
            strategy="afterInteractive"
            async
          />
        )}
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
