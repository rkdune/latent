"use client"

import { useState } from "react"
import { useModel, models } from "@/contexts/ModelContext"
import { useTheme } from "@/contexts/ThemeContext"
import { ChevronDown } from "lucide-react"

export default function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedModel, setSelectedModel } = useModel()
  const { theme } = useTheme()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 flex items-center gap-2 transition-colors text-xs h-full"
        style={{
          borderLeft: `1px solid ${theme.colors.border}`,
          borderRight: `1px solid ${theme.colors.border}`,
          backgroundColor: 'transparent',
          color: theme.colors.primaryText
        }}
        title="Select Model"
      >
        <span>{selectedModel.name}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div
            className="absolute top-full right-0 z-20 min-w-[180px] border"
            style={{
              backgroundColor: theme.colors.secondaryBackground,
              borderColor: theme.colors.border,
              borderTop: 'none'
            }}
          >
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-xs transition-colors"
                                  style={{
                    backgroundColor: selectedModel.id === model.id ? theme.colors.borderHover : 'transparent',
                    color: theme.colors.primaryText
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModel.id !== model.id) {
                      (e.target as HTMLElement).style.backgroundColor = theme.colors.border
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModel.id !== model.id) {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent'
                    }
                  }}
              >
                {model.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 