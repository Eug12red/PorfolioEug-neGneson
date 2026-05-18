import type { Metadata } from 'next'
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import SmoothScroll from '@/components/SmoothScroll'
import MiniMap from '@/components/MiniMap'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})
const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'SYNAPSE — portfolio',
  description: 'Étudiant en art numérique. Installations immersives, IA, mapping, interfaces cérébrales.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="grain bg-void text-ghost font-sans antialiased">
        <SmoothScroll>
          <Nav />
          <Cursor />
          <main className="page-enter">{children}</main>
          <MiniMap />
        </SmoothScroll>
      </body>
    </html>
  )
}
