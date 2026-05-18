import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0B0F',     // noir profond bleuté
        deep: '#11131A',     // fond alterné sombre
        ivory: '#F2EFE9',    // fond clair (About)
        ink: '#0A0B0F',      // texte sur ivory
        synapse: '#7FE7DC',  // accent unique — cyan synapse
        burn: '#FF5C3A',     // accent rare — destruction (Cloud)
        ghost: '#E8E6E1',    // texte principal sombre
        mute: '#6B6F76',     // texte secondaire
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
