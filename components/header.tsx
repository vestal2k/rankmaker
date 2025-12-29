"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, Compass, FolderHeart, PlusCircle, LayoutGrid } from "lucide-react";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-orange-200/50 dark:border-orange-900/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Rankmaker"
              width={42}
              height={42}
              className="transition-transform group-hover:scale-110 group-hover:rotate-6"
            />
            <span className="text-xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Rankmaker
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-950/30 dark:hover:to-emerald-950/30 text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 dark:hover:from-orange-950/30 dark:hover:to-pink-950/30 text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-all"
            >
              <LayoutGrid className="w-4 h-4" />
              Categories
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-950/30 dark:hover:to-blue-950/30 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-all"
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            {isSignedIn && (
              <Link
                href="/saved"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-950/30 dark:hover:to-rose-950/30 text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-all"
              >
                <FolderHeart className="w-4 h-4" />
                Saved
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 rounded-xl shadow-playful font-bold btn-playful px-5">
                <Sparkles className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
