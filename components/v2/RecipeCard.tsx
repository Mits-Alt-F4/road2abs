'use client'
import Link from 'next/link'
import { StoreBadge } from '@/components/ui/Badge'
import { DEMO_PRODUCT_MAP, RECIPE_PRODUCT_MAP } from '@/lib/demo/data'
import type { RecommendationResult } from '@/types'

interface Props {
  r: RecommendationResult
  href?: string
  onSave?: (id: string) => void
  onList?: (id: string) => void
  onChoose?: (id: string) => void
  saved?: boolean
  listed?: boolean
  dimmed?: boolean
}

export function RecipeCard({ r, href, onSave, onList, onChoose, saved = false, listed = false, dimmed = false }: Props) {
  const { recipe } = r
  const thumbIds = RECIPE_PRODUCT_MAP[recipe.id] ?? []
  const thumbs = thumbIds.map(id => DEMO_PRODUCT_MAP[id]).filter(Boolean)

  const proteinColor = r.reaches_protein_target
    ? 'var(--color-lime)'
    : r.reaches_protein_min
    ? 'var(--color-accent-dark)'
    : 'var(--color-border-strong)'

  function handleChoose(e: React.MouseEvent) {
    e.preventDefault()
    onChoose?.(recipe.id)
  }

  const inner = (
    <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden transition-opacity ${dimmed ? 'opacity-60' : ''}`}>
      {/* Protein fit bar */}
      <div className="h-[3px]" style={{ background: proteinColor }} />

      <div className="p-3.5 flex flex-col gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[var(--color-text)] text-[15px] leading-tight mb-1">
              {recipe.name}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {recipe.stores_required?.map((s: string) => <StoreBadge key={s} store={s} />)}
              <span className="text-[11px] text-[var(--color-subtle)]">
                {recipe.total_time_min === 0 ? 'No cooking' : `${recipe.total_time_min} min`}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className={`text-base font-black ${r.over_budget ? 'text-[var(--color-warn)]' : 'text-[var(--color-text)]'}`}>
              CHF {recipe.estimated_price_chf.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Macro pills + product thumbnails row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-muted)]">
              {recipe.total_calories} kcal
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-lime-dim)] text-[var(--color-lime)]">
              {recipe.total_protein}g protein
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-subtle)]">
              {recipe.total_carbs}g C · {recipe.total_fat}g F
            </span>
          </div>

          {/* Product thumbnails */}
          {thumbs.length > 0 && (
            <div className="flex -space-x-2 flex-shrink-0">
              {thumbs.slice(0, 3).map(p => (
                <div key={p.id} className="w-8 h-8 rounded-full border-2 border-[var(--color-bg)] bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={p.image_url} alt={p.name}
                    className="w-full h-full object-contain p-0.5"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Why it fits */}
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] px-3 py-2">
          <p className="text-[11px] font-semibold text-[var(--color-text)] leading-relaxed">{r.why}</p>
          <p className="text-[10px] text-[var(--color-subtle)] mt-0.5">{r.protein_efficiency}g protein / 100 kcal</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onSave && (
            <button onClick={e => { e.preventDefault(); onSave(recipe.id) }}
              className={`w-9 h-9 rounded-[var(--radius-md)] border flex items-center justify-center text-sm transition-all flex-shrink-0 ${
                saved ? 'bg-[#2a0a0a] border-[#7f1d1d] text-red-400' : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-subtle)]'
              }`}>{saved ? '♥' : '♡'}</button>
          )}
          {onList && (
            <button onClick={e => { e.preventDefault(); onList(recipe.id) }}
              className={`w-9 h-9 rounded-[var(--radius-md)] border flex items-center justify-center text-sm transition-all flex-shrink-0 ${
                listed ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent-dark)]' : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-subtle)]'
              }`}>{listed ? '✓' : '+'}</button>
          )}
          <button onClick={onChoose ? handleChoose : undefined}
            className="flex-1 h-9 bg-[var(--color-lime)] text-[#0D0F0E] font-bold text-sm rounded-[var(--radius-md)] active:scale-[0.97] transition-all">
            Choose this →
          </button>
        </div>
      </div>
    </div>
  )

  if (href) return <Link href={href}>{inner}</Link>
  return inner
}
