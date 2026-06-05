-- Road2Abs — Migration 005: Real verified products from Coop
-- All data scraped from official coop.ch product pages via Playwright on 2026-06-05
-- Run this in Supabase SQL Editor

-- Add image_url column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_page_url text;

-- Clear old placeholder products
DELETE FROM recipe_ingredients;
DELETE FROM products;

-- ── COOP PRODUCTS (verified from coop.ch on 2026-06-05) ──────────────────────

INSERT INTO products
  (name, brand, store, category, image_url, product_page_url,
   price_chf, price_unit,
   calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
   package_size_g, calories_per_package, protein_per_package, carbs_per_package, fat_per_package,
   last_checked, verified, tags)
VALUES

-- 1. Tuna
('Thon rosé naturel', 'Coop', 'coop', 'fish',
 'https://www.coop.ch/img/produkte/737_737/RGB/3950233_001.jpg',
 'https://www.coop.ch/de/lebensmittel/vorraete/konserven/fisch/thunfisch-ohne-oel/thon-rose-naturel/p/3950233',
 1.95, '155g drained / 200g net',
 110, 26, 0, 0.7,
 155, 170, 40.3, 0, 1.1,
 '2026-06-05', true,
 '{"high-protein","tuna","fish","no-cook","cheap","emergency-protein"}'),

-- 2. Chicken breast
('Naturafarm Pouletbrust 2 Stück', 'Naturafarm', 'coop', 'chicken',
 'https://www.coop.ch/img/produkte/737_737/RGB/3066950_001.jpg',
 'https://www.coop.ch/de/lebensmittel/fleisch-fisch/abgepacktes-frischfleisch/gefluegel/naturafarm-pouletbrust-2-stueck-ca/p/3066950',
 12.20, 'ca. 220g',
 109, 25, 0, 1,
 220, 240, 55, 0, 2.2,
 '2026-06-05', true,
 '{"high-protein","chicken","lean"}'),

-- 3. Skyr Natur 400g
('Skyr Natur', 'Coop', 'coop', 'skyr',
 'https://www.coop.ch/img/produkte/737_737/RGB/6622281_001.jpg',
 'https://www.coop.ch/de/lebensmittel/milchprodukte-eier/joghurt/joghurt-nature/skyr-natur/p/6622281',
 2.95, '400g',
 58, 11, 3.5, 0,
 400, 232, 44, 14, 0,
 '2026-06-05', true,
 '{"skyr","high-protein","snack","no-cook"}'),

-- 4. isey Skyr laktosefrei
('isey Skyr Nature laktosefrei', 'isey', 'coop', 'skyr',
 'https://www.coop.ch/img/produkte/737_737/RGB/4846718_001.jpg',
 'https://www.coop.ch/de/lebensmittel/milchprodukte-eier/quark/quark-nature/isey-skyr-nature-laktosefrei/p/4846718',
 2.05, '170g',
 61, 11, 3.7, 0.2,
 170, 103.7, 18.7, 6.3, 0.34,
 '2026-06-05', true,
 '{"skyr","high-protein","snack","no-cook","lactose-free"}'),

-- 5. Eggs 10-pack
('Naturafarm Eier Freilandhaltung 10 Stück', 'Naturafarm', 'coop', 'eggs',
 'https://www.coop.ch/img/produkte/737_737/RGB/3407653_001.jpg',
 'https://www.coop.ch/de/lebensmittel/milchprodukte-eier/eier/eier-roh/naturafarm-eier-aus-freilandhaltung-53g-10-stueck/p/3407653',
 6.30, '10 Stück à 53g',
 151, 13, 0, 11,
 530, 800, 68.9, 0, 58.3,
 '2026-06-05', true,
 '{"eggs","protein","breakfast"}'),

-- 6. Magerquark
('Prix Garantie Magerquark', 'Prix Garantie', 'coop', 'quark',
 'https://www.coop.ch/img/produkte/737_737/RGB/6568630_001.jpg',
 'https://www.coop.ch/de/lebensmittel/milchprodukte-eier/quark/quark-nature/prix-garantie-magerquark/p/6568630',
 1.25, '500g',
 62, 11, 4, 0.2,
 500, 310, 55, 20, 1,
 '2026-06-05', true,
 '{"quark","high-protein","snack","cheap","no-cook"}'),

-- 7. Hüttenkäse
('Hirz Hüttenkäse Nature', 'Hirz', 'coop', 'cottage_cheese',
 'https://www.coop.ch/img/produkte/737_737/RGB/3081176_001.jpg',
 'https://www.coop.ch/de/lebensmittel/milchprodukte-eier/abgepackter-kaese/frischkaese-mozzarella/huettenkaese/hirz-huettenkaese-nature/p/3081176',
 1.95, '200g',
 95, 10.9, 3.7, 4,
 200, 190, 21.8, 7.4, 8,
 '2026-06-05', true,
 '{"cottage-cheese","high-protein","snack","no-cook"}'),

-- 8. Spaghetti
('Prix Garantie Spaghetti', 'Prix Garantie', 'coop', 'pasta',
 'https://www.coop.ch/img/produkte/737_737/RGB/7362486_001.jpg',
 'https://www.coop.ch/de/lebensmittel/vorraete/grundnahrungsmittel/teigwaren/spaghetti/prix-garantie-spaghetti/p/7362486',
 1.20, '1000g',
 350, 12, 71, 1.2,
 1000, 3500, 120, 710, 12,
 '2026-06-05', true,
 '{"pasta","carbs","cheap"}'),

-- 9. Rice
('Prix Garantie Langkornreis Parboiled', 'Prix Garantie', 'coop', 'rice',
 'https://www.coop.ch/img/produkte/737_737/RGB/6554390_001.jpg',
 'https://www.coop.ch/de/lebensmittel/vorraete/grundnahrungsmittel/reis/langkorn-vitamin-camolino/prix-garantie-langkornreis-parboiled/p/6554390',
 1.35, '1000g',
 341, 7, 77, 0,
 1000, 3410, 70, 770, 0,
 '2026-06-05', true,
 '{"rice","carbs","cheap"}'),

-- 10. Toast bread
('Prix Garantie Toast dunkel', 'Prix Garantie', 'coop', 'bread',
 'https://www.coop.ch/img/produkte/737_737/RGB/7302187_001.jpg',
 'https://www.coop.ch/de/lebensmittel/brot-backwaren/haltbare-brote/toastbrote-buns/prix-garantie-toast-dunkel/p/7302187',
 1.20, '500g',
 259, 9.1, 46, 3.2,
 500, 1295, 45.5, 230, 16,
 '2026-06-05', true,
 '{"bread","carbs","cheap","toast"}');
