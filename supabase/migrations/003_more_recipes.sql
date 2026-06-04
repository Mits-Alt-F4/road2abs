-- Road2Abs — Migration 003: More Recipes
-- Run in Supabase SQL Editor after 001 and 002

INSERT INTO recipes (name, description, meal_context, meal_time, stores_required, prep_time_min, cook_time_min, total_time_min, total_calories, total_protein, total_carbs, total_fat, estimated_price_chf, instructions, tags)
VALUES

-- 1
('Skyr Protein Bowl', 'Skyr with whey, honey and banana — fast pre- or post-gym.', 'snack', 'post_gym', ARRAY['coop','migros'], 3, 0, 3, 380, 52, 38, 3, 4.50,
ARRAY['Spoon 500g Skyr into a bowl.','Add 1 scoop whey protein and stir well.','Slice half a banana on top.','Drizzle with 1 tsp honey.'],
ARRAY['no_cooking','post_gym','high_protein']),

-- 2
('Quark mit Früchten', 'Magerquark with fresh berries and a bit of honey. Swiss classic, zero effort.', 'snack', 'breakfast', ARRAY['coop','migros'], 2, 0, 2, 290, 38, 25, 2, 3.20,
ARRAY['Spoon 500g Magerquark into a bowl.','Add a large handful of frozen or fresh berries.','Drizzle 1 tsp honey on top.','Eat immediately or refrigerate.'],
ARRAY['no_cooking','breakfast','high_protein']),

-- 3
('Rührei mit Pouletschinken', 'Scrambled eggs with chicken deli slices on top. 5 minutes, high protein.', 'meal', 'breakfast', ARRAY['coop','migros'], 2, 4, 6, 420, 44, 4, 24, 5.80,
ARRAY['Crack 4 eggs into a bowl and whisk with a pinch of salt.','Heat a pan on medium, add a small knob of butter.','Pour in eggs and fold gently until just set.','Lay 4 slices of Pouletbrustschinken on top and serve.'],
ARRAY['breakfast','quick','high_protein']),

-- 4
('Thunfisch Avocado Wrap', 'Tuna, avocado, and spinach in a Migros tortilla. Ready in 5 minutes.', 'meal', 'lunch', ARRAY['migros'], 5, 0, 5, 490, 40, 34, 18, 6.40,
ARRAY['Drain one tin of tuna.','Mash half an avocado in a bowl with a squeeze of lemon.','Spread the avocado on a large tortilla.','Add tuna and a handful of spinach, roll tightly and cut in half.'],
ARRAY['no_cooking','lunch','high_protein']),

-- 5
('Poulet Reis Bowl', 'Pan-fried chicken breast over microwaved basmati. Simple and very high protein.', 'meal', 'lunch', ARRAY['coop','migros'], 5, 12, 17, 560, 58, 48, 8, 7.20,
ARRAY['Cook one Migros Basmati Reis packet in the microwave (90 sec).','Season chicken breast with salt, pepper and paprika.','Pan-fry in a hot pan with a little oil, 5–6 min per side until cooked through.','Slice chicken, lay over rice, add hot sauce if you want.'],
ARRAY['lunch','dinner','high_protein']),

-- 6
('Hüttenkäse Toast', 'Cottage cheese on Knäckebrot with cucumber and pepper. Zero cooking, very high protein.', 'snack', 'lunch', ARRAY['coop','migros'], 3, 0, 3, 260, 30, 18, 6, 3.80,
ARRAY['Spread generous cottage cheese on 4 pieces of Knäckebrot.','Top with thin slices of cucumber and bell pepper.','Season with salt, pepper, and a dash of chili flakes.'],
ARRAY['no_cooking','snack','high_protein']),

-- 7
('Proteinpfannkuchen', 'Oat and egg pancakes with yoghurt. Macro-friendly breakfast that actually fills you up.', 'meal', 'breakfast', ARRAY['coop','migros'], 5, 8, 13, 480, 42, 44, 10, 4.20,
ARRAY['Blend 80g oats, 3 eggs, 150g Greek yoghurt, and a pinch of salt into a smooth batter.','Heat a non-stick pan on medium with a little oil.','Pour small rounds and cook 2–3 min per side until golden.','Serve with a spoonful of Greek yoghurt and a drizzle of honey.'],
ARRAY['breakfast','meal_prep','high_protein']),

-- 8
('Lachs Quinoa Bowl', 'Smoked salmon over ready-to-eat quinoa with cucumber and lemon.', 'meal', 'lunch', ARRAY['migros'], 5, 0, 5, 510, 38, 42, 14, 9.50,
ARRAY['Open and warm one Migros quinoa packet (microwave 90 sec or eat cold).','Lay 100g smoked salmon on top.','Add cucumber slices and a squeeze of lemon.','Drizzle with a little olive oil and season with black pepper.'],
ARRAY['no_cooking','lunch','high_protein']),

-- 9
('Griechischer Joghurt Granola Bowl', 'Full-fat Greek yoghurt with granola and a banana. High protein, genuinely tasty.', 'snack', 'breakfast', ARRAY['coop','migros'], 2, 0, 2, 420, 24, 52, 12, 4.80,
ARRAY['Spoon 400g Greek yoghurt into a bowl.','Add 50g granola.','Slice one banana on top.','Optional: add a spoonful of peanut butter.'],
ARRAY['no_cooking','breakfast']),

-- 10
('Härtgekochte Eier mit Knäckebrot', 'Pre-boiled eggs and rye crispbread. The ultimate no-brainer protein snack.', 'snack', NULL, ARRAY['coop','migros'], 1, 10, 11, 280, 26, 18, 10, 2.60,
ARRAY['Boil 4 eggs for 9 minutes, then cool in cold water.','Peel and slice.','Eat with 4 Knäckebrot pieces and salt.','Meal prep: boil 8 at once, keep in fridge for 5 days.'],
ARRAY['meal_prep','snack','no_cooking']),

-- 11
('Thunfisch Pasta', 'Pasta with tuna, cherry tomatoes, and olive oil. 15 minutes from scratch.', 'meal', 'dinner', ARRAY['coop','migros'], 2, 13, 15, 580, 45, 62, 10, 4.90,
ARRAY['Cook 120g pasta in salted water.','Drain one tin of tuna.','Mix tuna with a drizzle of olive oil and halved cherry tomatoes.','Drain pasta and toss with the tuna mixture. Season well.'],
ARRAY['dinner','quick','high_protein']),

-- 12
('Hähnchenbrust Sandwich', 'Sliced chicken, mustard and lettuce in a Migros roll. Fast lunch.', 'meal', 'lunch', ARRAY['migros','coop'], 5, 0, 5, 440, 42, 38, 8, 5.20,
ARRAY['Slice a Migros Sandwich Roll in half.','Spread mustard on both halves.','Layer with pre-cooked chicken breast slices (or Pouletbrustschinken).','Add lettuce and a slice of tomato. Close and eat.'],
ARRAY['no_cooking','lunch','high_protein']),

-- 13
('Proteinshake mit Banane', 'Whey shake blended with a banana and milk. Post-gym classic.', 'snack', 'post_gym', ARRAY['coop','migros'], 2, 0, 2, 390, 40, 42, 5, 3.80,
ARRAY['Add 300ml milk to a shaker or blender.','Add 1–2 scoops of whey protein.','Add one ripe banana.','Blend or shake vigorously for 30 seconds.'],
ARRAY['post_gym','no_cooking','snack','high_protein']),

-- 14
('Rindfleisch Bowl mit Gemüse', 'Lean minced beef with frozen veg and rice. Classic bulk meal.', 'meal', 'dinner', ARRAY['coop','migros'], 5, 15, 20, 620, 54, 50, 14, 8.50,
ARRAY['Cook one Migros Basmati packet in the microwave.','Brown 200g lean minced beef in a hot pan, breaking it up as it cooks.','Add 150g frozen mixed vegetables in the last 3 minutes.','Season with salt, pepper and soy sauce. Serve over rice.'],
ARRAY['dinner','meal_prep','high_protein']),

-- 15
('Magerquark Waffeln', 'Two-ingredient waffles with quark and oats. Meal-prep friendly.', 'meal', 'breakfast', ARRAY['coop','migros'], 5, 10, 15, 460, 38, 48, 8, 3.90,
ARRAY['Mix 250g Magerquark with 80g oats, 2 eggs, and a pinch of salt.','Add a teaspoon of baking powder and mix well.','Pour into a waffle iron and cook until golden (about 4 min each).','Serve with yoghurt and berries.'],
ARRAY['breakfast','meal_prep','high_protein']);
