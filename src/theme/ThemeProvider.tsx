import { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { ThemeContext } from './ThemeContext';
import type { ThemeContextValue, ColorMode } from './ThemeContext';

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<ColorMode>('light');

  useEffect(() => {
    const stored = localStorage.getItem('app-theme') as ColorMode | null;
    if (stored) {
      setMode(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const contextValue = useMemo<ThemeContextValue>(() => ({
    mode,
    toggleMode: () => {
      setMode(prev => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('app-theme', next);
        return next;
      });
    },
  }), [mode]);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}