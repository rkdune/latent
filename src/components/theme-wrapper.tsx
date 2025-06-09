"use client"

import { ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const { themeName } = useTheme()
  
  return (
    <div data-theme={themeName} className="h-screen">
      {children}
    </div>
  )
} 