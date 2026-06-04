'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/today')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email to confirm your account, then sign in.')
        setMode('signin')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-5 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          inputMode="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          minLength={6}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium px-1">{error}</p>
      )}
      {message && (
        <p className="text-sm text-[var(--color-accent)] font-medium px-1">{message}</p>
      )}

      <Button type="submit" size="lg" fullWidth disabled={loading}>
        {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </Button>

      <button
        type="button"
        className="text-sm text-[var(--color-muted)] text-center mt-1 hover:text-[var(--color-accent)] transition-colors"
        onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
      >
        {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </form>
  )
}
