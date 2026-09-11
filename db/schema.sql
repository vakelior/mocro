-- ============================================================================
-- MOCRO — Supabase schema + RLS + seed (single migration file, idempotent)
-- Run this whole file in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ENUM
do $$ begin create type article_status as enum ('draft','published','archived');
exception when duplicate_object then null; end $$;

-- TABLES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  avatar text,
  bio text,
  social_links jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.authors(id) on delete set null,
  status article_status not null default 'draft',
  is_featured boolean not null default false,
  is_breaking boolean not null default false,
  views integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ADMIN USERS — explicit allow-list of editor emails.
create table if not exists public.admin_users (
  email text not null unique,
  created_at timestamptz not null default now()
);

-- INDEXES
create index if not exists idx_articles_status on public.articles (status, published_at desc);
create index if not exists idx_articles_category on public.articles (category_id);
create index if not exists idx_articles_author on public.articles (author_id);
create index if not exists idx_articles_featured on public.articles (is_featured);
create index if not exists idx_articles_breaking on public.articles (is_breaking);
create index if not exists idx_articles_views on public.articles (views desc);
create index if not exists idx_categories_active on public.categories (is_active, sort_order);
create index if not exists idx_article_tags_article on public.article_tags (article_id);
create index if not exists idx_article_tags_tag on public.article_tags (tag_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
  );
$$ language sql stable security definer set search_path = public;

alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.tags enable row level security;
alter table public.article_tags enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories for select using (is_active = true);

drop policy if exists "authors_public_read" on public.authors;
create policy "authors_public_read" on public.authors for select using (true);

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles for select using (status = 'published');

drop policy if exists "tags_public_read" on public.tags;
create policy "tags_public_read" on public.tags for select using (true);

drop policy if exists "article_tags_public_read" on public.article_tags;
create policy "article_tags_public_read" on public.article_tags for select using (true);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "authors_admin_all" on public.authors;
create policy "authors_admin_all" on public.authors for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all" on public.articles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tags_admin_all" on public.tags;
create policy "tags_admin_all" on public.tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "article_tags_admin_all" on public.article_tags;
create policy "article_tags_admin_all" on public.article_tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_users_read" on public.admin_users;
create policy "admin_users_read" on public.admin_users for select using (public.is_admin());

create or replace function public.increment_article_view_by_slug(p_slug text)
returns void as $$
  update public.articles set views = views + 1
  where slug = p_slug and status = 'published';
$$ language sql security definer set search_path = public;

revoke all on function public.increment_article_view_by_slug(text) from public;
grant execute on function public.increment_article_view_by_slug(text) to anon, authenticated;

alter publication supabase_realtime add table public.articles;
alter publication supabase_realtime add table public.categories;

-- SEED
insert into public.categories (name, slug, description, sort_order, is_active) values
  ('سياسة','politics','أخبار السياسة المحلية والدولية وآخر المستجدات.',1,true),
  ('اقتصاد','economy','الأسواق والاقتصاد والأعمال والمال.',2,true),
  ('رياضة','sports','أخبار الرياضة المحلية والعالمية وأبرز المباريات.',3,true),
  ('ثقافة وفنون','culture','الأدب والفن والسينما والموسيقى والتراث.',4,true),
  ('تكنولوجيا','technology','أخبار التقنية والذكاء الاصطناعي والابتكار.',5,true),
  ('محلية','local','أخبار محلية وقضايا المجتمع.',6,true),
  ('عالمية','world','أبرز الأحداث العالمية أولاً بأول.',7,true),
  ('صحة','health','الصحة والعلوم والطب ونمط الحياة.',8,true)
on conflict (slug) do nothing;

insert into public.authors (name, slug, bio) values
  ('فريق مُوكْرُو','mocro-team','فريق تحرير مُوكْرُو — نغطي الأخبار المحلية والعالمية بمهنية وموضوعية.')
on conflict (slug) do nothing;

insert into public.admin_users (email) values
  ('admin@mocro.design')
on conflict (email) do nothing;
