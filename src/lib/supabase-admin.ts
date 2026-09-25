import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

export type PixelSettingsRow = Tables<"pixel_settings">;
export type ZedyWebhookEventRow = Tables<"zedy_webhook_events">;

let cached: SupabaseClient | null = null;

/** Cliente com a service_role key do Supabase externo da loja: só deve ser
 * usado dentro de server functions, nunca importado em código que roda no
 * navegador. As tabelas pixel_settings e zedy_webhook_events vivem nesse
 * banco e só este cliente as alcança. Retorna null se as chaves não estiverem
 * configuradas — o rastreamento fica desligado nesse caso. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env["TRACKING_SUPABASE_URL"];
  const key = process.env["TRACKING_SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
