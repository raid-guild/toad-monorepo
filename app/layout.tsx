import type { Metadata } from 'next'
import { inter, roboto, okayJelly } from './fonts/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'TOAD - Trustless On-Chain Autonomous Delegate',
  description: 'Smoothing DAO governance by absorbing community sentiment and empowering users with AI-driven delegation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${okayJelly.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
