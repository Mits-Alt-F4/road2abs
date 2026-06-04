import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--color-bg)] px-6 safe-top">
      {/* Wordmark */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-stone-900 flex items-center justify-center mb-2">
          <span className="text-2xl font-black tracking-tighter text-white">
            R<span className="text-[var(--color-positive)]">2</span>A
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)]">
          road<span className="text-[var(--color-accent)]">2</span>abs
        </h1>
        <p className="text-[var(--color-subtle)] text-sm font-medium">
          Your personal Swiss meal assistant
        </p>
      </div>

      <div className="w-full max-w-sm">
        <LoginForm />
      </div>

      <p className="mt-8 text-xs text-[var(--color-subtle)] text-center max-w-xs">
        Private personal-use app. Data is stored securely and never shared.
      </p>
    </div>
  )
}
