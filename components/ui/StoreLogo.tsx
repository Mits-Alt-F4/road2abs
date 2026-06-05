/**
 * Real brand logos for Swiss supermarkets — inline SVG, no external deps.
 */

export function CoopLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="40" rx="4" fill="#FF6600"/>
      <text x="40" y="28" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="bold" fill="white">coop</text>
    </svg>
  )
}

export function MigrosLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="8" fill="#FF6600"/>
      <text x="30" y="44" textAnchor="middle" fontFamily="Arial Black,Arial,sans-serif" fontSize="38" fontWeight="900" fill="white">M</text>
    </svg>
  )
}

export function LidlLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="30" fill="#0050AA"/>
      <circle cx="30" cy="30" r="24" fill="#FFD700"/>
      <circle cx="30" cy="30" r="18" fill="#E31E26"/>
      <text x="30" y="35" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="white">LIDL</text>
    </svg>
  )
}

export function DennerLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size * 1.8} height={size * 0.7} viewBox="0 0 90 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="35" rx="3" fill="#CC0000"/>
      <text x="45" y="24" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="bold" fill="white" letterSpacing="1">denner</text>
    </svg>
  )
}

export function StoreLogoByName({ store, size = 28 }: { store: string; size?: number }) {
  switch (store) {
    case 'coop': return <CoopLogo size={size} />
    case 'migros': return <MigrosLogo size={size} />
    case 'lidl': return <LidlLogo size={size} />
    case 'denner': return <DennerLogo size={size} />
    default: return <span className="text-xs font-bold text-[var(--color-muted)]">{store}</span>
  }
}
