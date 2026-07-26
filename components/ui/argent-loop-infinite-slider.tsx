'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { projects, type Project } from '@/lib/projects'

/**
 * ARGENT LOOP — slider vertical infini avec preview.
 *
 * Chaque "page" couvre l'écran. La molette / le drag avancent dans la
 * boucle ; un léger lerp + snap-to-project donnent la sensation
 * cinématique. La minimap (image + texte) se synchronise.
 *
 * Adapté à la DA SYNAPSE :
 *  - palette void / synapse / ghost
 *  - voile dégradé pour préserver la lisibilité de la typo
 *  - HUD centré : numéro, titre serif, tagline cyan, CTA "entrer"
 *  - click sur le projet courant → navigation vers la page projet
 */

const CONFIG = {
  SCROLL_SPEED: 0.85,
  LERP_FACTOR: 0.06,
  BUFFER_SIZE: 3,
  MAX_VELOCITY: 200,
  SNAP_DURATION: 600,
}

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor

const wrapIndex = (i: number) =>
  ((Math.abs(i) % projects.length) + projects.length) % projects.length

const getProject = (i: number): Project => projects[wrapIndex(i)]
const getNumber = (i: number) => (wrapIndex(i) + 1).toString().padStart(2, '0')

// La couverture d'un projet peut être une image ou une vidéo (mp4/webm/mov)
const isVideoCover = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)

export default function ArgentLoopSlider() {
  const router = useRouter()
  const [visibleRange, setVisibleRange] = React.useState({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  })
  const [currentIndex, setCurrentIndex] = React.useState(0)

  // State haute fréquence (mute via Ref pour éviter les re-renders)
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0,
  })

  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map())
  const requestRef = React.useRef<number>()
  const renderedRange = React.useRef({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  })
  const renderedIndex = React.useRef(0)

  // ────────────────────────────────────────────────
  // Parallax interne à chaque image
  // ────────────────────────────────────────────────
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number,
  ) => {
    if (!img) return
    if (!img.dataset.parallaxCurrent) img.dataset.parallaxCurrent = '0'
    let current = parseFloat(img.dataset.parallaxCurrent)
    const target = (-scroll - index * height) * 0.2
    current = lerp(current, target, 0.1)
    if (Math.abs(current - target) > 0.01) {
      img.style.transform = `translateY(${current}px) scale(1.5)`
      img.dataset.parallaxCurrent = current.toString()
    }
  }

  const updateSnap = () => {
    const s = state.current
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1,
    )
    const eased = 1 - Math.pow(1 - progress, 3)
    s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased
    if (progress >= 1) s.isSnapping = false
  }

  const snapToProject = () => {
    const s = state.current
    const current = Math.round(-s.targetY / s.projectHeight)
    const target = -current * s.projectHeight
    s.isSnapping = true
    s.snapStart = { time: Date.now(), y: s.targetY, target }
  }

  const updatePositions = () => {
    const s = state.current

    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY
      el.style.transform = `translateY(${y}px)`
      // Parallaxe uniquement sur les images non marquées « no-zoom »
      // (les vidéos et images « cadrage naturel » gardent leur position via CSS)
      const img = el.querySelector('img:not([data-no-zoom])') as HTMLImageElement | null
      updateParallax(img, s.currentY, index, s.projectHeight)
    })
  }

  const animationLoop = () => {
    const s = state.current
    const now = Date.now()

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject()
    }

    if (s.isSnapping) updateSnap()
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR
    }

    updatePositions()

    const idx = Math.round(-s.targetY / s.projectHeight)
    const min = idx - CONFIG.BUFFER_SIZE
    const max = idx + CONFIG.BUFFER_SIZE

    if (
      min !== renderedRange.current.min ||
      max !== renderedRange.current.max
    ) {
      renderedRange.current = { min, max }
      setVisibleRange({ min, max })
    }
    if (idx !== renderedIndex.current) {
      renderedIndex.current = idx
      setCurrentIndex(idx)
    }

    requestRef.current = requestAnimationFrame(animationLoop)
  }

  React.useEffect(() => {
    state.current.projectHeight = window.innerHeight

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const s = state.current
      s.isSnapping = false
      s.lastScrollTime = Date.now()
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY,
      )
      s.targetY -= delta
    }

    const onTouchStart = (e: TouchEvent) => {
      const s = state.current
      s.isDragging = true
      s.isSnapping = false
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY }
      s.lastScrollTime = Date.now()
    }

    const onTouchMove = (e: TouchEvent) => {
      const s = state.current
      if (!s.isDragging) return
      s.targetY =
        s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.5
      s.lastScrollTime = Date.now()
    }

    const onTouchEnd = () => {
      state.current.isDragging = false
    }

    const onResize = () => {
      state.current.projectHeight = window.innerHeight
      const container = document.querySelector(
        '.parallax-container',
      ) as HTMLElement | null
      if (container) container.style.height = `${window.innerHeight}px`
    }

    const onKey = (e: KeyboardEvent) => {
      const s = state.current
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        s.isSnapping = false
        s.lastScrollTime = Date.now()
        s.targetY -= s.projectHeight * 0.5
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        s.isSnapping = false
        s.lastScrollTime = Date.now()
        s.targetY += s.projectHeight * 0.5
      } else if (e.key === 'Enter') {
        const idx = Math.round(-s.targetY / s.projectHeight)
        router.push(`/projet/${getProject(idx).slug}`)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)

    onResize()
    requestRef.current = requestAnimationFrame(animationLoop)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const indices: number[] = []
  for (let i = visibleRange.min; i <= visibleRange.max; i++) indices.push(i)

  const current = getProject(currentIndex)
  const currentNum = getNumber(currentIndex)
  const goToCurrent = () => router.push(`/projet/${current.slug}`)

  return (
    <div className="parallax-container">
      {/* Projets (fullscreen) */}
      <div className="project-list">
        {indices.map((i) => {
          const p = getProject(i)
          return (
            <div
              key={i}
              className="project"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el)
                else projectsRef.current.delete(i)
              }}
            >
              {isVideoCover(p.image) ? (
                <video
                  src={p.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  // Ralenti de moitié — les vidéos de couverture respirent
                  ref={(el) => { if (el) el.playbackRate = 0.5 }}
                />
              ) : (
                <img
                  src={p.image}
                  alt={p.title}
                  draggable={false}
                  data-no-zoom={p.coverNoZoom ? '' : undefined}
                />
              )}
              <div className="project-veil" />
            </div>
          )
        })}
      </div>

      {/* HUD — projet courant centré */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-synapse">
            {currentNum} / {projects.length.toString().padStart(2, '0')} · {current.kind} · {current.year}
          </p>
          <h1
            className="mt-6 font-serif italic leading-[0.92] text-ghost drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(56px, 9vw, 140px)' }}
          >
            {current.title}
          </h1>
          <p className="mt-6 font-serif italic text-lg md:text-xl text-synapse">
            {current.tagline}
          </p>
        </div>

        <button
          onClick={goToCurrent}
          className="pointer-events-auto mt-14 group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-ghost hover:text-synapse transition-colors"
          data-cursor="enter"
        >
          <span className="h-px w-10 bg-ghost/40 transition-all group-hover:w-16 group-hover:bg-synapse" />
          entrer dans le projet
          <span className="h-px w-10 bg-ghost/40 transition-all group-hover:w-16 group-hover:bg-synapse" />
        </button>
      </div>

    </div>
  )
}
