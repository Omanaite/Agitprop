import type { SupabaseClient } from "@supabase/supabase-js";

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1598885159317-b5a9c0a6f9c8?w=800&q=80",
  "https://images.unsplash.com/photo-1590492108714-829fce9e5df4?w=800&q=80",
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80",
];

export async function seedDemoContent(
  supabase: SupabaseClient,
  ownerUserId: string,
  studioName: string
) {
  try {
    // Demo gallery
    const { data: gallery, error: galleryError } = await supabase
      .from("galleries")
      .insert({
        owner_user_id: ownerUserId,
        title: "Featured Work",
        description: "A selection of recent pieces from the studio.",
        slug: "featured-work",
      })
      .select("id")
      .single();

    if (galleryError || !gallery) return;

    // Demo pieces
    const pieces = [
      {
        owner_user_id: ownerUserId,
        gallery_id: gallery.id,
        title: "Geometric Mandala",
        description: "Fine line geometric mandala on the forearm.",
        style: "geometric",
        image_url: DEMO_IMAGES[0],
        sort_order: 1,
      },
      {
        owner_user_id: ownerUserId,
        gallery_id: gallery.id,
        title: "Botanical Sleeve",
        description: "Blackwork botanical illustration, upper arm.",
        style: "blackwork",
        image_url: DEMO_IMAGES[1],
        sort_order: 2,
      },
      {
        owner_user_id: ownerUserId,
        gallery_id: gallery.id,
        title: "Abstract Composition",
        description: "Abstract ink composition on the ribcage.",
        style: "abstract",
        image_url: DEMO_IMAGES[2],
        sort_order: 3,
      },
    ];

    await supabase.from("tattoos").insert(pieces);

    // Demo post
    await supabase.from("posts").insert({
      owner_user_id: ownerUserId,
      title: `Welcome to ${studioName}`,
      body: `This is your first studio post. Share updates, behind-the-scenes moments, or upcoming availability with your clients. You can edit or delete this from your workspace.`,
      published_at: new Date().toISOString(),
    });
  } catch {
    // Never block provisioning on demo content failure
  }
}
