/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Color System
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        muted: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },

      // Font Family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // Custom Font Sizes
      fontSize: {
        'display-1': '4.5rem',
        'display-2': '3.75rem',
        'display-3': '3rem',
        'title-1': '2.25rem',
        'title-2': '1.875rem',
        'title-3': '1.5rem',
        'body-1': '1.125rem',
        'body-2': '1rem',
        'caption-1': '0.875rem',
        'caption-2': '0.75rem',
      },

      // Custom Spacing
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },

      // Custom Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },

      // Custom Backdrop Blur
      backdropBlur: {
        xs: '2px',
      },

      // Layout Variables
      height: {
        header: '4rem',
        sidebar: '280px',
        'sidebar-collapsed': '56px',
        'sidebar-mobile': '288px',
      },
      width: {
        sidebar: '280px',
        'sidebar-collapsed': '56px',
        'sidebar-mobile': '288px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
  // Production optimizations
  corePlugins: {
    // Disable unused features for smaller bundle
    preflight: true,
    container: false,
    accessibility: false,
    appearance: false,
    backgroundAttachment: false,
    backgroundClip: false,
    backgroundImage: false,
    backgroundPosition: false,
    backgroundRepeat: false,
    backgroundSize: false,
    borderCollapse: false,
    borderSpacing: false,
    caretColor: false,
    clear: false,
    columns: false,
    content: false,
    cursor: false,
    float: false,
    fontVariantNumeric: false,
    listStylePosition: false,
    listStyleType: false,
    objectFit: false,
    objectPosition: false,
    outline: false,
    outlineColor: false,
    outlineOffset: false,
    outlineStyle: false,
    outlineWidth: false,
    overscrollBehavior: false,
    placeholderColor: false,
    placeholderOpacity: false,
    pointerEvents: false,
    resize: false,
    ringColor: false,
    ringOffsetColor: false,
    ringOffsetWidth: false,
    ringOpacity: false,
    ringWidth: false,
    scrollBehavior: false,
    scrollMargin: false,
    scrollPadding: false,
    scrollSnapAlign: false,
    scrollSnapStop: false,
    scrollSnapType: false,
    tableLayout: false,
    textDecorationColor: false,
    textDecorationStyle: false,
    textDecorationThickness: false,
    textUnderlineOffset: false,
    touchAction: false,
    userSelect: false,
    verticalAlign: false,
    visibility: false,
    whitespace: false,
    wordBreak: false,
  },
};
