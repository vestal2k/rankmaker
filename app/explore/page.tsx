"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigUp, MessageCircle, Compass, Zap, Loader2, Search } from "lucide-react";

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
    <div className="min-h-screen pt-28 pb-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#4DABF7] rounded-2xl flex items-center justify-center border-3 border-zinc-900 shadow-hard">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
                Explore
              </h1>
              <p className="text-zinc-700 font-medium">Discover tier list templates to rank yourself</p>
            </div>
          </div>
          <Link href="/create">
            <button className="btn-cartoon btn-coral flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Create New
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="card-cartoon p-8 text-center">
              <Loader2 className="w-12 h-12 text-[#4DABF7] animate-spin mx-auto" />
              <p className="mt-4 font-bold text-zinc-600">Loading tier lists...</p>
            </div>
          </div>
        ) : tierlists.length === 0 ? (
          <div className="text-center py-20">
            <div className="card-cartoon p-10 inline-block">
              <div className="w-24 h-24 bg-[#E3F2FD] rounded-3xl flex items-center justify-center mx-auto mb-6 border-3 border-zinc-900">
                <Search className="w-12 h-12 text-[#4DABF7]" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-zinc-900">No tier lists yet!</h2>
              <p className="text-zinc-700 mb-8 text-lg max-w-md mx-auto">
                Be the first to create and share tier list templates with the community.
              </p>
              <Link href="/create">
                <button className="btn-cartoon btn-coral flex items-center gap-2 mx-auto">
                  <Zap className="w-5 h-5" />
                  Create the first one!
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierlists.map((tierlist) => (
              <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                <div className="card-cartoon overflow-hidden cursor-pointer">
                  {tierlist.coverImageUrl ? (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={tierlist.coverImageUrl}
                        alt={tierlist.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt=""
                        width={60}
                        height={60}
                        className="opacity-50"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 truncate text-zinc-900">
                      {tierlist.title}
                    </h3>
                    {tierlist.description && (
                      <p className="text-sm text-zinc-700 mb-4 line-clamp-2">
                        {tierlist.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      {tierlist.user?.imageUrl ? (
                        <img
                          src={tierlist.user.imageUrl}
                          alt={tierlist.user?.username || "User"}
                          className="w-8 h-8 rounded-full border-2 border-zinc-900"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#4DABF7] flex items-center justify-center text-white text-sm font-bold border-2 border-zinc-900">
                          {tierlist.user?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                      )}
                      <span className="text-sm font-medium text-zinc-700">
                        {tierlist.user?.username || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
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
    </div>
  );
}
