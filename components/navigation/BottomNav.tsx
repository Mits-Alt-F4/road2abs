'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const NAV = [
  { href: '/today', label: 'Today', icon: HomeIcon },
  { href: '/shop', label: 'Shop', icon: ShopIcon },
  { href: '/saved', label: 'Saved', icon: HeartIcon },
  { href: '/prep', label: 'Prep', icon: BoxIcon },
  { href: '/more', label: 'More', icon: GridIcon },
]

export function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-border)] safe-bottom">
      <div className="flex items-stretch justify-around px-1 pt-1 pb-1" style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom))' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/today' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-[var(--radius-md)] transition-colors min-h-[52px]',
                active
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-subtle)] hover:text-[var(--color-muted)]'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'stroke-[2.5px]')} />
              <span className={cn('text-[10px] font-semibold', active ? 'text-[var(--color-accent)]' : 'text-[var(--color-subtle)]')}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-[calc(env(safe-area-inset-bottom)+2px)] w-1 h-1 rounded-full bg-[var(--color-accent)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function ShopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  )
}
function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}
