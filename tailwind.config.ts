import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F2EBDC',
          300: '#E7DBC4',
        },
        terracotta: {
          50: '#FBEFEA',
          100: '#F4D8CB',
          200: '#E8B19C',
          300: '#DA8B6D',
          400: '#C75D3C',
          500: '#B14C2D',
          600: '#943C22',
          700: '#73301C',
        },
        forest: {
          50: '#EFF4F1',
          100: '#D9E5DC',
          200: '#A8C2AE',
          300: '#769F82',
          400: '#4F7D62',
          500: '#2F5D50',
          600: '#234A40',
          700: '#1A372F',
        },
        ink: {
          DEFAULT: '#1F1B16',
          muted: '#6B6660',
          // Was #9A9389 which gave a 2.8:1 contrast ratio on the cream-50
          // background — failed WCAG AA 4.5:1. Darkened to #6F6960
          // (~4.76:1) so every uppercase tracking-widest eyebrow tag and
          // metadata caption passes AA without changing the visual
          // hierarchy more than a hair.
          subtle: '#6F6960',
        },
        warning: '#D4A24A',
        success: '#4A7C59',
        danger: '#B23A48',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1F1B16',
            '--tw-prose-headings': '#1F1B16',
            '--tw-prose-links': '#C75D3C',
            maxWidth: '70ch',
          },
        },
      }),
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
