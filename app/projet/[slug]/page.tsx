import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects } from '@/lib/projects'
import InteractiveBentoGallery, {
  type BentoMediaItem,
} from '@/components/ui/interactive-bento-gallery'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

/**
 * Pattern de spans pour la grille bento (4 cols × auto-rows[90px]).
 * Indexé par position : 0 = tile feature (couverture), puis cycle.
 */
const BENTO_SPANS: string[] = [
  'md:col-span-2 md:row-span-4 sm:col-span-2 sm:row-span-3', // 0 — feature (cover)
  'md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2',
  'md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2',
  'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2',
  'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  'md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2',
  'md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2',
  'md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2',
  'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2',
]

const spanFor = (i: number) =>
  BENTO_SPANS[i] ?? BENTO_SPANS[BENTO_SPANS.length - 1]

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return notFound()

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const connected = project.connections
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean)

  const hasGallery = project.gallery && project.gallery.length > 0
  // La couverture ouvre déjà le bento — on l'écarte de la galerie si elle y figure aussi
  const galleryUrls = (project.gallery ?? []).filter((url) => url !== project.image)

  // Détection type à partir de l'extension (bento gère nativement <video>)
  const mediaType = (url: string): 'image' | 'video' =>
    /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) ? 'video' : 'image'

  // Construit le tableau bento : couverture en premier (tile feature),
  // suivi de toutes les photos/vidéos de la galerie.
  const bentoItems: BentoMediaItem[] = hasGallery
    ? [
        {
          id: 0,
          type: mediaType(project.image),
          title: `${project.title} — couverture`,
          desc: project.tagline,
          url: project.image,
          span: spanFor(0),
        },
        ...galleryUrls.map((url, i) => ({
          id: i + 1,
          type: mediaType(url),
          title: `${project.title} — fragment ${String(i + 1).padStart(2, '0')}`,
          desc: '',
          url,
          span: spanFor(i + 1),
        })),
      ]
    : []

  return (
    <article className="min-h-screen bg-void pb-24 pt-32">
      {/* Retour discret */}
      <div className="px-6 md:px-16">
        <Link
          href="/neuroscape"
          className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-mute hover:text-synapse"
          data-cursor="back"
        >
          <span className="h-px w-8 bg-mute transition-all hover:w-12 hover:bg-synapse" />
          retour au réseau
        </Link>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden px-6 pb-16 pt-12 md:px-16 md:pb-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-synapse">
          // {project.kind} · {project.year}
        </p>
        <h1
          className="mt-6 font-serif italic leading-[0.88] tracking-tight"
          style={{ fontSize: 'clamp(56px, 12vw, 220px)' }}
        >
          {project.title}
        </h1>
        <p className="mt-8 max-w-2xl font-serif text-2xl italic text-synapse md:text-3xl">
          {project.tagline}
        </p>
      </header>

      {/* MÉDIA — Bento Gallery pour les projets avec photos, placeholder sinon */}
      {hasGallery ? (
        <section className="pb-12">
          <div className="px-6 md:px-16">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-synapse">
              // visions · {bentoItems.length} fragments — clic pour zoomer · glisser pour réordonner
            </p>
          </div>
          <InteractiveBentoGallery mediaItems={bentoItems} />
        </section>
      ) : (
        <section className="px-6 md:px-16">
          <div className="aspect-video w-full overflow-hidden border border-ghost/10 bg-deep">
            <div className="flex h-full items-center justify-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-mute">
                [ media · vidéo ou image du projet ]
              </p>
            </div>
          </div>
        </section>
      )}

      {/* DESCRIPTION (asymétrique) */}
      <section className="grid gap-12 border-t border-ghost/10 px-6 py-24 md:grid-cols-12 md:gap-16 md:px-16">
        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
            // démarche
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-5">
          <p className="font-serif text-2xl leading-[1.4] text-ghost md:text-3xl">
            {project.description}
          </p>
          {project.longText && (
            <p className="mt-10 max-w-prose whitespace-pre-line text-base leading-[1.7] text-mute">
              {project.longText}
            </p>
          )}
        </div>
      </section>

      {/* STACK */}
      <section className="grid gap-12 px-6 py-24 md:grid-cols-12 md:gap-16 md:px-16">
        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
            // outils
          </p>
        </div>
        <div className="md:col-span-9">
          <ul className="flex flex-wrap gap-3">
            {project.tools.map((t) => (
              <li
                key={t}
                className="border border-ghost/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ghost transition-colors hover:border-synapse hover:text-synapse"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONNECTED NODES */}
      {connected.length > 0 && (
        <section className="border-t border-ghost/10 px-6 py-24 md:px-16">
          <p className="mb-12 font-mono text-[10px] uppercase tracking-[0.3em] text-synapse">
            // synapses connectées
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {connected.map((c) => c && (
              <Link
                key={c.slug}
                href={`/projet/${c.slug}`}
                className="group block border border-ghost/10 p-8 transition-colors hover:border-synapse"
                data-cursor="open"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                  {c.year} · {c.kind}
                </p>
                <p className="mt-2 font-serif text-3xl italic text-ghost transition-colors group-hover:text-synapse">
                  {c.title} →
                </p>
                <p className="mt-2 text-sm italic text-mute">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PREV / NEXT — transition synaptique */}
      <footer className="grid grid-cols-1 border-t border-ghost/10 md:grid-cols-2">
        <Link
          href={`/projet/${prev.slug}`}
          className="group block border-r border-ghost/10 px-6 py-20 md:px-16"
          data-cursor="prev"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute group-hover:text-synapse">
            ← précédent
          </p>
          <h2
            className="mt-4 font-serif italic leading-[0.95] text-ghost transition-colors group-hover:text-synapse"
            style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
          >
            {prev.title}
          </h2>
        </Link>
        <Link
          href={`/projet/${next.slug}`}
          className="group block px-6 py-20 text-right md:px-16"
          data-cursor="next"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute group-hover:text-synapse">
            suivant →
          </p>
          <h2
            className="mt-4 font-serif italic leading-[0.95] text-ghost transition-colors group-hover:text-synapse"
            style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
          >
            {next.title}
          </h2>
        </Link>
      </footer>
    </article>
  )
}
