"use client";

import Image from "next/image";
import { X, ImageIcon, Youtube } from "lucide-react";
import type { TierItem } from "./types";

interface ItemPreviewModalProps {
  item: TierItem | null;
  onClose: () => void;
  onCoverUpload?: (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}

export function ItemPreviewModal({ item, onClose, onCoverUpload }: ItemPreviewModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] card-cartoon overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 btn-cartoon btn-white !p-2"
        >
          <X className="w-5 h-5" />
        </button>

        {item.mediaType === "YOUTUBE" && item.embedId ? (
          <div className="w-[560px] max-w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${item.embedId}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : item.mediaType === "TWITTER" && item.embedId ? (
          <TwitterPreview item={item} />
        ) : item.mediaType === "INSTAGRAM" && item.embedId ? (
          <InstagramPreview item={item} />
        ) : item.mediaType === "VIDEO" ? (
          <video
            src={item.mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] object-contain"
          />
        ) : item.mediaType === "AUDIO" ? (
          <AudioPreview item={item} onCoverUpload={onCoverUpload} />
        ) : (
          <div className="relative w-[560px] max-w-full aspect-video">
            <Image
              src={item.mediaUrl}
              alt={item.label || ""}
              fill
              sizes="(max-width: 560px) 100vw, 560px"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TwitterPreview({ item }: { item: TierItem }) {
  return (
    <div className="p-6 min-w-[300px] max-w-[550px]">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="font-semibold">Tweet</span>
      </div>
      <a
        href={item.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline block mb-4"
      >
        View on X/Twitter
      </a>
      <p className="text-sm text-muted-foreground">
        Tweet ID: {item.embedId}
      </p>
    </div>
  );
}

function InstagramPreview({ item }: { item: TierItem }) {
  return (
    <div className="p-6 min-w-[300px] max-w-[550px]">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
        <span className="font-semibold">Instagram</span>
      </div>
      <a
        href={item.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline block mb-4"
      >
        View on Instagram
      </a>
      <p className="text-sm text-muted-foreground">
        Post ID: {item.embedId}
      </p>
    </div>
  );
}

interface AudioPreviewProps {
  item: TierItem;
  onCoverUpload?: (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}

function AudioPreview({ item, onCoverUpload }: AudioPreviewProps) {
  return (
    <div className="p-8 flex flex-col items-center gap-4 min-w-[300px]">
      {item.coverImageUrl ? (
        <div className="relative group w-48 h-48">
          <Image
            src={item.coverImageUrl}
            alt="Audio cover"
            fill
            sizes="192px"
            className="object-cover rounded-lg"
          />
          {onCoverUpload && (
            <label
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-lg"
              onContextMenu={(e) => e.preventDefault()}
            >
              <span className="text-white text-sm font-medium">Change cover</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onCoverUpload(e, item.id)}
              />
            </label>
          )}
        </div>
      ) : (
        <label
          className="w-48 h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gradient-to-br from-purple-500/20 to-purple-700/20"
          onContextMenu={(e) => e.preventDefault()}
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Add cover image</span>
          {onCoverUpload && (
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onCoverUpload(e, item.id)}
            />
          )}
        </label>
      )}
      <audio
        src={item.mediaUrl}
        controls
        autoPlay
        className="w-full"
      />
    </div>
  );
}
