'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const X = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/**
 * Interactive Bento Gallery — adapté DA SYNAPSE
 *  - palette : void / ghost / synapse / mute
 *  - typo serif italique pour les titres (cohérence portfolio)
 *  - dock dragable cyan synapse (au lieu de sky-400)
 *  - title / description en props optionnelles (la page projet
 *    a déjà son hero, on évite de dupliquer)
 *
 * Comportement :
 *  - grille bento (spans variables par item)
 *  - drag pour réordonner (offset > 50px)
 *  - click → modal plein écran + dock dragable de miniatures
 *  - support image / video
 */

export interface BentoMediaItem {
  id: number
  type: 'image' | 'video'
  title: string
  desc: string
  url: string
  span: string
}

/* ─────────────────────────────────────────────────────────────
   MEDIA ITEM — gère image ou video avec lazy / IntersectionObserver
   ───────────────────────────────────────────────────────────── */
function MediaItem({
  item,
  className,
  onClick,
}: {
  item: BentoMediaItem
  className?: string
  onClick?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isBuffering, setIsBuffering] = useState(true)

  useEffect(() => {
    if (item.type !== 'video') return
    const node = videoRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setIsInView(e.isIntersecting)),
      { root: null, rootMargin: '50px', threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.unobserve(node)
  }, [item.type])

  useEffect(() => {
    if (item.type !== 'video') return
    let mounted = true
    const play = async () => {
      const v = videoRef.current
      if (!v || !isInView || !mounted) return
      try {
        if (v.readyState >= 3) {
          setIsBuffering(false)
          await v.play()
        } else {
          setIsBuffering(true)
          await new Promise((resolve) => { if (v) v.oncanplay = resolve })
          if (mounted) {
            setIsBuffering(false)
            await v.play()
          }
        }
      } catch (err) {
        console.warn('Video playback failed:', err)
      }
    }
    if (isInView) play()
    else if (videoRef.current) videoRef.current.pause()
    return () => {
      mounted = false
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isInView, item.type])

  if (item.type === 'video') {
    return (
      <div className={`${className ?? ''} relative overflow-hidden`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.7 : 1,
            transition: 'opacity 0.2s',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-synapse/30 border-t-synapse" />
          </div>
        )}
      </div>
    )
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      className={`${className ?? ''} cursor-pointer object-cover`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   MODAL — visuel agrandi + dock dragable
   ───────────────────────────────────────────────────────────── */
interface GalleryModalProps {
  selectedItem: BentoMediaItem
  isOpen: boolean
  onClose: () => void
  setSelectedItem: (item: BentoMediaItem | null) => void
  mediaItems: BentoMediaItem[]
}

function GalleryModal({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 })
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop opaque pour masquer la bento derrière */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-void/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Conteneur visuel principal */}
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItem.id}
            className="relative h-auto max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-lg border border-ghost/10 bg-void/40"
            initial={{ y: 20, scale: 0.97 }}
            animate={{
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
            }}
            exit={{ y: 20, scale: 0.97, transition: { duration: 0.15 } }}
            onClick={(e) => e.stopPropagation()}
          >
            <MediaItem
              item={selectedItem}
              className="max-h-[85vh] w-full bg-void"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-void via-void/70 to-transparent p-4 sm:p-6 md:p-8">
              <h3 className="font-serif italic text-ghost" style={{ fontSize: 'clamp(20px, 2.6vw, 32px)' }}>
                {selectedItem.title}
              </h3>
              {selectedItem.desc && (
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-mute sm:text-sm">
                  {selectedItem.desc}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bouton fermer */}
        <motion.button
          className="absolute right-4 top-4 z-[80] flex h-9 w-9 items-center justify-center rounded-full border border-ghost/20 bg-void/60 text-ghost backdrop-blur-sm transition-colors hover:bg-synapse hover:text-void sm:right-6 sm:top-6"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Fermer"
          data-cursor="close"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Dock dragable — miniatures de toutes les images */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }))
        }}
        className="fixed bottom-4 left-1/2 z-[80] -translate-x-1/2 touch-none sm:bottom-6"
      >
        <div className="relative rounded-xl border border-synapse/30 bg-synapse/15 shadow-[0_0_30px_rgba(127,231,220,0.15)] backdrop-blur-xl">
          <div className="flex items-center -space-x-2 px-3 py-2">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem(item)
                }}
                style={{
                  zIndex:
                    selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={`relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg sm:h-10 sm:w-10 md:h-11 md:w-11 ${
                  selectedItem.id === item.id
                    ? 'ring-2 ring-synapse shadow-lg'
                    : 'hover:ring-2 hover:ring-ghost/40'
                }`}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.2 : 1,
                  rotate:
                    selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                  y: selectedItem.id === item.id ? -8 : 0,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  y: -10,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
              >
                <MediaItem
                  item={item}
                  className="h-full w-full"
                  onClick={() => setSelectedItem(item)}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ghost/5 to-ghost/15" />
                {selectedItem.id === item.id && (
                  <motion.div
                    layoutId="bentoActiveGlow"
                    className="pointer-events-none absolute -inset-2 bg-synapse/30 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   COMPOSANT PRINCIPAL
   ───────────────────────────────────────────────────────────── */
interface InteractiveBentoGalleryProps {
  mediaItems: BentoMediaItem[]
  /** Titre du bloc (optionnel — laisse vide si la page a déjà un hero). */
  title?: string
  /** Description sous le titre (optionnel). */
  description?: string
  /** Classe additionnelle sur le wrapper. */
  className?: string
}

export default function InteractiveBentoGallery({
  mediaItems,
  title,
  description,
  className = '',
}: InteractiveBentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<BentoMediaItem | null>(null)
  const [items, setItems] = useState(mediaItems)
  const [isDragging, setIsDragging] = useState(false)

  // Re-sync si la prop change (changement de slug / projet)
  useEffect(() => {
    setItems(mediaItems)
  }, [mediaItems])

  return (
    <div className={`mx-auto w-full max-w-6xl px-4 py-8 ${className}`}>
      {(title || description) && (
        <div className="mb-10 text-center">
          {title && (
            <motion.h2
              className="font-serif italic leading-[0.95] text-ghost"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              className="mx-auto mt-3 max-w-md font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="grid auto-rows-[90px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06 },
              },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={`relative cursor-pointer overflow-hidden rounded-xl border border-ghost/5 ${item.span}`}
                onClick={() => !isDragging && setSelectedItem(item)}
                variants={{
                  hidden: { y: 40, scale: 0.95, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.02 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false)
                  const moveDistance = info.offset.x + info.offset.y
                  if (Math.abs(moveDistance) > 50) {
                    const newItems = [...items]
                    const draggedItem = newItems[index]
                    const targetIndex =
                      moveDistance > 0
                        ? Math.min(index + 1, items.length - 1)
                        : Math.max(index - 1, 0)
                    newItems.splice(index, 1)
                    newItems.splice(targetIndex, 0, draggedItem)
                    setItems(newItems)
                  }
                }}
                data-cursor="open"
              >
                <MediaItem
                  item={item}
                  className="absolute inset-0 h-full w-full"
                  onClick={() => !isDragging && setSelectedItem(item)}
                />
                {/* Overlay info au hover */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-200 hover:opacity-100 md:p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                  <h3 className="relative font-serif italic text-ghost line-clamp-1 text-sm md:text-base">
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className="relative mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-mute line-clamp-2 sm:text-[10px]">
                      {item.desc}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
