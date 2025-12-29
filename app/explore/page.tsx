"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle, Compass, Zap, Loader2, Sparkles, Search } from "lucide-react";

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

export default function ExplorePage() {
  const [tierlists, setTierlists] = useState<TierListPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTierLists();
  }, []);

  const loadTierLists = async () => {
    try {
      const response = await fetch("/api/tierlists/public");
      if (!response.ok) throw new Error("Failed to load tier lists");
      const data = await response.json();
      setTierlists(data);
    } catch (error) {
      console.error("Error loading tier lists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animate-delay-300" />
        <div className="absolute inset-0 dots-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-purple animate-bounce-playful">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Explore
                </span>
              </h1>
              <p className="text-muted-foreground font-medium">Discover amazing tier lists</p>
            </div>
          </div>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 rounded-xl shadow-playful font-bold btn-playful px-6 py-6">
              <Zap className="w-5 h-5 mr-2" />
              Create New
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-purple-400/30 animate-pulse" />
            </div>
          </div>
        ) : tierlists.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8 relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/40 dark:to-blue-950/40 rounded-3xl flex items-center justify-center mx-auto">
                <Search className="w-16 h-16 text-purple-300 dark:text-purple-700" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce-playful" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No tier lists yet!</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Be the first to create and share your rankings with the community.
            </p>
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-2xl px-10 py-7 text-lg font-bold shadow-playful-lg btn-playful">
                <Zap className="w-5 h-5 mr-2" />
                Create the first one!
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierlists.map((tierlist, index) => (
              <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                <Card
                  className="overflow-hidden group card-playful cursor-pointer rounded-3xl border-0 shadow-soft hover:shadow-playful-lg bg-card/90 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
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
                    <div className="w-full h-40 bg-gradient-to-br from-purple-200 via-blue-200 to-cyan-200 dark:from-purple-950/40 dark:via-blue-950/40 dark:to-cyan-950/40 flex items-center justify-center">
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
                    <h3 className="font-bold text-xl mb-2 truncate group-hover:text-purple-500 transition-colors">
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
                          className="w-8 h-8 rounded-full ring-2 ring-purple-300 dark:ring-purple-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-sm font-bold">
                          {tierlist.user?.username?.charAt(0).toUpperCase() || "A"}
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
    </div>
  );
}
