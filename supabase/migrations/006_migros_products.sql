-- Road2Abs — Migration 006: Real verified Migros products
-- All data scraped from official migros.ch product pages via Playwright on 2026-06-05
-- Run this in Supabase SQL Editor AFTER migration 005

INSERT INTO products
  (name, brand, store, category, image_url, product_page_url,
   price_chf, price_unit,
   calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
   package_size_g, calories_per_package, protein_per_package, carbs_per_package, fat_per_package,
   last_checked, verified, tags)
VALUES

-- 1. Chicken breast (sold by 100g)
('Optigal Pouletbrust', 'Optigal', 'migros', 'chicken',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/0656119f4441c8e0e766f0a079dd42bdc6cd9084/optigal-pouletbrust.jpg',
 'https://www.migros.ch/de/product/231525586000',
 3.20, 'per 100g',
 92, 20, 0.6, 1.0,
 300, 276, 60, 1.8, 3.0,
 '2026-06-05', true,
 '{"chicken","high-protein","lean"}'),

-- 2. Chicken schnitzel ready-cut 500g
('Migros Pouletschnitzel à la Minute', 'Migros', 'migros', 'chicken',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/6fd727078886b5b07ceddbe22c0c0e848524c32b/migros-pouletschnitzel-a-la-minute.jpg',
 'https://www.migros.ch/de/product/243100550000',
 8.00, '500g',
 118, 25, 0, 2.0,
 500, 590, 125, 0, 10,
 '2026-06-05', true,
 '{"chicken","high-protein","lean","quick"}'),

-- 3. You Skyr Magerquark 170g
('You Skyr Magerquark Nature', 'You', 'migros', 'skyr',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/eb015519058c0be29288132fb260f267ee6dbcd2/you-skyr-magerquark-nature.jpg',
 'https://www.migros.ch/de/product/205223900000',
 1.80, '170g',
 61, 12, 2.9, 0.5,
 170, 103.7, 20.4, 4.9, 0.85,
 '2026-06-05', true,
 '{"skyr","high-protein","snack","no-cook","cheap"}'),

-- 4. Migros Rosa Thon in Salzwasser 4×155g
('Migros Rosa Thon in Salzwasser', 'Migros', 'migros', 'fish',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/6fd4c0674523286bc06f61c51ac894468889a8b1/migros-rosa-thon-in-salzwasser.jpg',
 'https://www.migros.ch/de/product/155133700000',
 5.40, '4×155g',
 105, 25, 0, 0.6,
 155, 162.75, 38.75, 0, 0.93,
 '2026-06-05', true,
 '{"tuna","fish","high-protein","no-cook","emergency-protein"}'),

-- 5. M-Budget Magerquark 500g
('M-Budget Magerquark', 'M-Budget', 'migros', 'quark',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/172505f62b577283ae4bb49514b0545a565277d1/m-budget-magerquark.jpg',
 'https://www.migros.ch/de/product/200803100000',
 1.25, '500g',
 63, 9.7, 5.7, 0.5,
 500, 315, 48.5, 28.5, 2.5,
 '2026-06-05', true,
 '{"quark","protein","snack","cheap","no-cook"}'),

-- 6. Bio Eggs free-range 10-pack
('Bio Eier Freiland 10 Stück', 'Migros Bio', 'migros', 'eggs',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/56791370338b8d77e28fd175194591e8e5ad19d9/bio-eier-53-import-freiland.jpg',
 'https://www.migros.ch/de/product/196570001000',
 4.80, '10 Stück à 53g',
 153, 13, 0.6, 11.0,
 530, 810.9, 68.9, 3.18, 58.3,
 '2026-06-05', true,
 '{"eggs","protein","breakfast"}'),

-- 7. Tortilla wraps 326g
('Pancho Villa Tortillas Weizen', 'Pancho Villa', 'migros', 'wraps',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/2cb1551167f6a82e8f7e681338942eb0997c5811/pancho-villa-tortillas-weizen-super-soft-flexible.jpg',
 'https://www.migros.ch/de/product/158567200000',
 4.55, '326g (8 Stück)',
 299, 9, 53, 5.0,
 326, 974.7, 29.3, 172.8, 16.3,
 '2026-06-05', true,
 '{"wraps","carbs"}'),

-- 8. Basmati rice 500g
('Alnatura Himalaya Basmati Reis Bio', 'Alnatura', 'migros', 'rice',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/bb9d91c26bee6a26a0ced636cf5c4dbbbdd7d67a/alnatura-bio-himalaya-basmati-reis.jpg',
 'https://www.migros.ch/de/product/104464300000',
 2.00, '500g',
 350, 8.6, 75, 1.2,
 500, 1750, 43, 375, 6,
 '2026-06-05', true,
 '{"rice","carbs"}'),

-- 9. Penne 1kg
('Migros Penne', 'Migros', 'migros', 'pasta',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/d1b7826cd41749179d066cb0c8dfb2968ac4971d/migros-penne.jpg',
 'https://www.migros.ch/de/product/104101600000',
 1.20, '1kg',
 349, 12, 70, 1.5,
 1000, 3490, 120, 700, 15,
 '2026-06-05', true,
 '{"pasta","carbs","cheap"}'),

-- 10. Wholegrain toast 280g
('Migros Toast Vollkorn IP-SUISSE', 'Migros', 'migros', 'bread',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/301ca29516574e5cba8a119b18cffcd506dfcfba/migros-ip-suisse-toast-vollkorn.jpg',
 'https://www.migros.ch/de/product/111282200000',
 2.25, '280g',
 243, 10, 38, 3.8,
 280, 680.4, 28, 106.4, 10.6,
 '2026-06-05', true,
 '{"bread","carbs","toast"}'),

-- 11. Cottage cheese 200g
('Migros Cottage Cheese Nature', 'Migros', 'migros', 'cottage_cheese',
 'https://image.migros.ch/d/mo-boxed/v-w-1000-h-1000/o-af-1-t.clr-fff/51914125b4c156003946f6d244b9305bec08fdb4/migros-cottage-cheese-nature.jpg',
 'https://www.migros.ch/de/product/200604100000',
 1.80, '200g',
 87, 10, 2.7, 4.0,
 200, 174, 20, 5.4, 8,
 '2026-06-05', true,
 '{"cottage-cheese","protein","snack","no-cook"}');
