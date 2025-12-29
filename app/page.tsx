"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Sparkles,
  Loader2,
  Star,
  Zap,
  Heart,
  Palette,
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
  { name: "Games", icon: Gamepad2, gradient: "from-purple-500 to-indigo-600", shadow: "shadow-purple" },
  { name: "Movies", icon: Film, gradient: "from-red-500 to-pink-600", shadow: "shadow-pink" },
  { name: "TV Shows", icon: Tv, gradient: "from-blue-500 to-cyan-600", shadow: "shadow-blue" },
  { name: "Music", icon: Music, gradient: "from-green-500 to-emerald-600", shadow: "shadow-green" },
  { name: "Food", icon: Utensils, gradient: "from-orange-500 to-amber-600", shadow: "shadow-playful" },
  { name: "Sports", icon: Trophy, gradient: "from-yellow-500 to-orange-600", shadow: "shadow-playful" },
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
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Super Playful */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-yellow-400/30 dark:from-orange-500/20 dark:to-yellow-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-tr from-pink-400/25 to-purple-400/25 dark:from-pink-500/15 dark:to-purple-500/15 rounded-full blur-3xl animate-blob animate-delay-200" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-gradient-to-bl from-green-400/20 to-cyan-400/20 dark:from-green-500/10 dark:to-cyan-500/10 rounded-full blur-3xl animate-blob animate-delay-400" />

          {/* Decorative floating elements */}
          <div className="absolute top-20 left-[15%] w-4 h-4 bg-orange-400 rounded-full animate-float opacity-60" />
          <div className="absolute top-40 right-[20%] w-3 h-3 bg-pink-400 rounded-full animate-float animate-delay-300 opacity-60" />
          <div className="absolute bottom-32 left-[25%] w-5 h-5 bg-yellow-400 rounded-full animate-float animate-delay-100 opacity-50" />
          <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-purple-400 rounded-full animate-float animate-delay-500 opacity-70" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Mascot with wiggle animation */}
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity scale-150" />
                <Image
                  src="/logo.png"
                  alt="Rankmaker Fox Mascot"
                  width={160}
                  height={160}
                  className="relative drop-shadow-2xl hover-wiggle cursor-pointer"
                  priority
                />
              </div>
            </div>

            {/* Title with gradient animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                Rank Everything
              </span>
              <br />
              <span className="text-foreground relative inline-block">
                Share Everywhere
                <Sparkles className="absolute -top-2 -right-8 w-8 h-8 text-yellow-500 animate-bounce-playful" />
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
              Create awesome tier lists for <span className="text-purple-500 font-bold">games</span>, <span className="text-pink-500 font-bold">movies</span>, <span className="text-orange-500 font-bold">food</span>, and literally anything else!
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-5 justify-center flex-wrap">
              <Link href="/create">
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 shadow-playful-lg btn-playful font-bold"
                >
                  <Zap className="mr-2 w-5 h-5" />
                  Create Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 rounded-2xl border-3 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-400 dark:hover:border-orange-600 font-bold hover-lift"
                >
                  <Star className="mr-2 w-5 h-5 text-orange-500" />
                  Explore
                </Button>
              </Link>
            </div>

            {/* Fun stats */}
            <div className="mt-12 flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold">
                <Heart className="w-4 h-4" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-semibold">
                <Zap className="w-4 h-4" />
                <span>Instant Share</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold">
                <Palette className="w-4 h-4" />
                <span>Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Playful Grid */}
      <section className="py-16 relative">
        <div className="absolute inset-0 dots-pattern opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-playful animate-bounce-playful">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black">Pick a Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 max-w-5xl mx-auto">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/explore?category=${category.name.toLowerCase()}`}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className={`p-6 text-center card-bouncy border-0 ${category.shadow} cursor-pointer bg-card/80 backdrop-blur-sm`}>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-bold text-base">{category.name}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Tier Lists */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-playful animate-wiggle">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">Top Tier Lists</h2>
            </div>
            <Link href="/explore">
              <Button
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-950/30 font-bold rounded-xl px-6"
              >
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-orange-400/30 animate-pulse" />
              </div>
            </div>
          ) : topTierlists.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6 relative inline-block">
                <Users className="w-20 h-20 mx-auto text-muted-foreground/30" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce-playful" />
              </div>
              <p className="text-xl text-muted-foreground mb-6 font-medium">No tier lists yet. Be the first!</p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-2xl px-8 py-6 text-lg font-bold shadow-playful-lg btn-playful">
                  <Zap className="mr-2 w-5 h-5" />
                  Create First Tier List
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTierlists.map((tierlist, index) => (
                <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                  <Card
                    className="overflow-hidden group card-playful cursor-pointer rounded-3xl border-0 shadow-soft hover:shadow-playful-lg bg-card/90 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tierlist.coverImageUrl ? (
                      <div className="w-full h-40 overflow-hidden bg-muted">
                        <img
                          src={tierlist.coverImageUrl}
                          alt={tierlist.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 dark:from-orange-950/40 dark:via-pink-950/40 dark:to-purple-950/40 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt=""
                          width={70}
                          height={70}
                          className="opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-2 truncate group-hover:text-orange-500 transition-colors">
                        {tierlist.title}
                      </h3>
                      {tierlist.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {tierlist.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        {tierlist.user?.imageUrl ? (
                          <img
                            src={tierlist.user.imageUrl}
                            alt={tierlist.user?.username || "User"}
                            className="w-8 h-8 rounded-full ring-2 ring-orange-300 dark:ring-orange-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                            {tierlist.user?.username?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="text-sm font-medium text-muted-foreground">
                          {tierlist.user?.username || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                          tierlist.voteScore > 0
                            ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400"
                            : tierlist.voteScore < 0
                              ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                              : "bg-muted text-muted-foreground"
                        } font-semibold`}>
                          <ArrowBigUp className="w-4 h-4" />
                          <span>{tierlist.voteScore}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold">
                          <MessageCircle className="w-4 h-4" />
                          <span>{tierlist._count.comments}</span>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(tierlist.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Super Fun */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
        <div className="absolute inset-0 dots-pattern opacity-20" />

        {/* Floating decorative elements */}
        <div className="absolute top-10 left-[10%] w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-10 right-[15%] w-32 h-32 bg-white/10 rounded-full blur-xl animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-[5%] opacity-20 pointer-events-none">
          <Image
            src="/logo.png"
            alt=""
            width={200}
            height={200}
            className="animate-float"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Join the fun!</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Ready to Rank?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-lg mx-auto font-medium">
            Create your first tier list in seconds. No signup required!
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="text-lg px-12 py-7 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 shadow-2xl font-bold btn-playful hover:scale-110"
            >
              <Zap className="mr-2 w-5 h-5" />
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal & Fun */}
      <footer className="py-8 bg-card border-t border-orange-200/50 dark:border-orange-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <Image
                src="/logo.png"
                alt="Rankmaker"
                width={36}
                height={36}
                className="group-hover:animate-wiggle"
              />
              <span className="text-xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Rankmaker
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Made with <Heart className="inline w-4 h-4 text-pink-500 animate-pulse" /> for ranking enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
