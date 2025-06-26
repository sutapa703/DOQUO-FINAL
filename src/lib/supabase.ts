import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'todo' | 'in-progress' | 'done'
          priority: 'low' | 'medium' | 'high'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          status?: 'todo' | 'in-progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'todo' | 'in-progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}