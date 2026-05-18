'use client'

import dynamic from 'next/dynamic'

// Charge le slider côté client uniquement — il manipule window/document
// massivement et n'a aucun intérêt à être pré-rendu.
const ArgentLoopSlider = dynamic(
  () => import('@/components/ui/argent-loop-infinite-slider'),
  { ssr: false },
)

export default function Works() {
  return <ArgentLoopSlider />
}
