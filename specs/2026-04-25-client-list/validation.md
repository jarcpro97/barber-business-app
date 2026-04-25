# Validation — Phase 5: Client List

All checks must pass before this branch can be merged.

## Checks

### 1. Add a client

- Navigate to `/dashboard/clients/new`.
- Fill in name (required), phone, and notes, then submit.
- Redirected to `/dashboard/clients` and the new client appears in the list.

### 2. Search

- With multiple clients in the list, type part of a name or phone number into the search input.
- List filters in real time to matching clients.
- Clear the search → all clients reappear.

### 3. View detail

- Click a client card → navigated to `/dashboard/clients/[id]`.
- Name, phone, and notes are displayed correctly.

### 4. Edit a client

- On the detail page, update the name or phone and save.
- The updated values persist after page reload.

### 5. Delete a client

- On the detail page, click Delete and confirm.
- Redirected to the list and the client no longer appears.

### 6. RLS isolation

- Log in as a second test user and confirm the first user's clients are not visible.

### 7. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
