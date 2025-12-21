"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Rankmaker"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-110"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Rankmaker
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Explore
            </Link>
            {isSignedIn && (
              <Link
                href="/create"
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Create
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
