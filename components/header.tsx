"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Compass, FolderHeart, PlusCircle, LayoutGrid, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isSignedIn, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <div className="card-cartoon-sm !rounded-full pl-5 pr-6 py-3 flex items-center justify-between overflow-visible">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border-3 border-transparent transition-all duration-150 hover:border-[#1a1a1a] hover:bg-white hover:shadow-[4px_4px_0_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#1a1a1a] overflow-visible"
          >
            <Image
              src="/logo.png"
              alt="Rankmaker"
              width={40}
              height={40}
            />
            <span className="text-xl font-black text-zinc-900 hidden sm:block">
              Rankmaker
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/explore">
              <button className="btn-cartoon btn-blue flex items-center gap-2 !py-2 !px-4 text-sm">
                <Compass className="w-4 h-4" />
                Explore
              </button>
            </Link>
            <Link href="/categories">
              <button className="btn-cartoon btn-yellow flex items-center gap-2 !py-2 !px-4 text-sm">
                <LayoutGrid className="w-4 h-4" />
                Categories
              </button>
            </Link>
            <Link href="/create">
              <button className="btn-cartoon btn-green flex items-center gap-2 !py-2 !px-4 text-sm">
                <PlusCircle className="w-4 h-4" />
                Create
              </button>
            </Link>
            {isSignedIn && (
              <Link href="/saved">
                <button className="btn-cartoon btn-purple flex items-center gap-2 !py-2 !px-4 text-sm">
                  <FolderHeart className="w-4 h-4" />
                  Saved
                </button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-zinc-900 shadow-[2px_2px_0_#1a1a1a] hover:shadow-[3px_3px_0_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user?.username}`} className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <button className="btn-cartoon btn-coral flex items-center gap-2 !py-2 !px-5 text-sm">
                  Sign In
                </button>
              </Link>
            )}

            <button
              className="md:hidden btn-cartoon btn-white !p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 card-cartoon p-4 flex flex-col gap-2">
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>
              <button className="btn-cartoon btn-blue flex items-center gap-2 w-full justify-center">
                <Compass className="w-4 h-4" />
                Explore
              </button>
            </Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
              <button className="btn-cartoon btn-yellow flex items-center gap-2 w-full justify-center">
                <LayoutGrid className="w-4 h-4" />
                Categories
              </button>
            </Link>
            <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
              <button className="btn-cartoon btn-green flex items-center gap-2 w-full justify-center">
                <PlusCircle className="w-4 h-4" />
                Create
              </button>
            </Link>
            {isSignedIn && (
              <Link href="/saved" onClick={() => setMobileMenuOpen(false)}>
                <button className="btn-cartoon btn-purple flex items-center gap-2 w-full justify-center">
                  <FolderHeart className="w-4 h-4" />
                  Saved
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
