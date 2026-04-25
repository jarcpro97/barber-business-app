# Requirements — Phase 4: Barber Profile

## Scope

Let each barber store and update their name and shop name, and display their avatar initials while an avatar upload feature is scaffolded.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Profile table | `profiles` in Supabase | Extends `auth.users` with barber-specific fields |
| Profile creation | DB trigger on `auth.users` insert | Guarantees a row exists for every new user without extra client code |
| RLS | Row-level security enabled; users can only read/write their own row | Prevents cross-barber data access |
| Avatar | Initials fallback via `Avatar` component; `avatar_url` column reserved for future upload | Avoids Supabase Storage complexity in this phase |
| Save method | Direct `supabase.from('profiles').upsert(...)` on the client | Simple; no Route Handler needed at this scale |

## Database schema

```sql
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  shop_name  text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Trigger: create a profile row for every new auth user
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

## Page produced

| Route | Purpose |
|---|---|
| `/dashboard/profile` | View and edit name and shop name; avatar initials preview |

## Out of scope

- Avatar file upload to Supabase Storage (future phase).
- Public barber profile page (Phase 10).
