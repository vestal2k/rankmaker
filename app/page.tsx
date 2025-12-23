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
  { name: "Games", icon: Gamepad2, iconColor: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-950/30" },
  { name: "Movies", icon: Film, iconColor: "text-red-500", bgColor: "bg-red-100 dark:bg-red-950/30" },
  { name: "TV Shows", icon: Tv, iconColor: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-950/30" },
  { name: "Music", icon: Music, iconColor: "text-green-500", bgColor: "bg-green-100 dark:bg-green-950/30" },
  { name: "Food", icon: Utensils, iconColor: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-950/30" },
  { name: "Sports", icon: Trophy, iconColor: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-950/30" },
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
      {/* Hero Section - Simplified */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/50 to-background dark:from-orange-950/20 dark:via-amber-950/10 dark:to-background py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-yellow-200/40 dark:from-orange-500/10 dark:to-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/30 to-blue-200/30 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Rankmaker Fox Mascot"
                  width={140}
                  height={140}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Create & Share
              </span>
              <br />
              <span className="text-foreground">Tier Lists</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Rank games, movies, food, and anything else. Share with the community.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/create">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25">
                  Create Tier List
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Browse All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/explore?category=${category.name.toLowerCase()}`}
                  className="group"
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-orange-200 dark:hover:border-orange-900 cursor-pointer">
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${category.iconColor}`} />
                    </div>
                    <span className="font-medium text-sm">{category.name}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Tier Lists */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Top Tier Lists</h2>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : topTierlists.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <Users className="w-16 h-16 mx-auto text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground mb-4">No tier lists yet. Be the first to create one!</p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  Create Tier List
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTierlists.map((tierlist) => (
                <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                  <Card className="overflow-hidden group hover:shadow-xl hover:shadow-orange-500/10 transition-all hover:-translate-y-1 border-2 hover:border-orange-200 dark:hover:border-orange-900 cursor-pointer">
                    {tierlist.coverImageUrl ? (
                      <div className="w-full h-36 overflow-hidden bg-muted">
                        <img
                          src={tierlist.coverImageUrl}
                          alt={tierlist.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt=""
                          width={60}
                          height={60}
                          className="opacity-30"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {tierlist.title}
                      </h3>
                      {tierlist.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {tierlist.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {tierlist.user?.imageUrl ? (
                          <img
                            src={tierlist.user.imageUrl}
                            alt={tierlist.user.username}
                            className="w-6 h-6 rounded-full ring-2 ring-orange-200 dark:ring-orange-900"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                            {tierlist.user?.username?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {tierlist.user?.username || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ArrowBigUp className={`w-4 h-4 ${tierlist.voteScore > 0 ? "text-green-500" : tierlist.voteScore < 0 ? "text-red-500" : ""}`} />
                          <span className={tierlist.voteScore > 0 ? "text-green-600" : tierlist.voteScore < 0 ? "text-red-600" : ""}>
                            {tierlist.voteScore}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          <span>{tierlist._count.comments}</span>
                        </div>
                        <span className="ml-auto text-xs">
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <Image
            src="/logo.png"
            alt=""
            width={300}
            height={300}
            className="rotate-12"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to Create Your Tier List?
          </h2>
          <p className="text-lg mb-6 text-orange-100">
            Join the community and start ranking today
          </p>
          <Link href="/create">
            <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-orange-600 hover:bg-orange-50 shadow-xl">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Rankmaker"
                width={28}
                height={28}
              />
              <span className="font-semibold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Rankmaker
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Rankmaker. Create and share your rankings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
