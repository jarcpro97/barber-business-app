-- CutMetrics: Tabla de clientes
-- Ejecutado en Fase 5

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indice para busquedas por barbero
create index if not exists clients_barber_id_idx on public.clients(barber_id);

-- Habilitar RLS
alter table public.clients enable row level security;

-- Politicas RLS - cada barbero solo ve sus propios clientes
create policy "clients_select_own" on public.clients 
  for select using (auth.uid() = barber_id);

create policy "clients_insert_own" on public.clients 
  for insert with check (auth.uid() = barber_id);

create policy "clients_update_own" on public.clients 
  for update using (auth.uid() = barber_id);

create policy "clients_delete_own" on public.clients 
  for delete using (auth.uid() = barber_id);
