import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      
      setTheme: (theme: Theme) => {
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
        set({ theme, resolvedTheme: resolved });
      },
      
      toggleTheme: () => {
        const { resolvedTheme } = get();
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
      
      initializeTheme: () => {
        const { theme } = get();
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
        set({ resolvedTheme: resolved });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(() => {
    useThemeStore.getState().initializeTheme();
  }, 0);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const currentStore = useThemeStore.getState();
    if (currentStore.theme === 'system') {
      const resolved = getSystemTheme();
      applyTheme(resolved);
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  });
} 