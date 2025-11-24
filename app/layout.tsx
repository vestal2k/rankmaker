import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tierlist Maker",
  description: "Create and share tier lists with your community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
