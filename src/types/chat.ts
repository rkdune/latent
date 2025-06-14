export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  modelName?: string // Optional field for assistant messages
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