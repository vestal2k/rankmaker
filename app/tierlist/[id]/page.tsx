"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Edit } from "lucide-react";

interface TierItem {
  id: string;
  imageUrl: string;
  label: string | null;
  order: number;
}

interface Tier {
  id: string;
  name: string;
  color: string;
  order: number;
  items: TierItem[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    imageUrl: string | null;
  };
}

interface TierListDetail {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  user: {
    id: string;
    username: string;
    imageUrl: string | null;
  };
  tiers: Tier[];
  comments: Comment[];
  likes: { userId: string }[];
  _count: {
    likes: number;
    comments: number;
  };
}

export default function TierListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user, isSignedIn } = useUser();
  const [tierlist, setTierlist] = useState<TierListDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    loadTierList();
  }, [resolvedParams.id]);

  const loadTierList = async () => {
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Failed to load tier list");
      const data = await response.json();
      setTierlist(data);

      // Check if user has liked this tierlist
      if (isSignedIn && data.likes) {
        setIsLiked(data.likes.some((like: any) => like.userId === user?.id));
      }
    } catch (error) {
      console.error("Error loading tier list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isSignedIn) return;

    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!response.ok) throw new Error("Failed to toggle like");

      setIsLiked(!isLiked);
      if (tierlist) {
        setTierlist({
          ...tierlist,
          _count: {
            ...tierlist._count,
            likes: tierlist._count.likes + (isLiked ? -1 : 1),
          },
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(
        `/api/tierlists/${resolvedParams.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      setNewComment("");
      await loadTierList(); // Reload to get new comment
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!tierlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Tier List Not Found</h1>
        <Link href="/explore" className="text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const isOwner = isSignedIn && tierlist.user.id === user?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold">{tierlist.title}</h1>
          {isOwner && (
            <Link href={`/create?id=${tierlist.id}`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          {tierlist.user.imageUrl && (
            <img
              src={tierlist.user.imageUrl}
              alt={tierlist.user.username}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{tierlist.user.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(tierlist.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLike}
            variant={isLiked ? "default" : "outline"}
            size="sm"
            disabled={!isSignedIn}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
            {tierlist._count.likes}
          </Button>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>{tierlist._count.comments}</span>
          </div>
        </div>
      </div>

      {/* Tier List Display */}
      <div className="space-y-2 mb-8">
        {tierlist.tiers
          .sort((a, b) => a.order - b.order)
          .map((tier) => (
            <Card key={tier.id} className="p-0 overflow-hidden">
              <div className="flex">
                <div
                  className="w-24 flex items-center justify-center font-bold text-lg shrink-0"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.name}
                </div>
                <div className="flex-1 min-h-[100px] p-2 flex flex-wrap gap-2 items-start bg-secondary/20">
                  {tier.items
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div key={item.id} className="w-16 h-16">
                        <img
                          src={item.imageUrl}
                          alt={item.label || ""}
                          className="w-full h-full object-cover rounded border-2"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({tierlist.comments.length})
        </h2>

        {isSignedIn ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="mb-2"
              rows={3}
            />
            <Button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
            >
              Post Comment
            </Button>
          </form>
        ) : (
          <p className="mb-6 text-gray-600">Sign in to leave a comment.</p>
        )}

        <div className="space-y-4">
          {tierlist.comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-3">
                {comment.user.imageUrl && (
                  <img
                    src={comment.user.imageUrl}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {comment.user.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
