'use client'

import { usePathname } from 'next/navigation'

export default function Role() {
  const pathname = usePathname()
  if (pathname === '/neuroscape') return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[120] hidden md:block font-mono text-[10px] uppercase tracking-[0.25em] text-mute mix-blend-difference pointer-events-none select-none"
      aria-hidden="true"
    >
      data analyst · creative developer //
    </div>
  )
}
