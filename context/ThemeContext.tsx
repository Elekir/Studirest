import React, { createContext, useContext, useState } from 'react';
import { Colors } from '../constants/theme';

type ThemeContextType = {
  isDayMode: boolean;
  toggleTheme: () => void;
  theme: typeof Colors.dark; //  ensures TypeScript knows our colors
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDayMode, setIsDayMode] = useState(false);

  const toggleTheme = () => setIsDayMode(!isDayMode);

  // choose which color object to provide based on the state
  const theme = isDayMode ? Colors.light : Colors.dark;

  return (
    <ThemeContext.Provider value={{ isDayMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};