"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";

interface TierListPreview {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

interface UserProfile {
  username: string;
  imageUrl: string | null;
  createdAt: string;
  tierlists: TierListPreview[];
  _count: {
    tierlists: number;
  };
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <Link href="/explore" className="text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {profile.imageUrl && (
            <img
              src={profile.imageUrl}
              alt={profile.username}
              className="w-20 h-20 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile.username}</h1>
            <p className="text-gray-600">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-bold text-lg text-black">
              {profile._count.tierlists}
            </span>{" "}
            tier lists
          </div>
        </div>
      </div>

      {/* User's Tier Lists */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tier Lists</h2>

        {profile.tierlists.length === 0 ? (
          <p className="text-gray-600">No tier lists yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.tierlists.map((tierlist) => (
              <Link key={tierlist.id} href={`/tierlist/${tierlist.id}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg truncate flex-1">
                      {tierlist.title}
                    </h3>
                    {!tierlist.isPublic && (
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                        Private
                      </span>
                    )}
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
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
