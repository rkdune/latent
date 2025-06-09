import { useState, useCallback } from 'react'
import { Message, Chat } from '@/types/chat'

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([
    { 
      id: 1, 
      title: "New Chat", 
      timestamp: "now",
      messages: []
    }
  ])
  const [activeChat, setActiveChat] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const getCurrentChat = useCallback(() => {
    return chats.find(chat => chat.id === activeChat)
  }, [chats, activeChat])

  const addMessage = useCallback((chatId: number, message: Message) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    )
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const currentChat = getCurrentChat()
    if (!currentChat) return

    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    addMessage(currentChat.id, userMessage)

    // Update chat title if it's the first message
    if (currentChat.messages.length === 0) {
      const newTitle = content.length > 30 ? content.substring(0, 30) + '...' : content
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, title: newTitle }
            : chat
        )
      )
    }

    try {
      // Prepare messages for API
      const allMessages = [...currentChat.messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: allMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      addMessage(currentChat.id, aiMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      addMessage(currentChat.id, errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentChat, addMessage, isLoading])

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      timestamp: "now",
      messages: []
    }
    setChats([...chats, newChat])
    setActiveChat(newChat.id)
  }, [chats])

  const deleteChat = useCallback((chatId: number) => {
    const newChats = chats.filter(c => c.id !== chatId)
    setChats(newChats)
    if (activeChat === chatId && newChats.length > 0) {
      setActiveChat(newChats[0].id)
    }
  }, [chats, activeChat])

  return {
    chats,
    activeChat,
    setActiveChat,
    getCurrentChat,
    sendMessage,
    createNewChat,
    deleteChat,
    isLoading
  }
} 