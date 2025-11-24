"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Rankmaker
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/explore" className="text-sm hover:underline">
              Explore
            </Link>
            {isSignedIn && (
              <Link href="/create" className="text-sm hover:underline">
                Create
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
