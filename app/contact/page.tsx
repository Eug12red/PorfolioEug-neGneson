'use client'

import Link from 'next/link'

/**
 * CONTACT — le signal.
 * Deux nœuds. Rien d'autre.
 */
export default function ContactPage() {
  const links = [
    { label: 'Instagram', handle: '@ton_handle', href: 'https://instagram.com/' },
    { label: 'GitHub', handle: '/ton_handle', href: 'https://github.com/' },
  ]

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-void px-6">
      {/* graine ambiante */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="synapse-pulse h-1.5 w-1.5 rounded-full bg-synapse/60"
          style={{ boxShadow: '0 0 80px 12px rgba(127,231,220,0.18)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-synapse">
          // contact · le signal continue
        </p>

        <h1
          className="mt-8 font-serif italic leading-[0.9]"
          style={{ fontSize: 'clamp(56px, 11vw, 180px)' }}
        >
          Trouve-moi<span className="text-synapse">.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-md font-serif text-lg italic text-mute">
          Pour une collaboration, une résidence, un café — ou juste pour échanger sur la suite.
        </p>

        <div className="mt-20 flex flex-col items-center gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full max-w-md items-center justify-between border-t border-ghost/15 py-6 transition-colors last:border-b hover:border-synapse"
              data-cursor="open"
            >
              <span className="font-serif text-3xl italic transition-colors group-hover:text-synapse md:text-5xl">
                {l.label}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute transition-colors group-hover:text-synapse">
                {l.handle} →
              </span>
            </a>
          ))}
        </div>

        <Link
          href="/"
          className="mt-24 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-mute hover:text-synapse"
          data-cursor="back"
        >
          <span className="h-px w-8 bg-mute" />
          retour
        </Link>
      </div>
    </section>
  )
}
