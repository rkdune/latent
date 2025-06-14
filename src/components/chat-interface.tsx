"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X, Plus, PanelLeftOpen, PanelLeftClose, Sun, Moon, Key } from "lucide-react"
import { useChat } from "@/hooks/useChat"
import { useTheme } from "@/contexts/ThemeContext"
import { useApiKey } from "@/contexts/ApiKeyContext"
import ModelSelector from "./model-selector"
import ApiKeyModal from "./ApiKeyModal"
import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { synthwave84 } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Components } from 'react-markdown'

export default function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  
  const { theme, themeName, toggleTheme } = useTheme()
  const { hasApiKey } = useApiKey()
  
  const {
    chats,
    activeChat,
    setActiveChat,
    getCurrentChat,
    sendMessage,
    createNewChat,
    deleteChat,
    isLoading
  } = useChat()

  // Auto-scroll to bottom when new messages arrive, but only if user is already at bottom
  const currentMessages = getCurrentChat()?.messages
  useEffect(() => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80 // 100px threshold
    
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentMessages])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    
    await sendMessage(inputValue)
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const currentChat = getCurrentChat()

  const markdownComponents: Components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      // More explicit inline detection
      const isInline = inline || !className || !language
      
      return !isInline ? (
        <SyntaxHighlighter
          style={synthwave84}
          language={language}
          PreTag="div"
          customStyle={{
            backgroundColor: theme.colors.secondaryBackground,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          style={{
            backgroundColor: theme.colors.secondaryBackground,
            color: theme.colors.primaryText,
            padding: '2px 4px',
            borderRadius: '3px',
            fontSize: '0.875rem',
            display: 'inline', // Explicitly set as inline
            whiteSpace: 'nowrap', // Prevent wrapping
          }}
          {...props}
        >
          {children}
        </code>
      )
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{backgroundColor: theme.colors.primaryBackground}}>
      {/* Unified Tab Bar */}
      <header style={{backgroundColor: theme.colors.secondaryBackground, borderBottom: `1px solid ${theme.colors.border}`}}>
        <div className="flex items-stretch h-12" style={{backgroundColor: theme.colors.secondaryBackground, borderBottom: `1px solid ${theme.colors.border}`}}>
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 flex items-center transition-colors sidebar-toggle-btn"
            style={{
              borderRight: `1px solid ${theme.colors.border}`,
              backgroundColor: 'transparent'
            }}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" style={{color: theme.colors.primaryText}} />
            ) : (
              <PanelLeftOpen className="w-4 h-4" style={{color: theme.colors.primaryText}} />
            )}
          </button>
          
          {/* Tabs */}
          <div className="flex items-center flex-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`group relative px-4 py-2 cursor-pointer transition-all duration-75 min-w-[140px] max-w-[200px] flex items-center justify-center h-full tab-item ${activeChat === chat.id ? 'active' : ''}`}
                style={{
                  backgroundColor: activeChat === chat.id ? theme.colors.primaryBackground : theme.colors.secondaryBackground,
                  color: activeChat === chat.id ? theme.colors.primaryText : theme.colors.secondaryText,
                  borderRight: `1px solid ${theme.colors.border}`
                }}
              >
                <span className="text-xs truncate mr-2">
                  {chat.title}
                </span>
                {chats.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(chat.id)
                    }}
                    className="ml-auto p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{backgroundColor: 'transparent'}}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = theme.colors.border}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                    title="Close tab"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Model Selector */}
          <ModelSelector />
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-3 flex items-center transition-colors theme-toggle-btn"
            style={{
              borderRight: `1px solid ${theme.colors.border}`,
              backgroundColor: 'transparent'
            }}
            title={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}
          >
            {themeName === 'light' ? (
              <Sun className="w-4 h-4" style={{color: theme.colors.primaryText}} />
            ) : (
              <Moon className="w-4 h-4" style={{color: theme.colors.primaryText}} />
            )}
          </button>

          {/* API Key Button */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="px-3 flex items-center transition-colors api-key-btn"
            style={{
              borderRight: `1px solid ${theme.colors.border}`,
              backgroundColor: 'transparent'
            }}
            title="Configure OpenRouter API Key"
          >
            <Key className="w-4 h-4" style={{color: hasApiKey ? theme.colors.primaryText : theme.colors.secondaryText}} />
          </button>
          
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="px-3 flex items-center transition-colors new-chat-btn"
            style={{backgroundColor: 'transparent'}}
            title="New Chat"
          >
            <Plus className="w-4 h-4" style={{color: theme.colors.primaryText}} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "transition-all duration-75",
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          )}
          style={{backgroundColor: theme.colors.secondaryBackground, borderRight: `1px solid ${theme.colors.border}`}}
        >
          <div className="p-4">
            <h2 className="font-semibold mb-4 text-sm" style={{color: theme.colors.primaryText}}>
              Chat History
            </h2>
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-2 rounded cursor-pointer transition-colors sidebar-chat-item ${activeChat === chat.id ? 'active' : ''}`}
                  style={{
                    backgroundColor: activeChat === chat.id ? theme.colors.borderHover : 'transparent',
                    color: activeChat === chat.id ? theme.colors.primaryText : theme.colors.secondaryText
                  }}
                >
                  <div className="text-xs">
                    {chat.title}
                  </div>
                  <div className="text-xs" style={{color: theme.colors.secondaryText}}>
                    {chat.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col" style={{backgroundColor: theme.colors.primaryBackground, color: theme.colors.primaryText}}>
          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
            {currentChat?.messages.length === 0 ? (
              <div className="space-y-4">
                <div style={{color: theme.colors.primaryText}}>
                  Welcome to Logits.
                </div>
                <div style={{color: theme.colors.secondaryText}}>
                  Type your message and press Enter to chat with AI
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentChat?.messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs" style={{color: theme.colors.secondaryText}}>
                      <span>{message.role === 'user' ? 'You' : 'AI'}</span>
                      <span>•</span>
                      <span>{message.role === 'assistant' && message.content === '' && isLoading ? 'typing...' : formatTimestamp(message.timestamp)}</span>
                    </div>
                    <div 
                      className="whitespace-pre-wrap"
                      style={{
                        color: theme.colors.primaryText,
                        paddingLeft: '0.5rem',
                        borderLeft: `2px solid ${theme.colors.border}`
                      }}
                    >
                      {message.content ? (
                        message.role === 'assistant' ? (
                          <div className="markdown-content">
                            <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          message.content
                        )
                      ) : (message.role === 'assistant' && isLoading ? '●●●' : '')}
                    </div>
                  </div>
                ))}
                {isLoading && currentChat?.messages.length === 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs" style={{color: theme.colors.secondaryText}}>
                      <span>AI</span>
                      <span>•</span>
                      <span>typing...</span>
                    </div>
                    <div 
                      className="whitespace-pre-wrap"
                      style={{
                        color: theme.colors.secondaryText,
                        paddingLeft: '0.5rem',
                        borderLeft: `2px solid ${theme.colors.border}`
                      }}
                    >
                      ●●●
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4" style={{borderTop: `1px solid ${theme.colors.border}`}}>
            <div className="flex items-center gap-2">
              <span style={{color: theme.colors.primaryText}}>$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none terminal-input"
                style={{
                  color: theme.colors.primaryText,
                  backgroundColor: 'transparent'
                }}
              />
              {isLoading && (
                <span className="text-xs" style={{color: theme.colors.secondaryText}}>
                  Sending...
                </span>
              )}
            </div>
          </form>
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={apiKeyModalOpen} 
        onClose={() => setApiKeyModalOpen(false)} 
      />
    </div>
  )
} 