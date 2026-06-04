-- Road2Abs — Initial Schema
-- Run in Supabase SQL Editor or via supabase db push

-- ── EXTENSIONS ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── PROFILES ────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text,
  default_budget numeric(6,2) not null default 10.00,
  nearby_only boolean not null default true,
  equipment text[] not null default '{"pan","oven","air_fryer","microwave","blender","sandwich_press","grill","shaker"}',
  show_carbs boolean not null default false,
  show_fat boolean not null default false,
  default_store text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── NUTRITION TARGETS ───────────────────────────────────────────────────────
create table if not exists nutrition_targets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  calories integer not null default 2070,
  protein_min integer not null default 130,
  protein_target integer not null default 160,
  protein_max integer not null default 180,
  carbs integer,
  fat integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text,
  store text not null check (store in ('coop','migros','lidl','denner')),
  category text not null,
  image_url text,
  product_page_url text,
  price_chf numeric(6,2) not null,
  price_unit text not null,
  calories_per_100g numeric(6,1) not null,
  protein_per_100g numeric(6,1) not null,
  carbs_per_100g numeric(6,1) not null default 0,
  fat_per_100g numeric(6,1) not null default 0,
  package_size_g numeric(8,1) not null,
  calories_per_package numeric(8,1) not null default 0,
  protein_per_package numeric(8,1) not null default 0,
  carbs_per_package numeric(8,1) not null default 0,
  fat_per_package numeric(8,1) not null default 0,
  availability_notes text,
  last_checked date,
  verified boolean not null default false,
  tags text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── RECIPES ─────────────────────────────────────────────────────────────────
create table if not exists recipes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text,
  image_url text,
  instructions text[] not null default '{}',
  prep_time_min integer not null default 0,
  cook_time_min integer not null default 0,
  total_time_min integer not null default 0,
  servings integer not null default 1,
  equipment_required text[] not null default '{}',
  suitable_contexts text[] not null default '{"meal"}',
  suitable_times text[] not null default '{}',
  stores_required text[] not null default '{}',
  tags text[] not null default '{}',
  total_calories numeric(8,1) not null,
  total_protein numeric(6,1) not null,
  total_carbs numeric(6,1) not null default 0,
  total_fat numeric(6,1) not null default 0,
  estimated_price_chf numeric(6,2) not null,
  protein_efficiency numeric(5,2) not null default 0,
  times_selected integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── RECIPE INGREDIENTS ──────────────────────────────────────────────────────
create table if not exists recipe_ingredients (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  quantity_g numeric(8,1) not null,
  notes text
);

-- ── FAVOURITES ──────────────────────────────────────────────────────────────
create table if not exists favourites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, recipe_id)
);

-- ── RECENTLY SELECTED ───────────────────────────────────────────────────────
create table if not exists recently_selected_meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  selected_at timestamptz not null default now(),
  unique(user_id, recipe_id)
);

-- ── PANTRY ITEMS ────────────────────────────────────────────────────────────
create table if not exists pantry_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  available boolean not null default true,
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

-- ── SHOPPING LISTS ──────────────────────────────────────────────────────────
create table if not exists shopping_lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists shopping_list_items (
  id uuid primary key default uuid_generate_v4(),
  shopping_list_id uuid references shopping_lists(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity_g numeric(8,1) not null,
  checked boolean not null default false,
  added_from_recipe_id uuid references recipes(id) on delete set null
);

-- ── DAILY MACRO INPUTS ──────────────────────────────────────────────────────
create table if not exists daily_macro_inputs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  input_date date not null,
  mode text not null check (mode in ('remaining','consumed')),
  calories numeric(8,1) not null,
  protein numeric(6,1) not null,
  carbs numeric(6,1),
  fat numeric(6,1),
  store_filter text,
  nearby_only boolean not null default true,
  budget_chf numeric(6,2) not null default 10,
  situation text,
  meal_time text,
  created_at timestamptz not null default now()
);

-- ── PROGRESS ENTRIES ────────────────────────────────────────────────────────
create table if not exists progress_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  weight_kg numeric(5,2),
  energy_level text check (energy_level in ('low','okay','good')),
  hunger_level text check (hunger_level in ('low','manageable','high')),
  gym_performance text check (gym_performance in ('improving','stable','worse')),
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, entry_date)
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table nutrition_targets enable row level security;
alter table favourites enable row level security;
alter table recently_selected_meals enable row level security;
alter table pantry_items enable row level security;
alter table shopping_lists enable row level security;
alter table shopping_list_items enable row level security;
alter table daily_macro_inputs enable row level security;
alter table progress_entries enable row level security;
-- Products and recipes are shared/public read, owner-write
alter table products enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;

-- User-owned tables: each user sees only their own rows
create policy "own rows" on profiles for all using (auth.uid() = user_id);
create policy "own rows" on nutrition_targets for all using (auth.uid() = user_id);
create policy "own rows" on favourites for all using (auth.uid() = user_id);
create policy "own rows" on recently_selected_meals for all using (auth.uid() = user_id);
create policy "own rows" on pantry_items for all using (auth.uid() = user_id);
create policy "own rows" on shopping_lists for all using (auth.uid() = user_id);
create policy "own rows" on daily_macro_inputs for all using (auth.uid() = user_id);
create policy "own rows" on progress_entries for all using (auth.uid() = user_id);

-- Shopping list items: accessible if the parent list belongs to the user
create policy "own shopping list items" on shopping_list_items for all
  using (
    shopping_list_id in (
      select id from shopping_lists where user_id = auth.uid()
    )
  );

-- Products and recipes: anyone authenticated can read; only authenticated can insert/update
create policy "auth read products" on products for select using (auth.role() = 'authenticated');
create policy "auth write products" on products for insert with check (auth.role() = 'authenticated');
create policy "auth update products" on products for update using (auth.role() = 'authenticated');

create policy "auth read recipes" on recipes for select using (auth.role() = 'authenticated');
create policy "auth write recipes" on recipes for insert with check (auth.role() = 'authenticated');
create policy "auth update recipes" on recipes for update using (auth.role() = 'authenticated');

create policy "auth read ingredients" on recipe_ingredients for select using (auth.role() = 'authenticated');
create policy "auth write ingredients" on recipe_ingredients for insert with check (auth.role() = 'authenticated');

-- ── FUNCTIONS / TRIGGERS ────────────────────────────────────────────────────
-- Auto-create profile + targets on user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (user_id) values (new.id) on conflict do nothing;
  insert into nutrition_targets (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
