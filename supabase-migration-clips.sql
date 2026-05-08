-- Klipų lentelė admin redagavimui
create table if not exists public.clip_screens (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  screen text not null,
  type text not null,
  resolution text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clip_screens_display_order on public.clip_screens (display_order);
create index if not exists idx_clip_screens_is_active on public.clip_screens (is_active);

-- RLS (pasirinktinai): paliekama įjungta ir leidimai anon skaitymui
alter table public.clip_screens enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'clip_screens'
      and policyname = 'Allow public read clip_screens'
  ) then
    create policy "Allow public read clip_screens"
      on public.clip_screens
      for select
      to anon, authenticated
      using (is_active = true or auth.role() = 'authenticated');
  end if;
end $$;

-- Admin autentifikacija čia yra aplikacijos lygio (ne Supabase auth),
-- todėl rašymą leidžiame taip pat kaip news lentelėje.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'clip_screens'
      and policyname = 'Allow public modify clip_screens'
  ) then
    create policy "Allow public modify clip_screens"
      on public.clip_screens
      for all
      using (true)
      with check (true);
  end if;
end $$;
