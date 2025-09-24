import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          purple: '#8B7CC8',
          'purple-light': '#B8A9E8',
          'purple-dark': '#6B5CA0',
          DEFAULT: '#8B7CC8',
          foreground: '#FFFFFF'
        },
        secondary: {
          coral: '#E8A688',
          'coral-light': '#F4C4A8',
          'coral-dark': '#D8956E',
          DEFAULT: '#E8A688',
          foreground: '#FFFFFF'
        },
        neutral: {
          'light-gray': '#F8F8F8',
          'medium-gray': '#E5E5E5',
          'dark-gray': '#666666'
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F3F8',
          DEFAULT: '#FFFFFF'
        },
        // shadcn/ui required colors
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#8B7CC8',
        foreground: '#000000',
        muted: {
          DEFAULT: '#F8F8F8',
          foreground: '#666666'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000'
        }
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 12px rgba(139, 124, 200, 0.3)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
