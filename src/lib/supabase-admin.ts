import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

/** Cliente com a service_role key: só deve ser usado dentro de server functions,
 * nunca importado em código que roda no navegador. As tabelas pixel_settings e
 * zedy_webhook_events têm RLS sem políticas — só este cliente as alcança. */
export function getSupabaseAdmin() {
  // O cliente gerado usa os tipos de src/integrations/supabase/types.ts; as tabelas
  // desta loja ainda não estão nos tipos gerados, então fazemos o cast aqui.
  return supabaseAdmin as unknown as {
    from(table: "pixel_settings"): {
      select(columns: string): {
        eq(column: string, value: unknown): {
          single(): Promise<{ data: PixelSettingsRow | null; error: { message: string } | null }>;
        };
      };
      update(values: Partial<PixelSettingsRow>): {
        eq(column: string, value: unknown): Promise<{ error: { message: string } | null }>;
      };
    };
    from(table: "zedy_webhook_events"): {
      insert(
        values: Pick<ZedyWebhookEventRow, "order_id" | "event_type" | "payload">,
      ): Promise<{ error: { code?: string; message: string } | null }>;
    };
  };
}
