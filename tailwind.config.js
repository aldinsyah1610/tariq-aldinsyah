/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#C0F53D',
          dark:    '#a8db2e',
          muted:   '#9aab6a',
        },
        dark: {
          DEFAULT: '#080c02',
          card:    '#0f1505',
          border:  '#1e2a0a',
          medium:  '#1a2209',
          light:   '#243010',
          hover:   '#2d3d12',
        },
        cream: '#FAFFF3',
        viz: {
          teal:  '#4ECDC4',  // secondary data series (muted teal-mint)
          slate: '#95A5B8',  // tertiary data series (blue-slate)
        },
      },
      fontFamily: {
        sans:  ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Bodoni Moda"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'lime-glow':  '0 0 40px rgba(192,245,61,0.18)',
        'lime-glow-lg':'0 0 80px rgba(192,245,61,0.22)',
        'dark-card':  '0 1px 0 rgba(192,245,61,0.06)',
      },
    },
  },
  plugins: [],
}
