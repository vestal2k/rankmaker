"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Download, Save, Settings, ChevronUp, ChevronDown, Palette, ImageIcon, X, Undo2, Redo2, LayoutTemplate, Link2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  type Tier,
  type TierItem,
  type TierTemplate,
  type MediaType,
  DEFAULT_TIERS,
  TIER_TEMPLATES,
  MAX_HISTORY_SIZE,
  POOL_TIER_NAME,
  DRAG_ACTIVATION_DISTANCE,
  MediaPreview,
  SortableItem,
  DroppableTierZone,
  DroppablePoolZone,
  ItemPreviewModal,
  EmbedDialog,
} from "@/components/tierlist";

interface HistoryState {
  tiers: Tier[];
  unplacedItems: TierItem[];
}

const getAnonymousId = () => {
  if (typeof window === "undefined") return null;
  let anonymousId = localStorage.getItem("rankmaker_anonymous_id");
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("rankmaker_anonymous_id", anonymousId);
  }
  return anonymousId;
};


function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [title, setTitle] = useState("My Tier List");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [unplacedItems, setUnplacedItems] = useState<TierItem[]>([]);
  const [activeItem, setActiveItem] = useState<TierItem | null>(null);
  const [tierlistId, setTierlistId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeOverId, setActiveOverId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TierItem | null>(null);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const saveToHistory = useCallback((newTiers: Tier[], newUnplacedItems: TierItem[]) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      const updated = [...newHistory, { tiers: newTiers, unplacedItems: newUnplacedItems }];
      if (updated.length > MAX_HISTORY_SIZE) {
        return updated.slice(-MAX_HISTORY_SIZE);
      }
      return updated;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    isUndoRedoAction.current = true;
    const prevState = history[historyIndex - 1];
    setTiers(prevState.tiers);
    setUnplacedItems(prevState.unplacedItems);
    setHistoryIndex(prev => prev - 1);
  }, [canUndo, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    isUndoRedoAction.current = true;
    const nextState = history[historyIndex + 1];
    setTiers(nextState.tiers);
    setUnplacedItems(nextState.unplacedItems);
    setHistoryIndex(prev => prev + 1);
  }, [canRedo, history, historyIndex]);

  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ tiers: DEFAULT_TIERS, unplacedItems: [] }]);
      setHistoryIndex(0);
    }
  }, [history.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.key === "Escape") {
        if (selectedItem) {
          setSelectedItem(null);
          return;
        }
        if (showEmbedDialog) {
          setShowEmbedDialog(false);
          return;
        }
      }

      if (isTyping) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!isSaving) handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, selectedItem, showEmbedDialog, isSaving]);

  useEffect(() => {
    if (!isUndoRedoAction.current && history.length > 0) {
      const currentState = history[historyIndex];
      if (currentState && (JSON.stringify(currentState.tiers) !== JSON.stringify(tiers) || JSON.stringify(currentState.unplacedItems) !== JSON.stringify(unplacedItems))) {
        saveToHistory(tiers, unplacedItems);
      }
    }
  }, [tiers, unplacedItems, history, historyIndex, saveToHistory]);

  useEffect(() => {
    setAnonymousId(getAnonymousId());
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== tierlistId) {
      loadTierList(id);
    }
  }, [searchParams]);

  const loadTierList = async (id: string) => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const anonId = getAnonymousId();
      if (anonId) {
        headers["x-anonymous-id"] = anonId;
      }

      const response = await fetch(`/api/tierlists/${id}`, { headers });
      if (!response.ok) throw new Error("Failed to load tier list");

      const data = await response.json();
      setTierlistId(data.id);
      setTitle(data.title);
      setDescription(data.description || "");
      setCoverImageUrl(data.coverImageUrl || null);
      setIsPublic(data.isPublic);

      const poolItems: TierItem[] = [];
      const loadedTiers: Tier[] = [];

      for (const tier of data.tiers) {
        const items = tier.items.map((tierItem: any) => ({
          id: tierItem.id,
          mediaUrl: tierItem.mediaUrl,
          mediaType: tierItem.mediaType || "IMAGE",
          coverImageUrl: tierItem.coverImageUrl,
          embedId: tierItem.embedId,
          label: tierItem.label,
        }));

        if (tier.name === POOL_TIER_NAME) {
          poolItems.push(...items);
        } else {
          loadedTiers.push({
            id: tier.id,
            name: tier.name,
            color: tier.color,
            items,
          });
        }
      }

      setTiers(loadedTiers);
      setUnplacedItems(poolItems);
    } catch (error) {
      console.error("Error loading tier list:", error);
      setSaveMessage({ type: "error", text: "Failed to load tier list." });
    } finally {
      setIsLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addTier = () => {
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      name: "New Tier",
      color: "#808080",
      items: [],
    };
    setTiers([...tiers, newTier]);
  };

  const removeTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (tier && tier.items.length > 0) {
      setUnplacedItems([...unplacedItems, ...tier.items]);
    }
    setTiers(tiers.filter((t) => t.id !== tierId));
  };

  const updateTierName = (tierId: string, name: string) => {
    setTiers(tiers.map((t) => (t.id === tierId ? { ...t, name } : t)));
  };

  const updateTierColor = (tierId: string, color: string) => {
    setTiers(tiers.map((t) => (t.id === tierId ? { ...t, color } : t)));
  };

  const moveTierUp = (tierId: string) => {
    const index = tiers.findIndex((t) => t.id === tierId);
    if (index <= 0) return;
    const newTiers = [...tiers];
    [newTiers[index - 1], newTiers[index]] = [newTiers[index], newTiers[index - 1]];
    setTiers(newTiers);
  };

  const moveTierDown = (tierId: string) => {
    const index = tiers.findIndex((t) => t.id === tierId);
    if (index === -1 || index >= tiers.length - 1) return;
    const newTiers = [...tiers];
    [newTiers[index], newTiers[index + 1]] = [newTiers[index + 1], newTiers[index]];
    setTiers(newTiers);
  };

  const addTierAfter = (tierId: string) => {
    const index = tiers.findIndex((t) => t.id === tierId);
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      name: "New",
      color: "#808080",
      items: [],
    };
    const newTiers = [...tiers];
    newTiers.splice(index + 1, 0, newTier);
    setTiers(newTiers);
  };

  const handleApplyTemplate = (template: TierTemplate) => {
    const allItems = tiers.flatMap((tier) => tier.items);
    setUnplacedItems((prev) => [...prev, ...allItems]);

    const newTiers = template.tiers.map((tier, index) => ({
      ...tier,
      id: `tier-${Date.now()}-${index}`,
      items: [],
    }));
    setTiers(newTiers);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload media");

      const data = await response.json();
      const newItems: TierItem[] = data.files.map((file: { url: string; mediaType: MediaType }) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        mediaUrl: file.url,
        mediaType: file.mediaType,
      }));

      setUnplacedItems((prev) => [...prev, ...newItems]);
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media. Please try again.");
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload cover image");

      const data = await response.json();
      setCoverImageUrl(data.files[0].url);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      alert("Failed to upload cover image. Please try again.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    let foundItem: TierItem | undefined;

    for (const tier of tiers) {
      foundItem = tier.items.find((i) => i.id === active.id);
      if (foundItem) break;
    }

    if (!foundItem) {
      foundItem = unplacedItems.find((i) => i.id === active.id);
    }

    setActiveItem(foundItem || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setActiveOverId(null);
      return;
    }

    const overId = over.id as string;
    const tier = tiers.find((t) => t.id === overId);
    if (tier) {
      setActiveOverId(tier.id);
      return;
    }

    if (overId === "unplaced") {
      setActiveOverId("unplaced");
      return;
    }

    for (const t of tiers) {
      if (t.items.some((i) => i.id === overId)) {
        setActiveOverId(t.id);
        return;
      }
    }

    if (unplacedItems.some((i) => i.id === overId)) {
      setActiveOverId("unplaced");
      return;
    }

    setActiveOverId(null);
  };

  const handleDeleteItem = (itemId: string) => {
    for (const tier of tiers) {
      if (tier.items.some((i) => i.id === itemId)) {
        setTiers(tiers.map((t) => (t.id === tier.id ? { ...t, items: t.items.filter((i) => i.id !== itemId) } : t)));
        return;
      }
    }
    setUnplacedItems(unplacedItems.filter((i) => i.id !== itemId));
  };

  const handleUpdateItem = (itemId: string, updates: Partial<TierItem>) => {
    for (const tier of tiers) {
      if (tier.items.some((i) => i.id === itemId)) {
        setTiers(tiers.map((t) => (t.id === tier.id ? { ...t, items: t.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)) } : t)));
        if (selectedItem?.id === itemId) {
          setSelectedItem({ ...selectedItem, ...updates });
        }
        return;
      }
    }

    setUnplacedItems(unplacedItems.map((i) => (i.id === itemId ? { ...i, ...updates } : i)));
    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const handleAudioCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload cover image");

      const data = await response.json();
      handleUpdateItem(itemId, { coverImageUrl: data.files[0].url });
    } catch (error) {
      console.error("Error uploading audio cover:", error);
      alert("Failed to upload cover image. Please try again.");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    setActiveOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let sourceTierId: string | null = null;
    let draggedItem: TierItem | undefined;

    for (const tier of tiers) {
      draggedItem = tier.items.find((i) => i.id === activeId);
      if (draggedItem) {
        sourceTierId = tier.id;
        break;
      }
    }

    if (!draggedItem) {
      draggedItem = unplacedItems.find((i) => i.id === activeId);
      sourceTierId = "unplaced";
    }

    if (!draggedItem) return;

    let destTierId: string | null = null;
    const destTier = tiers.find((t) => t.id === overId);
    if (destTier) {
      destTierId = destTier.id;
    } else if (overId === "unplaced") {
      destTierId = "unplaced";
    } else {
      for (const tier of tiers) {
        if (tier.items.some((i) => i.id === overId)) {
          destTierId = tier.id;
          break;
        }
      }
      if (!destTierId && unplacedItems.some((i) => i.id === overId)) {
        destTierId = "unplaced";
      }
    }

    if (!destTierId || sourceTierId === destTierId) {
      if (sourceTierId && sourceTierId !== "unplaced") {
        setTiers(tiers.map((tier) => {
          if (tier.id === sourceTierId) {
            const oldIndex = tier.items.findIndex((i) => i.id === activeId);
            const newIndex = tier.items.findIndex((i) => i.id === overId);
            if (oldIndex !== -1 && newIndex !== -1) {
              return { ...tier, items: arrayMove(tier.items, oldIndex, newIndex) };
            }
          }
          return tier;
        }));
      } else if (sourceTierId === "unplaced") {
        const oldIndex = unplacedItems.findIndex((i) => i.id === activeId);
        const newIndex = unplacedItems.findIndex((i) => i.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          setUnplacedItems(arrayMove(unplacedItems, oldIndex, newIndex));
        }
      }
      return;
    }

    let insertIndex = -1;
    if (destTierId === "unplaced") {
      insertIndex = unplacedItems.findIndex((i) => i.id === overId);
    } else {
      const destTierObj = tiers.find((t) => t.id === destTierId);
      if (destTierObj) {
        insertIndex = destTierObj.items.findIndex((i) => i.id === overId);
      }
    }

    if (sourceTierId === "unplaced") {
      setUnplacedItems(unplacedItems.filter((i) => i.id !== activeId));
    } else {
      setTiers(tiers.map((tier) => (tier.id === sourceTierId ? { ...tier, items: tier.items.filter((i) => i.id !== activeId) } : tier)));
    }

    if (destTierId === "unplaced") {
      if (insertIndex !== -1) {
        const newItems = [...unplacedItems.filter((i) => i.id !== activeId)];
        newItems.splice(insertIndex, 0, draggedItem);
        setUnplacedItems(newItems);
      } else {
        setUnplacedItems([...unplacedItems.filter((i) => i.id !== activeId), draggedItem]);
      }
    } else {
      setTiers(tiers.map((tier) => {
        if (tier.id === destTierId) {
          if (insertIndex !== -1) {
            const newItems = [...tier.items];
            newItems.splice(insertIndex, 0, draggedItem);
            return { ...tier, items: newItems };
          }
          return { ...tier, items: [...tier.items, draggedItem] };
        }
        return tier;
      }));
    }
  };

  const handleSave = async () => {
    if (!isSignedIn && isPublic) {
      setShowAuthPrompt(true);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const allTiers = [...tiers.map((tier) => ({
        name: tier.name,
        color: tier.color,
        items: tier.items.map((tierItem) => ({
          mediaUrl: tierItem.mediaUrl,
          mediaType: tierItem.mediaType,
          coverImageUrl: tierItem.coverImageUrl,
          embedId: tierItem.embedId,
          label: tierItem.label,
        })),
      }))];

      if (unplacedItems.length > 0) {
        allTiers.push({
          name: POOL_TIER_NAME,
          color: "#808080",
          items: unplacedItems.map((tierItem) => ({
            mediaUrl: tierItem.mediaUrl,
            mediaType: tierItem.mediaType,
            coverImageUrl: tierItem.coverImageUrl,
            embedId: tierItem.embedId,
            label: tierItem.label,
          })),
        });
      }

      const payload: Record<string, any> = {
        title,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        isPublic: isSignedIn ? isPublic : false,
        tiers: allTiers,
      };

      if (!isSignedIn && anonymousId) {
        payload.anonymousId = anonymousId;
      }

      if (tierlistId) {
        const response = await fetch(`/api/tierlists/${tierlistId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update tier list");

        setSaveMessage({
          type: "success",
          text: isSignedIn ? "Tier list updated successfully!" : "Tier list saved privately. Sign in to publish it!",
        });
      } else {
        const response = await fetch("/api/tierlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to save tier list");

        const data = await response.json();
        setTierlistId(data.id);
        setSaveMessage({
          type: "success",
          text: isSignedIn ? "Tier list saved successfully!" : "Tier list saved privately. Sign in to publish it!",
        });

        window.history.pushState({}, "", `/create?id=${data.id}`);
      }
    } catch (error) {
      console.error("Error saving tier list:", error);
      setSaveMessage({ type: "error", text: "Failed to save tier list. Please try again." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleExportPNG = async () => {
    try {
      const tierListElement = document.getElementById("tier-list-container");
      if (!tierListElement) return;

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(tierListElement, { backgroundColor: "#ffffff", scale: 2 });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error exporting PNG:", error);
      setSaveMessage({ type: "error", text: "Failed to export PNG. Please try again." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stripes pt-28 pb-12 px-4 flex items-center justify-center">
        <div className="card-cartoon p-8 text-center">
          <p className="text-lg font-bold text-zinc-900">Loading tier list...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-stripes pt-28 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <div className="card-cartoon p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FFD43B] rounded-xl flex items-center justify-center border-2 border-zinc-900">
                  <Settings className="w-5 h-5 text-zinc-900" />
                </div>
                <h2 className="text-xl font-black text-zinc-900">Tierlist Settings</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Title</Label>
                    <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-semibold" placeholder="Tier List Title" />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Description (optional)</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description for your tier list" rows={3} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch id="public-toggle" checked={isSignedIn ? isPublic : false} onCheckedChange={setIsPublic} disabled={!isSignedIn} />
                    <Label htmlFor="public-toggle" className={`cursor-pointer ${!isSignedIn ? "text-muted-foreground" : ""}`}>
                      {isSignedIn ? (isPublic ? "Public" : "Private") : "Private"} tier list
                      {!isSignedIn && <span className="text-xs ml-2">(Sign in to publish publicly)</span>}
                    </Label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Cover Image (optional)</Label>
                  {coverImageUrl ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                      <Image src={coverImageUrl} alt="Cover" fill sizes="100vw" className="object-cover" />
                      <Button size="icon" variant="destructive" className="absolute top-2 right-2 w-6 h-6" onClick={() => setCoverImageUrl(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="cover-image-upload" onContextMenu={(e) => e.preventDefault()}>
                      <div className="w-full h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        {isUploadingCover ? (
                          <span className="text-muted-foreground">Uploading...</span>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-sm">Click to upload cover image</span>
                          </div>
                        )}
                      </div>
                      <input id="cover-image-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverImageUpload} disabled={isUploadingCover} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" className="btn-cartoon btn-white !py-2 !px-3 disabled:opacity-50">
                <Undo2 className="w-4 h-4" />
              </button>

              <button onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" className="btn-cartoon btn-white !py-2 !px-3 disabled:opacity-50">
                <Redo2 className="w-4 h-4" />
              </button>

              <button onClick={addTier} className="btn-cartoon btn-blue flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Tier
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="btn-cartoon btn-purple flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4" />
                    Template
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {TIER_TEMPLATES.map((template, index) => (
                    <DropdownMenuItem key={index} onClick={() => handleApplyTemplate(template)} className="flex flex-col items-start">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={handleSave} disabled={isSaving} className="btn-cartoon btn-coral flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : tierlistId ? "Update" : "Save"}
              </button>

              <button onClick={handleExportPNG} className="btn-cartoon btn-green flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PNG
              </button>
            </div>

            {saveMessage && (
              <div className={`mt-4 card-cartoon-sm p-4 ${saveMessage.type === "success" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFEBEE] text-[#C62828]"}`}>
                <p className="font-bold">{saveMessage.text}</p>
              </div>
            )}

            {showAuthPrompt && (
              <div className="mt-4 card-cartoon-sm p-4 bg-[#E3F2FD]">
                <p className="text-[#1565C0] font-bold mb-3">Sign in to publish your tier list publicly! You can still save it privately without an account.</p>
                <div className="flex gap-2 flex-wrap">
                  <Link href="/sign-in">
                    <button className="btn-cartoon btn-blue">Sign In</button>
                  </Link>
                  <button className="btn-cartoon btn-white" onClick={() => { setShowAuthPrompt(false); setIsPublic(false); setTimeout(() => handleSave(), 100); }}>
                    Save as Private
                  </button>
                  <button className="btn-cartoon btn-white" onClick={() => setShowAuthPrompt(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div id="tier-list-container" className="space-y-3 mb-6">
            {tiers.map((tier) => (
              <div key={tier.id} className="card-cartoon overflow-hidden !rounded-2xl">
                <div className="flex">
                  <div className="min-w-24 max-w-48 flex items-center justify-center font-bold text-lg shrink-0 p-2" style={{ backgroundColor: tier.color }}>
                    <Input value={tier.name} onChange={(e) => updateTierName(tier.id, e.target.value)} className="text-center border-none bg-transparent font-bold text-lg w-full" style={{ color: getContrastColor(tier.color) }} />
                  </div>

                  <SortableContext items={tier.items.map((i) => i.id)} strategy={rectSortingStrategy} id={tier.id}>
                    <DroppableTierZone tier={tier} isOver={activeOverId === tier.id}>
                      {tier.items.map((tierItem) => (
                        <SortableItem key={tierItem.id} item={tierItem} onDelete={handleDeleteItem} onClick={setSelectedItem} />
                      ))}
                    </DroppableTierZone>
                  </SortableContext>

                  <div className="flex items-center p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => moveTierUp(tier.id)} disabled={tiers.findIndex((t) => t.id === tier.id) === 0}>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => moveTierDown(tier.id)} disabled={tiers.findIndex((t) => t.id === tier.id) === tiers.length - 1}>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Move Down
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center cursor-pointer gap-2">
                          <Palette className="w-4 h-4" />
                          <span>Color</span>
                          <input type="color" value={tier.color} onChange={(e) => updateTierColor(tier.id, e.target.value)} className="w-8 h-6 cursor-pointer rounded border border-border ml-auto" onClick={(e) => e.stopPropagation()} />
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addTierAfter(tier.id)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Tier Below
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => removeTier(tier.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Tier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-cartoon p-6">
            <h3 className="text-xl font-black mb-4 text-zinc-900">Pool</h3>
            <SortableContext items={unplacedItems.map((i) => i.id)} strategy={rectSortingStrategy} id="unplaced">
              <DroppablePoolZone isOver={activeOverId === "unplaced"}>
                {unplacedItems.map((poolItem) => (
                  <SortableItem key={poolItem.id} item={poolItem} onDelete={handleDeleteItem} onClick={setSelectedItem} />
                ))}
              </DroppablePoolZone>
            </SortableContext>
            <div className="mt-4 pt-4 border-t-2 border-zinc-200 flex gap-3 flex-wrap">
              <label htmlFor="pool-media-upload" className="flex-1 min-w-[140px]" onContextMenu={(e) => e.preventDefault()}>
                <button type="button" className="btn-cartoon btn-blue w-full flex items-center justify-center gap-2" onClick={() => document.getElementById("pool-media-upload")?.click()}>
                  <Plus className="w-4 h-4" />
                  Add Media
                </button>
              </label>
              <input id="pool-media-upload" type="file" accept="image/*,video/*,audio/*,.gif" multiple className="hidden" onChange={handleMediaUpload} />
              <button type="button" className="btn-cartoon btn-purple flex-1 min-w-[140px] flex items-center justify-center gap-2" onClick={() => setShowEmbedDialog(true)}>
                <Link2 className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>

          <EmbedDialog isOpen={showEmbedDialog} onClose={() => setShowEmbedDialog(false)} onAddEmbed={(newItem) => setUnplacedItems((prev) => [...prev, newItem])} />
        </div>

        <ItemPreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} onCoverUpload={handleAudioCoverUpload} />

        <DragOverlay>
          {activeItem ? (
            <div className="w-16 h-16 opacity-80">
              <MediaPreview item={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stripes pt-28 pb-12 px-4 flex items-center justify-center">
          <div className="card-cartoon p-8 text-center">
            <p className="text-lg font-bold text-zinc-900">Loading...</p>
          </div>
        </div>
      }
    >
      <CreatePageContent />
    </Suspense>
  );
}
