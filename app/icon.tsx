import { ImageResponse } from 'next/og'

/**
 * Favicon dynamique — initiales EK sur fond void, point cyan signature.
 * Next.js attache automatiquement <link rel="icon"> à toutes les pages
 * grâce au nom de fichier `icon.tsx` dans /app.
 */
export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

async function loadGoogleFont(family: string, italic = 0, weight = 400): Promise<ArrayBuffer> {
  const fam = family.replace(/ /g, '+')
  const cssUrl = `https://fonts.googleapis.com/css2?family=${fam}:ital,wght@${italic},${weight}&display=swap`
  const css = await (
    await fetch(cssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:1.9) Gecko/20081202 Firefox/3.1',
      },
    })
  ).text()
  const match = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)
  if (!match?.[1]) throw new Error(`Unable to extract font URL for ${family}`)
  return (await fetch(match[1])).arrayBuffer()
}

export default async function Icon() {
  const serifItalic = await loadGoogleFont('Instrument Serif', 1, 400)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0B0F',
          color: '#E8E6E1',
          fontFamily: 'Instrument Serif',
          fontStyle: 'italic',
          fontSize: 320,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        <span>EK</span>
        <span style={{ color: '#7FE7DC' }}>.</span>
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
      ],
    },
  )
}
