"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Download, Save, Settings, ChevronUp, ChevronDown, Palette, ImageIcon, X, Volume2, Film, Link2, Youtube, Undo2, Redo2, LayoutTemplate } from "lucide-react";
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
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "GIF" | "YOUTUBE" | "TWITTER" | "INSTAGRAM";

interface TierItem {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  coverImageUrl?: string;
  embedId?: string;
  label?: string;
}

interface Tier {
  id: string;
  name: string;
  color: string;
  items: TierItem[];
}

interface HistoryState {
  tiers: Tier[];
  unplacedItems: TierItem[];
}

const MAX_HISTORY_SIZE = 50;

const DEFAULT_TIERS: Tier[] = [
  { id: "s", name: "S", color: "#ff7f7f", items: [] },
  { id: "a", name: "A", color: "#ffbf7f", items: [] },
  { id: "b", name: "B", color: "#ffdf7f", items: [] },
  { id: "c", name: "C", color: "#ffff7f", items: [] },
  { id: "d", name: "D", color: "#bfff7f", items: [] },
  { id: "f", name: "F", color: "#7fff7f", items: [] },
];

interface TierTemplate {
  name: string;
  description: string;
  tiers: Omit<Tier, 'id'>[];
}

const TIER_TEMPLATES: TierTemplate[] = [
  {
    name: "Standard (S-F)",
    description: "Classic tier list with S, A, B, C, D, F rankings",
    tiers: [
      { name: "S", color: "#ff7f7f", items: [] },
      { name: "A", color: "#ffbf7f", items: [] },
      { name: "B", color: "#ffdf7f", items: [] },
      { name: "C", color: "#ffff7f", items: [] },
      { name: "D", color: "#bfff7f", items: [] },
      { name: "F", color: "#7fff7f", items: [] },
    ],
  },
  {
    name: "Simple (S-A-B-C)",
    description: "Simplified tier list with 4 tiers",
    tiers: [
      { name: "S", color: "#ff7f7f", items: [] },
      { name: "A", color: "#ffbf7f", items: [] },
      { name: "B", color: "#ffdf7f", items: [] },
      { name: "C", color: "#bfff7f", items: [] },
    ],
  },
  {
    name: "Top/Mid/Bottom",
    description: "Simple 3-tier ranking system",
    tiers: [
      { name: "Top", color: "#4ade80", items: [] },
      { name: "Mid", color: "#facc15", items: [] },
      { name: "Bottom", color: "#f87171", items: [] },
    ],
  },
  {
    name: "Numeric (1-5)",
    description: "Numbered ranking from 1 to 5",
    tiers: [
      { name: "1", color: "#4ade80", items: [] },
      { name: "2", color: "#86efac", items: [] },
      { name: "3", color: "#fde047", items: [] },
      { name: "4", color: "#fb923c", items: [] },
      { name: "5", color: "#f87171", items: [] },
    ],
  },
  {
    name: "Yes/Maybe/No",
    description: "Decision-based tier list",
    tiers: [
      { name: "Yes", color: "#4ade80", items: [] },
      { name: "Maybe", color: "#fde047", items: [] },
      { name: "No", color: "#f87171", items: [] },
    ],
  },
  {
    name: "Love/Like/OK/Dislike",
    description: "Preference-based ranking",
    tiers: [
      { name: "Love", color: "#f472b6", items: [] },
      { name: "Like", color: "#4ade80", items: [] },
      { name: "OK", color: "#fde047", items: [] },
      { name: "Dislike", color: "#f87171", items: [] },
    ],
  },
];

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
            onMouseEnter={(e) => {
              const video = e.currentTarget;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Silently ignore - element was removed or paused before play resolved
                });
              }
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget;
              video.pause();
              video.currentTime = 0;
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

function SortableItem({ item, onDelete, onClick }: { item: TierItem; onDelete?: (id: string) => void; onClick?: (item: TierItem) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-16 h-16 relative group"
    >
      {/* Drag handle - only this area triggers drag */}
      <div
        {...listeners}
        className="w-full h-full cursor-move"
        onClick={(e) => {
          if (onClick && !isDragging) {
            e.stopPropagation();
            onClick(item);
          }
        }}
      >
        <MediaPreview
          item={item}
          className="border-2 border-transparent hover:border-primary"
        />
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(item.id);
          }}
          onPointerDown={(e) => {
            e.stopPropagation(); // Prevent drag from starting
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold z-10"
        >
          ×
        </button>
      )}
    </div>
  );
}

function DroppableTierZone({ tier, children, isOver }: { tier: Tier; children: React.ReactNode; isOver: boolean }) {
  const { setNodeRef } = useDroppable({
    id: tier.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[80px] p-2 flex flex-wrap gap-2 items-start content-start transition-colors ${
        isOver ? "bg-primary/20 ring-2 ring-primary ring-inset" : "bg-secondary/20"
      }`}
    >
      {children}
    </div>
  );
}

function DroppablePoolZone({ children, isOver }: { children: React.ReactNode; isOver: boolean }) {
  const { setNodeRef } = useDroppable({
    id: "unplaced",
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2 min-h-[80px] p-2 rounded transition-colors ${
        isOver ? "bg-primary/20 ring-2 ring-primary ring-inset" : ""
      }`}
    >
      {children}
    </div>
  );
}

// Generate or retrieve anonymous ID
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
  const { isSignedIn } = useUser();
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
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeOverId, setActiveOverId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TierItem | null>(null);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedError, setEmbedError] = useState<string | null>(null);

  // History management for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Save current state to history
  const saveToHistory = useCallback((newTiers: Tier[], newUnplacedItems: TierItem[]) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new state
      const updated = [...newHistory, { tiers: newTiers, unplacedItems: newUnplacedItems }];
      // Limit history size
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

  // Initialize history with initial state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ tiers: DEFAULT_TIERS, unplacedItems: [] }]);
      setHistoryIndex(0);
    }
  }, [history.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Escape key - close modals/dialogs
      if (e.key === 'Escape') {
        if (selectedItem) {
          setSelectedItem(null);
          return;
        }
        if (showEmbedDialog) {
          setShowEmbedDialog(false);
          setEmbedUrl("");
          setEmbedError(null);
          return;
        }
      }

      // Skip other shortcuts if typing
      if (isTyping) return;

      // Ctrl+Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Ctrl+Shift+Z: Redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl+S: Save
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving) handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedItem, showEmbedDialog, isSaving]);

  // Save to history when tiers or unplacedItems change
  useEffect(() => {
    if (!isUndoRedoAction.current && history.length > 0) {
      const currentState = history[historyIndex];
      if (currentState &&
          (JSON.stringify(currentState.tiers) !== JSON.stringify(tiers) ||
           JSON.stringify(currentState.unplacedItems) !== JSON.stringify(unplacedItems))) {
        saveToHistory(tiers, unplacedItems);
      }
    }
  }, [tiers, unplacedItems, history, historyIndex, saveToHistory]);

  // Parse embed URLs
  const parseEmbedUrl = (url: string): { type: MediaType; embedId: string; mediaUrl: string } | null => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        return { type: "YOUTUBE", embedId: match[1], mediaUrl: url };
      }
    }

    // Twitter/X patterns
    const twitterPatterns = [
      /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    ];
    for (const pattern of twitterPatterns) {
      const match = url.match(pattern);
      if (match) {
        return { type: "TWITTER", embedId: match[1], mediaUrl: url };
      }
    }

    // Instagram patterns
    const instagramPatterns = [
      /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of instagramPatterns) {
      const match = url.match(pattern);
      if (match) {
        return { type: "INSTAGRAM", embedId: match[1], mediaUrl: url };
      }
    }

    return null;
  };

  const handleAddEmbed = () => {
    const parsed = parseEmbedUrl(embedUrl.trim());
    if (!parsed) {
      setEmbedError("URL not recognized. Supported: YouTube, Twitter/X, Instagram");
      return;
    }

    const newItem: TierItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      mediaUrl: parsed.mediaUrl,
      mediaType: parsed.type,
      embedId: parsed.embedId,
    };

    setUnplacedItems((prev) => [...prev, newItem]);
    setEmbedUrl("");
    setEmbedError(null);
    setShowEmbedDialog(false);
  };

  const handleApplyTemplate = (template: TierTemplate) => {
    // Move all current items to unplaced
    const allItems = tiers.flatMap(tier => tier.items);
    setUnplacedItems(prev => [...prev, ...allItems]);

    // Apply template with unique IDs
    const newTiers = template.tiers.map((tier, index) => ({
      ...tier,
      id: `tier-${Date.now()}-${index}`,
      items: [],
    }));
    setTiers(newTiers);
  };

  // Get anonymous ID on mount
  useEffect(() => {
    setAnonymousId(getAnonymousId());
  }, []);

  // Load tier list if ID is in URL
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== tierlistId) {
      loadTierList(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const items = tier.items.map((item: any) => ({
          id: item.id,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType || "IMAGE",
          coverImageUrl: item.coverImageUrl,
          embedId: item.embedId,
          label: item.label,
        }));

        if (tier.name === "__POOL__") {
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
      setSaveMessage({
        type: "error",
        text: "Failed to load tier list.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px minimum movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
      // Move items back to unplaced
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

  const getMediaTypeFromFile = (file: File): MediaType => {
    const mimeType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (mimeType === "image/gif" || fileName.endsWith(".gif")) {
      return "GIF";
    }
    if (mimeType.startsWith("video/")) {
      return "VIDEO";
    }
    if (mimeType.startsWith("audio/")) {
      return "AUDIO";
    }
    return "IMAGE";
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const fileArray = Array.from(files);

      // Separate files: small images use server upload, large files use client upload
      const smallFiles: File[] = [];
      const largeFiles: File[] = [];

      for (const file of fileArray) {
        const isLargeOrMedia = file.size > 4 * 1024 * 1024 || // > 4MB
          file.type.startsWith("video/") ||
          file.type.startsWith("audio/");

        if (isLargeOrMedia) {
          largeFiles.push(file);
        } else {
          smallFiles.push(file);
        }
      }

      const newItems: TierItem[] = [];

      // Upload small files via server
      if (smallFiles.length > 0) {
        const formData = new FormData();
        smallFiles.forEach((file) => {
          formData.append("files", file);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload media");
        }

        const data = await response.json();

        data.files.forEach((file: { url: string; mediaType: MediaType }) => {
          newItems.push({
            id: `item-${Date.now()}-${Math.random()}`,
            mediaUrl: file.url,
            mediaType: file.mediaType,
          });
        });
      }

      // Upload large files via client upload (for videos, audio, large images)
      for (const file of largeFiles) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload/client-token",
        });

        newItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          mediaUrl: blob.url,
          mediaType: getMediaTypeFromFile(file),
        });
      }

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

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload cover image");
      }

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

    // Find the item being dragged
    let item: TierItem | undefined;

    for (const tier of tiers) {
      item = tier.items.find((i) => i.id === active.id);
      if (item) break;
    }

    if (!item) {
      item = unplacedItems.find((i) => i.id === active.id);
    }

    setActiveItem(item || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setActiveOverId(null);
      return;
    }

    const overId = over.id as string;

    // Check if over a tier container
    const tier = tiers.find((t) => t.id === overId);
    if (tier) {
      setActiveOverId(tier.id);
      return;
    }

    if (overId === "unplaced") {
      setActiveOverId("unplaced");
      return;
    }

    // Check if over an item - find its parent tier
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
    // Check in tiers
    for (const tier of tiers) {
      if (tier.items.some((i) => i.id === itemId)) {
        setTiers(
          tiers.map((t) =>
            t.id === tier.id
              ? { ...t, items: t.items.filter((i) => i.id !== itemId) }
              : t
          )
        );
        return;
      }
    }

    // Check in unplaced
    setUnplacedItems(unplacedItems.filter((i) => i.id !== itemId));
  };

  const handleUpdateItem = (itemId: string, updates: Partial<TierItem>) => {
    // Check in tiers
    for (const tier of tiers) {
      if (tier.items.some((i) => i.id === itemId)) {
        setTiers(
          tiers.map((t) =>
            t.id === tier.id
              ? {
                  ...t,
                  items: t.items.map((i) =>
                    i.id === itemId ? { ...i, ...updates } : i
                  ),
                }
              : t
          )
        );
        // Update selectedItem if it's the one being updated
        if (selectedItem?.id === itemId) {
          setSelectedItem({ ...selectedItem, ...updates });
        }
        return;
      }
    }

    // Check in unplaced
    setUnplacedItems(
      unplacedItems.map((i) =>
        i.id === itemId ? { ...i, ...updates } : i
      )
    );
    // Update selectedItem if it's the one being updated
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

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload cover image");
      }

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

    // Find source tier and item
    let sourceTierId: string | null = null;
    let item: TierItem | undefined;

    for (const tier of tiers) {
      item = tier.items.find((i) => i.id === activeId);
      if (item) {
        sourceTierId = tier.id;
        break;
      }
    }

    if (!item) {
      item = unplacedItems.find((i) => i.id === activeId);
      sourceTierId = "unplaced";
    }

    if (!item) return;

    // Find destination tier
    let destTierId: string | null = null;

    // Check if dropped on a tier container
    const destTier = tiers.find((t) => t.id === overId);
    if (destTier) {
      destTierId = destTier.id;
    } else if (overId === "unplaced") {
      destTierId = "unplaced";
    } else {
      // Dropped on an item, find its tier
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
      // Same tier - just reorder
      if (sourceTierId && sourceTierId !== "unplaced") {
        setTiers(
          tiers.map((tier) => {
            if (tier.id === sourceTierId) {
              const oldIndex = tier.items.findIndex((i) => i.id === activeId);
              const newIndex = tier.items.findIndex((i) => i.id === overId);
              if (oldIndex !== -1 && newIndex !== -1) {
                return {
                  ...tier,
                  items: arrayMove(tier.items, oldIndex, newIndex),
                };
              }
            }
            return tier;
          })
        );
      } else if (sourceTierId === "unplaced") {
        const oldIndex = unplacedItems.findIndex((i) => i.id === activeId);
        const newIndex = unplacedItems.findIndex((i) => i.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          setUnplacedItems(arrayMove(unplacedItems, oldIndex, newIndex));
        }
      }
      return;
    }

    // Find insertion index if dropping on a specific item
    let insertIndex = -1;
    if (destTierId === "unplaced") {
      insertIndex = unplacedItems.findIndex((i) => i.id === overId);
    } else {
      const destTierObj = tiers.find((t) => t.id === destTierId);
      if (destTierObj) {
        insertIndex = destTierObj.items.findIndex((i) => i.id === overId);
      }
    }

    // Moving between different tiers or unplaced
    if (sourceTierId === "unplaced") {
      setUnplacedItems(unplacedItems.filter((i) => i.id !== activeId));
    } else {
      setTiers(
        tiers.map((tier) => {
          if (tier.id === sourceTierId) {
            return {
              ...tier,
              items: tier.items.filter((i) => i.id !== activeId),
            };
          }
          return tier;
        })
      );
    }

    if (destTierId === "unplaced") {
      if (insertIndex !== -1) {
        // Insert at specific position
        const newItems = [...unplacedItems.filter((i) => i.id !== activeId)];
        newItems.splice(insertIndex, 0, item);
        setUnplacedItems(newItems);
      } else {
        setUnplacedItems([...unplacedItems.filter((i) => i.id !== activeId), item]);
      }
    } else {
      setTiers(
        tiers.map((tier) => {
          if (tier.id === destTierId) {
            if (insertIndex !== -1) {
              // Insert at specific position
              const newItems = [...tier.items];
              newItems.splice(insertIndex, 0, item);
              return {
                ...tier,
                items: newItems,
              };
            }
            return {
              ...tier,
              items: [...tier.items, item],
            };
          }
          return tier;
        })
      );
    }
  };

  const allItems = [
    ...unplacedItems,
    ...tiers.flatMap((tier) => tier.items),
  ];

  const handleSave = async () => {
    // If not signed in and trying to make public, show auth prompt
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
        items: tier.items.map((item) => ({
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          coverImageUrl: item.coverImageUrl,
          embedId: item.embedId,
          label: item.label,
        })),
      }))];

      if (unplacedItems.length > 0) {
        allTiers.push({
          name: "__POOL__",
          color: "#808080",
          items: unplacedItems.map((item) => ({
            mediaUrl: item.mediaUrl,
            mediaType: item.mediaType,
            coverImageUrl: item.coverImageUrl,
            embedId: item.embedId,
            label: item.label,
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

      // Add anonymousId for non-authenticated users
      if (!isSignedIn && anonymousId) {
        payload.anonymousId = anonymousId;
      }

      if (tierlistId) {
        // Update existing tier list
        const response = await fetch(`/api/tierlists/${tierlistId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update tier list");

        setSaveMessage({
          type: "success",
          text: isSignedIn
            ? "Tier list updated successfully!"
            : "Tier list saved privately. Sign in to publish it!",
        });
      } else {
        // Create new tier list
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
          text: isSignedIn
            ? "Tier list saved successfully!"
            : "Tier list saved privately. Sign in to publish it!",
        });

        // Update URL without reload
        window.history.pushState({}, "", `/create?id=${data.id}`);
      }
    } catch (error) {
      console.error("Error saving tier list:", error);
      setSaveMessage({
        type: "error",
        text: "Failed to save tier list. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleExportPNG = async () => {
    try {
      const tierListElement = document.getElementById("tier-list-container");
      if (!tierListElement) return;

      // Use html2canvas
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(tierListElement, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      // Convert to blob and download
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
      setSaveMessage({
        type: "error",
        text: "Failed to export PNG. Please try again.",
      });
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
          {/* Tierlist Settings Card */}
          <div className="card-cartoon p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFD43B] rounded-xl flex items-center justify-center border-2 border-zinc-900">
                <Settings className="w-5 h-5 text-zinc-900" />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Tierlist Settings</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Left column: Title, Description, Visibility */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Title</Label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold"
                    placeholder="Tier List Title"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Description (optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description for your tier list"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="public-toggle"
                    checked={isSignedIn ? isPublic : false}
                    onCheckedChange={setIsPublic}
                    disabled={!isSignedIn}
                  />
                  <Label htmlFor="public-toggle" className={`cursor-pointer ${!isSignedIn ? "text-muted-foreground" : ""}`}>
                    {isSignedIn ? (isPublic ? "Public" : "Private") : "Private"} tier list
                    {!isSignedIn && (
                      <span className="text-xs ml-2">(Sign in to publish publicly)</span>
                    )}
                  </Label>
                </div>
              </div>

              {/* Right column: Cover Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Cover Image (optional)</Label>
                {coverImageUrl ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                    <img
                      src={coverImageUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 w-6 h-6"
                      onClick={() => setCoverImageUrl(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="cover-image-upload"
                    onContextMenu={(e) => e.preventDefault()}
                  >
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
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageUpload}
                      disabled={isUploadingCover}
                    />
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
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleApplyTemplate(template)}
                    className="flex flex-col items-start"
                  >
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
            <div className={`mt-4 card-cartoon-sm p-4 ${
              saveMessage.type === "success"
                ? "bg-[#E8F5E9] text-[#2E7D32]"
                : "bg-[#FFEBEE] text-[#C62828]"
            }`}>
              <p className="font-bold">{saveMessage.text}</p>
            </div>
          )}

          {showAuthPrompt && (
            <div className="mt-4 card-cartoon-sm p-4 bg-[#E3F2FD]">
              <p className="text-[#1565C0] font-bold mb-3">
                Sign in to publish your tier list publicly! You can still save it privately without an account.
              </p>
              <div className="flex gap-2 flex-wrap">
                <SignInButton mode="modal">
                  <button className="btn-cartoon btn-blue">Sign In</button>
                </SignInButton>
                <button
                  className="btn-cartoon btn-white"
                  onClick={() => {
                    setShowAuthPrompt(false);
                    setIsPublic(false);
                    setTimeout(() => handleSave(), 100);
                  }}
                >
                  Save as Private
                </button>
                <button
                  className="btn-cartoon btn-white"
                  onClick={() => setShowAuthPrompt(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tier List */}
        <div id="tier-list-container" className="space-y-3 mb-6">
          {tiers.map((tier) => (
            <div key={tier.id} className="card-cartoon overflow-hidden !rounded-2xl">
              <div className="flex">
                {/* Tier Label */}
                <div
                  className="min-w-24 max-w-48 flex items-center justify-center font-bold text-lg shrink-0 p-2"
                  style={{ backgroundColor: tier.color }}
                >
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTierName(tier.id, e.target.value)}
                    className="text-center border-none bg-transparent font-bold text-lg w-full"
                    style={{
                      color: getContrastColor(tier.color),
                    }}
                  />
                </div>

                {/* Tier Items Area */}
                <SortableContext
                  items={tier.items.map((i) => i.id)}
                  strategy={rectSortingStrategy}
                  id={tier.id}
                >
                  <DroppableTierZone tier={tier} isOver={activeOverId === tier.id}>
                    {tier.items.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteItem}
                        onClick={setSelectedItem}
                      />
                    ))}
                  </DroppableTierZone>
                </SortableContext>

                {/* Controls */}
                <div className="flex items-center p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => moveTierUp(tier.id)}
                        disabled={tiers.findIndex((t) => t.id === tier.id) === 0}
                      >
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => moveTierDown(tier.id)}
                        disabled={tiers.findIndex((t) => t.id === tier.id) === tiers.length - 1}
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center cursor-pointer gap-2"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Color</span>
                        <input
                          type="color"
                          value={tier.color}
                          onChange={(e) => updateTierColor(tier.id, e.target.value)}
                          className="w-8 h-6 cursor-pointer rounded border border-border ml-auto"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addTierAfter(tier.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tier Below
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => removeTier(tier.id)}
                        className="text-destructive focus:text-destructive"
                      >
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

        {/* Unplaced Items (Pool) */}
        <div className="card-cartoon p-6">
          <h3 className="text-xl font-black mb-4 text-zinc-900 dark:text-white">Pool</h3>
          <SortableContext
            items={unplacedItems.map((i) => i.id)}
            strategy={rectSortingStrategy}
            id="unplaced"
          >
            <DroppablePoolZone isOver={activeOverId === "unplaced"}>
              {unplacedItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  onClick={setSelectedItem}
                />
              ))}
            </DroppablePoolZone>
          </SortableContext>
          <div className="mt-4 pt-4 border-t-2 border-zinc-200 dark:border-zinc-700 flex gap-3 flex-wrap">
            <label
              htmlFor="pool-media-upload"
              className="flex-1 min-w-[140px]"
              onContextMenu={(e) => e.preventDefault()}
            >
              <button
                type="button"
                className="btn-cartoon btn-blue w-full flex items-center justify-center gap-2"
                onClick={() => document.getElementById("pool-media-upload")?.click()}
              >
                <Plus className="w-4 h-4" />
                Add Media
              </button>
            </label>
            <input
              id="pool-media-upload"
              type="file"
              accept="image/*,video/*,audio/*,.gif"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
            />
            <button
              type="button"
              className="btn-cartoon btn-purple flex-1 min-w-[140px] flex items-center justify-center gap-2"
              onClick={() => setShowEmbedDialog(true)}
            >
              <Link2 className="w-4 h-4" />
              Add Link
            </button>
          </div>
        </div>

        {/* Embed Dialog */}
        {showEmbedDialog && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowEmbedDialog(false);
              setEmbedUrl("");
              setEmbedError(null);
            }}
          >
            <div
              className="card-cartoon p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">Add Link</h3>
                <button
                  onClick={() => {
                    setShowEmbedDialog(false);
                    setEmbedUrl("");
                    setEmbedError(null);
                  }}
                  className="btn-cartoon btn-white !p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-zinc-500 mb-4 font-medium">
                Paste a YouTube, Twitter/X, or Instagram URL
              </p>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={embedUrl}
                onChange={(e) => {
                  setEmbedUrl(e.target.value);
                  setEmbedError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddEmbed();
                  }
                }}
                className="input-cartoon w-full mb-3"
              />
              {embedError && (
                <p className="text-sm text-[#C62828] font-bold mb-4">{embedError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  className="btn-cartoon btn-white"
                  onClick={() => {
                    setShowEmbedDialog(false);
                    setEmbedUrl("");
                    setEmbedError(null);
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleAddEmbed} className="btn-cartoon btn-blue">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Item Preview Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] card-cartoon overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-10 btn-cartoon btn-white !p-2"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedItem.mediaType === "YOUTUBE" && selectedItem.embedId ? (
              <div className="w-[560px] max-w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedItem.embedId}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selectedItem.mediaType === "TWITTER" && selectedItem.embedId ? (
              <div className="p-6 min-w-[300px] max-w-[550px]">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="font-semibold">Tweet</span>
                </div>
                <a
                  href={selectedItem.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mb-4"
                >
                  View on X/Twitter
                </a>
                <p className="text-sm text-muted-foreground">
                  Tweet ID: {selectedItem.embedId}
                </p>
              </div>
            ) : selectedItem.mediaType === "INSTAGRAM" && selectedItem.embedId ? (
              <div className="p-6 min-w-[300px] max-w-[550px]">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="font-semibold">Instagram</span>
                </div>
                <a
                  href={selectedItem.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mb-4"
                >
                  View on Instagram
                </a>
                <p className="text-sm text-muted-foreground">
                  Post ID: {selectedItem.embedId}
                </p>
              </div>
            ) : selectedItem.mediaType === "VIDEO" ? (
              <video
                src={selectedItem.mediaUrl}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] object-contain"
              />
            ) : selectedItem.mediaType === "AUDIO" ? (
              <div className="p-8 flex flex-col items-center gap-4 min-w-[300px]">
                {selectedItem.coverImageUrl ? (
                  <div className="relative group">
                    <img
                      src={selectedItem.coverImageUrl}
                      alt="Audio cover"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <label
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-lg"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                      <span className="text-white text-sm font-medium">Change cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAudioCoverUpload(e, selectedItem.id)}
                      />
                    </label>
                  </div>
                ) : (
                  <label
                    className="w-48 h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gradient-to-br from-purple-500/20 to-purple-700/20"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Add cover image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAudioCoverUpload(e, selectedItem.id)}
                    />
                  </label>
                )}
                <audio
                  src={selectedItem.mediaUrl}
                  controls
                  autoPlay
                  className="w-full"
                />
              </div>
            ) : (
              <img
                src={selectedItem.mediaUrl}
                alt={selectedItem.label || ""}
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </div>
      )}

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
