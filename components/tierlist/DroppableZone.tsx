"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Tier } from "./types";

interface DroppableTierZoneProps {
  tier: Tier;
  children: React.ReactNode;
  isOver: boolean;
}

export function DroppableTierZone({ tier, children, isOver }: DroppableTierZoneProps) {
  const { setNodeRef } = useDroppable({
    id: tier.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[80px] p-2 flex flex-wrap gap-2 items-start content-start transition-all duration-200 ease-out ${
        isOver ? "bg-primary/20 ring-2 ring-primary ring-inset scale-[1.01]" : "bg-secondary/20"
      }`}
    >
      {children}
    </div>
  );
}

interface DroppablePoolZoneProps {
  children: React.ReactNode;
  isOver: boolean;
}

export function DroppablePoolZone({ children, isOver }: DroppablePoolZoneProps) {
  const { setNodeRef } = useDroppable({
    id: "unplaced",
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2 min-h-[80px] p-2 rounded-lg transition-all duration-200 ease-out ${
        isOver ? "bg-primary/20 ring-2 ring-primary ring-inset scale-[1.005]" : "bg-secondary/10"
      }`}
    >
      {children}
    </div>
  );
}

interface ViewDroppableTierProps {
  tier: { id: string; name: string; color: string };
  children: React.ReactNode;
}

export function ViewDroppableTier({ tier, children }: ViewDroppableTierProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[80px] p-2 flex flex-wrap gap-2 items-start content-start transition-all duration-200 ease-out ${
        isOver ? "bg-primary/20 ring-2 ring-primary ring-inset scale-[1.01]" : "bg-secondary/20"
      }`}
    >
      {children}
    </div>
  );
}

interface ViewDroppablePoolProps {
  children: React.ReactNode;
}

export function ViewDroppablePool({ children }: ViewDroppablePoolProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "__POOL__" });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2 min-h-[80px] p-2 rounded-lg transition-all duration-200 ease-out ${
        isOver ? "bg-primary/20 ring-2 ring-primary ring-inset scale-[1.005]" : "bg-secondary/10"
      }`}
    >
      {children}
    </div>
  );
}
