import { ImageResponse } from 'next/og'

/**
 * Open Graph image générée dynamiquement par next/og.
 * Next.js attache automatiquement <meta og:image> à toutes les pages
 * grâce au nom de fichier `opengraph-image.tsx` dans /app.
 *
 * Rendue sur l'edge runtime → ~200ms par requête, cachée par Vercel.
 * Aperçu local : http://localhost:3000/opengraph-image
 */
export const runtime = 'edge'
export const alt = 'SYNAPSE — un esprit, des connexions, des œuvres qui regardent'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Petites coordonnées de "neurones" dispersés (rendu déterministe).
const NEURONS = [
  { top: 80,  left: 140, size: 8, opacity: 0.7 },
  { top: 130, left: 320, size: 5, opacity: 0.45 },
  { top: 60,  left: 540, size: 4, opacity: 0.35 },
  { top: 100, left: 880, size: 6, opacity: 0.5 },
  { top: 70,  left: 1050, size: 5, opacity: 0.55 },
  { top: 220, left: 220, size: 4, opacity: 0.3 },
  { top: 240, left: 1000, size: 5, opacity: 0.4 },
  { top: 450, left: 160, size: 7, opacity: 0.55 },
  { top: 480, left: 380, size: 4, opacity: 0.3 },
  { top: 510, left: 720, size: 5, opacity: 0.4 },
  { top: 470, left: 980, size: 6, opacity: 0.5 },
  { top: 540, left: 1100, size: 4, opacity: 0.3 },
]

// Lignes synaptiques (juste 2-3, très discrètes — Satori ne gère pas le SVG aussi
// bien que les divs absolu).
const SYNAPSES = [
  { from: { x: 144, y: 84 },  to: { x: 322, y: 132 } },
  { from: { x: 884, y: 103 }, to: { x: 1052, y: 72 } },
  { from: { x: 164, y: 453 }, to: { x: 384, y: 481 } },
  { from: { x: 982, y: 472 }, to: { x: 1102, y: 542 } },
]

// Charge une font Google directement comme buffer (Satori a besoin du fichier).
// Satori ne lit que TTF/OTF — pas WOFF2. On utilise donc un User-Agent ancien
// pour forcer Google Fonts à renvoyer un fichier .ttf au lieu de .woff2.
async function loadGoogleFont(
  family: string,
  italic = 0,
  weight = 400,
): Promise<ArrayBuffer> {
  const fam = family.replace(/ /g, '+')
  const cssUrl = `https://fonts.googleapis.com/css2?family=${fam}:ital,wght@${italic},${weight}&display=swap`
  const css = await (
    await fetch(cssUrl, {
      headers: {
        // Firefox 3.x → Google sert du TTF (le seul format que comprenait FF3)
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:1.9) Gecko/20081202 Firefox/3.1',
      },
    })
  ).text()
  const match = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)
  if (!match?.[1]) throw new Error(`Unable to extract font URL for ${family}`)
  return (await fetch(match[1])).arrayBuffer()
}

export default async function OpengraphImage() {
  // 2 fonts : Instrument Serif italique (le hero) + JetBrains Mono (captions).
  const [serifItalic, mono] = await Promise.all([
    loadGoogleFont('Instrument Serif', 1, 400),
    loadGoogleFont('JetBrains Mono', 0, 400),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0B0F',
          color: '#E8E6E1',
          position: 'relative',
          padding: '64px',
        }}
      >
        {/* Lignes synaptiques — fines, cyan, derrière tout */}
        {SYNAPSES.map((s, i) => {
          const dx = s.to.x - s.from.x
          const dy = s.to.y - s.from.y
          const length = Math.sqrt(dx * dx + dy * dy)
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI
          return (
            <div
              key={`syn-${i}`}
              style={{
                position: 'absolute',
                top: s.from.y,
                left: s.from.x,
                width: length,
                height: 1,
                background: '#7FE7DC',
                opacity: 0.15,
                transformOrigin: '0 0',
                transform: `rotate(${angle}deg)`,
              }}
            />
          )
        })}

        {/* Neurones — points cyan dispersés */}
        {NEURONS.map((n, i) => (
          <div
            key={`n-${i}`}
            style={{
              position: 'absolute',
              top: n.top,
              left: n.left,
              width: n.size,
              height: n.size,
              borderRadius: n.size,
              background: '#7FE7DC',
              opacity: n.opacity,
              boxShadow: `0 0 ${n.size * 2}px rgba(127,231,220,${n.opacity * 0.6})`,
            }}
          />
        ))}

        {/* Caption haut — UN ESPRIT S'ÉVEILLE */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 64,
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            color: '#6B6F76',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
          }}
        >
          // un esprit s&apos;éveille
        </div>

        {/* TITRE — SYNAPSE. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontSize: 240,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
          }}
        >
          <span>SYNAPSE</span>
          <span style={{ color: '#7FE7DC' }}>.</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontSize: 36,
            color: '#9A9DA3',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          un esprit, des connexions, des œuvres qui regardent.
        </div>

        {/* Caption bas — portfolio art numérique */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 64,
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            color: '#6B6F76',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
          }}
        >
          // portfolio art numérique
        </div>

        {/* Petite signature URL en bas à droite */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 64,
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            color: '#7FE7DC',
            letterSpacing: '0.2em',
          }}
        >
          synapse.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Instrument Serif',
          data: serifItalic,
          style: 'italic',
          weight: 400,
        },
        {
          name: 'JetBrains Mono',
          data: mono,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
