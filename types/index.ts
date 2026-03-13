// Shared domain types used across UI and API routes.
export type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  style: string;
  image_url: string;
  gallery_id?: string | null;
  tags?: string[] | null;
  location_link?: string | null;
  session_length_minutes?: number | null;
  aftercare?: string | null;
  sort_order?: number | null;
  created_at: string;
};

export type BookingRequest = {
  name: string;
  email: string;
  preferredDate: string;
  placement: string;
  description: string;
};

export type ContactRequest = {
  name?: string;
  email: string;
  message: string;
};

export type Gallery = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  body: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  status: "draft" | "published";
  publish_at?: string | null;
  created_at: string;
  updated_at: string;
};
