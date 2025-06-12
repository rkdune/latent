"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Model {
  id: string
  name: string
  endpoint: string
}

export const models: Model[] = [
  {
    id: 'gemma-3n-4b',
    name: 'Gemma 3N 4B',
    endpoint: 'google/gemma-3n-e4b-it:free'
  },
  {
    id: 'gemma-3-27b',
    name: 'Gemma 3 27B',
    endpoint: 'google/gemma-3-27b-it:free'
  },
  {
    id: 'deepseek-r1',
    name: 'R1 Distill Qwen 32B',
    endpoint: 'deepseek/deepseek-r1-distill-qwen-32b:free'
  }
]

interface ModelContextType {
  selectedModel: Model
  setSelectedModel: (model: Model) => void
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]) // Default to first model

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider')
  }
  return context
} 