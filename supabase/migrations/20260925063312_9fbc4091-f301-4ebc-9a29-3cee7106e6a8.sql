CREATE TABLE public.pixel_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  utmify_html text,
  tiktok_pixel_id text,
  tiktok_access_token text,
  password_hash text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.pixel_settings TO service_role;
ALTER TABLE public.pixel_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.pixel_settings (id) VALUES (1);

CREATE TABLE public.zedy_webhook_events (
  order_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (order_id, event_type)
);
GRANT ALL ON public.zedy_webhook_events TO service_role;
ALTER TABLE public.zedy_webhook_events ENABLE ROW LEVEL SECURITY;