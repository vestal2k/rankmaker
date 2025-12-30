import type { Tier, TierTemplate } from "./types";

export const MAX_HISTORY_SIZE = 50;

export const TIER_COLORS = {
  S: "#ff7f7f",
  A: "#ffbf7f",
  B: "#ffdf7f",
  C: "#ffff7f",
  D: "#bfff7f",
  F: "#7fff7f",
  DEFAULT: "#808080",
  POOL: "#808080",
} as const;

export const DEFAULT_TIERS: Tier[] = [
  { id: "s", name: "S", color: TIER_COLORS.S, items: [] },
  { id: "a", name: "A", color: TIER_COLORS.A, items: [] },
  { id: "b", name: "B", color: TIER_COLORS.B, items: [] },
  { id: "c", name: "C", color: TIER_COLORS.C, items: [] },
  { id: "d", name: "D", color: TIER_COLORS.D, items: [] },
  { id: "f", name: "F", color: TIER_COLORS.F, items: [] },
];

export const TIER_TEMPLATES: TierTemplate[] = [
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

export const POOL_TIER_NAME = "__POOL__";
export const POOL_TIER_ORDER = 9999;

export const ITEM_SIZE = {
  width: 64,
  height: 64,
} as const;

export const DRAG_ACTIVATION_DISTANCE = 8;
