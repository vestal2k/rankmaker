export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "GIF" | "YOUTUBE" | "TWITTER" | "INSTAGRAM";

export interface TierItem {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  coverImageUrl?: string | null;
  embedId?: string | null;
  label?: string | null;
  order?: number;
}

export interface Tier {
  id: string;
  name: string;
  color: string;
  items: TierItem[];
  order?: number;
}

export interface TierTemplate {
  name: string;
  description: string;
  tiers: Omit<Tier, "id">[];
}
