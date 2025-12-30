"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowBigUp,
  MessageCircle,
  Gamepad2,
  Film,
  Tv,
  Music,
  Utensils,
  Trophy,
  Users,
  Loader2,
  Zap,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

interface TierListPreview {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  user: {
    username: string;
    imageUrl: string | null;
  };
  voteScore: number;
  _count: {
    votes: number;
    comments: number;
  };
}

const CATEGORIES = [
  { name: "Games", icon: Gamepad2, color: "btn-purple" },
  { name: "Movies", icon: Film, color: "btn-coral" },
  { name: "TV Shows", icon: Tv, color: "btn-blue" },
  { name: "Music", icon: Music, color: "btn-green" },
  { name: "Food", icon: Utensils, color: "btn-yellow" },
  { name: "Sports", icon: Trophy, color: "btn-coral" },
];

export default function Home() {
  const [topTierlists, setTopTierlists] = useState<TierListPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopTierLists();
  }, []);

  const loadTopTierLists = async () => {
    try {
      const response = await fetch("/api/tierlists/top?limit=6");
      if (!response.ok) throw new Error("Failed to load tier lists");
      const data = await response.json();
      setTopTierlists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading top tier lists:", error);
      setTopTierlists([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center overflow-visible">
              <div className="relative p-4">
                <Image
                  src="/logo.png"
                  alt="Rankmaker Fox Mascot"
                  width={140}
                  height={140}
                  className="drop-shadow-2xl hover-wiggle cursor-pointer"
                  priority
                />
              </div>
            </div>

            <div className="card-cartoon p-8 mb-8 inline-block">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-zinc-900">
                Rank Everything.
                <br />
                <span className="text-[#FF6B6B]">Share Everywhere.</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
                Create tier list templates for games, movies, food, and literally anything else!
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap mb-10">
              <Link href="/create">
                <button className="btn-cartoon btn-coral flex items-center gap-2 text-lg !px-8 !py-4">
                  <Zap className="w-5 h-5" />
                  Create Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/explore">
                <button className="btn-cartoon btn-white flex items-center gap-2 text-lg !px-8 !py-4">
                  <Star className="w-5 h-5" />
                  Explore
                </button>
              </Link>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <span className="badge-cartoon bg-[#E8F5E9] text-[#2E7D32]">
                <Heart className="w-4 h-4" />
                100% Free
              </span>
              <span className="badge-cartoon bg-[#FFF3E0] text-[#E65100]">
                <Zap className="w-4 h-4" />
                Instant Share
              </span>
              <span className="badge-cartoon bg-[#E3F2FD] text-[#1565C0]">
                <Sparkles className="w-4 h-4" />
                Customizable
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="card-cartoon p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-12 h-12 bg-[#FFD43B] rounded-2xl flex items-center justify-center border-3 border-zinc-900">
                <Sparkles className="w-6 h-6 text-zinc-900" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900">Pick a Category</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={`/explore?category=${category.name.toLowerCase()}`}
                  >
                    <button className={`btn-cartoon ${category.color} w-full flex flex-col items-center gap-2 !py-4`}>
                      <Icon className="w-8 h-8" />
                      <span className="text-sm font-bold">{category.name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6B6B] rounded-2xl flex items-center justify-center border-3 border-zinc-900">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900">Top Tierlists</h2>
            </div>
            <Link href="/explore">
              <button className="btn-cartoon btn-blue flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="card-cartoon p-8">
                <Loader2 className="w-12 h-12 text-[#FF6B6B] animate-spin mx-auto" />
                <p className="mt-4 font-bold text-zinc-600">Loading...</p>
              </div>
            </div>
          ) : topTierlists.length === 0 ? (
            <div className="text-center py-16">
              <div className="card-cartoon p-8 inline-block">
                <Users className="w-16 h-16 mx-auto text-zinc-400 mb-4" />
                <p className="text-xl text-zinc-600 mb-6 font-medium">No tier lists yet. Be the first!</p>
                <Link href="/create">
                  <button className="btn-cartoon btn-coral flex items-center gap-2 mx-auto">
                    <Zap className="w-5 h-5" />
                    Create First Tier List
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {topTierlists.map((tierlist) => (
                <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                  <div className="card-cartoon overflow-hidden cursor-pointer h-full flex flex-col">
                    {tierlist.coverImageUrl ? (
                      <div className="w-full h-44 overflow-hidden flex-shrink-0">
                        <img
                          src={tierlist.coverImageUrl}
                          alt={tierlist.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/logo.png"
                          alt=""
                          width={60}
                          height={60}
                          className="opacity-50"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-xl mb-2 truncate text-zinc-900">
                        {tierlist.title}
                      </h3>
                      <p className="text-sm text-zinc-700 mb-4 line-clamp-2 min-h-[2.5rem]">
                        {tierlist.description || "No description"}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        {tierlist.user?.imageUrl ? (
                          <img
                            src={tierlist.user.imageUrl}
                            alt={tierlist.user?.username || "User"}
                            className="w-8 h-8 rounded-full border-2 border-zinc-900"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#4DABF7] flex items-center justify-center text-white text-sm font-bold border-2 border-zinc-900">
                            {tierlist.user?.username?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="text-sm font-medium text-zinc-700">
                          {tierlist.user?.username || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm mt-auto">
                        <span className={`badge-cartoon ${
                          tierlist.voteScore > 0
                            ? "bg-[#E8F5E9] text-[#2E7D32]"
                            : tierlist.voteScore < 0
                              ? "bg-[#FFEBEE] text-[#C62828]"
                              : "bg-zinc-100 text-zinc-700"
                        }`}>
                          <ArrowBigUp className="w-4 h-4" />
                          {tierlist.voteScore}
                        </span>
                        <span className="badge-cartoon bg-[#E3F2FD] text-[#1565C0]">
                          <MessageCircle className="w-4 h-4" />
                          {tierlist._count.comments}
                        </span>
                        <span className="ml-auto text-xs text-zinc-400 font-medium">
                          {new Date(tierlist.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="card-cartoon !bg-[#FF6B6B] p-12 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4 text-white">
              Ready to Rank?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-lg mx-auto font-medium">
              Create your first tier list in seconds. No signup required!
            </p>
            <Link href="/create">
              <button className="btn-cartoon btn-white text-lg !px-10 !py-4 flex items-center gap-2 mx-auto">
                <Zap className="w-5 h-5" />
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4">
        <div className="container mx-auto">
          <div className="card-cartoon-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <Image
                src="/logo.png"
                alt="Rankmaker"
                width={32}
                height={32}
                className="group-hover:animate-wiggle"
              />
              <span className="text-lg font-black text-zinc-900">
                Rankmaker
              </span>
            </div>
            <p className="text-zinc-700 text-sm font-medium">
              Made by{" "}
              <a
                href="https://github.com/vestal2k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B6B] hover:underline font-bold"
              >
                vestal
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
