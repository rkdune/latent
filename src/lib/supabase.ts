import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DbChat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface DbMessage {
  id: string
  chat_id: string
  role: 'user' | 'assistant'
  content: string
  model_name?: string
  created_at: string
} 