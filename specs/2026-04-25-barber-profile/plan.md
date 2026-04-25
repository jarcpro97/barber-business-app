# Plan — Phase 4: Barber Profile

## 1. Create the `profiles` table in Supabase

Run the following SQL in the Supabase SQL Editor:

```sql
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  shop_name  text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
```

## 2. Add the trigger that creates a profile on sign-up

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, shop_name)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'shop_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 3. Build the profile page

**`app/dashboard/profile/page.tsx`** (`'use client'`)

- On mount: load the authenticated user with `supabase.auth.getUser()`, then query `profiles` with `.eq('id', user.id).single()`.
- Populate `name` and `shopName` state fields.
- Avatar displayed with Shadcn `Avatar` component; falls back to initials derived from `name`.
- On submit: call `supabase.from('profiles').upsert({ id, name, shop_name, updated_at })`.
- Display success or error message after save.
- Back button returns to `/dashboard`.

## 4. Wire the profile link in the dashboard

- Add a "Perfil" button in `app/dashboard/page.tsx` that links to `/dashboard/profile`.

## 5. Commit

```
feat: add barber profile page with Supabase profiles table and trigger
```
