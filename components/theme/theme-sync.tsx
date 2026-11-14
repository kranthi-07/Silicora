'use client';

import { useEffect } from 'react';
import { useWorkspaceStore } from '@/lib/store';

export function ThemeSync() {
  const { themeMode, setThemeMode } = useWorkspaceStore();

  // 1. Initial hydration from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('silicora_theme') as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        if (savedTheme !== themeMode) {
          setThemeMode(savedTheme);
        }
      }
    } catch {
      // Ignore localStorage access issues in restricted modes
    }
  }, [setThemeMode]);

  // 2. Synchronize DOM root classes, data-theme and colorScheme whenever themeMode changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    }
  }, [themeMode]);

  return null;
}
