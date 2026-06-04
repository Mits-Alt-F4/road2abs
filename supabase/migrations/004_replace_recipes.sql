-- Road2Abs — Migration 004: Replace all recipes with real ones
-- This deletes all existing recipe data and starts fresh.
-- Run AFTER 001, 002, 003.

-- Clear existing data (safe if recipe_ingredients table is empty)
DELETE FROM recipe_ingredients;
DELETE FROM recently_selected_meals;
DELETE FROM favourites;
DELETE FROM recipes;

-- ── 25 REAL HIGH-PROTEIN RECIPES ────────────────────────────────────────────

INSERT INTO recipes
  (name, category, description, instructions, prep_time_min, cook_time_min, total_time_min,
   servings, equipment_required, suitable_contexts, suitable_times, stores_required, tags,
   total_calories, total_protein, total_carbs, total_fat, estimated_price_chf, protein_efficiency)
VALUES

-- 1. CHICKEN TERIYAKI RICE BOWL
('Chicken Teriyaki Rice Bowl',
 'dinner',
 'Sticky teriyaki chicken over fluffy white rice. One of the best ratios of taste to effort. Make the sauce from soy and honey — takes 18 minutes total.',
 ARRAY[
   'Cook 150g rice: rinse it, add to pot with 300ml water, bring to boil, lid on, lowest heat for 12 min. Do not lift the lid.',
   'While rice cooks: slice one chicken breast into thin strips.',
   'Mix in a bowl: 3 tbsp soy sauce, 1 tbsp honey, 1 tsp sesame oil, 1 clove minced garlic.',
   'Heat pan on high heat, add a little oil, fry chicken strips 3–4 min until golden.',
   'Pour teriyaki sauce over chicken, toss on high heat for 1–2 min until sauce glazes and thickens.',
   'Fluff rice with a fork. Bowl it up: rice, teriyaki chicken on top. Add sesame seeds or spring onions if available.'
 ],
 5, 18, 23,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['lunch','dinner','post_gym'], ARRAY['coop','migros'],
 ARRAY['chicken','rice','teriyaki','high-protein','quick'],
 580, 52, 68, 8, 6.80, 9.0),

-- 2. BEEF BOLOGNESE WITH PENNE
('Beef Bolognese with Penne',
 'dinner',
 'A proper bolognese — not a jar sauce situation. Brown the beef well, let it simmer, serve over penne. Tastes like effort but it''s mostly hands-off.',
 ARRAY[
   'Boil a large pot of well-salted water for pasta.',
   'In a separate pan on high heat, brown 250g minced beef, breaking it into small pieces. Do not stir too much — you want colour on it. Cook 6–8 min.',
   'Season with salt, pepper, 1 tsp dried oregano, and 2 crushed garlic cloves.',
   'Add half a 400g tin of chopped tomatoes (or 200g passata). Add a pinch of sugar.',
   'Simmer sauce on medium-low for 10 minutes while pasta cooks.',
   'Cook 120g penne in boiling water according to package (usually 9–11 min), drain, reserve a small cup of pasta water.',
   'Toss pasta with the sauce, add a splash of pasta water if needed to loosen it. Serve immediately.'
 ],
 5, 20, 25,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner'], ARRAY['coop','migros'],
 ARRAY['beef','pasta','bolognese','classic','high-protein'],
 680, 50, 75, 18, 7.50, 7.4),

-- 3. GARLIC BUTTER CHICKEN PASTA
('Garlic Butter Chicken Pasta',
 'dinner',
 'Pan-fried chicken in a garlic butter sauce tossed with pasta. This is genuinely one of the best things you can make in 20 minutes.',
 ARRAY[
   'Boil salted water and cook 120g penne or fusilli until al dente. Reserve a cup of the pasta water before draining.',
   'Season chicken breast on both sides with salt, pepper, and a pinch of paprika.',
   'Pan-fry chicken on medium-high heat for 5–6 min per side until golden and cooked through. Rest 2 min, then slice.',
   'In the same pan on medium heat, melt a large knob of butter (about 20g). Add 3 crushed garlic cloves and fry for 30 seconds until fragrant — do not burn it.',
   'Add a splash of the pasta water to the butter and garlic to make a light sauce.',
   'Toss in the drained pasta and chicken slices. Mix well. Season with salt and cracked black pepper.',
   'Optional: add a handful of grated Parmesan if you have it.'
 ],
 5, 20, 25,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','post_gym'], ARRAY['coop','migros'],
 ARRAY['chicken','pasta','garlic-butter','quick','high-protein'],
 610, 50, 68, 14, 7.20, 8.2),

-- 4. GREEK CHICKEN WRAP (GYROS-STYLE)
('Greek Chicken Wrap',
 'lunch',
 'Marinated chicken with garlic skyr sauce, cucumber and tomato in a wrap. Tastes exactly like a döner without the mystery meat.',
 ARRAY[
   'Mix the chicken marinade: 1 tbsp olive oil, 1 tsp dried oregano, 1 tsp paprika, juice of half a lemon, salt, pepper. Coat sliced chicken breast and let sit 5 min.',
   'Make the sauce: mix 3 tbsp skyr with a crushed garlic clove, a squeeze of lemon, and a pinch of salt.',
   'Pan-fry marinated chicken on high heat for 4–5 min, tossing regularly, until charred at the edges and cooked through.',
   'Warm the tortilla in a dry pan for 30 seconds on each side.',
   'Spread garlic skyr sauce on the tortilla. Add chicken, sliced cucumber, sliced tomato.',
   'Roll tightly, wrap the bottom in foil or paper so it does not fall apart. Cut in half diagonally.'
 ],
 8, 8, 16,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['lunch','dinner'], ARRAY['coop','migros'],
 ARRAY['chicken','wrap','greek','gyros','quick','high-protein'],
 530, 48, 44, 12, 6.40, 9.1),

-- 5. TUNA MELT ON TOAST
('Tuna Melt on Toast',
 'lunch',
 'Seasoned tuna with melted cheese on toast. Broiled under the grill for 2 minutes. Way better than it sounds.',
 ARRAY[
   'Drain a tin of tuna and mix in a bowl with 1 tbsp mayo (or skyr for lighter version), a squeeze of lemon, salt, and black pepper.',
   'Toast 2–3 slices of bread.',
   'Spread tuna mixture generously on each slice.',
   'Lay a slice of cheese on top of each (Gruyère or Emmental works best; any Swiss cheese will do).',
   'Place under the oven grill (broiler) on high for 2–3 minutes until cheese is melted and bubbling.',
   'Watch it — it goes from perfect to burnt very fast. Eat hot.'
 ],
 4, 4, 8,
 1, ARRAY['oven'], ARRAY['meal','snack'], ARRAY['lunch','late_night'], ARRAY['migros','coop'],
 ARRAY['tuna','toast','quick','no-prep','high-protein'],
 410, 42, 28, 12, 4.80, 10.2),

-- 6. CREAMY SCRAMBLED EGGS ON TOAST
('Creamy Scrambled Eggs on Toast',
 'breakfast',
 'Slow-cooked scrambled eggs that are actually creamy, not rubbery. The trick is low heat and constant stirring. 6 minutes of attention, that''s all.',
 ARRAY[
   'Crack 4–5 eggs into a cold non-stick pan. Add a small knob of butter and a pinch of salt.',
   'Turn heat to medium-low. Start stirring immediately with a spatula, moving the eggs constantly.',
   'The eggs will slowly start to come together in soft curds after 4–5 min. Keep going.',
   'When the eggs look almost done but still slightly wet, pull the pan off the heat. Carry-over heat will finish them — they should be silky and glossy, not dry.',
   'Toast 2 slices of bread while the eggs cook.',
   'Pile the eggs on the toast. Season with cracked black pepper. Optional: top with sliced avocado or smoked salmon slices for extra protein.'
 ],
 1, 6, 7,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['breakfast','post_gym'], ARRAY['coop','migros'],
 ARRAY['eggs','breakfast','quick','creamy','high-protein'],
 380, 30, 24, 16, 3.50, 7.9),

-- 7. SPICY SRIRACHA CHICKEN FRIED RICE
('Spicy Sriracha Chicken Fried Rice',
 'dinner',
 'Leftover rice or fresh rice, egg, chicken, and sriracha. This is proper fried rice — high heat, fast moves. Better than most restaurants.',
 ARRAY[
   'Cook rice if you do not have leftovers: 150g rice, rinse, cook with 300ml water 12 min. Then spread on a plate and refrigerate 15 min to dry it out (or use yesterday''s rice).',
   'Dice chicken breast into 1cm cubes. Season with salt, pepper, and a little soy sauce.',
   'Get a pan very hot — hotter than you think you need. Add oil, fry chicken 3–4 min until browned. Remove from pan.',
   'In the same hot pan, scramble 2 eggs quickly in 30 seconds — do not fully cook them, leave them slightly wet.',
   'Add the rice to the pan. Stir-fry on maximum heat for 2 min, spreading and tossing constantly.',
   'Add the chicken back in. Season with 2 tbsp soy sauce, 1 tbsp sriracha (or to taste), and a splash of sesame oil.',
   'Toss everything together for 1 more minute. The rice should have crispy bits. Serve immediately.'
 ],
 5, 20, 25,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','post_gym'], ARRAY['coop','migros'],
 ARRAY['chicken','fried-rice','spicy','egg','high-protein','quick'],
 590, 50, 62, 12, 6.20, 8.5),

-- 8. SKYR BERRY PARFAIT WITH GRANOLA
('Skyr Berry Parfait',
 'snack',
 'Layers of skyr, granola and berries. Looks like something from a café, takes 3 minutes, tastes better than it has any right to.',
 ARRAY[
   'In a tall glass or bowl, spoon a thick layer of plain skyr (about 150g).',
   'Add a layer of frozen berries (mixed red berries work well — microwave 30 sec to thaw if needed).',
   'Add a handful of granola or rolled oats.',
   'Repeat the layers if the glass is tall enough.',
   'Drizzle with 1 tsp honey on top.',
   'Eat immediately before the granola goes soggy.'
 ],
 3, 0, 3,
 1, ARRAY['microwave'], ARRAY['snack','sweet'], ARRAY['breakfast','lunch'], ARRAY['coop','migros','lidl'],
 ARRAY['skyr','berries','granola','no-cook','sweet','quick','high-protein'],
 320, 28, 38, 4, 4.20, 8.8),

-- 9. ONE-PAN BEEF TACO BOWL
('One-Pan Beef Taco Bowl',
 'dinner',
 'Seasoned beef with rice, sour cream and salsa in a bowl. You do not need a taco shell for this to be great.',
 ARRAY[
   'Cook 150g rice while you prepare the beef.',
   'Brown 250g minced beef in a hot pan on high heat, breaking it apart — about 6–7 min. Drain excess fat if needed.',
   'Season the beef with: 1 tsp cumin, 1 tsp paprika, 1/2 tsp chili powder (or more), salt, pepper, and a crushed garlic clove.',
   'Add 2 tbsp water to the pan, stir into the beef, let it absorb for 1 minute.',
   'Build the bowl: rice first, then spiced beef, then a big spoonful of skyr (acts like sour cream), then whatever salsa or hot sauce you have.',
   'Optional: sliced avocado, pickled jalapeños, coriander.'
 ],
 3, 20, 23,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','post_gym'], ARRAY['coop','migros'],
 ARRAY['beef','taco','bowl','high-protein','dinner'],
 630, 52, 65, 15, 7.80, 8.3),

-- 10. PROTEIN PANCAKES (ACTUALLY GOOD)
('Protein Pancakes',
 'breakfast',
 'Oat and egg pancakes that actually taste like pancakes, not protein bars. The key is getting the batter right and not flipping them too early.',
 ARRAY[
   'Blend together: 80g rolled oats, 3 whole eggs, 150g skyr or Magerquark, 1/2 tsp baking powder, a pinch of salt, 1 tsp vanilla extract if available.',
   'The batter should be thick but pourable. If too thick, add 2 tbsp milk.',
   'Heat a non-stick pan on medium heat. Lightly oil it with a paper towel — just a thin film.',
   'Pour rounds about 10cm wide. Cook until bubbles form on the surface and the edges look set — about 2–3 min.',
   'Flip once and cook 1–2 min on the other side. They should be golden brown.',
   'Serve with Greek yoghurt, honey, and fresh berries. A spoonful of peanut butter on top also works extremely well.'
 ],
 5, 12, 17,
 1, ARRAY['pan','blender'], ARRAY['meal'], ARRAY['breakfast','post_gym'], ARRAY['coop','migros'],
 ARRAY['pancakes','breakfast','oats','skyr','high-protein'],
 490, 40, 52, 10, 4.50, 8.2),

-- 11. CHICKEN CAESAR WRAP
('Chicken Caesar Wrap',
 'lunch',
 'Pan-fried chicken in a Caesar-style wrap. The dressing is just mayo, lemon, and parmesan — 3 ingredients. Better cold-packed for school.',
 ARRAY[
   'Season chicken breast with salt and pepper. Pan-fry on medium-high heat, 5–6 min per side. Rest 2 min, then slice thin.',
   'Make quick Caesar dressing: mix 1 tbsp mayo, a squeeze of lemon, a little grated Parmesan (or just salt + pepper if no Parmesan).',
   'Warm a tortilla in a dry pan for 30 seconds each side.',
   'Spread the Caesar dressing on the tortilla.',
   'Add romaine or iceberg lettuce, sliced chicken, and any grated cheese available.',
   'Roll tightly, press, and slice in half at an angle. Wrap in foil to keep it together if taking to school.'
 ],
 8, 12, 20,
 1, ARRAY['pan'], ARRAY['meal','no_cooking'], ARRAY['lunch'], ARRAY['coop','migros'],
 ARRAY['chicken','caesar','wrap','lunch','school','high-protein'],
 510, 46, 40, 14, 6.60, 9.0),

-- 12. OVERNIGHT OATS WITH QUARK
('Overnight Oats with Quark',
 'breakfast',
 'Mix it in 3 minutes the night before, eat cold in the morning. No cooking, extremely high protein, actually filling.',
 ARRAY[
   'In a jar or bowl with a lid, combine: 80g rolled oats, 200g Magerquark, 150ml milk.',
   'Add: 1 tsp honey, a pinch of cinnamon, half a sliced banana.',
   'Mix well. The oats will absorb the liquid overnight.',
   'Seal and refrigerate overnight (or at least 4 hours).',
   'In the morning, stir and add a splash more milk if it is too thick.',
   'Top with fresh berries or more banana. Eat cold.'
 ],
 3, 0, 3,
 1, ARRAY[''], ARRAY['meal','no_cooking'], ARRAY['breakfast'], ARRAY['migros','coop'],
 ARRAY['overnight-oats','quark','no-cook','meal-prep','breakfast','high-protein'],
 420, 36, 56, 5, 3.40, 8.6),

-- 13. PAN-SEARED SALMON WITH LEMON RICE
('Pan-Seared Salmon with Lemon Rice',
 'dinner',
 'Crispy-skin salmon over rice with lemon. The trick to crispy salmon skin is a very hot, dry pan and not touching it for 4 minutes.',
 ARRAY[
   'Cook 150g rice as usual.',
   'Pat salmon fillet completely dry with paper towel — this is what makes the skin crispy.',
   'Season the flesh side with salt and pepper.',
   'Heat a pan until very hot, add a small amount of oil. Place salmon skin-side down.',
   'Press gently for 10 seconds so it does not curl. Do NOT move it for 4 minutes.',
   'After 4 min, flip. Cook 1–2 min more on the flesh side. The salmon should still be slightly pink inside.',
   'Squeeze lemon over salmon. Serve over rice with a drizzle of olive oil and fresh black pepper.'
 ],
 3, 18, 21,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','lunch'], ARRAY['coop','migros'],
 ARRAY['salmon','rice','lemon','dinner','high-protein'],
 540, 46, 52, 14, 9.50, 8.5),

-- 14. CHICKEN SHAWARMA RICE BOWL
('Chicken Shawarma Bowl',
 'lunch',
 'Shawarma-spiced chicken over rice with garlic sauce. The spice mix takes 30 seconds to measure out — the flavour is completely different from plain chicken.',
 ARRAY[
   'Mix shawarma spices: 1 tsp cumin, 1 tsp paprika, 1/2 tsp turmeric, 1/2 tsp cinnamon, 1/4 tsp cayenne, salt, pepper.',
   'Coat sliced chicken breast in the spice mix plus a squeeze of lemon and a drizzle of olive oil.',
   'Cook rice while you prep the chicken.',
   'Pan-fry chicken on high heat for 6–8 min, tossing often, until the edges are charred and the spices are caramelised.',
   'Make garlic sauce: mix 3 tbsp skyr with a crushed garlic clove, lemon juice, and salt.',
   'Build the bowl: rice, shawarma chicken, generous drizzle of garlic sauce.',
   'Optional: sliced cucumber, pickled cabbage, chili flakes.'
 ],
 8, 18, 26,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['lunch','dinner','post_gym'], ARRAY['coop','migros'],
 ARRAY['chicken','shawarma','bowl','spiced','rice','high-protein'],
 560, 52, 58, 10, 7.00, 9.3),

-- 15. COTTAGE CHEESE PIZZA TOAST
('Cottage Cheese Pizza Toast',
 'snack',
 'High-protein pizza toast with Hüttenkäse base instead of regular cheese. Grill 5 minutes, done. Actually tastes like pizza.',
 ARRAY[
   'Preheat grill/broiler to high.',
   'Toast 2 thick slices of bread until lightly golden.',
   'Spread 1 tbsp tomato paste or passata on each slice.',
   'Layer generously with Hüttenkäse (cottage cheese).',
   'Add whatever topping you have: deli ham slices, salami, canned corn, sliced mushrooms.',
   'Season with dried oregano, a pinch of chili flakes, and black pepper.',
   'Grill for 3–5 minutes until cheese is set and starting to brown at the edges.',
   'Cool 1 minute before eating — the top is very hot.'
 ],
 3, 5, 8,
 1, ARRAY['oven'], ARRAY['snack','meal'], ARRAY['lunch','late_night'], ARRAY['coop'],
 ARRAY['cottage-cheese','pizza','toast','quick','high-protein'],
 310, 32, 28, 7, 4.10, 10.3),

-- 16. BEEF AND EGG FRIED RICE
('Beef and Egg Fried Rice',
 'dinner',
 'Minced beef with eggs and rice in the wok style. Uses yesterday''s leftover rice if possible — the dryer the rice, the better the fry.',
 ARRAY[
   'Cook rice if needed. Best results come from rice cooked the day before and refrigerated overnight.',
   'Brown 200g minced beef in a very hot pan, breaking it up into small pieces. Season with salt, pepper, and a dash of soy sauce. Remove from pan.',
   'In the same pan, scramble 3 eggs quickly on high heat — 30–40 seconds, leave them slightly wet.',
   'Add rice to the pan, pressing and tossing on maximum heat. Fry for 2–3 min until you hear crackling.',
   'Add beef back in. Season with 2 tbsp soy sauce and 1 tsp sesame oil.',
   'Toss everything together on high heat for 1 more minute.',
   'Serve immediately. Sprinkle with spring onions or sesame seeds if available.'
 ],
 5, 20, 25,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner'], ARRAY['coop','migros'],
 ARRAY['beef','egg','fried-rice','high-protein','quick'],
 620, 48, 65, 16, 7.20, 7.7),

-- 17. FRENCH TOAST WITH PROTEIN TWIST
('Protein French Toast',
 'breakfast',
 'Egg-dipped toast cooked in butter, served with skyr and berries. This is proper French toast — crispy outside, custardy inside.',
 ARRAY[
   'In a shallow bowl, whisk together: 3 eggs, 3 tbsp milk, a pinch of cinnamon, a pinch of salt.',
   'Dip 3–4 slices of thick toast bread into the egg mixture, making sure both sides are well coated. Let each slice soak for 10 seconds.',
   'Heat a pan on medium heat. Add a generous knob of butter.',
   'Fry dipped slices for 2–3 minutes per side until deep golden brown. The egg should be fully cooked and the outside crispy.',
   'Serve with a big spoonful of skyr or Greek yoghurt, fresh or frozen berries, and a drizzle of honey.',
   'Optional: a dusting of icing sugar on top if you want to feel fancy.'
 ],
 3, 10, 13,
 1, ARRAY['pan'], ARRAY['meal','sweet'], ARRAY['breakfast'], ARRAY['coop','migros'],
 ARRAY['french-toast','breakfast','eggs','sweet','quick','high-protein'],
 480, 32, 52, 14, 4.20, 6.7),

-- 18. HIGH-PROTEIN CHICKEN SOUP
('Quick Chicken Noodle Soup',
 'dinner',
 'Shredded chicken in a proper broth with pasta. Sounds complicated but uses just a pot, some chicken stock, and whatever is in the kitchen.',
 ARRAY[
   'In a pot, add 700ml water and 2 chicken stock cubes (bouillon cubes). Bring to a boil.',
   'Add a whole chicken breast to the simmering broth. Cook 12–15 min until cooked through.',
   'Remove chicken, shred it into pieces with two forks. It should fall apart easily.',
   'Add 80g small pasta (or break spaghetti into thirds) and 100g frozen mixed vegetables to the broth. Cook 8–9 min.',
   'Return shredded chicken to the soup. Season with salt, pepper, and a little lemon juice.',
   'Ladle into a deep bowl. Eat with a piece of bread if you want extra carbs.'
 ],
 5, 25, 30,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','lunch'], ARRAY['coop','migros'],
 ARRAY['chicken','soup','noodles','winter','high-protein'],
 440, 46, 42, 6, 5.90, 10.5),

-- 19. MEAL PREP: 4 CHICKEN BOWLS
('Meal Prep Chicken Bowls (4 portions)',
 'meal_prep',
 'Make 4 full lunches on Sunday. Each box is chicken, rice, and veg. Reheats in 2 minutes. Eating well all week with 40 minutes of cooking once.',
 ARRAY[
   'Cook 400g dry rice in a big pot of salted water, 12 min. Drain and spread on a tray to cool.',
   'Mix marinade for 4 chicken breasts: 2 tbsp soy sauce, 1 tbsp olive oil, 1 tsp garlic powder, 1 tsp paprika, salt, pepper.',
   'Coat chicken, then pan-fry in 2 batches: 5–6 min per side on medium-high. Let rest 3 min per batch.',
   'Microwave 400g frozen mixed vegetables in a bowl with a splash of water for 4 minutes.',
   'Slice all chicken.',
   'Divide into 4 food containers: rice base, sliced chicken on top, veg on the side.',
   'Cool completely before sealing and refrigerating. Keeps 4 days.',
   'To reheat: microwave 2–3 minutes, stir halfway. Add a splash of water if rice seems dry.'
 ],
 10, 35, 45,
 4, ARRAY['pan','microwave'], ARRAY['meal_prep','meal'], ARRAY['lunch','dinner','post_gym'], ARRAY['coop','migros'],
 ARRAY['meal-prep','chicken','rice','4-servings','high-protein','prep-sunday'],
 570, 54, 62, 7, 4.50, 9.5),

-- 20. SKYR PROTEIN SHAKE (BLENDER)
('Skyr Protein Shake',
 'snack',
 'Thick, filling shake with skyr, banana, oats, and milk. Not a powder-and-water situation — this is actually good.',
 ARRAY[
   'Add to a blender: 200g skyr, 1 ripe banana, 50g rolled oats, 250ml milk.',
   'Optional but good: 1 tbsp peanut butter, a pinch of cinnamon, 1 tsp honey.',
   'Blend on high for 30 seconds until completely smooth.',
   'Taste and adjust: more honey if too tart, more milk if too thick.',
   'Drink immediately — or seal and refrigerate for up to 4 hours (the oats absorb liquid and thicken it further, which some people prefer).'
 ],
 2, 0, 2,
 1, ARRAY['blender'], ARRAY['snack','no_cooking'], ARRAY['breakfast','post_gym','late_night'], ARRAY['coop','migros','lidl'],
 ARRAY['shake','skyr','banana','oats','no-cook','post-gym','high-protein'],
 420, 34, 58, 6, 4.80, 8.1),

-- 21. CRISPY EGG FRIED NOODLES
('Crispy Egg Noodles',
 'dinner',
 'Egg noodles (or spaghetti) with a fried egg, soy butter sauce, and sriracha. This looks simple — it tastes incredible. The crispy noodle edges are the whole point.',
 ARRAY[
   'Cook 120g noodles or spaghetti in salted water. Drain and toss with a little sesame oil so they do not stick.',
   'Heat a large pan until very hot. Add oil. Add the noodles in a single layer if possible.',
   'Do not touch them for 2 minutes — let them get crispy on the bottom.',
   'Toss and let the other side crisp up 1–2 min.',
   'Push noodles to the side. Fry 2 eggs in the pan — you want the whites crispy and lacy at the edges.',
   'Mix sauce: 2 tbsp soy sauce, 1 tbsp butter, 1 tsp sriracha.',
   'Pour sauce over noodles and eggs. Toss gently. Eat immediately.'
 ],
 3, 15, 18,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','late_night'], ARRAY['coop','migros'],
 ARRAY['eggs','noodles','quick','crispy','dinner','high-protein'],
 510, 28, 68, 14, 3.80, 5.5),

-- 22. BUFFALO CHICKEN WRAP
('Buffalo Chicken Wrap',
 'lunch',
 'Crispy pan-fried chicken tossed in hot sauce, with skyr as a cooling blue-cheese substitute. One of the better wraps you can make at home.',
 ARRAY[
   'Slice chicken breast into strips. Season with salt, pepper, and garlic powder.',
   'Pan-fry chicken strips on high heat with a little oil, 4–5 min until cooked through with crispy edges.',
   'Toss hot chicken in a mix of: 1 tbsp hot sauce (Tabasco or sriracha) and a small knob of melted butter.',
   'Make cooling sauce: 3 tbsp skyr, a squeeze of lemon, pinch of salt and garlic powder.',
   'Warm a tortilla in a dry pan 30 seconds each side.',
   'Spread skyr sauce on tortilla. Add buffalo chicken, lettuce, and sliced celery if available.',
   'Roll tightly and eat immediately.'
 ],
 6, 8, 14,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['lunch','dinner'], ARRAY['coop','migros'],
 ARRAY['chicken','buffalo','wrap','spicy','quick','high-protein'],
 490, 46, 40, 12, 6.30, 9.4),

-- 23. QUARK CHOCOLATE MOUSSE
('Quark Chocolate Mousse',
 'snack',
 'Quark with cocoa powder and honey. This is a legitimately good dessert with 26g of protein. Takes 3 minutes.',
 ARRAY[
   'Add 250g Magerquark to a bowl.',
   'Add 1.5 tbsp unsweetened cocoa powder, 2 tsp honey (or more to taste), and a pinch of salt.',
   'Mix vigorously with a fork or spoon for 1–2 minutes until smooth and combined.',
   'Taste and adjust sweetness with more honey.',
   'Refrigerate for 15 min if you want a thicker texture (optional).',
   'Serve with a few raspberries or sliced banana on top.',
   'You can also fold in a small crushed biscuit for texture.'
 ],
 3, 0, 3,
 1, ARRAY[''], ARRAY['sweet','snack'], ARRAY['late_night','breakfast'], ARRAY['migros','coop'],
 ARRAY['quark','chocolate','mousse','sweet','no-cook','dessert','high-protein'],
 240, 26, 28, 3, 2.80, 10.8),

-- 24. EMERGENCY PROTEIN: SKYR + TUNA
('Emergency Max Protein',
 'snack',
 'This is for when you need 40g of protein fast and have nothing else. Tuna plus skyr is genuinely not as weird as it sounds — skyr has almost no flavour on its own.',
 ARRAY[
   'Drain one tin of tuna.',
   'Put 200g skyr in a bowl.',
   'Season the tuna with black pepper, a squeeze of lemon, and a dash of soy sauce or hot sauce.',
   'Eat the tuna and skyr side by side, alternating bites.',
   'Optional: a couple of Knäckebrot crackers on the side.'
 ],
 2, 0, 2,
 1, ARRAY[''], ARRAY['emergency_protein','snack','no_cooking'], ARRAY['post_gym','late_night'], ARRAY['coop','migros'],
 ARRAY['emergency-protein','tuna','skyr','no-cook','fastest-protein'],
 280, 46, 12, 2, 4.50, 16.4),

-- 25. GROUND BEEF QUESADILLA
('Beef Quesadilla',
 'dinner',
 'Spiced beef and melted cheese in a toasted tortilla. Crispy on the outside, melty inside. Probably the fastest proper hot dinner on this list.',
 ARRAY[
   'Brown 150g minced beef in a hot dry pan, 5–6 min, breaking it up. Season with salt, pepper, 1/2 tsp cumin, 1/2 tsp paprika, and a pinch of chili.',
   'Remove beef. Wipe the pan.',
   'Lay a tortilla flat in the pan on medium heat.',
   'Spread beef on half the tortilla. Add grated cheese if you have it. Fold the other half over.',
   'Press down with a spatula. Cook 2 min until golden and crispy underneath.',
   'Flip carefully. Cook another 1–2 min.',
   'Remove and let cool 1 minute before cutting — the inside is extremely hot.',
   'Serve with skyr (acts as sour cream) and hot sauce.'
 ],
 3, 12, 15,
 1, ARRAY['pan'], ARRAY['meal'], ARRAY['dinner','late_night'], ARRAY['coop','migros'],
 ARRAY['beef','quesadilla','quick','crispy','dinner','high-protein'],
 560, 44, 42, 20, 6.80, 7.9);
