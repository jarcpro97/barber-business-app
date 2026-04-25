-- CutMetrics: Tabla de cortes
-- Ejecutado en Fase 6

create table if not exists public.cuts (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  date timestamptz not null default now(),
  price decimal(10,2) not null,
  duration integer, -- duracion en minutos
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indices para busquedas
create index if not exists cuts_barber_id_idx on public.cuts(barber_id);
create index if not exists cuts_client_id_idx on public.cuts(client_id);
create index if not exists cuts_date_idx on public.cuts(date);

-- Habilitar RLS
alter table public.cuts enable row level security;

-- Politicas RLS - cada barbero solo ve sus propios cortes
create policy "cuts_select_own" on public.cuts 
  for select using (auth.uid() = barber_id);

create policy "cuts_insert_own" on public.cuts 
  for insert with check (auth.uid() = barber_id);

create policy "cuts_update_own" on public.cuts 
  for update using (auth.uid() = barber_id);

create policy "cuts_delete_own" on public.cuts 
  for delete using (auth.uid() = barber_id);
