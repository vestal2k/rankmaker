"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MediaPreview } from "./MediaPreview";
import type { TierItem } from "./types";

interface SortableItemProps {
  item: TierItem;
  onDelete?: (id: string) => void;
  onClick?: (item: TierItem) => void;
  isDragging?: boolean;
  showDeleteButton?: boolean;
}

export function SortableItem({
  item,
  onDelete,
  onClick,
  isDragging: externalIsDragging,
  showDeleteButton = true,
}: SortableItemProps) {
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
    transition: transition || "transform 150ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging || externalIsDragging ? 0.4 : 1,
    scale: isDragging ? "1.05" : "1",
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !isDragging) {
      e.stopPropagation();
      onClick(item);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(item.id);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`w-16 h-16 relative group transition-shadow duration-150 ${isDragging ? "z-50 shadow-xl" : ""}`}
    >
      <div
        {...listeners}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onClick={handleClick}
      >
        <MediaPreview
          item={item}
          className={`border-2 transition-all duration-150 ${isDragging ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"}`}
        />
      </div>
      {showDeleteButton && onDelete && (
        <button
          onClick={handleDelete}
          onPointerDown={handlePointerDown}
          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center text-xs font-bold z-10 hover:scale-110"
        >
          ×
        </button>
      )}
    </div>
  );
}

interface SimpleSortableItemProps {
  item: TierItem;
  isDragging?: boolean;
}

export function SimpleSortableItem({ item, isDragging }: SimpleSortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: internalIsDragging } = useSortable({ id: item.id });

  const isCurrentlyDragging = isDragging || internalIsDragging;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isCurrentlyDragging ? 0.4 : 1,
    scale: isCurrentlyDragging ? "1.05" : "1",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-16 h-16 cursor-grab active:cursor-grabbing transition-shadow duration-150 ${isCurrentlyDragging ? "z-50 shadow-xl" : ""}`}
    >
      <MediaPreview
        item={item}
        className={`border-2 transition-all duration-150 ${isCurrentlyDragging ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"}`}
      />
    </div>
  );
}
