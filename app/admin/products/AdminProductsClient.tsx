'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { StoreBadge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  brand: string | null
  store: string
  category: string
  price_chf: number
  price_unit: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  package_size_g: number
  product_page_url: string | null
  last_checked: string | null
  verified: boolean
  active: boolean
  tags: string[]
}

const EMPTY_FORM = {
  name: '', brand: '', store: 'coop', category: 'chicken',
  price_chf: '', price_unit: '100g',
  calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fat_per_100g: '',
  package_size_g: '', product_page_url: '', last_checked: new Date().toISOString().slice(0, 10),
  tags: '',
}

export function AdminProductsClient({ products: initial, userId }: { products: Product[]; userId: string }) {
  const supabase = createClient()
  const [products, setProducts] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  function startEdit(p: Product) {
    setEditId(p.id)
    setForm({
      name: p.name, brand: p.brand ?? '', store: p.store, category: p.category,
      price_chf: String(p.price_chf), price_unit: p.price_unit,
      calories_per_100g: String(p.calories_per_100g),
      protein_per_100g: String(p.protein_per_100g),
      carbs_per_100g: String(p.carbs_per_100g),
      fat_per_100g: String(p.fat_per_100g),
      package_size_g: String(p.package_size_g),
      product_page_url: p.product_page_url ?? '',
      last_checked: p.last_checked ?? new Date().toISOString().slice(0, 10),
      tags: (p.tags ?? []).join(', '),
    })
    setShowForm(true)
  }

  async function save() {
    setSaving(true)
    const pkgG = parseFloat(form.package_size_g) || 100
    const cal100 = parseFloat(form.calories_per_100g) || 0
    const pro100 = parseFloat(form.protein_per_100g) || 0
    const carb100 = parseFloat(form.carbs_per_100g) || 0
    const fat100 = parseFloat(form.fat_per_100g) || 0
    const payload = {
      name: form.name, brand: form.brand || null, store: form.store, category: form.category,
      price_chf: parseFloat(form.price_chf) || 0, price_unit: form.price_unit,
      calories_per_100g: cal100, protein_per_100g: pro100,
      carbs_per_100g: carb100, fat_per_100g: fat100,
      package_size_g: pkgG,
      calories_per_package: (cal100 * pkgG) / 100,
      protein_per_package: (pro100 * pkgG) / 100,
      carbs_per_package: (carb100 * pkgG) / 100,
      fat_per_package: (fat100 * pkgG) / 100,
      product_page_url: form.product_page_url || null,
      last_checked: form.last_checked || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      active: true, verified: true,
    }

    if (editId) {
      const { data } = await supabase.from('products').update(payload).eq('id', editId).select().single()
      if (data) setProducts((prev) => prev.map((p) => p.id === editId ? data : p))
    } else {
      const { data } = await supabase.from('products').insert(payload).select().single()
      if (data) setProducts((prev) => [data, ...prev])
    }

    setEditId(null)
    setForm(EMPTY_FORM)
    setShowForm(false)
    setSaving(false)
  }

  async function toggleActive(p: Product) {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id)
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x))
  }

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.store.includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <a href="/more" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">←</a>
        <div className="flex-1">
          <h1 className="text-xl font-black text-[var(--color-text)]">Product manager</h1>
          <p className="text-xs text-[var(--color-subtle)]">{products.length} products · private</p>
        </div>
        <Button size="sm" onClick={() => { setEditId(null); setForm(EMPTY_FORM); setShowForm(!showForm) }}>
          {showForm && !editId ? 'Cancel' : '+ Add'}
        </Button>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or store…"
          className="w-full h-10 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />

        {/* Form */}
        {showForm && (
          <Card padding="md" className="flex flex-col gap-3">
            <h2 className="font-bold text-[var(--color-text)]">{editId ? 'Edit product' : 'Add product'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Poulet brustfilet" /></div>
              <Input label="Brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Coop Naturaplan" />
              <div>
                <label className="text-sm font-semibold text-[var(--color-text)] block mb-1">Store</label>
                <select value={form.store} onChange={(e) => set('store', e.target.value)} className="w-full h-12 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                  <option value="coop">Coop</option>
                  <option value="migros">Migros</option>
                  <option value="lidl">Lidl</option>
                  <option value="denner">Denner</option>
                </select>
              </div>
              <Input label="Category" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="chicken" />
              <Input label="Price CHF" type="number" inputMode="decimal" unit="CHF" value={form.price_chf} onChange={(e) => set('price_chf', e.target.value)} />
              <Input label="Price unit" value={form.price_unit} onChange={(e) => set('price_unit', e.target.value)} placeholder="500g" />
              <Input label="Calories" type="number" inputMode="numeric" hint="per 100g" unit="kcal" value={form.calories_per_100g} onChange={(e) => set('calories_per_100g', e.target.value)} />
              <Input label="Protein" type="number" inputMode="decimal" hint="per 100g" unit="g" value={form.protein_per_100g} onChange={(e) => set('protein_per_100g', e.target.value)} />
              <Input label="Carbs" type="number" inputMode="decimal" hint="per 100g" unit="g" value={form.carbs_per_100g} onChange={(e) => set('carbs_per_100g', e.target.value)} />
              <Input label="Fat" type="number" inputMode="decimal" hint="per 100g" unit="g" value={form.fat_per_100g} onChange={(e) => set('fat_per_100g', e.target.value)} />
              <Input label="Package size" type="number" inputMode="numeric" unit="g" value={form.package_size_g} onChange={(e) => set('package_size_g', e.target.value)} />
              <Input label="Last checked" type="date" value={form.last_checked} onChange={(e) => set('last_checked', e.target.value)} />
              <div className="col-span-2"><Input label="Product page URL" type="url" value={form.product_page_url} onChange={(e) => set('product_page_url', e.target.value)} placeholder="https://www.coop.ch/…" /></div>
              <div className="col-span-2"><Input label="Tags" hint="comma separated" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="high-protein, chicken, lean" /></div>
            </div>
            <Button size="lg" fullWidth onClick={save} disabled={saving || !form.name}>
              {saving ? 'Saving…' : editId ? 'Update product' : 'Add product'}
            </Button>
          </Card>
        )}

        {/* Product list */}
        {filtered.map((p) => (
          <Card key={p.id} padding="sm" className={!p.active ? 'opacity-50' : ''}>
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[var(--color-text)]">{p.name}</span>
                  <StoreBadge store={p.store} />
                  {p.verified && <span className="text-[10px] text-emerald-600 font-bold">✓ verified</span>}
                </div>
                <div className="text-xs text-[var(--color-subtle)] mt-0.5">
                  CHF {p.price_chf} · {p.protein_per_100g}g pro · {p.calories_per_100g} kcal per 100g
                </div>
                {p.last_checked && (
                  <div className="text-[10px] text-[var(--color-subtle)]">
                    Checked: {new Date(p.last_checked).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => startEdit(p)} className="text-xs px-2 py-1 rounded bg-stone-100 text-[var(--color-muted)] font-semibold">Edit</button>
                <button onClick={() => toggleActive(p)} className="text-xs px-2 py-1 rounded bg-stone-100 text-[var(--color-muted)] font-semibold">
                  {p.active ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
