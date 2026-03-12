import type { Tattoo } from "@/types";

// Fallback data when Supabase is not configured yet.
export const FALLBACK_TATTOOS: Tattoo[] = [
  {
    id: "fallback-1",
    title: "Anatomy Study",
    description: "Fine-line vertebrae with fractured symmetry.",
    style: "Fine Line / Dotwork",
    image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Iron Bloom",
    description: "Blackwork petals with industrial scars.",
    style: "Blackwork",
    image_url: "https://images.unsplash.com/photo-1500534314209-a26db0f5d4d2",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "Terminal Dream",
    description: "Ascii-inspired geometry on soft tissue.",
    style: "Ignorant / Concept",
    image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    created_at: new Date().toISOString(),
  },
];
