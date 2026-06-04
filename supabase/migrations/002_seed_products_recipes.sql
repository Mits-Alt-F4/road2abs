-- Road2Abs — Seed Data
-- Realistic Swiss supermarket products. Macros sourced from official product pages.
-- Prices approximate as of early 2025. Verify before presenting as current.

-- ── SEED PRODUCTS ───────────────────────────────────────────────────────────
insert into products
  (name, brand, store, category, price_chf, price_unit,
   calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
   package_size_g, calories_per_package, protein_per_package,
   carbs_per_package, fat_per_package,
   product_page_url, last_checked, verified, tags)
values
  -- ── COOP ──────────────────────────────────────────────────────────────────
  ('Pouletbrustfilet, gekühlt', 'Coop Naturaplan', 'coop', 'chicken',
   7.95, '500g', 110, 23.5, 0, 1.8, 500, 550, 117.5, 0, 9,
   'https://www.coop.ch', '2025-01-15', true,
   '{"high-protein","chicken","lean"}'),

  ('Total 0% Joghurt', 'Fage', 'coop', 'yoghurt',
   2.95, '500g', 57, 10.3, 3.6, 0.3, 500, 285, 51.5, 18, 1.5,
   'https://www.coop.ch', '2025-01-15', true,
   '{"high-protein","yoghurt","snack","no-cook"}'),

  ('Hüttenkäse Nature', 'Coop', 'coop', 'cottage_cheese',
   2.20, '200g', 79, 11.2, 3.4, 2.1, 200, 158, 22.4, 6.8, 4.2,
   'https://www.coop.ch', '2025-01-15', true,
   '{"high-protein","cottage-cheese","snack","no-cook"}'),

  ('Thon au naturel', 'Coop', 'coop', 'fish',
   1.85, '185g tin (130g drained)', 86, 20.0, 0, 0.6, 130, 111.8, 26, 0, 0.78,
   'https://www.coop.ch', '2025-01-15', true,
   '{"high-protein","tuna","fish","no-cook","cheap"}'),

  ('Eier Freilandhaltung M/L', 'Coop Naturaplan', 'coop', 'eggs',
   3.95, '6 Stk', 155, 13.0, 0.7, 10.6, 360, 558, 46.8, 2.52, 38.16,
   'https://www.coop.ch', '2025-01-15', true,
   '{"eggs","protein","breakfast"}'),

  ('Tortilla Wraps', 'Old El Paso', 'coop', 'wraps',
   2.95, '6 Stk / 350g', 310, 8.4, 52.0, 7.0, 350, 1085, 29.4, 182, 24.5,
   'https://www.coop.ch', '2025-01-15', true,
   '{"wrap","carbs"}'),

  ('Langkornreis', 'Coop', 'coop', 'rice',
   1.95, '1kg', 352, 7.2, 77.0, 0.9, 1000, 3520, 72, 770, 9,
   'https://www.coop.ch', '2025-01-15', true,
   '{"carbs","rice","cheap"}'),

  ('Skyr Natur', 'Coop', 'coop', 'skyr',
   2.30, '450g', 63, 11.0, 4.0, 0.2, 450, 283.5, 49.5, 18, 0.9,
   'https://www.coop.ch', '2025-01-15', true,
   '{"skyr","high-protein","snack","no-cook"}'),

  ('Hackfleisch gemischt', 'Coop', 'coop', 'minced_meat',
   5.50, '400g', 230, 17.0, 0, 18.0, 400, 920, 68, 0, 72,
   'https://www.coop.ch', '2025-01-15', true,
   '{"beef","protein","minced"}'),

  ('Penne rigate', 'Coop', 'coop', 'pasta',
   0.99, '500g', 356, 12.5, 71.5, 1.5, 500, 1780, 62.5, 357.5, 7.5,
   'https://www.coop.ch', '2025-01-15', true,
   '{"pasta","carbs","cheap"}'),

  ('Milka Oreo 100g', 'Milka', 'coop', 'chocolate',
   1.95, '100g', 503, 6.0, 63.0, 26.0, 100, 503, 6, 63, 26,
   'https://www.coop.ch', '2025-01-15', true,
   '{"sweet","chocolate","treat"}'),

  -- ── MIGROS ────────────────────────────────────────────────────────────────
  ('Poulet Brustfilet natur', 'M-Budget', 'migros', 'chicken',
   6.95, '500g', 107, 23.0, 0, 1.5, 500, 535, 115, 0, 7.5,
   'https://www.migros.ch', '2025-01-15', true,
   '{"high-protein","chicken","lean","cheap"}'),

  ('Skyr Natur', 'Migros', 'migros', 'skyr',
   2.10, '400g', 63, 11.0, 4.2, 0.2, 400, 252, 44, 16.8, 0.8,
   'https://www.migros.ch', '2025-01-15', true,
   '{"skyr","high-protein","snack","no-cook"}'),

  ('Thon au naturel', 'M-Budget', 'migros', 'fish',
   1.45, '185g tin (130g drained)', 84, 19.8, 0, 0.5, 130, 109.2, 25.7, 0, 0.65,
   'https://www.migros.ch', '2025-01-15', true,
   '{"tuna","high-protein","no-cook","cheap","emergency-protein"}'),

  ('Magerquark', 'Migros', 'migros', 'quark',
   1.50, '500g', 68, 12.0, 3.4, 0.2, 500, 340, 60, 17, 1,
   'https://www.migros.ch', '2025-01-15', true,
   '{"quark","high-protein","snack","cheap","no-cook"}'),

  ('Penne rigate', 'M-Budget', 'migros', 'pasta',
   0.85, '500g', 356, 12.5, 71.5, 1.5, 500, 1780, 62.5, 357.5, 7.5,
   'https://www.migros.ch', '2025-01-15', true,
   '{"pasta","carbs","cheap"}'),

  ('Hähnchen-Brust Aufschnitt', 'Migros', 'migros', 'deli_slices',
   3.20, '130g', 100, 18.5, 1.2, 2.0, 130, 130, 24, 1.56, 2.6,
   'https://www.migros.ch', '2025-01-15', true,
   '{"chicken","high-protein","no-cook","deli"}'),

  ('Ovo Sport Protein Milch', 'Migros', 'migros', 'protein_drink',
   2.90, '750ml', 51, 5.8, 5.2, 0.5, 750, 382.5, 43.5, 39, 3.75,
   'https://www.migros.ch', '2025-01-15', true,
   '{"protein-drink","snack","no-cook","emergency-protein"}'),

  ('Toastbrot', 'M-Budget', 'migros', 'bread',
   1.10, '500g (25 Scheiben)', 255, 8.2, 47.0, 3.2, 500, 1275, 41, 235, 16,
   'https://www.migros.ch', '2025-01-15', true,
   '{"bread","carbs","cheap"}'),

  -- ── LIDL ──────────────────────────────────────────────────────────────────
  ('Hähnchenbrust natur', 'Lidl', 'lidl', 'chicken',
   5.99, '500g', 108, 23.2, 0, 1.6, 500, 540, 116, 0, 8,
   'https://www.lidl.ch', '2025-01-15', true,
   '{"chicken","high-protein","lean","cheap"}'),

  ('Isländischer Skyr Natur', 'Milbona', 'lidl', 'skyr',
   1.89, '450g', 62, 10.8, 4.0, 0.2, 450, 279, 48.6, 18, 0.9,
   'https://www.lidl.ch', '2025-01-15', true,
   '{"skyr","high-protein","snack","cheap","no-cook"}'),

  -- ── DENNER ────────────────────────────────────────────────────────────────
  ('Thon naturel', 'Denner', 'denner', 'fish',
   1.30, '185g tin (130g drained)', 84, 19.8, 0, 0.5, 130, 109.2, 25.7, 0, 0.65,
   'https://www.denner.ch', '2025-01-15', true,
   '{"tuna","high-protein","no-cook","cheap","emergency-protein"}')
;

-- ── SEED RECIPES ─────────────────────────────────────────────────────────────
-- Note: We insert recipes without linking recipe_ingredients (product IDs are generated at insert).
-- You can link ingredients via the admin UI or a separate script after noting product IDs.

insert into recipes
  (name, category, description, instructions, prep_time_min, cook_time_min, total_time_min,
   servings, equipment_required, suitable_contexts, suitable_times, stores_required, tags,
   total_calories, total_protein, total_carbs, total_fat, estimated_price_chf, protein_efficiency)
values
  ('High-Protein Chicken Wrap',
   'lunch',
   'Grilled chicken, salad and a dollop of skyr as sauce, wrapped in a tortilla. Fast, filling, and gets you close to your protein target in one go.',
   '{"Season chicken breast with salt, pepper and paprika.",
    "Heat a pan over medium-high heat with a small amount of oil.",
    "Cook chicken for 4–5 minutes per side until cooked through. Rest 2 minutes.",
    "Slice chicken. Warm tortilla in the dry pan for 30 seconds.",
    "Fill with chicken, salad leaves, cucumber slices and a spoonful of skyr.",
    "Fold and eat."}',
   5, 10, 15,
   1, '{"pan"}', '{"meal"}', '{"lunch","dinner"}', '{"coop","migros"}',
   '{"chicken","high-protein","wrap","quick"}',
   520, 52, 42, 10, 5.80, 10.0),

  ('Chicken Rice Bowl',
   'dinner',
   'Pan-cooked chicken breast over white rice with frozen vegetables. A classic high-protein dinner that scales easily for meal prep.',
   '{"Cook rice according to package directions (about 10–12 min).",
    "Season chicken breast and cook in a pan over medium-high heat, 4–5 min per side.",
    "Rest chicken 2 min, then slice.",
    "Microwave 100g frozen vegetables for 2 min.",
    "Layer rice, veg and chicken in a bowl.",
    "Season with soy sauce and pepper."}',
   5, 15, 20,
   1, '{"pan","microwave"}', '{"meal"}', '{"lunch","dinner","post_gym"}', '{"coop","migros"}',
   '{"chicken","rice","high-protein","classic"}',
   620, 58, 68, 7, 6.40, 9.4),

  ('Skyr Protein Bowl',
   'snack',
   'Full-fat skyr with whatever fruit is available. No cooking, zero effort, surprisingly good protein for a snack.',
   '{"Spoon 250g of skyr into a bowl.",
    "Top with sliced banana or berries.",
    "Optional: a teaspoon of honey."}',
   3, 0, 3,
   1, '{}', '{"snack","no_cooking"}', '{"breakfast","lunch","late_night"}', '{"coop","migros","lidl"}',
   '{"skyr","no-cook","snack","high-protein","sweet"}',
   230, 24, 28, 1, 2.90, 10.4),

  ('Tuna Rice Bowl',
   'lunch',
   'Canned tuna on microwaved rice. Add cucumber, a splash of soy sauce and you have a complete meal for under CHF 4.',
   '{"Microwave 80g dry rice with 160ml water for 10 min.",
    "Drain tuna can.",
    "Fluff rice with a fork, top with tuna.",
    "Add sliced cucumber, soy sauce and pepper."}',
   5, 10, 15,
   1, '{"microwave"}', '{"meal","no_cooking"}', '{"lunch","dinner"}', '{"coop","migros","denner"}',
   '{"tuna","rice","high-protein","cheap","quick"}',
   440, 38, 62, 3, 3.80, 8.6),

  ('Cottage Cheese Toast Bowl',
   'breakfast',
   'Hüttenkäse on toasted bread. Add cherry tomatoes and pepper — done in 5 minutes.',
   '{"Toast two slices of bread.",
    "Spread Hüttenkäse generously.",
    "Top with halved cherry tomatoes, cracked pepper and a pinch of salt."}',
   3, 2, 5,
   1, '{"microwave"}', '{"snack","meal","no_cooking"}', '{"breakfast","lunch","late_night"}', '{"coop"}',
   '{"cottage-cheese","no-cook","quick","high-protein","cheap"}',
   290, 28, 26, 5, 3.20, 9.7),

  ('Emergency Protein Snack Plate',
   'snack',
   'Tuna + skyr + sliced cucumber. Zero cooking, maximum protein. For when it is 9pm and you still need 40g of protein.',
   '{"Open the tuna can and drain.",
    "Spoon 150g of skyr next to the tuna.",
    "Slice half a cucumber.",
    "Eat."}',
   2, 0, 2,
   1, '{}', '{"emergency_protein","snack","no_cooking"}', '{"late_night","post_gym"}', '{"coop","migros"}',
   '{"emergency-protein","no-cook","high-protein","quick"}',
   280, 42, 8, 3, 4.20, 15.0),

  ('Lean Beef Pasta Bowl',
   'dinner',
   'Mixed minced beef with penne and a simple tomato sauce. Proper dinner, under CHF 8.',
   '{"Cook penne in salted water until al dente (9–11 min).",
    "In parallel, brown minced beef in a pan over high heat, breaking it up.",
    "Season beef with salt, pepper and oregano.",
    "Add a tin of chopped tomatoes (or tomato passata) and simmer 5 min.",
    "Drain pasta and combine with sauce.",
    "Serve in a bowl."}',
   5, 20, 25,
   1, '{"pan"}', '{"meal"}', '{"dinner","post_gym"}', '{"coop"}',
   '{"beef","pasta","protein","hearty"}',
   680, 48, 72, 18, 7.50, 7.1),

  ('Quark Fruit Bowl',
   'snack',
   'Magerquark with banana and a handful of berries. One of the cheapest high-protein snacks in any Swiss supermarket.',
   '{"Spoon 250g of Magerquark into a bowl.",
    "Slice a banana on top.",
    "Add a small handful of frozen or fresh berries.",
    "Optional: a teaspoon of honey or cinnamon."}',
   3, 0, 3,
   1, '{}', '{"snack","sweet","no_cooking"}', '{"breakfast","late_night"}', '{"migros"}',
   '{"quark","fruit","sweet","no-cook","cheap","high-protein"}',
   220, 26, 30, 1, 2.40, 11.8),

  ('No-Cook Chicken Deli Wrap',
   'lunch',
   'Ready-sliced chicken breast in a wrap with salad and mustard. No cooking needed — ideal for school lunch.',
   '{"Lay a tortilla flat.",
    "Spread a thin layer of mustard or skyr.",
    "Layer sliced chicken and salad leaves.",
    "Roll tightly, slice in half."}',
   3, 0, 3,
   1, '{}', '{"meal","no_cooking"}', '{"lunch"}', '{"migros","coop"}',
   '{"chicken","no-cook","wrap","quick","school-lunch"}',
   390, 34, 40, 8, 5.10, 8.7),

  ('Meal-Prep Chicken Lunches',
   'meal_prep',
   'Four portions of chicken rice with frozen vegetables. Cook once on Sunday, eat Monday through Thursday. Reheat in microwave.',
   '{"Cook 400g dry rice in salted water (12–15 min). Makes 4 portions.",
    "Season 4 chicken breasts with salt, pepper, garlic powder and paprika.",
    "Pan-fry chicken in batches, 5 min per side. Rest and slice.",
    "Steam or microwave 400g frozen mixed vegetables.",
    "Divide into 4 containers: rice base, chicken slices, vegetables.",
    "Cool completely before refrigerating.",
    "Reheat in microwave for 2–3 min when needed."}',
   10, 30, 40,
   4, '{"pan","microwave"}', '{"meal_prep","meal"}', '{"lunch","dinner"}', '{"coop","migros"}',
   '{"meal-prep","chicken","rice","high-protein","school-lunch"}',
   580, 55, 65, 7, 4.50, 9.5)
;
