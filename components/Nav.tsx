'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Index', sub: 'l\'éveil' },
  { href: '/neuroscape', label: 'Works', sub: 'le réseau' },
  { href: '/about', label: 'About', sub: 'l\'origine' },
  { href: '/contact', label: 'Contact', sub: 'le signal' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between p-6 font-mono text-[10px] uppercase tracking-[0.25em] mix-blend-difference md:p-8">
        <Link href="/" className="text-ghost hover:text-synapse" data-cursor="home">
          SYNAPSE<span className="text-synapse">.</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-ghost"
          data-cursor={open ? 'close' : 'menu'}
          aria-label="Menu"
        >
          {open ? '[ fermer ]' : '[ menu ]'}
        </button>
      </header>

      <div
        className={`fixed inset-0 z-[140] flex items-center justify-center bg-void/95 backdrop-blur-xl transition-all duration-700 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-start gap-2">
          {links.map((l, i) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`group flex items-baseline gap-6 font-serif italic leading-[0.95] transition-colors ${
                  active ? 'text-synapse' : 'text-ghost hover:text-synapse'
                }`}
                style={{ fontSize: 'clamp(48px, 9vw, 120px)' }}
                data-cursor="enter"
              >
                <span className="font-mono text-xs not-italic opacity-40">
                  0{i + 1}
                </span>
                <span>{l.label}</span>
                <span className="font-mono text-xs not-italic opacity-30 transition-opacity group-hover:opacity-60">
                  — {l.sub}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
