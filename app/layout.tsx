import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PwaRegister } from '@/components/ui/PwaRegister'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Road2Abs',
  description: 'Personal high-protein meal assistant for Swiss supermarkets.',
  applicationName: 'Road2Abs',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Road2Abs',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#3a6235',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <PwaRegister />
        {children}
      </body>
    </html>
  )
}
