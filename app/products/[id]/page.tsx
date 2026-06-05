import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Product } from '@/types'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  if (!data) notFound()

  const product = data as Product
  const imageUrl = product.official_image_url ?? product.uploaded_image_url ?? product.image_url

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <Link
          href="/products"
          className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]"
        >
          ←
        </Link>
        <h1 className="text-lg font-black text-[var(--color-text)] flex-1 truncate">
          {product.name}
        </h1>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Large product image */}
        <div className="w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <span className="text-sm text-[var(--color-subtle)]">Image unavailable</span>
          )}
        </div>

        {/* Product card with serving calc */}
        <ProductCard product={product} showServingCalc linkToDetail={false} />

        {/* Source notes */}
        {product.source_notes && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide mb-1.5">
              Source
            </p>
            <p className="text-xs text-[var(--color-subtle)] leading-relaxed">
              {product.source_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
