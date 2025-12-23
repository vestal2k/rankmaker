"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle, Bookmark, Loader2, Compass } from "lucide-react";

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
  const { isSignedIn, isLoaded } = useUser();
  const [tierlists, setTierlists] = useState<SavedTierListPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadSavedTierLists();
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

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

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Saved Tier Lists</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Saved Tier Lists</h1>
        </div>
        <div className="text-center py-20">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-6 text-lg">Sign in to see your saved tier lists</p>
          <Link href="/sign-in">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Saved Tier Lists</h1>
        </div>
        <Link href="/explore">
          <Button variant="outline">
            <Compass className="w-4 h-4 mr-2" />
            Explore More
          </Button>
        </Link>
      </div>

      {tierlists.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-6">
            <Bookmark className="w-20 h-20 mx-auto text-muted-foreground opacity-30" />
          </div>
          <p className="text-muted-foreground mb-6 text-lg">You haven&apos;t saved any tier lists yet</p>
          <Link href="/explore">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Compass className="w-5 h-5 mr-2" />
              Discover Tier Lists
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierlists.map((tierlist) => (
            <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
              <Card className="overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 border-2 hover:border-blue-200 dark:hover:border-blue-900 cursor-pointer">
                {tierlist.coverImageUrl ? (
                  <div className="w-full h-36 overflow-hidden bg-muted">
                    <img
                      src={tierlist.coverImageUrl}
                      alt={tierlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center">
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
                  <h3 className="font-bold text-lg mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tierlist.title}
                  </h3>
                  {tierlist.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {tierlist.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {tierlist.user.imageUrl ? (
                      <img
                        src={tierlist.user.imageUrl}
                        alt={tierlist.user.username}
                        className="w-6 h-6 rounded-full ring-2 ring-blue-200 dark:ring-blue-900"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white text-xs font-bold">
                        {tierlist.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {tierlist.user.username}
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
  );
}
