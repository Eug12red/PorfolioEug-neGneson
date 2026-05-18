'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'

/**
 * Smooth scroll global via Lenis.
 *
 * Désactivé sur /neuroscape : la page Works gère elle-même le wheel
 * (preventDefault + interpolation maison pour le slider infini).
 * Laisser Lenis actif là-bas créerait un conflit visible de scroll.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/neuroscape') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [pathname])

  return <>{children}</>
}
