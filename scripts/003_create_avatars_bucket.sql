-- Create avatars storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own avatar
create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update their own avatar
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own avatar
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access to avatars
create policy "avatars_public_read" on storage.objects
  for select to public
  using (bucket_id = 'avatars');
