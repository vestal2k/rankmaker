"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Edit, Bookmark, Link2, ArrowLeft, Loader2, Save, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { getContrastColor } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
  type TierItem,
  type Tier,
  POOL_TIER_NAME,
  MediaPreview,
  SimpleSortableItem,
  ViewDroppableTier,
  ViewDroppablePool,
} from "@/components/tierlist";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { username: string; imageUrl: string | null };
}

interface TierListDetail {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  user: { id: string; username: string; imageUrl: string | null };
  tiers: Tier[];
  comments: Comment[];
  votes: { userId: string; value: number }[];
  _count: { votes: number; comments: number };
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
  const { user, isSignedIn } = useAuth();
  const [tierlist, setTierlist] = useState<TierListDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [voteScore, setVoteScore] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>("");

  const [userTiers, setUserTiers] = useState<Tier[]>([]);
  const [unplacedItems, setUnplacedItems] = useState<TierItem[]>([]);
  const [activeItem, setActiveItem] = useState<TierItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setAnonymousId(getAnonymousId());
  }, []);

  useEffect(() => {
    loadTierList();
  }, [resolvedParams.id, anonymousId]);

  const loadTierList = async () => {
    try {
      const response = await fetch(`/api/tierlists/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Failed to load tier list");
      const data = await response.json();
      setTierlist(data);

      const poolTier = data.tiers.find((t: Tier) => t.name === POOL_TIER_NAME);
      const regularTiers = data.tiers.filter((t: Tier) => t.name !== POOL_TIER_NAME).sort((a: Tier, b: Tier) => (a.order || 0) - (b.order || 0));

      const allItems: TierItem[] = [];
      regularTiers.forEach((tier: Tier) => {
        tier.items.forEach((tierItem: TierItem) => allItems.push(tierItem));
      });
      if (poolTier) {
        poolTier.items.forEach((tierItem: TierItem) => allItems.push(tierItem));
      }

      setUnplacedItems(allItems);
      setUserTiers(regularTiers.map((t: Tier) => ({ ...t, items: [] })));

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
        } catch {}
      }

      if (isSignedIn) {
        try {
          const savedResponse = await fetch(`/api/tierlists/${resolvedParams.id}/save`);
          if (savedResponse.ok) {
            const savedData = await savedResponse.json();
            setIsSaved(savedData.isSaved);
          }
        } catch {}
      }
    } catch (error) {
      console.error("Error loading tier list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const foundItem = findItem(active.id as string);
    setActiveItem(foundItem || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (activeContainer === overContainer) return;

    setHasChanges(true);
    const foundItem = findItem(activeId);
    if (!foundItem) return;

    if (activeContainer === POOL_TIER_NAME) {
      setUnplacedItems((prev) => prev.filter((i) => i.id !== activeId));
    } else {
      setUserTiers((prev) =>
        prev.map((t) => (t.id === activeContainer ? { ...t, items: t.items.filter((i) => i.id !== activeId) } : t))
      );
    }

    if (overContainer === POOL_TIER_NAME) {
      setUnplacedItems((prev) => [...prev, foundItem]);
    } else {
      setUserTiers((prev) =>
        prev.map((t) => (t.id === overContainer ? { ...t, items: [...t.items, foundItem] } : t))
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer !== overContainer || activeId === overId) return;

    setHasChanges(true);
    if (activeContainer === POOL_TIER_NAME) {
      setUnplacedItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === activeId);
        const newIndex = prev.findIndex((i) => i.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    } else {
      setUserTiers((prev) =>
        prev.map((t) => {
          if (t.id !== activeContainer) return t;
          const oldIndex = t.items.findIndex((i) => i.id === activeId);
          const newIndex = t.items.findIndex((i) => i.id === overId);
          return { ...t, items: arrayMove(t.items, oldIndex, newIndex) };
        })
      );
    }
  };

  const findItem = (id: string): TierItem | undefined => {
    const poolItem = unplacedItems.find((i) => i.id === id);
    if (poolItem) return poolItem;
    for (const tier of userTiers) {
      const foundItem = tier.items.find((i) => i.id === id);
      if (foundItem) return foundItem;
    }
    return undefined;
  };

  const findContainer = (id: string): string | undefined => {
    if (unplacedItems.find((i) => i.id === id)) return POOL_TIER_NAME;
    for (const tier of userTiers) {
      if (tier.items.find((i) => i.id === id)) return tier.id;
    }
    return undefined;
  };

  const handleReset = () => {
    if (!tierlist) return;
    const poolTier = tierlist.tiers.find((t) => t.name === POOL_TIER_NAME);
    const regularTiers = tierlist.tiers.filter((t) => t.name !== POOL_TIER_NAME).sort((a, b) => (a.order || 0) - (b.order || 0));

    const allItems: TierItem[] = [];
    regularTiers.forEach((tier) => {
      tier.items.forEach((tierItem) => allItems.push(tierItem));
    });
    if (poolTier) {
      poolTier.items.forEach((tierItem) => allItems.push(tierItem));
    }

    setUnplacedItems(allItems);
    setUserTiers(regularTiers.map((t) => ({ ...t, items: [] })));
    setHasChanges(false);
  };

  const handleSaveRanking = async () => {
    if (!tierlist || !isSignedIn) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/tierlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `My ranking: ${tierlist.title}`,
          description: `Based on template by ${tierlist.user?.username || "Anonymous"}`,
          isPublic: true,
          tiers: userTiers.map((tier, index) => ({
            name: tier.name,
            color: tier.color,
            order: index,
            items: tier.items.map((tierItem, itemIndex) => ({
              mediaUrl: tierItem.mediaUrl,
              mediaType: tierItem.mediaType,
              coverImageUrl: tierItem.coverImageUrl,
              embedId: tierItem.embedId,
              label: tierItem.label,
              order: itemIndex,
            })),
          })),
          poolItems: unplacedItems.map((tierItem, index) => ({
            mediaUrl: tierItem.mediaUrl,
            mediaType: tierItem.mediaType,
            coverImageUrl: tierItem.coverImageUrl,
            embedId: tierItem.embedId,
            label: tierItem.label,
            order: index,
          })),
        }),
      });
      if (!response.ok) throw new Error("Failed to save ranking");
      const data = await response.json();
      router.push(`/tierlist/${data.id}`);
    } catch (error) {
      console.error("Error saving ranking:", error);
    } finally {
      setIsSaving(false);
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
      if (oldVote === null && newVote !== null) {
        scoreChange = newVote;
      } else if (oldVote !== null && newVote === null) {
        scoreChange = -oldVote;
      } else if (oldVote !== null && newVote !== null) {
        scoreChange = newVote - oldVote;
      }
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
    const shareTitle = encodeURIComponent(tierlist?.title || "Check out this tier list!");
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${shareTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${shareTitle}`,
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
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
  const totalItems = unplacedItems.length + userTiers.reduce((sum, t) => sum + t.items.length, 0);
  const placedItems = userTiers.reduce((sum, t) => sum + t.items.length, 0);

  return (
    <div className="min-h-screen bg-stripes pt-28 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {tierlist.coverImageUrl && (
          <div className="mb-6 card-cartoon overflow-hidden relative h-48 md:h-64">
            <Image src={tierlist.coverImageUrl} alt={tierlist.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
          </div>
        )}

        <div className="card-cartoon p-6 mb-6">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <h1 className="text-3xl font-black text-zinc-900">{tierlist.title}</h1>
            {isOwner && (
              <Link href={`/create?id=${tierlist.id}`}>
                <button className="btn-cartoon btn-yellow flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </Link>
            )}
          </div>

          {tierlist.description && <p className="text-zinc-500 mb-4">{tierlist.description}</p>}

          <div className="flex items-center gap-4 mb-4">
            {tierlist.user?.imageUrl ? (
              <Image src={tierlist.user.imageUrl} alt={tierlist.user?.username || "User"} width={40} height={40} className="rounded-full border-2 border-zinc-900" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#4DABF7] flex items-center justify-center text-white font-bold border-2 border-zinc-900">
                {tierlist.user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <div>
              <p className="font-bold text-zinc-900">{tierlist.user?.username || "Anonymous"}</p>
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="space-y-3 mb-6">
            {userTiers.map((tier) => (
              <div key={tier.id} className="card-cartoon overflow-hidden !rounded-2xl">
                <div className="flex">
                  <div className="min-w-24 max-w-48 flex items-center justify-center font-bold text-lg shrink-0 p-2 break-words text-center" style={{ backgroundColor: tier.color, color: getContrastColor(tier.color) }}>
                    {tier.name}
                  </div>
                  <SortableContext items={tier.items.map((i) => i.id)} strategy={rectSortingStrategy}>
                    <ViewDroppableTier tier={tier}>
                      {tier.items.map((tierItem) => (
                        <SimpleSortableItem key={tierItem.id} item={tierItem} isDragging={activeItem?.id === tierItem.id} />
                      ))}
                    </ViewDroppableTier>
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>

          <div className="card-cartoon p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-zinc-900">Pool ({placedItems}/{totalItems} placed)</h3>
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <button onClick={handleReset} className="btn-cartoon btn-white !py-1 !px-3 !text-sm flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                {isSignedIn && placedItems > 0 && (
                  <button onClick={handleSaveRanking} disabled={isSaving} className="btn-cartoon btn-green !py-1 !px-3 !text-sm flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    {isSaving ? "Saving..." : "Save my ranking"}
                  </button>
                )}
                {!isSignedIn && placedItems > 0 && <span className="text-xs text-zinc-400">Sign in to save</span>}
              </div>
            </div>
            <SortableContext items={unplacedItems.map((i) => i.id)} strategy={rectSortingStrategy}>
              <ViewDroppablePool>
                {unplacedItems.length === 0 ? (
                  <p className="text-zinc-500 text-sm">All items have been placed!</p>
                ) : (
                  unplacedItems.map((poolItem) => (
                    <SimpleSortableItem key={poolItem.id} item={poolItem} isDragging={activeItem?.id === poolItem.id} />
                  ))
                )}
              </ViewDroppablePool>
            </SortableContext>
          </div>

          <DragOverlay>
            {activeItem && (
              <div className="w-16 h-16 opacity-80">
                <MediaPreview item={activeItem} className="border-2 border-zinc-900 shadow-lg" />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <div className="card-cartoon p-6">
          <h2 className="text-2xl font-black mb-4 text-zinc-900">Comments ({tierlist.comments.length})</h2>

          {isSignedIn ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="input-cartoon w-full mb-3" rows={3} />
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
                    <Image src={comment.user.imageUrl} alt={comment.user.username} width={32} height={32} className="rounded-full border-2 border-zinc-900" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#4DABF7] flex items-center justify-center text-white font-bold border-2 border-zinc-900 text-sm">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-zinc-900">{comment.user.username}</span>
                      <span className="text-sm text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-zinc-600">{comment.content}</p>
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
