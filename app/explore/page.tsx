"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Tier Lists</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Tier Lists</h1>

      {tierlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No tier lists yet.</p>
          <Link
            href="/create"
            className="text-primary hover:underline font-semibold"
          >
            Create the first one!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierlists.map((tierlist) => (
            <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {tierlist.coverImageUrl && (
                  <div className="w-full h-32 overflow-hidden">
                    <img
                      src={tierlist.coverImageUrl}
                      alt={tierlist.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">
                    {tierlist.title}
                  </h3>
                  {tierlist.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {tierlist.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {tierlist.user.imageUrl && (
                      <img
                        src={tierlist.user.imageUrl}
                        alt={tierlist.user.username}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-600">
                      {tierlist.user.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{tierlist._count.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{tierlist._count.comments}</span>
                    </div>
                    <span className="ml-auto">
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
