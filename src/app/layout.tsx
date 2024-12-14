import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vision Landing - For those who dare to reshape reality',
  description: 'Join a band of brilliant misfits dedicated to pushing the boundaries of what\'s possible in autonomous systems.',
  openGraph: {
    title: 'Vision Landing',
    description: 'For those who dare to reshape reality',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}