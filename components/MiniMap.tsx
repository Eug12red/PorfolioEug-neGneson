'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { projects } from '@/lib/projects'

/**
 * MINIMAP — signature visuelle persistante.
 * Mini réseau SVG en bas à droite. Visible partout sauf sur le Hub
 * (qui est déjà le réseau en grand) et l'intro (sobriété).
 *
 * IMPORTANT : tous les hooks doivent être appelés AVANT tout
 * `return` conditionnel — sinon Fast Refresh part en vrille.
 */
const W = 110
const H = 110
const SCALE = 9

export default function MiniMap() {
  const pathname = usePathname()

  // Hooks AVANT toute condition de sortie.
  const points = useMemo(
    () =>
      projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        kind: p.kind,
        x: W / 2 + p.position[0] * SCALE,
        y: H / 2 - p.position[1] * SCALE,
      })),
    [],
  )

  const lines = useMemo(() => {
    const seen = new Set<string>()
    const segs: { x1: number; y1: number; x2: number; y2: number }[] = []
    projects.forEach((p) => {
      p.connections.forEach((slug) => {
        const target = points.find((t) => t.slug === slug)
        const src = points.find((t) => t.slug === p.slug)
        if (!target || !src) return
        const key = [p.slug, slug].sort().join('|')
        if (seen.has(key)) return
        seen.add(key)
        segs.push({ x1: src.x, y1: src.y, x2: target.x, y2: target.y })
      })
    })
    return segs
  }, [points])

  // Sortie conditionnelle APRÈS les hooks.
  if (pathname === '/' || pathname === '/neuroscape') return null

  const activeSlug = pathname.startsWith('/projet/')
    ? pathname.replace('/projet/', '')
    : null

  return (
    <div className="pointer-events-auto fixed bottom-5 right-5 z-[120] hidden md:block">
      <p className="mb-2 text-right font-mono text-[8px] uppercase tracking-[0.25em] text-mute">
        // tu es ici
      </p>
      <div
        className="relative rounded-md border border-ghost/10 bg-void/40 p-2 backdrop-blur-md"
        style={{ width: W + 16, height: H + 16 }}
      >
        <svg width={W} height={H} className="overflow-visible">
          {lines.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#7FE7DC"
              strokeOpacity={0.18}
              strokeWidth={0.5}
            />
          ))}
          {points.map((p) => {
            const isActive = p.slug === activeSlug
            const r = p.kind === 'individual' ? 2.6 : 1.5
            return (
              <Link key={p.slug} href={`/projet/${p.slug}`}>
                <g className="group">
                  <circle cx={p.x} cy={p.y} r={r + 6} fill="transparent" className="cursor-pointer" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill={isActive ? '#7FE7DC' : '#E8E6E1'}
                    fillOpacity={isActive ? 1 : 0.35}
                    className="transition-all group-hover:fill-synapse"
                  />
                  {isActive && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={r + 2}
                      fill="none"
                      stroke="#7FE7DC"
                      strokeWidth={0.6}
                      className="synapse-pulse"
                    />
                  )}
                  <title>{p.title}</title>
                </g>
              </Link>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
