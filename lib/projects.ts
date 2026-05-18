export type ProjectKind = 'individual' | 'collection'

export type Project = {
  slug: string
  title: string
  tagline: string
  year: string
  kind: ProjectKind
  // Position 3D dans le réseau neuronal (x, y, z) — utilisé par le MiniMap SVG
  position: [number, number, number]
  description: string
  longText?: string
  tools: string[]
  // Connexions vers d'autres slugs (synapses thématiques)
  connections: string[]
  // Image hero (slider Works + page projet). Soit un chemin /projects/... soit une URL externe.
  image: string
  // Galerie affichée sur la page projet — toutes les photos en plein écran, empilées.
  // Si absent, on retombe sur le placeholder média.
  gallery?: string[]
}

// ────────────────────────────────────────────────────────────────────
// PROJETS INDIVIDUELS — gros nœuds, au centre du réseau
// ────────────────────────────────────────────────────────────────────
const individuals: Project[] = [
  {
    slug: 'cloud',
    title: 'Cloud',
    tagline: 'Le poids invisible du nuage.',
    year: '2025',
    kind: 'individual',
    position: [-2.4, 1.2, 0.4],
    description:
      "Installation interactive monumentale interrogeant l'empreinte écologique du numérique. Le public dialogue avec une IA projetée à l'échelle du bâtiment ; chaque requête déclenche, en temps réel, la destruction visuelle d'un fragment de l'image. Le nuage se dissout sous le regard de ceux qui l'invoquent.",
    longText:
      "Cloud confronte le geste anodin — une requête, un prompt, une question posée à la machine — à son coût matériel invisible. La projection couvre une façade ; l'image est entière, presque iconique. À chaque interaction du public via une interface IA, un fragment de l'image est littéralement effacé, érodé, désintégré. La beauté de la projection se consume au rythme de notre curiosité. Quand l'œuvre est devenue un trou noir, elle se reconstruit, et l'on recommence.",
    tools: ['TouchDesigner', 'Stable Diffusion', 'GLSL', 'Projection façade'],
    connections: ['mind-interaction', 'open-mind'],
    // Placeholder Unsplash — remplace par tes vrais visuels Cloud quand tu les as
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
  },
  {
    slug: 'mind-interaction',
    title: 'Mind Interaction',
    tagline: 'Aux limites du langage commun.',
    year: '2024',
    kind: 'individual',
    position: [2.6, 1.6, -0.6],
    description:
      "Mapping immersif explorant la communication entre l'humain et la machine. Une tentative de dialogue qui ne tient ni du code, ni de la parole — quelque chose d'autre, en train de naître.",
    longText:
      "Mind Interaction met en scène une conversation impossible. L'humain parle, la machine répond — mais dans une langue qui n'est ni la sienne, ni la nôtre. Mapping immersif sur volume, gestes captés, signaux interprétés. Au centre : l'inconfort du malentendu, et la beauté qu'il y a à insister.",
    tools: ['TouchDesigner', 'Kinect', 'OSC', 'Mapping'],
    connections: ['cloud', 'open-mind'],
    image: '/projects/mind-interaction-couverture.jpg',
    gallery: [
      '/projects/mind-interaction-2.jpg',
      '/projects/mind-interaction-3.jpg',
      '/projects/mind-interaction-6.jpg',
      '/projects/mind-interaction-10.jpg',
    ],
  },
  {
    slug: 'open-mind',
    title: 'Open Mind',
    tagline: 'Voir ce qu\'on ressent.',
    year: '2024',
    kind: 'individual',
    position: [0.4, -1.8, 0.8],
    description:
      "Visualisation en temps réel des données EEG et cardiaques d'un sujet connecté à la machine. La pensée et le battement deviennent paysage. Une cartographie vivante de l'intériorité.",
    longText:
      "Un casque EEG, un capteur cardiaque, un volontaire. Les signaux du corps sont traduits en formes, en flux, en couleurs — sans filtre, sans esthétisation préalable. L'œuvre est un miroir intérieur : ce qu'on voit n'existait pas avant qu'on le ressente.",
    tools: ['Muse EEG', 'Python', 'TouchDesigner', 'OSC'],
    connections: ['cloud', 'mind-interaction'],
    image: '/projects/open-mind-couverture.jpg',
    gallery: [
      '/projects/open-mind-hero.jpg',
      '/projects/open-mind-1.jpg',
      '/projects/open-mind-2.jpg',
      '/projects/open-mind-3.jpg',
      '/projects/open-mind-5.jpg',
      '/projects/open-mind-6.jpg',
      '/projects/open-mind-25.jpg',
      '/projects/open-mind-55.jpg',
    ],
  },
  {
    slug: 'mask-and-culture',
    title: 'Mask & Culture',
    tagline: 'Deux continents, un même visage.',
    year: '2023',
    kind: 'individual',
    position: [-2.0, -1.4, -1.0],
    description:
      "Mapping projeté sur des formes sculpturales — masques, totems, fragments. Une réflexion en lumière sur la fertilité, la guerre, l'identité, à l'intersection des cultures africaines et européennes.",
    longText:
      "Mask & Culture est une lecture croisée. Sur des formes sculptées — héritées d'iconographies africaines et européennes — la lumière projette des récits qui dialoguent : rituels de fertilité, mémoires de guerre, signes d'identité. Les masques deviennent surfaces de mémoire commune.",
    tools: ['MadMapper', 'After Effects', 'Sculpture', 'Vidéoprojection'],
    connections: ['mind-interaction'],
    image: '/projects/mask-and-culture-couverture.jpg',
    gallery: [
      '/projects/mask-and-culture-1.jpg',
      '/projects/mask-and-culture-2.jpg',
      '/projects/mask-and-culture-3.jpg',
    ],
  },
]

// ────────────────────────────────────────────────────────────────────
// COLLECTIONS — petits nœuds, en orbite
// ────────────────────────────────────────────────────────────────────
const collections: Project[] = [
  {
    slug: 'interractive-2',
    title: 'Interractive²',
    tagline: 'Plongée dans les abysses.',
    year: '2024',
    kind: 'collection',
    position: [-4.2, 0.2, 1.6],
    description:
      "Voyage immersif dans les abysses marins. Un univers étrange où le visiteur devient lui-même partie du courant.",
    tools: ['TouchDesigner', 'Mapping', 'Sound design'],
    connections: ['mons-2025'],
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
  },
  {
    slug: 'mons-2024',
    title: 'Mons en Lumière 2024',
    tagline: 'La ville comme vitrine.',
    year: '2024',
    kind: 'collection',
    position: [3.8, 2.6, 1.4],
    description:
      "Interaction avec les vitrines urbaines. La rue devient écran ; le passant, déclencheur.",
    tools: ['Kinect', 'TouchDesigner', 'Projection vitrine'],
    connections: ['mons-2025'],
    image:
      'https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop',
  },
  {
    slug: 'mons-2025',
    title: 'Mons en Lumière 2025',
    tagline: 'Le réel doublé.',
    year: '2025',
    kind: 'collection',
    position: [4.0, -0.4, -1.6],
    description:
      "Mapping immersif. Une dimension superposée à celle qu'on croyait connaître.",
    tools: ['MadMapper', 'TouchDesigner', 'Mapping monumental'],
    connections: ['mons-2024', 'mons-2026'],
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
  },
  {
    slug: 'mons-2026',
    title: 'Mons en Lumière 2026',
    tagline: "Voyage d'un photon.",
    year: '2026',
    kind: 'collection',
    position: [3.4, -2.6, 1.0],
    description:
      "Une particule traverse le vide, rencontre la matière, devient lumière, devient vie. La création racontée à l'échelle de l'infime.",
    tools: ['Houdini', 'TouchDesigner', 'Mapping monumental'],
    connections: ['mons-2025', 'tourcoing-2026'],
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1896&auto=format&fit=crop',
  },
  {
    slug: 'tourcoing-2025',
    title: 'Tourcoing 2025',
    tagline: 'Festival des Lumières.',
    year: '2025',
    kind: 'collection',
    position: [-3.8, -2.4, 0.4],
    description:
      "Participation au Festival des Lumières de Tourcoing. Lecture lumineuse du tissu urbain.",
    tools: ['MadMapper', 'TouchDesigner'],
    connections: ['tourcoing-2026'],
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
  },
  {
    slug: 'tourcoing-2026',
    title: 'Tourcoing 2026',
    tagline: 'Festival des Lumières.',
    year: '2026',
    kind: 'collection',
    position: [-4.4, 2.8, -0.6],
    description:
      "Seconde édition. Une continuité de la recherche entamée en 2025.",
    tools: ['MadMapper', 'TouchDesigner'],
    connections: ['tourcoing-2025'],
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
  },
]

export const projects: Project[] = [...individuals, ...collections]
export const individualProjects = individuals
export const collectionProjects = collections
