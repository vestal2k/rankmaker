import type { Metadata } from "next";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProviderWithTheme } from "@/components/clerk-provider-with-theme";
import "./globals.css";

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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProviderWithTheme>
            <Header />
            {children}
          </ClerkProviderWithTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}
