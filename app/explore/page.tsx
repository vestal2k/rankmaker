"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Compass, Plus, Loader2 } from "lucide-react";

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
  _count: {
    likes: number;
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Explore Tier Lists</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Explore Tier Lists</h1>
        </div>
        <Link href="/create">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      {tierlists.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="No tier lists"
              width={120}
              height={120}
              className="mx-auto opacity-50"
            />
          </div>
          <p className="text-muted-foreground mb-6 text-lg">No tier lists yet. Be the first!</p>
          <Link href="/create">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Plus className="w-5 h-5 mr-2" />
              Create the first one!
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierlists.map((tierlist) => (
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
                    {tierlist.user.imageUrl ? (
                      <img
                        src={tierlist.user.imageUrl}
                        alt={tierlist.user.username}
                        className="w-6 h-6 rounded-full ring-2 ring-orange-200 dark:ring-orange-900"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                        {tierlist.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {tierlist.user.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span>{tierlist._count.likes}</span>
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
  );
}
