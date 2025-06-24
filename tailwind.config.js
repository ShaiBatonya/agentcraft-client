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
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
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
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-in-down': 'fade-in-down 0.3s ease-in-out',
        'fade-in-up': 'fade-in-up 0.3s ease-in-out',
        'fade-in-left': 'fade-in-left 0.3s ease-in-out',
        'fade-in-right': 'fade-in-right 0.3s ease-in-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-in-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-in-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-in-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-in-out',
        'loading-bar': 'loading-bar 2s ease-in-out infinite',
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
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-20px)' },
      },
      'loading-bar': {
        '0%': { transform: 'translateX(-100%)' },
        '50%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(100%)' },
      },
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'fade-in-down': {
        '0%': { opacity: '0', transform: 'translateY(-10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'fade-in-up': {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'fade-in-left': {
        '0%': { opacity: '0', transform: 'translateX(-10px)' },
        '100%': { opacity: '1', transform: 'translateX(0)' },
      },
      'fade-in-right': {
        '0%': { opacity: '0', transform: 'translateX(10px)' },
        '100%': { opacity: '1', transform: 'translateX(0)' },
      },
      'slide-in-from-bottom': {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      'slide-in-from-top': {
        '0%': { transform: 'translateY(-100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      'slide-in-from-left': {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(0)' },
      },
      'slide-in-from-right': {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
  },
  plugins: [],
  // Production optimizations
  corePlugins: {
    // Keep essential features
    preflight: true,
    container: false,
    backgroundImage: true, // Enable for gradients
    backgroundClip: true, // Enable for text gradients
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundSize: true,
    borderCollapse: true,
    borderSpacing: true,
    cursor: true,
    pointerEvents: true,
    resize: true,
    scrollBehavior: true,
    touchAction: true,
    userSelect: true,
    visibility: true,
    whitespace: true,
    wordBreak: true,
  },
};
