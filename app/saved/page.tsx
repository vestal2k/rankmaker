"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle, Heart, Loader2, Compass, Sparkles, FolderHeart } from "lucide-react";

interface SavedTierListPreview {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  savedAt: string;
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

export default function SavedPage() {
  const { isSignedIn, isLoading: isAuthLoading } = useAuth();
  const [tierlists, setTierlists] = useState<SavedTierListPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && isSignedIn) {
      loadSavedTierLists();
    } else if (!isAuthLoading && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isAuthLoading, isSignedIn]);

  const loadSavedTierLists = async () => {
    try {
      const response = await fetch("/api/users/saved");
      if (!response.ok) throw new Error("Failed to load saved tier lists");
      const data = await response.json();
      setTierlists(data);
    } catch (error) {
      console.error("Error loading saved tier lists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute inset-0 dots-pattern opacity-30" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-pink">
              <FolderHeart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Saved
              </span>
            </h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-pink-400/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute inset-0 dots-pattern opacity-30" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-pink">
              <FolderHeart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Saved
              </span>
            </h1>
          </div>
          <div className="text-center py-20">
            <div className="mb-8 relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/40 dark:to-rose-950/40 rounded-3xl flex items-center justify-center mx-auto">
                <Heart className="w-16 h-16 text-pink-300 dark:text-pink-700" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce-playful" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Sign in to see your favorites</h2>
            <p className="text-muted-foreground mb-8 text-lg">Save tier lists you love and access them anytime</p>
            <Link href="/sign-in">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-2xl px-10 py-7 text-lg font-bold shadow-pink btn-playful">
                <Sparkles className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animate-delay-300" />
        <div className="absolute inset-0 dots-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-pink animate-bounce-playful">
              <FolderHeart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Saved
                </span>
              </h1>
              <p className="text-muted-foreground font-medium">Your favorite tier lists</p>
            </div>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="rounded-xl border-2 border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/30 font-bold">
              <Compass className="w-4 h-4 mr-2" />
              Explore More
            </Button>
          </Link>
        </div>

        {tierlists.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8 relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/40 dark:to-rose-950/40 rounded-3xl flex items-center justify-center mx-auto">
                <Heart className="w-16 h-16 text-pink-300 dark:text-pink-700" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce-playful" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No saved tier lists yet</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Explore and save tier lists you love to find them here later!
            </p>
            <Link href="/explore">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-2xl px-10 py-7 text-lg font-bold shadow-pink btn-playful">
                <Compass className="w-5 h-5 mr-2" />
                Discover Tier Lists
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierlists.map((tierlist, index) => (
              <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                <Card
                  className="overflow-hidden group card-playful cursor-pointer rounded-3xl border-0 shadow-soft hover:shadow-pink bg-card/90 backdrop-blur-sm"
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
                    <div className="w-full h-40 bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 dark:from-pink-950/40 dark:via-rose-950/40 dark:to-orange-950/40 flex items-center justify-center">
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
                    <h3 className="font-bold text-xl mb-2 truncate group-hover:text-pink-500 transition-colors">
                      {tierlist.title}
                    </h3>
                    {tierlist.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tierlist.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      {tierlist.user.imageUrl ? (
                        <img
                          src={tierlist.user.imageUrl}
                          alt={tierlist.user.username}
                          className="w-8 h-8 rounded-full ring-2 ring-pink-300 dark:ring-pink-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white text-sm font-bold">
                          {tierlist.user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-muted-foreground">
                        {tierlist.user.username}
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
                        Saved {new Date(tierlist.savedAt).toLocaleDateString()}
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
