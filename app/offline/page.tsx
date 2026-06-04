export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center bg-[var(--color-bg)]">
      <div className="text-5xl mb-4">📡</div>
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">
        road<span className="text-[var(--color-accent)]">2</span>abs
      </h1>
      <p className="text-[var(--color-muted)] text-base font-medium mb-6">
        You&apos;re offline right now.
      </p>
      <p className="text-sm text-[var(--color-subtle)] max-w-xs">
        Product prices and new recommendations need a connection. Your saved meals and settings are still available.
      </p>
    </div>
  )
}
