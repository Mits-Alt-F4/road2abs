export default function DemoLayout({ children }: { children: React.ReactNode }) {
  // No bottom nav, no auth wrapper — purely public demo shell
  return <>{children}</>
}
