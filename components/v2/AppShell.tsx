/**
 * V2 AppShell — centers content to max-width 430px on desktop,
 * full-width on mobile. Feels like a phone app everywhere.
 */
export function AppShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[430px] mx-auto min-h-dvh bg-[var(--color-bg)] relative ${className}`}>
      {children}
    </div>
  )
}

export function PageContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-4 flex flex-col gap-4 ${className}`}>
      {children}
    </div>
  )
}
