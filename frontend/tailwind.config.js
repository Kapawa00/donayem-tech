/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF0F7',
          100: '#D5DAF0',
          200: '#A4AFDE',
          300: '#6E82CA',
          400: '#3E5BB5',
          500: '#1A3490',
          600: '#0F2270',
          700: '#0D1B56',
          800: '#09123B',
          900: '#050A22',
          950: '#020510',
        },
        gold: {
          50: '#FDF8EC',
          100: '#F9EDCC',
          200: '#F2D99A',
          300: '#E8C163',
          400: '#D4A336',
          500: '#B8861A',
          600: '#956A10',
          700: '#72500C',
          800: '#503808',
          900: '#302105',
        },
        surface: '#F9FAFB',
        border: '#E5E7EB',
        muted: '#9CA3AF',
        dark: '#111827',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        pill: '9999px',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.dark'),
            '--tw-prose-headings': theme('colors.navy.900'),
            '--tw-prose-lead': theme('colors.muted'),
            '--tw-prose-links': theme('colors.gold.500'),
            '--tw-prose-bold': theme('colors.navy.900'),
            '--tw-prose-counters': theme('colors.gold.500'),
            '--tw-prose-bullets': theme('colors.gold.400'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.navy.700'),
            '--tw-prose-quote-borders': theme('colors.gold.400'),
            '--tw-prose-captions': theme('colors.muted'),
            '--tw-prose-code': theme('colors.navy.900'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            maxWidth: 'none',
            fontFamily: theme('fontFamily.inter').join(', '),
            a: {
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': { color: theme('colors.gold.400') },
            },
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.syne').join(', '),
              fontWeight: '700',
            },
          },
        },
      }),
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateY(-14px) scale(1.2)', opacity: '0.9' },
        },
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'spin-reverse': 'spin-reverse 1s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'gradient-move': 'gradient-move 10s ease infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
