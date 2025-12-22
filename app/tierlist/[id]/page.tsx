"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Edit, Volume2, Film, Youtube } from "lucide-react";
import { getContrastColor } from "@/lib/utils";

type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "GIF" | "YOUTUBE" | "TWITTER" | "INSTAGRAM";

interface TierItem {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  coverImageUrl?: string | null;
  embedId?: string | null;
  label: string | null;
  order: number;
}

// Helper to get YouTube thumbnail from video ID
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function MediaPreview({ item, className = "" }: { item: TierItem; className?: string }) {
  switch (item.mediaType) {
    case "YOUTUBE":
      return (
        <div className={`relative ${className}`}>
          <img
            src={item.embedId ? getYouTubeThumbnail(item.embedId) : item.coverImageUrl || ""}
            alt={item.label || "YouTube video"}
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute bottom-0.5 right-0.5 bg-red-600 rounded p-0.5">
            <Youtube className="w-3 h-3 text-white" />
          </div>
        </div>
      );
    case "TWITTER":
      return (
        <div className={`relative ${className}`}>
          {item.coverImageUrl ? (
            <img
              src={item.coverImageUrl}
              alt={item.label || "Tweet"}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center rounded">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 bg-black rounded p-0.5">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>
      );
    case "INSTAGRAM":
      return (
        <div className={`relative ${className}`}>
          {item.coverImageUrl ? (
            <img
              src={item.coverImageUrl}
              alt={item.label || "Instagram post"}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center rounded">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded p-0.5">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        </div>
      );
    case "VIDEO":
      return (
        <div className={`relative ${className}`}>
          <video
            src={item.mediaUrl}
            className="w-full h-full object-cover rounded"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded p-0.5">
            <Film className="w-3 h-3 text-white" />
          </div>
        </div>
      );
    case "AUDIO":
      return (
        <div className={`relative ${className}`}>
          {item.coverImageUrl ? (
            <img
              src={item.coverImageUrl}
              alt={item.label || "Audio cover"}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center rounded">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded p-0.5">
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        </div>
      );
    case "GIF":
      return (
        <div className={`relative ${className}`}>
          <img
            src={item.mediaUrl}
            alt={item.label || ""}
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded px-1">
            <span className="text-[10px] font-bold text-white">GIF</span>
          </div>
        </div>
      );
    case "IMAGE":
    default:
      return (
        <img
          src={item.mediaUrl}
          alt={item.label || ""}
          className={`w-full h-full object-cover rounded ${className}`}
        />
      );
  }
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
  coverImageUrl: string | null;
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
      {/* Cover Image */}
      {tierlist.coverImageUrl && (
        <div className="mb-6 w-full h-48 md:h-64 rounded-lg overflow-hidden">
          <img
            src={tierlist.coverImageUrl}
            alt={tierlist.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

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

        {/* Description */}
        {tierlist.description && (
          <p className="text-muted-foreground mb-4">{tierlist.description}</p>
        )}

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
                  className="w-24 flex items-center justify-center font-bold text-lg shrink-0 p-2 break-words text-center"
                  style={{
                    backgroundColor: tier.color,
                    color: getContrastColor(tier.color),
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere'
                  }}
                >
                  {tier.name}
                </div>
                <div className="flex-1 min-h-[100px] p-2 flex flex-wrap gap-2 items-start bg-secondary/20">
                  {tier.items
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div key={item.id} className="w-16 h-16">
                        <MediaPreview item={item} className="border-2" />
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
