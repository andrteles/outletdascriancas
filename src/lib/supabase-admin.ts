import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

export type PixelSettingsRow = Tables<"pixel_settings">;
export type ZedyWebhookEventRow = Tables<"zedy_webhook_events">;

/** Cliente com a service_role key: só deve ser usado dentro de server functions,
 * nunca importado em código que roda no navegador. As tabelas pixel_settings e
 * zedy_webhook_events têm RLS sem políticas — só este cliente as alcança. */
export function getSupabaseAdmin() {
  return supabaseAdmin;
}
