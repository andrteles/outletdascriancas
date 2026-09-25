import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface PublicTrackingConfig {
  tiktokPixelId: string | null;
  utmifyHtml: string | null;
}

export async function fetchPixelRow() {
  // Rastreamento é opcional: se o banco não estiver configurado ou falhar,
  // a loja continua funcionando sem pixel em vez de quebrar a página.
  try {
    const admin = getSupabaseAdmin();
    if (!admin) return null;
    const { data, error } = await admin
      .from("pixel_settings")
      .select("utmify_html, tiktok_pixel_id, tiktok_access_token")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return data;
  } catch (err) {
    console.warn("[tracking] configuração do pixel indisponível:", (err as Error).message);
    return null;
  }
}

export const getPublicTrackingConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicTrackingConfig> => {
    const row = await fetchPixelRow();
    return {
      tiktokPixelId: row?.tiktok_pixel_id ?? null,
      utmifyHtml: row?.utmify_html ?? null,
    };
  },
);

interface TikTokEventContent {
  contentId: string;
  contentName: string;
  quantity?: number;
  price?: number;
}

interface TrackTikTokEventInput {
  event: "AddToCart";
  eventId: string;
  url: string;
  currency?: string;
  value?: number;
  contents?: TikTokEventContent[];
}

export const trackTikTokEvent = createServerFn({ method: "POST" })
  .validator((input: TrackTikTokEventInput) => input)
  .handler(async ({ data }) => {
    const row = await fetchPixelRow();
    const pixelId = row?.tiktok_pixel_id;
    const accessToken = row?.tiktok_access_token;
    if (!pixelId || !accessToken) return { sent: false };

    const userAgent = getRequestHeader("user-agent");
    const ip = getRequestIP();

    try {
      const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken,
        },
        body: JSON.stringify({
          event_source: "web",
          event_source_id: pixelId,
          data: [
            {
              event: data.event,
              event_time: Math.floor(Date.now() / 1000),
              event_id: data.eventId,
              user: {
                ...(ip ? { ip } : {}),
                ...(userAgent ? { user_agent: userAgent } : {}),
              },
              page: { url: data.url },
              properties: {
                currency: data.currency ?? "BRL",
                value: data.value,
                contents: data.contents?.map((item) => ({
                  content_id: item.contentId,
                  content_name: item.contentName,
                  quantity: item.quantity ?? 1,
                  price: item.price,
                })),
              },
            },
          ],
        }),
      });
      return { sent: response.ok };
    } catch {
      return { sent: false };
    }
  });
