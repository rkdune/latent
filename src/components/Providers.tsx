"use client"

import { ReactNode } from 'react'
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ModelProvider } from "@/contexts/ModelContext"
import { ApiKeyProvider } from "@/contexts/ApiKeyContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeWrapper } from "@/components/theme-wrapper"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <ApiKeyProvider>
            <ModelProvider>
              <ThemeWrapper>
                {children}
              </ThemeWrapper>
            </ModelProvider>
          </ApiKeyProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
} 