# Validation — Phase 3: Authentication

All checks must pass before this branch can be merged.

## Checks

### 1. Sign-up flow

- Navigate to `/auth/sign-up`.
- Fill in name, shop name, email, and password (≥ 6 characters).
- Submit → redirected to `/auth/sign-up-success`.
- Check email inbox for a confirmation link.
- Click the link → redirected to `/dashboard`.

### 2. Login flow

- Navigate to `/auth/login`.
- Enter valid credentials → redirected to `/dashboard`.
- Enter wrong password → inline error message is shown (no page crash).

### 3. Middleware guard

- Clear cookies / open incognito.
- Navigate directly to `/dashboard` → immediately redirected to `/auth/login`.
- Confirm no `/dashboard` content is briefly visible before the redirect.

### 4. Sign-out

- Log in and land on `/dashboard`.
- Click "Cerrar sesión" → redirected to `/auth/login`.
- Navigate back to `/dashboard` → redirected to `/auth/login` again.

### 5. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
