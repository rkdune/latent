import { useState, useCallback, useEffect } from 'react'
import { Message, Chat } from '@/types/chat'
import { useModel } from '@/contexts/ModelContext'
import { useApiKey } from '@/contexts/ApiKeyContext'
import { useDatabase } from './useDatabase'

export function useChat() {
  const { selectedModel } = useModel()
  const { apiKey } = useApiKey()
  const { saveChat, saveMessage, loadChats, deleteChat: dbDeleteChat, updateMessage: updateMessageInDB, isAuthenticated } = useDatabase()
  
  // All chats from database (for sidebar)
  const [allChats, setAllChats] = useState<Chat[]>([])
  
  // Currently active tabs (subset of allChats)
  const [activeTabs, setActiveTabs] = useState<Chat[]>([
    { 
      id: 1, 
      title: "New Chat", 
      timestamp: "now",
      messages: []
    }
  ])
  
  const [activeChat, setActiveChat] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedFromDB, setHasLoadedFromDB] = useState(false)

  // Load chats from database when user signs in
  useEffect(() => {
    const loadUserChats = async () => {
      if (isAuthenticated && !hasLoadedFromDB) {
        try {
          const dbChats = await loadChats()
          
          if (dbChats.length > 0) {
            setAllChats(dbChats)
            // Start with the most recent chat as an active tab
            setActiveTabs([dbChats[0]])
            setActiveChat(dbChats[0].id)
          } else {
            // If no chats in database, create a default one (but don't save it until it has messages)
            const defaultChat: Chat = {
              id: Date.now(),
              title: "New Chat",
              timestamp: "now",
              messages: []
            }
            setAllChats([defaultChat])
            setActiveTabs([defaultChat])
            setActiveChat(defaultChat.id)
            // Don't save empty chat to database
          }
          setHasLoadedFromDB(true)
        } catch (error) {
          console.error('Error loading chats:', error)
        }
      } else if (!isAuthenticated && hasLoadedFromDB) {
        // User signed out, reset to default state
        const defaultChat: Chat = {
          id: Date.now(),
          title: "New Chat",
          timestamp: "now",
          messages: []
        }
        setAllChats([defaultChat])
        setActiveTabs([defaultChat])
        setActiveChat(defaultChat.id)
        setHasLoadedFromDB(false)
      }
    }

    loadUserChats()
  }, [isAuthenticated, hasLoadedFromDB, loadChats, saveChat])

  const getCurrentChat = useCallback(() => {
    return activeTabs.find(chat => chat.id === activeChat)
  }, [activeTabs, activeChat])

  const addMessage = useCallback((chatId: number, message: Message) => {
    // Update both activeTabs and allChats
    const updateChats = (chats: Chat[]) =>
      chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    
    setActiveTabs(updateChats)
    setAllChats(updateChats)
    
    // Save to database if authenticated
    if (isAuthenticated) {
      saveMessage(chatId.toString(), message)
    }
  }, [isAuthenticated, saveMessage])

  const updateMessage = useCallback((chatId: number, messageId: string, content: string) => {
    // Update both activeTabs and allChats
    const updateChats = (chats: Chat[]) =>
      chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages: chat.messages.map(msg => 
                msg.id === messageId 
                  ? { ...msg, content }
                  : msg
              )
            }
          : chat
      )
    
    setActiveTabs(updateChats)
    setAllChats(updateChats)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const currentChat = getCurrentChat()
    if (!currentChat) return

    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    addMessage(currentChat.id, userMessage)

    // Save chat to database now that it has messages (if this is the first message)
    if (isAuthenticated && currentChat.messages.length === 0) {
      const chatToSave = {
        ...currentChat,
        messages: [userMessage] // Include the message we just added
      }
      saveChat(chatToSave)
    }

    // Update chat title if it's the first message
    if (currentChat.messages.length === 0) {
      const newTitle = content.length > 30 ? content.substring(0, 30) + '...' : content
      
      const updateChatsTitle = (chats: Chat[]) =>
        chats.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, title: newTitle }
            : chat
        )
      
      setActiveTabs(updateChatsTitle)
      setAllChats(updateChatsTitle)
      
      // We'll save the chat to database after the first message is added below
    }

    // Create AI message placeholder  
    const aiMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      modelName: selectedModel.name
    }

    addMessage(currentChat.id, aiMessage)

    try {
      let accumulatedContent = ''

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'x-api-key': apiKey }),
          'x-app-name': 'Logits'
        },
        body: JSON.stringify({
          messages: [...currentChat.messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel.endpoint,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            
            if (data.content) {
              accumulatedContent += data.content
              updateMessage(currentChat.id, aiMessageId, accumulatedContent)
            }
            
            if (data.done) {
              // Update final message content in database
              if (isAuthenticated && accumulatedContent.trim()) {
                updateMessageInDB(aiMessageId, accumulatedContent)
              }
              setIsLoading(false)
              return
            }
            
            if (data.error) {
              throw new Error(data.error)
            }
          } catch (parseError) {
            console.warn('Failed to parse streaming data:', parseError)
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = 'Sorry, I encountered an error. Please try again.'
      // Update the AI message with error content
      updateMessage(currentChat.id, aiMessageId, errorMessage)
      // Update in database as well
      if (isAuthenticated) {
        updateMessageInDB(aiMessageId, errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentChat, addMessage, updateMessage, isLoading, selectedModel, apiKey, isAuthenticated, saveChat, updateMessageInDB])

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now(),
      title: `Chat ${allChats.length + 1}`,
      timestamp: "now",
      messages: []
    }
    
    // Add to both allChats and activeTabs
    setAllChats(prev => [...prev, newChat])
    setActiveTabs(prev => [...prev, newChat])
    setActiveChat(newChat.id)
    
    // Don't save empty chat to database - it will be saved when first message is added
  }, [allChats])

  const openChatInTab = useCallback((chatId: number) => {
    // Find the chat in allChats
    const chatToOpen = allChats.find(chat => chat.id === chatId)
    if (!chatToOpen) return

    // Check if it's already in activeTabs
    const isAlreadyOpen = activeTabs.some(tab => tab.id === chatId)
    
    if (!isAlreadyOpen) {
      // Add to activeTabs
      setActiveTabs(prev => [...prev, chatToOpen])
    }
    
    // Set as active
    setActiveChat(chatId)
  }, [allChats, activeTabs])

  const closeTab = useCallback((chatId: number) => {
    // Remove from activeTabs only (keep in allChats)
    const newActiveTabs = activeTabs.filter(tab => tab.id !== chatId)
    setActiveTabs(newActiveTabs)
    
    if (activeChat === chatId && newActiveTabs.length > 0) {
      setActiveChat(newActiveTabs[0].id)
    } else if (newActiveTabs.length === 0) {
      // If no tabs left, create a new one
      const newChat: Chat = {
        id: Date.now(),
        title: "New Chat",
        timestamp: "now",
        messages: []
      }
      setAllChats(prev => [...prev, newChat])
      setActiveTabs([newChat])
      setActiveChat(newChat.id)
      // Don't save empty chat to database - it will be saved when first message is added
    }
  }, [activeTabs, activeChat])

  const deleteChat = useCallback((chatId: number) => {
    // Permanently delete from both allChats and activeTabs
    setAllChats(prev => prev.filter(c => c.id !== chatId))
    setActiveTabs(prev => prev.filter(c => c.id !== chatId))
    
    if (activeChat === chatId) {
      const remainingTabs = activeTabs.filter(c => c.id !== chatId)
      if (remainingTabs.length > 0) {
        setActiveChat(remainingTabs[0].id)
      } else {
        // If no tabs left, create a new one
        const newChat: Chat = {
          id: Date.now(),
          title: "New Chat",
          timestamp: "now",
          messages: []
        }
        setAllChats(prev => [...prev, newChat])
        setActiveTabs([newChat])
        setActiveChat(newChat.id)
        // Don't save empty chat to database - it will be saved when first message is added
      }
    }
    
    // Delete from database if authenticated
    if (isAuthenticated) {
      dbDeleteChat(chatId.toString())
    }
      }, [activeTabs, activeChat, isAuthenticated, dbDeleteChat])

  return {
    // For tabs
    chats: activeTabs,
    activeChat,
    setActiveChat,
    // For sidebar
    allChats,
    openChatInTab,
    // Common functions
    getCurrentChat,
    sendMessage,
    createNewChat,
    closeTab,
    deleteChat,
    isLoading
  }
} 