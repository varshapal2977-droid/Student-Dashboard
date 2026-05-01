/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#050D1F',
          soft: '#0D1B38',
          muted: '#1A2D52',
        },
        cream: {
          DEFAULT: '#FFFCE8',
          soft: '#F5F2DC',
        },
        accent: {
          yellow: '#FFD60A',
          coral: '#FF6B6B',
          mint: '#06D6A0',
          lavender: '#A78BFA',
          sky: '#38BDF8',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-12px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        }
      }
    }
  },
  plugins: []
}
