import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Chat, Message } from '@/types/chat'
import { useAuth } from '@/contexts/AuthContext'

export function useDatabase() {
  const { isAuthenticated, user } = useAuth()

  // Save chat to database (only if it has messages)
  const saveChat = useCallback(async (chat: Chat): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) return null
    
    // Don't save empty chats to database
    if (chat.messages.length === 0) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from('chats')
        .upsert({
          id: chat.id.toString(),
          user_id: user.id,
          title: chat.title,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving chat:', error)
        throw error
      }
      return data.id
    } catch (error) {
      console.error('Error saving chat:', error)
      return null
    }
  }, [isAuthenticated, user?.id])

  // Save message to database
  const saveMessage = useCallback(async (chatId: string, message: Message): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          id: message.id,
          chat_id: chatId,
          role: message.role,
          content: message.content,
          model_name: message.modelName,
          created_at: message.timestamp.toISOString()
        })

      if (error) {
        console.error('Error saving message:', error)
        throw error
      }
      return true
    } catch (error) {
      console.error('Error saving message:', error)
      return false
    }
  }, [isAuthenticated, user?.id])

  // Load user's chats from database
  const loadChats = useCallback(async (): Promise<Chat[]> => {
    if (!isAuthenticated || !user?.id) {
      return []
    }
    
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (chatsError) {
        console.error('Error loading chats from database:', chatsError)
        throw chatsError
      }

      const chats: Chat[] = []
      
      for (const dbChat of chatsData) {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', dbChat.id)
          .order('created_at', { ascending: true })

        if (messagesError) {
          console.error('Error loading messages for chat', dbChat.id, ':', messagesError)
          throw messagesError
        }

        const messages: Message[] = messagesData.map(dbMsg => ({
          id: dbMsg.id,
          role: dbMsg.role as 'user' | 'assistant',
          content: dbMsg.content,
          timestamp: new Date(dbMsg.created_at),
          modelName: dbMsg.model_name || undefined
        }))

        chats.push({
          id: parseInt(dbChat.id),
          title: dbChat.title,
          timestamp: new Date(dbChat.created_at).toLocaleString(),
          messages
        })
      }

      return chats
    } catch (error) {
      console.error('Error loading chats:', error)
      return []
    }
  }, [isAuthenticated, user?.id])

  // Delete chat from database
  const deleteChat = useCallback(async (chatId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting chat:', error)
      return false
    }
  }, [isAuthenticated, user?.id])

  // Update message content in database
  const updateMessage = useCallback(async (messageId: string, content: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false

    try {
      const { error } = await supabase
        .from('messages')
        .update({ content })
        .eq('id', messageId)

      if (error) {
        console.error('Error updating message:', error)
        throw error
      }
      return true
    } catch (error) {
      console.error('Error updating message:', error)
      return false
    }
  }, [isAuthenticated, user?.id])

  return {
    saveChat,
    saveMessage,
    loadChats,
    deleteChat,
    updateMessage,
    isAuthenticated
  }
} 