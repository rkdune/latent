"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeName, Theme } from '@/types/theme'
import { themes, defaultTheme } from '@/lib/themes'

interface ThemeContextType {
  theme: Theme
  themeName: ThemeName
  setTheme: (themeName: ThemeName) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('latent-theme') as ThemeName
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme)
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('latent-theme', themeName)
  }, [themeName])

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName)
  }

  const toggleTheme = () => {
    setThemeName(current => current === 'dark' ? 'light' : 'dark')
  }

  const value: ThemeContextType = {
    theme: themes[themeName],
    themeName,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 