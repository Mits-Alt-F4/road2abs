-- Road2Abs — Migration 005: Product library schema additions + first verified product
-- Adds official_image_url, uploaded_image_url, source_notes to products table
-- Inserts the first Playwright-verified Coop product (2026-06-05)

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS official_image_url text,
  ADD COLUMN IF NOT EXISTS uploaded_image_url text,
  ADD COLUMN IF NOT EXISTS source_notes text;

-- First Playwright-verified product: Coop Thon rosé naturel
-- All values retrieved live from coop.ch via Playwright MCP on 2026-06-05
INSERT INTO products (
  name, brand, store, category,
  image_url, official_image_url,
  product_page_url,
  price_chf, price_unit,
  calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  package_size_g,
  calories_per_package, protein_per_package, carbs_per_package, fat_per_package,
  last_checked, verified,
  source_notes,
  tags, active
) VALUES (
  'Thon rosé naturel',
  'Coop',
  'coop',
  'fish',
  'https://www.coop.ch/img/produkte/737_737/RGB/3950233_001.jpg',
  'https://www.coop.ch/img/produkte/737_737/RGB/3950233_001.jpg',
  'https://www.coop.ch/de/lebensmittel/vorraete/konserven/fisch/thunfisch-ohne-oel/thon-rose-naturel/p/3950233',
  1.95,
  '155g drained (200g net fill)',
  110, 26, 0, 0.7,
  155,
  170.5, 40.3, 0, 1.1,
  '2026-06-05',
  true,
  'All values extracted from the official Coop product page through Playwright MCP. Nutrition values taken from the nutrition tab, per-100g column. Price and product name taken from the product heading/price block. Image URL confirmed from official Coop image source.',
  '{"high-protein","tuna","fish","no-cook","cheap","verified"}',
  true
);
