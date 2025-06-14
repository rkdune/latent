"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ApiKeyContextType {
  apiKey: string | null
  setApiKey: (key: string | null) => void
  hasApiKey: boolean
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined)

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter-api-key')
    if (savedKey) {
      setApiKeyState(savedKey)
    }
  }, [])

  const setApiKey = (key: string | null) => {
    setApiKeyState(key)
    if (key) {
      localStorage.setItem('openrouter-api-key', key)
    } else {
      localStorage.removeItem('openrouter-api-key')
    }
  }

  const value: ApiKeyContextType = {
    apiKey,
    setApiKey,
    hasApiKey: !!apiKey
  }

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  const context = useContext(ApiKeyContext)
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider')
  }
  return context
} 