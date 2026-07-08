'use client'

import { usePathname } from 'next/navigation'

export default function Credit() {
  const pathname = usePathname()
  // Masqué sur /neuroscape — la page immersive doit respirer
  if (pathname === '/neuroscape') return null

  return (
    <div
      className="fixed bottom-5 left-5 z-[120] font-mono text-[10px] uppercase tracking-[0.25em] text-mute mix-blend-difference pointer-events-none select-none"
      aria-hidden="true"
    >
      // by Kamegneson E.
    </div>
  )
}
