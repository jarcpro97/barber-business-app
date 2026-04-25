# Validation — Phase 4: Barber Profile

All checks must pass before this branch can be merged.

## Checks

### 1. Trigger creates profile on sign-up

- Register a new account.
- In Supabase Table Editor open `profiles` → confirm a row exists for the new user with the name and shop name entered at sign-up.

### 2. Profile page loads

- Log in and navigate to `/dashboard/profile`.
- The page shows the name and shop name from the database.
- Avatar displays initials derived from the name.

### 3. Edit and save

- Change the name or shop name and click "Guardar cambios".
- A success message appears.
- Reload the page → the updated values persist.

### 4. RLS enforced (manual)

- In the Supabase SQL Editor run:
  ```sql
  select * from profiles;
  ```
  with the anon key — the query should return 0 rows (RLS blocks unauthenticated reads).

### 5. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
