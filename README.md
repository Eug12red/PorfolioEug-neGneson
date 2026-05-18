# SYNAPSE — Portfolio

Portfolio immersif basé sur le concept **SYNAPSE** : un esprit, des connexions, des œuvres.
Chaque projet est un nœud synaptique ; la navigation est un flux de pensée.

## Stack

- Next.js 14 (App Router) + TypeScript
- React Three Fiber + drei (3D / shaders)
- GSAP + Lenis (animations & smooth scroll)
- Tailwind CSS

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Structure

```
app/
  page.tsx                 → Intro (champ shader interactif)
  neuroscape/page.tsx      → Hub — réseau neuronal 3D
  projet/[slug]/page.tsx   → Page projet
  about/page.tsx           → Bio + formation
  contact/page.tsx         → Instagram + GitHub
components/
  SynapseField.tsx         → Shader fbm interactif (home)
  Cursor.tsx               → Curseur custom snappy
  Nav.tsx                  → Menu radial
  MiniMap.tsx              → Mini réseau persistant (signature)
  SmoothScroll.tsx         → Lenis wrapper
lib/
  projects.ts              → Données projets — à éditer
```

## Personnaliser

1. **Tes projets** → édite `lib/projects.ts` (titre, tagline, description, position 3D, connexions)
2. **Tes infos perso** → `app/about/page.tsx` (nom, écoles, bio)
3. **Tes liens** → `app/contact/page.tsx` (Instagram, GitHub)
4. **Tes médias** → ajoute tes vidéos/images dans `public/` puis remplace les "media slot" dans `app/projet/[slug]/page.tsx`
5. **Couleurs** → `tailwind.config.ts` et `app/globals.css`

## Concept

Le visiteur n'explore pas un portfolio — il explore une façon de penser.
4 projets individuels (gros nœuds lumineux) + 6 collections (petits nœuds filaires)
reliés par des connexions thématiques. Le mini-réseau en bas à droite te
sert de boussole sur tout le site.

## Build

```bash
npm run build
npm start
```

## Deploy

Vercel : `vercel deploy`
