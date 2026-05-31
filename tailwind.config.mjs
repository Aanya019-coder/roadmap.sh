/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#020617',
        'bg-secondary': '#0f172a',
        'bg-tertiary': '#1e293b',
        'border-default': '#1e293b',
        'border-hover': '#334155',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#475569',
        'accent-yellow': '#fbbf24',
        'accent-green': '#22c55e',
        'accent-red': '#ef4444',
        'node-done': '#166534',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
};
