import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProviderWithTheme } from "@/components/clerk-provider-with-theme";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rankmaker.vercel.app"
  ),
  title: {
    default: "Rankmaker - Create and Share Tier Lists",
    template: "%s | Rankmaker",
  },
  description:
    "Create amazing tier lists for games, movies, food, and more. Drag and drop interface, PNG export, social features. Join thousands of users ranking their favorites.",
  keywords: [
    "tier list",
    "ranking",
    "tier list maker",
    "create tier list",
    "rank items",
    "tier list generator",
  ],
  authors: [{ name: "Rankmaker" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rankmaker.vercel.app",
    siteName: "Rankmaker",
    title: "Rankmaker - Create and Share Tier Lists",
    description:
      "Create amazing tier lists for games, movies, food, and more. Drag and drop interface, PNG export, social features.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Rankmaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rankmaker - Create and Share Tier Lists",
    description:
      "Create amazing tier lists for games, movies, food, and more. Drag and drop interface, PNG export, social features.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${nunitoSans.variable} antialiased pt-16 font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ClerkProviderWithTheme>
            <Header />
            <main>
              {children}
            </main>
          </ClerkProviderWithTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}
