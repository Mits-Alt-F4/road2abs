'use client'
import { useRouter } from 'next/navigation'
import { StoreBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export interface ProductCardData {
  id: string
  name: string
  store: string
  image_url: string | null
  official_image_url?: string | null
  uploaded_image_url?: string | null
  product_page_url: string | null
  price_chf: number
  price_unit: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  package_size_g: number
  verified: boolean
  last_checked: string | null
}

interface ProductCardProps {
  product: ProductCardData
  showServingCalc?: boolean
  linkToDetail?: boolean
}

function resolveImage(p: ProductCardData): string | null {
  return p.official_image_url ?? p.uploaded_image_url ?? p.image_url ?? null
}

export function ProductCard({ product, showServingCalc, linkToDetail = true }: ProductCardProps) {
  const router = useRouter()
  const imageUrl = resolveImage(product)

  function handleCardClick() {
    if (linkToDetail) router.push(`/products/${product.id}`)
  }

  const content = (
    <Card
      padding="sm"
      className={`flex flex-col gap-3${linkToDetail ? ' cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
      onClick={handleCardClick}
    >
      {/* Top row: image + name/store/price */}
      <div className="flex gap-3">
        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface-raised)] flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-center text-[var(--color-subtle)] px-1 leading-tight">
              Image unavailable
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[var(--color-text)] leading-tight">{product.name}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <StoreBadge store={product.store} />
            {product.verified && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded-full">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-base font-black text-[var(--color-text)] mt-1.5">
            CHF {product.price_chf.toFixed(2)}
          </p>
          <p className="text-[11px] text-[var(--color-subtle)]">{product.price_unit}</p>
        </div>
      </div>

      {/* Macro grid */}
      <div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'kcal', value: String(product.calories_per_100g) },
            { label: 'protein', value: `${product.protein_per_100g}g` },
            { label: 'carbs', value: `${product.carbs_per_100g}g` },
            { label: 'fat', value: `${product.fat_per_100g}g` },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-[var(--color-surface-raised)] rounded-lg px-1.5 py-2 text-center"
            >
              <div className="text-xs font-bold text-[var(--color-text)]">{m.value}</div>
              <div className="text-[9px] text-[var(--color-subtle)] mt-0.5 uppercase tracking-wide">
                {m.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-[var(--color-subtle)] mt-1 text-right">per 100 g</p>
      </div>

      {/* Footer: last checked + official link */}
      <div className="flex items-center justify-between pt-0.5">
        {product.last_checked ? (
          <span className="text-[10px] text-[var(--color-subtle)]">
            Checked{' '}
            {new Date(product.last_checked).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ) : (
          <span />
        )}
        {product.product_page_url && (
          <a
            href={product.product_page_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-[var(--color-accent-dark)] underline underline-offset-2"
          >
            Official page ↗
          </a>
        )}
      </div>

      {/* Serving calculator */}
      {showServingCalc && (
        <div className="pt-3 border-t border-[var(--color-border)]">
          <p className="text-[11px] font-bold text-[var(--color-muted)] mb-2 uppercase tracking-wide">
            Serving calculator
          </p>
          <div className="flex flex-col gap-1.5">
            <ServingRow label="100 g" grams={100} product={product} />
            <ServingRow
              label={`Full tin drained (${product.package_size_g} g)`}
              grams={product.package_size_g}
              product={product}
            />
          </div>
        </div>
      )}
    </Card>
  )

  return content
}

function ServingRow({
  label,
  grams,
  product,
}: {
  label: string
  grams: number
  product: ProductCardData
}) {
  const f = grams / 100
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-[var(--color-muted)] w-36 flex-shrink-0 text-[11px]">{label}</span>
      <div className="flex gap-2 flex-wrap">
        <span className="text-[var(--color-text)] font-bold">
          {Math.round(product.calories_per_100g * f)} kcal
        </span>
        <span className="text-[var(--color-text)]">
          {(product.protein_per_100g * f).toFixed(1)} g pro
        </span>
        <span className="text-[var(--color-subtle)]">
          {(product.carbs_per_100g * f).toFixed(1)} g carbs
        </span>
        <span className="text-[var(--color-subtle)]">
          {(product.fat_per_100g * f).toFixed(1)} g fat
        </span>
      </div>
    </div>
  )
}
