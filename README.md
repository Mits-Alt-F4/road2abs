# road2abs

Personal high-protein meal assistant for Swiss supermarkets. Mobile-first PWA built with Next.js 16, Tailwind v4, and Supabase.

> **Private app** — designed for one user. Not a public platform.

---

## What it does

You open it on your phone after tracking food in MyNetDiary, enter what calories and protein you have left, pick a store and situation, and it shows you exactly what you can buy and eat to hit your protein target.

- Recommends meals from Coop, Migros, Lidl, Denner
- Ranks results by protein efficiency, budget, and your favourites
- Supermarket mode for fast in-store decisions
- Emergency protein — maximum protein with fewest calories left
- Make a treat fit — fit chocolate/ice cream into remaining macros
- Meal prep planner
- Shopping list builder
- Weekly progress tracking
- Private product database you control

---

## Step 1 — Create a Supabase project and find your credentials

1. Go to **[supabase.com](https://supabase.com)** and sign in (or create a free account).
2. Click **New project**. Give it any name (e.g. `road2abs`). Pick a strong database password and save it somewhere — you will not need it often but you cannot recover it later. Choose the closest region (e.g. `eu-central-1`).
3. Wait about 60 seconds for the project to finish provisioning.
4. Once the dashboard loads, click **Project Settings** in the left sidebar (gear icon at the bottom).
5. Click **Data API** (previously called "API") in the settings menu.
6. You will see two things you need:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **Project API keys** — there are two:
     - `anon / public` — safe to expose in the browser
     - `service_role` — **secret**, never put this in a public repo
7. Keep this tab open — you will copy these values into the next step.

---

## Step 2 — Configure your environment variables

1. In your terminal, navigate into the project folder:
   ```bash
   cd /Users/maurits/road2abs
   ```
2. Copy the example env file to a real one:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` in your code editor (e.g. `open -a "Visual Studio Code" .env.local`).
4. Replace each placeholder with the real values from Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijkl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` → paste your **Project URL**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → paste the **anon / public** key
   - `SUPABASE_SERVICE_ROLE_KEY` → paste the **service_role** key
   - `NEXT_PUBLIC_APP_URL` → leave as `http://localhost:3000` for local dev; change to your Vercel URL after deployment

5. Save the file. **Do not commit `.env.local` to git** — it is already in `.gitignore`.

---

## Step 3 — Run the database migrations

This creates every table, enables security rules, sets up the auto-profile trigger, and loads the starter Swiss product and recipe data.

1. Go back to your Supabase dashboard at **[supabase.com](https://supabase.com)** and open your project.
2. Click **SQL Editor** in the left sidebar.
3. Click **New query** (the `+` button or the "New query" button at the top).

**Run migration 1 — schema:**

4. Open the file `supabase/migrations/001_initial_schema.sql` from this project in your code editor.
5. Select all the text (`Cmd+A`), copy it (`Cmd+C`).
6. Paste it into the Supabase SQL Editor query box.
7. Click the green **Run** button (or press `Cmd+Enter`).
8. Wait for it to complete. You should see a success message at the bottom. If you see any error, check that you pasted the full file without cutting it off.

**Run migration 2 — seed data:**

9. Click **New query** again to open a fresh editor tab.
10. Open `supabase/migrations/002_seed_products_recipes.sql` in your code editor.
11. Select all, copy, paste into the new SQL Editor tab.
12. Click **Run**.
13. This inserts 22 verified Swiss supermarket products and 10 recipe templates.

**Verify it worked:**

14. In the Supabase left sidebar, click **Table Editor**.
15. You should see tables listed: `profiles`, `products`, `recipes`, `favourites`, etc.
16. Click on `products` — you should see rows for items like "Pouletbrustfilet" and "Skyr Natur".
17. Click on `recipes` — you should see rows like "High-Protein Chicken Wrap".

If either table is empty, re-run the corresponding migration file.

---

## Step 4 — Run locally and test

1. In your terminal (still in `/Users/maurits/road2abs`), start the dev server:
   ```bash
   npm run dev
   ```
2. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
3. You will see the login page. Click **Don't have an account? Sign up**.
4. Enter your email address and choose a password (minimum 6 characters). Click **Create account**.
5. **Check your email** — Supabase sends a confirmation link. Click it. (If you do not see it, check spam.)
6. After confirming, go back to [http://localhost:3000](http://localhost:3000) and sign in with your email and password.
7. You should land on the **Today** homepage.
8. Try entering some numbers — e.g. 600 calories left and 50g protein left — and tap **Show me what fits**.
9. You should see recipe results appear. The seed data has 10 recipes so you should get matches.

If the Today page redirects back to login, double-check that:
- Your `.env.local` values are correct (no extra spaces, no quotes around the values)
- You confirmed your email

---

## Step 5 — Deploy to Vercel

### Push the code to GitHub

1. Go to **[github.com](https://github.com)** and create a new **private** repository called `road2abs`. Do not initialise it with a README (the project already has one).
2. Back in your terminal:
   ```bash
   git add .
   git commit -m "Initial Road2Abs build"
   git remote add origin https://github.com/YOUR_USERNAME/road2abs.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

### Import into Vercel

3. Go to **[vercel.com](https://vercel.com)** and sign in (or create a free account, linking your GitHub).
4. Click **Add New… → Project**.
5. Find `road2abs` in the repository list and click **Import**.
6. Vercel auto-detects Next.js. You do not need to change the build settings — leave everything as default.

### Add environment variables in Vercel

7. Before clicking Deploy, scroll down to the **Environment Variables** section.
8. Add each variable one by one. Click **Add** after each:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon/public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
   | `NEXT_PUBLIC_APP_URL` | leave blank for now — you will fill this in after the first deploy |

9. Click **Deploy**. Vercel builds and deploys the app. This takes about 30–60 seconds.
10. Once done, Vercel shows you your live URL — something like `https://road2abs-abc123.vercel.app`.
11. Copy that URL. Go back to Vercel → your project → **Settings** → **Environment Variables**.
12. Add `NEXT_PUBLIC_APP_URL` = `https://road2abs-abc123.vercel.app` (your actual URL).
13. Go to **Deployments** and click **Redeploy** on the latest deployment so it picks up the new variable.

### Test the live app

14. Open your Vercel URL in a browser. You should see the Road2Abs login page.
15. Sign in with the same account you used locally (Supabase is shared — same database).

---

## Step 6 — Install on your iPhone as an app

> You must use the **live Vercel URL**, not localhost — PWA installation only works over HTTPS.

1. On your iPhone, open **Safari**. (This will not work in Chrome on iPhone — Safari is required for Add to Home Screen.)
2. Type your Vercel URL into the address bar and open it. Sign in.
3. Tap the **Share** button — it looks like a box with an arrow pointing upward. It is at the bottom centre of the screen on iPhone.
4. A menu slides up from the bottom. Scroll **down** in this menu until you see **Add to Home Screen**. Tap it.
5. A screen appears showing the app name and icon. The name should already say `road2abs`. If you want to rename it, tap the name field and edit it. Then tap **Add** in the top-right corner.
6. Press the iPhone home button (or swipe up) to go to your home screen.
7. Find the **road2abs** icon — it has a dark background with "R2A" in white and a green accent. Tap it.
8. The app opens **full-screen** with no browser address bar or Safari controls. It looks and behaves like a native app.

**If you do not see the app icon immediately:** swipe right through your home screen pages, or look in the App Library (swipe all the way right). iPhone sometimes puts new icons on the second page.

**If Add to Home Screen is greyed out or missing:** make sure you are using Safari (not Chrome, Firefox, or any other browser) and that you are on the live HTTPS URL.

> iOS 16.4+ recommended for the best experience. On older iOS, the app still works but may not launch fully full-screen.

---

## Adding your own verified products

Once you are using the app daily, you will want to add exact products you actually buy. Products are managed at `/admin/products` (tap **More** → **Manage products (private)**).

For each product you want to add:

1. Find it on the official product page:
   - Coop: search at [coop.ch](https://www.coop.ch/de/lebensmittel.html)
   - Migros: search at [migros.ch](https://www.migros.ch/de/category/lebensmittel)
2. On the product page, find the **Nährwertangaben** (nutrition table). You need the values **per 100g**:
   - Energie / Brennwert → calories (kcal)
   - Protein / Eiweiss → protein (g)
   - Kohlenhydrate → carbs (g)
   - Fett → fat (g)
3. Note the current shelf price and the package size.
4. Open road2abs on your phone, go to **More → Manage products**, tap **+ Add**.
5. Fill in all fields. Paste the official product page URL into the **Product page URL** field.
6. Set **Last checked** to today's date.
7. Tap **Add product**.

The product now appears immediately in recommendations. Prices and macros should be re-verified whenever you notice they have changed on the shelf.

---

## Project structure

```
app/
  (main)/           # Authenticated shell with bottom nav
    today/          # Homepage — macro input, store selection, CTA
    shop/           # Supermarket fast mode
    saved/          # Favourites + shopping lists
    prep/           # Meal prep planner
    more/           # Hub for extra features
      treat/        # Make a treat fit
      emergency/    # Emergency protein mode
      pantry/       # Pantry items
      progress/     # Weekly check-ins
      settings/     # Targets, budget, equipment
  auth/login/       # Sign in / sign up
  auth/callback/    # Supabase OAuth callback
  results/          # Recommendation results page
  recipe/[id]/      # Full recipe detail + shopping list
  admin/products/   # Private product manager
  manifest.ts       # PWA manifest (native Next.js 16)
  layout.tsx        # Root layout

components/
  ui/               # Button, Card, Chip, Input, Badge, MacroTag, ProgressBar
  navigation/       # BottomNav

lib/
  supabase/         # Browser client, server client, proxy session handler
  utils/            # Macro scoring, formatting, seed data

supabase/
  migrations/       # 001 schema + RLS, 002 seed data

public/
  icons/            # PWA icons (regenerate: node scripts/generate-icons.mjs)
  sw.js             # Service worker (cache-first shell, network-first pages)
```

---

## Tech notes

- **Next.js 16** — App Router, `proxy.ts` (replaces deprecated `middleware.ts`)
- **Tailwind v4** — CSS-first config via `@theme` in `globals.css`; no `tailwind.config.ts`
- **Supabase** — Row Level Security on all user tables; trigger auto-creates profile on signup
- **PWA** — Manifest via `app/manifest.ts`, service worker at `public/sw.js`, icons generated from SVG via Sharp
- Macro scoring in `lib/utils/macros.ts` — weights calories fit, protein contribution, budget, favourites, and efficiency
