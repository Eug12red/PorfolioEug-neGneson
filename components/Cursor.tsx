'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * CURSOR — point + ring qui suit la souris.
 *
 * Latence : 0. Le `transform` est appliqué directement par rAF
 * sans aucune transition CSS (sinon chaque frame est interpolée).
 * Les transitions ne portent QUE sur width/height/background.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string>('')

  // Position cible (souris) et position lerpée (ring)
  const target = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const seeded = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY

      // 1ère frame : on téléporte le ring pour éviter le slide-in initial
      if (!seeded.current) {
        ring.current.x = e.clientX
        ring.current.y = e.clientY
        seeded.current = true
      }

      // Le DOT suit instantanément (pas de lerp, pas de transition)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor')
      setLabel(cursorAttr || '')
    }

    let raf = 0
    const animate = () => {
      // Ring lerp rapide (0.32) — suffisamment pour sentir un trail léger
      ring.current.x += (target.current.x - ring.current.x) * 0.32
      ring.current.y += (target.current.y - ring.current.y) * 0.32
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      {/* DOT — suit la souris au pixel près */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-synapse"
        style={{
          boxShadow: '0 0 12px rgba(127,231,220,0.6)',
          willChange: 'transform',
        }}
      />

      {/* RING — légère traînée, sans transition sur le transform */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full border border-synapse/70 ${
          label
            ? 'h-16 w-16 -ml-8 -mt-8 bg-synapse/5'
            : 'h-7 w-7 -ml-[14px] -mt-[14px] bg-transparent'
        }`}
        style={{
          willChange: 'transform',
          transitionProperty: 'width, height, margin, background-color',
          transitionDuration: '260ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-synapse">
            {label}
          </span>
        )}
      </div>
    </>
  )
}
