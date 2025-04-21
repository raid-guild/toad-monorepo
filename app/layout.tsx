import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { okayJelly } from './fonts/fonts'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TOAD - Trustless On-Chain Autonomous Delegate',
  description: 'An AI-powered voting delegate system that revolutionizes DAO governance',
  icons: {
    icon: [
      { url: '/logo_trans_w.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo_trans_w.png', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${okayJelly.variable}`}>
      <body className={`${inter.className} ${montserrat.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
