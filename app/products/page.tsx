import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Product } from '@/types'

export default async function ProductLibraryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('verified', true)
    .eq('active', true)
    .order('store')
    .order('name')

  const list = (products ?? []) as Product[]

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <Link
          href="/more"
          className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-[var(--color-text)]">Product Library</h1>
          <p className="text-xs text-[var(--color-subtle)]">
            {list.length} verified product{list.length !== 1 ? 's' : ''} · private
          </p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {list.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-subtle)]">
            <p className="text-sm">No verified products yet.</p>
            <p className="text-xs mt-1">Run the migration to add the first product.</p>
          </div>
        ) : (
          list.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  )
}
