import { createClient } from "@supabase/supabase-js";

export type PixelSettingsRow = {
  id: number;
  utmify_html: string | null;
  tiktok_pixel_id: string | null;
  tiktok_access_token: string | null;
  password_hash: string | null;
  updated_at: string;
};

export type ZedyWebhookEventRow = {
  order_id: string;
  event_type: string;
  payload: unknown;
  processed_at: string;
};

export type Database = {
  public: {
    Tables: {
      pixel_settings: {
        Row: PixelSettingsRow;
        Insert: Partial<PixelSettingsRow>;
        Update: Partial<PixelSettingsRow>;
        Relationships: [];
      };
      zedy_webhook_events: {
        Row: ZedyWebhookEventRow;
        Insert: Partial<ZedyWebhookEventRow> &
          Pick<ZedyWebhookEventRow, "order_id" | "event_type" | "payload">;
        Update: Partial<ZedyWebhookEventRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let client: ReturnType<typeof createClient<Database>> | null = null;

/** Cliente Supabase com a service_role key: só deve ser usado dentro de server functions,
 * nunca importado em código que roda no navegador. */
export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env["SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados");
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
