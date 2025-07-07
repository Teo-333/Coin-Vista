import { createContext } from 'react';

export type ColorMode = 'light' | 'dark';

export interface ThemeContextValue {
  mode: ColorMode;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleMode: () => {},
});