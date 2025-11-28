import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'nativewind';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <ThemeContext.Provider value={{ isDark: colorScheme === 'dark', toggleTheme: toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
