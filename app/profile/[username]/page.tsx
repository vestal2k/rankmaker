"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle, Calendar, LayoutGrid, User, Loader2 } from "lucide-react";

interface TierListPreview {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  voteScore: number;
  _count: {
    votes: number;
    comments: number;
  };
}

interface UserProfile {
  username: string;
  imageUrl: string | null;
  createdAt: string;
  tierlists: TierListPreview[];
  stats: {
    totalTierlists: number;
    totalVoteScore: number;
    totalComments: number;
  };
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?.username === resolvedParams.username;

  useEffect(() => {
    loadProfile();
  }, [resolvedParams.username]);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `/api/users/profile/${resolvedParams.username}`
      );
      if (!response.ok) throw new Error("Failed to load profile");
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">User Not Found</h1>
        </div>
        <div className="text-center py-20">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-6 text-lg">This user doesn&apos;t exist</p>
          <Link href="/explore">
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Card className="p-6 md:p-8 mb-8 border-2">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={profile.username}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full ring-4 ring-violet-200 dark:ring-violet-900"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-violet-200 dark:ring-violet-900">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {profile.stats.totalTierlists}
                </div>
                <div className="text-sm text-muted-foreground">Tier Lists</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${profile.stats.totalVoteScore > 0 ? "text-green-600 dark:text-green-400" : profile.stats.totalVoteScore < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                  {profile.stats.totalVoteScore > 0 ? "+" : ""}{profile.stats.totalVoteScore}
                </div>
                <div className="text-sm text-muted-foreground">Vote Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {profile.stats.totalComments}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
          <LayoutGrid className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Tier Lists</h2>
      </div>

      {profile.tierlists.length === 0 ? (
        <div className="text-center py-16">
          <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground text-lg">
            {isOwnProfile ? "You haven't created any public tier lists yet" : "No public tier lists yet"}
          </p>
          {isOwnProfile && (
            <Link href="/create">
              <Button size="lg" className="mt-6 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                Create Your First Tier List
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.tierlists.map((tierlist) => (
            <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
              <Card className="overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all hover:-translate-y-1 border-2 hover:border-violet-200 dark:hover:border-violet-900 cursor-pointer">
                {tierlist.coverImageUrl ? (
                  <div className="w-full h-36 overflow-hidden bg-muted">
                    <img
                      src={tierlist.coverImageUrl}
                      alt={tierlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 flex items-center justify-center">
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
                  <h3 className="font-bold text-lg mb-1 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {tierlist.title}
                  </h3>
                  {tierlist.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {tierlist.description}
                    </p>
                  )}
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
  );
}
