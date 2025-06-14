"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useApiKey } from "@/contexts/ApiKeyContext"
import { X } from "lucide-react"

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const { theme } = useTheme()
  const { apiKey, setApiKey } = useApiKey()
  const [inputValue, setInputValue] = useState(apiKey || "")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiKey(inputValue.trim() || null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 p-6 border"
        style={{
          backgroundColor: theme.colors.secondaryBackground,
          borderColor: theme.colors.border
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium" style={{ color: theme.colors.primaryText }}>
            OpenRouter API Key
          </h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = theme.colors.border}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
          >
            <X className="w-4 h-4" style={{ color: theme.colors.primaryText }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-2" style={{ color: theme.colors.secondaryText }}>
              API Key (overrides server key)
            </label>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="sk-or-..."
              className="w-full px-3 py-2 text-xs border bg-transparent outline-none transition-colors"
              style={{
                backgroundColor: theme.colors.primaryBackground,
                borderColor: theme.colors.border,
                color: theme.colors.primaryText
              }}
              onFocus={(e) => (e.target as HTMLElement).style.borderColor = theme.colors.borderHover}
              onBlur={(e) => (e.target as HTMLElement).style.borderColor = theme.colors.border}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-xs transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.secondaryText,
                border: `1px solid ${theme.colors.border}`
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = theme.colors.border}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs transition-colors"
              style={{
                backgroundColor: theme.colors.border,
                color: theme.colors.primaryText,
                border: `1px solid ${theme.colors.border}`
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = theme.colors.borderHover}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = theme.colors.border}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 