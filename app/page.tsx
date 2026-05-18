'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import dynamic from 'next/dynamic'

// Charge le shader uniquement côté client → évite les soucis SSR/hydratation
const SynapseField = dynamic(() => import('@/components/SynapseField'), {
  ssr: false,
})

/**
 * INTRO — l'éveil
 * Champ shader interactif en backdrop, typographie au-dessus.
 */
export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Le champ apparaît en fondu lent — on entre dans la matière
    tl.fromTo(fieldRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2.2, ease: 'power2.out' }
    )

    tl.fromTo(titleRef.current,
      { opacity: 0, filter: 'blur(20px)', y: 30 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.6 }, '-=1.5')
    .fromTo(subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1 }, '-=0.9')
    .fromTo(ctaRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  }, [])

  return (
    <section className="relative min-h-screen w-screen overflow-hidden">
      {/* Champ shader interactif — backdrop */}
      <div ref={fieldRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <SynapseField />
        {/* Voile pour préserver la lisibilité de la typo */}
        <div className="pointer-events-none absolute inset-0 bg-void/35" />
        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(10,11,15,0.85) 100%)' }}
        />
      </div>

      {/* Typo */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className="font-serif italic leading-[0.9] tracking-tight"
          style={{ fontSize: 'clamp(72px, 14vw, 220px)' }}
        >
          INTRO<span className="text-synapse">.</span>
        </h1>

        <p ref={subRef} className="mt-10 max-w-md font-serif text-lg italic leading-relaxed text-mute md:text-xl">
          un esprit, des connexions,<br />
          des œuvres qui regardent.
        </p>

        <Link
          ref={ctaRef}
          href="/neuroscape"
          className="group mt-20 inline-flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ghost"
          data-cursor="enter"
        >
          <span className="h-px w-12 bg-ghost/40 transition-all duration-500 group-hover:w-24 group-hover:bg-synapse" />
          entrer dans l&apos;esprit
          <span className="h-px w-12 bg-ghost/40 transition-all duration-500 group-hover:w-24 group-hover:bg-synapse" />
        </Link>

        <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-mute/60">
          ↓ scroll · ou cliquer
        </p>
      </div>
    </section>
  )
}
