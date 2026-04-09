/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        fg: 'var(--color-text)',
        'fg-muted': 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        'accent-2': 'var(--color-accent-2)',
        glass: 'var(--color-glass-bg)',
        'glass-border': 'var(--color-glass-border)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      boxShadow: {
        glow: '0 0 24px var(--color-glow), 0 0 48px var(--color-glow-soft)',
        'glow-sm': '0 0 12px var(--color-glow)',
      },
    },
  },
  plugins: [],
};
