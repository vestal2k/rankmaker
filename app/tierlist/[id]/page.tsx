"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Edit, Volume2, Film, Youtube, Bookmark, Link2, Layers, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
            <img src={item.coverImageUrl} alt={item.label || "Tweet"} className="w-full h-full object-cover rounded" />
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
            <img src={item.coverImageUrl} alt={item.label || "Instagram post"} className="w-full h-full object-cover rounded" />
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
          <video src={item.mediaUrl} className="w-full h-full object-cover rounded" muted loop playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
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
            <img src={item.coverImageUrl} alt={item.label || "Audio cover"} className="w-full h-full object-cover rounded" />
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
          <img src={item.mediaUrl} alt={item.label || ""} className="w-full h-full object-cover rounded" />
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded px-1">
            <span className="text-[10px] font-bold text-white">GIF</span>
          </div>
        </div>
      );
    case "IMAGE":
    default:
      return <img src={item.mediaUrl} alt={item.label || ""} className={`w-full h-full object-cover rounded ${className}`} />;
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
  user: { username: string; imageUrl: string | null; };
}

interface TierListDetail {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  user: { id: string; username: string; imageUrl: string | null; };
  tiers: Tier[];
  comments: Comment[];
  votes: { userId: string; value: number }[];
  _count: { votes: number; comments: number; };
}

function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("rankmaker_anonymous_id");
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("rankmaker_anonymous_id", id);
  }
  return id;
}

export default function TierListPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [tierlist, setTierlist] = useState<TierListDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [voteScore, setVoteScore] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCreatingFromTemplate, setIsCreatingFromTemplate] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>("");

  useEffect(() => { setAnonymousId(getAnonymousId()); }, []);
  useEffect(() => { loadTierList(); }, [resolvedParams.id, anonymousId]);

  const loadTierList = async () => {
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Failed to load tier list");
      const data = await response.json();
      setTierlist(data);
      if (data.votes) {
        const score = data.votes.reduce((sum: number, vote: { value: number }) => sum + vote.value, 0);
        setVoteScore(score);
      }
      if (anonymousId || isSignedIn) {
        try {
          const voteUrl = isSignedIn
            ? `/api/tierlists/${resolvedParams.id}/vote`
            : `/api/tierlists/${resolvedParams.id}/vote?anonymousId=${anonymousId}`;
          const voteResponse = await fetch(voteUrl);
          if (voteResponse.ok) {
            const voteData = await voteResponse.json();
            setUserVote(voteData.userVote);
          }
        } catch { }
      }
      if (isSignedIn) {
        try {
          const savedResponse = await fetch(`/api/tierlists/${resolvedParams.id}/save`);
          if (savedResponse.ok) {
            const savedData = await savedResponse.json();
            setIsSaved(savedData.isSaved);
          }
        } catch { }
      }
    } catch (error) {
      console.error("Error loading tier list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (value: 1 | -1) => {
    if (!isSignedIn && !anonymousId) return;
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, anonymousId: isSignedIn ? undefined : anonymousId }),
      });
      if (!response.ok) throw new Error("Failed to vote");
      const data = await response.json();
      const oldVote = userVote;
      const newVote = data.userVote;
      setUserVote(newVote);
      let scoreChange = 0;
      if (oldVote === null && newVote !== null) scoreChange = newVote;
      else if (oldVote !== null && newVote === null) scoreChange = -oldVote;
      else if (oldVote !== null && newVote !== null) scoreChange = newVote - oldVote;
      setVoteScore((prev) => prev + scoreChange);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleSave = async () => {
    if (!isSignedIn) return;
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}/save`, { method: isSaved ? "DELETE" : "POST" });
      if (!response.ok) throw new Error("Failed to toggle save");
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(tierlist?.title || "Check out this tier list!");
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) throw new Error("Failed to post comment");
      setNewComment("");
      await loadTierList();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUseTemplate = async () => {
    setIsCreatingFromTemplate(true);
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}/use-template`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to use template");
      const data = await response.json();
      router.push(`/create?id=${data.id}`);
    } catch (error) {
      console.error("Error using template:", error);
      setIsCreatingFromTemplate(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stripes pt-28 pb-12 px-4">
        <div className="container mx-auto flex items-center justify-center py-20">
          <div className="card-cartoon p-8 text-center">
            <Loader2 className="w-12 h-12 text-[#4DABF7] animate-spin mx-auto" />
            <p className="mt-4 font-bold text-zinc-600">Loading tier list...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tierlist) {
    return (
      <div className="min-h-screen bg-stripes pt-28 pb-12 px-4">
        <div className="container mx-auto">
          <div className="card-cartoon p-8 text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-zinc-900">Tier List Not Found</h1>
            <Link href="/explore">
              <button className="btn-cartoon btn-blue flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = isSignedIn && tierlist.user?.id === user?.id;

  return (
    <div className="min-h-screen bg-stripes pt-28 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {tierlist.coverImageUrl && (
          <div className="mb-6 card-cartoon overflow-hidden">
            <img src={tierlist.coverImageUrl} alt={tierlist.title} className="w-full h-48 md:h-64 object-cover" />
          </div>
        )}

        <div className="card-cartoon p-6 mb-6">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">{tierlist.title}</h1>
            <div className="flex items-center gap-2">
              {!isOwner && (
                <button onClick={handleUseTemplate} disabled={isCreatingFromTemplate} className="btn-cartoon btn-green flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  {isCreatingFromTemplate ? "Loading..." : "Rank This!"}
                </button>
              )}
              {isOwner && (
                <Link href={`/create?id=${tierlist.id}`}>
                  <button className="btn-cartoon btn-yellow flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </Link>
              )}
            </div>
          </div>

          {tierlist.description && <p className="text-zinc-500 mb-4">{tierlist.description}</p>}

          <div className="flex items-center gap-4 mb-4">
            {tierlist.user?.imageUrl ? (
              <img src={tierlist.user.imageUrl} alt={tierlist.user?.username || "User"} className="w-10 h-10 rounded-full border-2 border-zinc-900" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#4DABF7] flex items-center justify-center text-white font-bold border-2 border-zinc-900">
                {tierlist.user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">{tierlist.user?.username || "Anonymous"}</p>
              <p className="text-sm text-zinc-500">{new Date(tierlist.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="card-cartoon-sm flex items-center !rounded-full overflow-hidden !p-0">
              <button onClick={() => handleVote(1)} className={`px-3 py-2 transition-colors ${userVote === 1 ? "bg-[#E8F5E9] text-[#2E7D32]" : "hover:bg-zinc-100"}`}>
                <ArrowBigUp className={`w-5 h-5 ${userVote === 1 ? "fill-current" : ""}`} />
              </button>
              <span className={`px-2 font-bold min-w-[40px] text-center ${voteScore > 0 ? "text-[#2E7D32]" : voteScore < 0 ? "text-[#C62828]" : ""}`}>
                {voteScore}
              </span>
              <button onClick={() => handleVote(-1)} className={`px-3 py-2 transition-colors ${userVote === -1 ? "bg-[#FFEBEE] text-[#C62828]" : "hover:bg-zinc-100"}`}>
                <ArrowBigDown className={`w-5 h-5 ${userVote === -1 ? "fill-current" : ""}`} />
              </button>
            </div>

            <span className="badge-cartoon bg-[#E3F2FD] text-[#1565C0]">
              <MessageCircle className="w-4 h-4" />
              {tierlist._count.comments}
            </span>

            <button onClick={handleSave} disabled={!isSignedIn} className={`btn-cartoon ${isSaved ? "btn-purple" : "btn-white"} !py-2 !px-3`} title={isSignedIn ? (isSaved ? "Unsave" : "Save") : "Sign in to save"}>
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>

            <button onClick={handleCopyLink} className="btn-cartoon btn-white !py-2 !px-3" title="Copy link">
              {copySuccess ? <span className="text-[#2E7D32] text-xs font-bold">Copied!</span> : <Link2 className="w-4 h-4" />}
            </button>

            <button onClick={() => handleShare("twitter")} className="btn-cartoon btn-white !py-2 !px-3" title="Share on Twitter">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            <button onClick={() => handleShare("reddit")} className="btn-cartoon btn-white !py-2 !px-3" title="Share on Reddit">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {tierlist.tiers.filter((t) => t.name !== "__POOL__").sort((a, b) => a.order - b.order).map((tier) => (
            <div key={tier.id} className="card-cartoon overflow-hidden !rounded-2xl">
              <div className="flex">
                <div className="w-24 flex items-center justify-center font-black text-lg shrink-0 p-3 break-words text-center" style={{ backgroundColor: tier.color, color: getContrastColor(tier.color) }}>
                  {tier.name}
                </div>
                <div className="flex-1 min-h-[80px] p-3 flex flex-wrap gap-2 items-start bg-white dark:bg-zinc-800">
                  {tier.items.sort((a, b) => a.order - b.order).map((item) => (
                    <div key={item.id} className="w-16 h-16">
                      <MediaPreview item={item} className="border-2 border-zinc-900" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-cartoon p-6">
          <h2 className="text-2xl font-black mb-4 text-zinc-900 dark:text-white">
            Comments ({tierlist.comments.length})
          </h2>

          {isSignedIn ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="input-cartoon w-full mb-3"
                rows={3}
              />
              <button type="submit" disabled={isSubmittingComment || !newComment.trim()} className="btn-cartoon btn-blue">
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="mb-6 text-zinc-500 font-medium">Sign in to leave a comment.</p>
          )}

          <div className="space-y-4">
            {tierlist.comments.map((comment) => (
              <div key={comment.id} className="card-cartoon-sm p-4">
                <div className="flex items-start gap-3">
                  {comment.user.imageUrl ? (
                    <img src={comment.user.imageUrl} alt={comment.user.username} className="w-8 h-8 rounded-full border-2 border-zinc-900" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#4DABF7] flex items-center justify-center text-white font-bold border-2 border-zinc-900 text-sm">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-zinc-900 dark:text-white">{comment.user.username}</span>
                      <span className="text-sm text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
