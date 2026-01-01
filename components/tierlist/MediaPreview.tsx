"use client";

import Image from "next/image";
import { Volume2, Film, Youtube } from "lucide-react";
import type { TierItem } from "./types";

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

interface MediaPreviewProps {
  item: TierItem;
  className?: string;
}

export function MediaPreview({ item, className = "" }: MediaPreviewProps) {
  switch (item.mediaType) {
    case "YOUTUBE":
      return (
        <div className={`relative ${className}`}>
          <Image
            src={item.embedId ? getYouTubeThumbnail(item.embedId) : item.coverImageUrl || ""}
            alt={item.label || "YouTube video"}
            fill
            sizes="64px"
            className="object-cover rounded"
          />
          <div className="absolute bottom-0.5 right-0.5 bg-red-600 rounded p-0.5 z-10">
            <Youtube className="w-3 h-3 text-white" />
          </div>
        </div>
      );

    case "TWITTER":
      return (
        <div className={`relative ${className}`}>
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={item.label || "Tweet"}
              fill
              sizes="64px"
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center rounded">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 bg-black rounded p-0.5 z-10">
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
            <Image
              src={item.coverImageUrl}
              alt={item.label || "Instagram post"}
              fill
              sizes="64px"
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center rounded">
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded p-0.5 z-10">
            <InstagramIcon className="w-3 h-3 text-white" />
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
                playPromise.catch(() => {});
              }
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget;
              video.pause();
              video.currentTime = 0;
            }}
          />
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded p-0.5 z-10">
            <Film className="w-3 h-3 text-white" />
          </div>
        </div>
      );

    case "AUDIO":
      return (
        <div className={`relative ${className}`}>
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={item.label || "Audio cover"}
              fill
              sizes="64px"
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center rounded">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded p-0.5 z-10">
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        </div>
      );

    case "GIF":
      return (
        <div className={`relative ${className}`}>
          <Image
            src={item.mediaUrl}
            alt={item.label || ""}
            fill
            sizes="64px"
            className="object-cover rounded"
            unoptimized
          />
          <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded px-1 z-10">
            <span className="text-[10px] font-bold text-white">GIF</span>
          </div>
        </div>
      );

    case "IMAGE":
    default:
      return (
        <div className={`relative ${className}`}>
          <Image
            src={item.mediaUrl}
            alt={item.label || ""}
            fill
            sizes="64px"
            className="object-cover rounded"
          />
        </div>
      );
  }
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
