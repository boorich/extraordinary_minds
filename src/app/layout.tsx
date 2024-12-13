import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vision Landing',
  description: 'Visionary Founder for a New Era of Agentic Systems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}