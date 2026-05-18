import Link from 'next/link'

/**
 * ABOUT — l'origine du signal.
 * Inversion : fond ivoire, encre noire. Mise en page éditoriale.
 * Aucun effet superflu — la respiration du papier.
 */
export default function AboutPage() {
  return (
    <article className="min-h-screen bg-ivory text-ink">
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-32 md:px-12">

        <Link
          href="/"
          className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50 hover:text-ink"
          data-cursor="back"
        >
          <span className="h-px w-8 bg-ink/30" />
          retour
        </Link>

        <header className="mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            // about
          </p>
          <h1
            className="mt-6 font-serif italic leading-[0.9]"
            style={{ fontSize: 'clamp(56px, 11vw, 180px)' }}
          >
            Origine<br />
            du <span className="text-ink/40">signal.</span>
          </h1>
        </header>

        <section className="mt-24 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
              // bio
            </p>
            <p className="mt-6 font-serif text-2xl leading-[1.4] italic md:text-3xl">
              Étudiant en art numérique. Je travaille à la frontière entre installation, code et perception.
            </p>
            <div className="mt-8 space-y-5 text-base leading-[1.7] text-ink/70">
              <p>
                Mon terrain : ce qui se passe quand l&apos;humain et la machine essaient de se comprendre.
                Quand un signal cardiaque devient image, quand une projection efface le bâtiment qu&apos;elle habille, quand un masque parle deux langues à la fois.
              </p>
              <p>
                Je m&apos;intéresse moins aux outils qu&apos;à ce qu&apos;ils révèlent : la fragilité de la communication, le poids matériel du virtuel, la mémoire des formes.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
              // formation
            </p>

            <ol className="mt-6 space-y-8 border-l border-ink/15 pl-6">
              <li>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">2024 — 2026</p>
                <p className="mt-1 font-serif text-xl italic">Master Art Numérique</p>
                <p className="text-sm text-ink/60">[École à compléter]</p>
              </li>
              <li>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">2021 — 2024</p>
                <p className="mt-1 font-serif text-xl italic">Bachelor [discipline]</p>
                <p className="text-sm text-ink/60">[École à compléter]</p>
              </li>
              <li>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">résidences · workshops</p>
                <p className="mt-1 text-sm text-ink/60">
                  Mons en Lumière (2024 → 2026)<br />
                  Festival des Lumières de Tourcoing (2025 → 2026)<br />
                  Interractive²
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* Citation */}
        <blockquote className="mt-32 max-w-3xl font-serif italic leading-[1.1]"
          style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
        >
          « Je ne fais pas d&apos;images.<br />
          Je construis des espaces<br />
          qui <span className="italic text-ink/50">regardent.</span> »
        </blockquote>

        {/* Sortie */}
        <div className="mt-32 flex flex-wrap items-baseline justify-between gap-6 border-t border-ink/15 pt-10">
          <Link
            href="/neuroscape"
            className="group inline-flex items-baseline gap-3 font-serif text-3xl italic hover:text-ink/60"
            data-cursor="enter"
          >
            voir le réseau →
          </Link>
          <Link
            href="/contact"
            className="group inline-flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50 hover:text-ink"
            data-cursor="enter"
          >
            envoyer un signal →
          </Link>
        </div>
      </div>
    </article>
  )
}
