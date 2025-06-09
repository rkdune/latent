export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Chat {
  id: number
  title: string
  timestamp: string
  messages: Message[]
}

export interface ChatResponse {
  message: string
  error?: string
} 