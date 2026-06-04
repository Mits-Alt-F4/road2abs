import Link from 'next/link'
import { Card } from '@/components/ui/Card'

const ITEMS = [
  { href: '/more/treat', emoji: '🍫', title: 'Make a treat fit', desc: 'Find a combination that includes your treat' },
  { href: '/more/emergency', emoji: '🆘', title: 'Emergency protein', desc: 'High protein options with fewest calories' },
  { href: '/more/pantry', emoji: '🧺', title: 'My pantry', desc: 'Mark what you already have at home' },
  { href: '/more/progress', emoji: '📈', title: 'Progress', desc: 'Weekly weight and energy check-ins' },
  { href: '/more/settings', emoji: '⚙️', title: 'Settings', desc: 'Targets, stores, equipment and preferences' },
]

export default function MorePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 border-b border-[var(--color-border)]">
        <h1 className="text-2xl font-black text-[var(--color-text)]">More</h1>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card padding="md" className="flex items-center gap-4 active:scale-[0.98] transition-transform">
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[var(--color-text)]">{item.title}</div>
                <div className="text-sm text-[var(--color-subtle)] mt-0.5">{item.desc}</div>
              </div>
              <span className="text-[var(--color-subtle)] text-lg">›</span>
            </Card>
          </Link>
        ))}

        <div className="mt-4 px-1">
          <Link href="/admin/products" className="text-sm text-[var(--color-subtle)] underline">
            Manage products (private)
          </Link>
        </div>
      </div>
    </div>
  )
}
