"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { MediaType, TierItem } from "./types";

interface EmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmbed: (item: TierItem) => void;
}

export function EmbedDialog({ isOpen, onClose, onAddEmbed }: EmbedDialogProps) {
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedError, setEmbedError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmbedUrl("");
    setEmbedError(null);
    onClose();
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

    onAddEmbed(newItem);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="card-cartoon p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-zinc-900">Add Link</h3>
          <button onClick={handleClose} className="btn-cartoon btn-white !p-2">
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
          <button className="btn-cartoon btn-white" onClick={handleClose}>
            Cancel
          </button>
          <button onClick={handleAddEmbed} className="btn-cartoon btn-blue">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function parseEmbedUrl(url: string): { type: MediaType; embedId: string; mediaUrl: string } | null {
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

  const twitterPatterns = [/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/];
  for (const pattern of twitterPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { type: "TWITTER", embedId: match[1], mediaUrl: url };
    }
  }

  const instagramPatterns = [/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/];
  for (const pattern of instagramPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { type: "INSTAGRAM", embedId: match[1], mediaUrl: url };
    }
  }

  return null;
}
