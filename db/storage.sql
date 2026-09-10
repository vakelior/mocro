-- ============================================================================
-- MOCRO — Supabase Storage setup (run after schema.sql)
-- ============================================================================

insert into storage.buckets (id, name, public) values ('images','images',true)
on conflict (id) do nothing;

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects for select using (bucket_id = 'images');

drop policy if exists "images_admin_insert" on storage.objects;
create policy "images_admin_insert" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "images_admin_update" on storage.objects;
create policy "images_admin_update" on storage.objects for update using (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "images_admin_delete" on storage.objects;
create policy "images_admin_delete" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');