/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'], // needed for shadcn variants
  content: ['./src/MonitoringService/**/*.{js,jsx,ts,tsx}'],
  important: '.monitoring-agency-theme',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--ms-background-color))',
        foreground: 'rgb(var(--ms-text-color))',
        text: 'rgb(var(--ms-text-color))',

        primary: {
          DEFAULT: 'rgb(var(--ms-primary-color))',
          foreground: 'rgb(var(--ms-white-color))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--ms-secondary-color))',
          foreground: 'rgb(var(--ms-background-color))',
        },
        accent: {
          DEFAULT: 'rgb(var(--ms-accent-color))',
          foreground: 'rgb(var(--ms-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--ms-destructive-color))',
          foreground: 'rgb(var(--ms-white-color))',
        },
        confirm: {
          DEFAULT: 'rgb(var(--ms-confirm-color))',
          foreground: 'rgb(var(--ms-white-color))',
        },
        muted: {
          DEFAULT: 'rgb(var(--ms-muted-color))',
          foreground: 'rgb(var(--ms-muted-foreground-color))',
        },
        popover: {
          DEFAULT: 'rgb(var(--ms-popover-color))',
          foreground: 'rgb(var(--ms-popover-foreground-color))',
        },
        card: {
          DEFAULT: 'rgb(var(--ms-card-color))',
          foreground: 'rgb(var(--ms-text-color))',
          50: 'rgb(var(--ms-card-50))',
          100: 'rgb(var(--ms-card-100))',
          200: 'rgb(var(--ms-card-200))',
          300: 'rgb(var(--ms-card-300))',
          400: 'rgb(var(--ms-card-400))',
          500: 'rgb(var(--ms-card-500))',
          600: 'rgb(var(--ms-card-600))',
          700: 'rgb(var(--ms-card-700))',
          800: 'rgb(var(--ms-card-800))',
          900: 'rgb(var(--ms-card-900))',
        },
        border: 'rgb(var(--ms-border-color))',
        input: 'rgb(var(--ms-input-color))',
        ring: 'rgb(var(--ms-primary-color))',
      },
      fontSize: {
        xs: ['0.85rem', { lineHeight: '1rem' }],
        sm: ['0.975rem', { lineHeight: '1.25rem' }],
        // base: ["1.125rem", { lineHeight: "1.75rem" }],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),

    plugin(function ({ addUtilities }) {
      addUtilities({
        '.border-borderL': {
          position: 'relative',
          borderRadius: '12px',
          padding: '1px', // thickness
          background:
            'linear-gradient(135deg, rgba(var(--ms-card-400)/0.9), rgba(var(--ms-card-400)/0.3), rgba(var(--ms-card-400)/0.5))',
        },
        '.border-borderL > *': {
          borderRadius: '11px',
        },
      });
    }),

    // inside plugins: [ ... ]
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '1px',
            height: '1px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(var(--ms-text-color) / 0.01)',
            borderRadius: '9999px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgb(var(--ms-text-color) / 0.35)',
          },
          '.dark &::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(var(--ms-text-color) / 0.25)',
          },
          '.dark &::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgb(var(--ms-text-color) / 0.45)',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(var(--ms-text-color) / 0.05) transparent',
        },
      });
    }),
  ],
};
