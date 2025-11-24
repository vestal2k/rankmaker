"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Download } from "lucide-react";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TierItem {
  id: string;
  imageUrl: string;
  label?: string;
}

interface Tier {
  id: string;
  name: string;
  color: string;
  items: TierItem[];
}

const DEFAULT_TIERS: Tier[] = [
  { id: "s", name: "S", color: "#ff7f7f", items: [] },
  { id: "a", name: "A", color: "#ffbf7f", items: [] },
  { id: "b", name: "B", color: "#ffdf7f", items: [] },
  { id: "c", name: "C", color: "#ffff7f", items: [] },
  { id: "d", name: "D", color: "#bfff7f", items: [] },
  { id: "f", name: "F", color: "#7fff7f", items: [] },
];

function SortableItem({ item }: { item: TierItem }) {
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
      {...listeners}
      className="w-16 h-16 relative group cursor-move"
    >
      <img
        src={item.imageUrl}
        alt={item.label || ""}
        className="w-full h-full object-cover rounded border-2 border-transparent hover:border-primary"
      />
    </div>
  );
}

export default function CreatePage() {
  const [title, setTitle] = useState("My Tier List");
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [unplacedItems, setUnplacedItems] = useState<TierItem[]>([]);
  const [activeItem, setActiveItem] = useState<TierItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: TierItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          imageUrl: event.target?.result as string,
        };
        setUnplacedItems((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

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
      setUnplacedItems([...unplacedItems, item]);
    } else {
      setTiers(
        tiers.map((tier) => {
          if (tier.id === destTierId) {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold mb-4"
            placeholder="Tier List Title"
          />

          <div className="flex gap-2">
            <label htmlFor="image-upload">
              <Button
                type="button"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Images
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            <Button onClick={addTier} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </div>

        {/* Tier List */}
        <div className="space-y-2 mb-6">
          {tiers.map((tier) => (
            <Card key={tier.id} className="p-0 overflow-hidden">
              <div className="flex">
                {/* Tier Label */}
                <div
                  className="w-24 flex items-center justify-center font-bold text-lg shrink-0"
                  style={{ backgroundColor: tier.color }}
                >
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTierName(tier.id, e.target.value)}
                    className="text-center border-none bg-transparent font-bold text-lg w-full"
                  />
                </div>

                {/* Tier Items Area */}
                <SortableContext
                  items={tier.items.map((i) => i.id)}
                  strategy={rectSortingStrategy}
                  id={tier.id}
                >
                  <div
                    className="flex-1 min-h-[100px] p-2 flex flex-wrap gap-2 items-start bg-secondary/20"
                    data-tier-id={tier.id}
                  >
                    {tier.items.map((item) => (
                      <SortableItem key={item.id} item={item} />
                    ))}
                  </div>
                </SortableContext>

                {/* Controls */}
                <div className="flex flex-col gap-2 p-2">
                  <input
                    type="color"
                    value={tier.color}
                    onChange={(e) => updateTierColor(tier.id, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeTier(tier.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Unplaced Items */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Unplaced Items</h3>
          <SortableContext
            items={unplacedItems.map((i) => i.id)}
            strategy={rectSortingStrategy}
            id="unplaced"
          >
            <div className="flex flex-wrap gap-2 min-h-[100px]">
              {unplacedItems.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </Card>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="w-16 h-16">
            <img
              src={activeItem.imageUrl}
              alt={activeItem.label || ""}
              className="w-full h-full object-cover rounded opacity-80"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
