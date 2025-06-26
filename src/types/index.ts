export interface User {
  id: string
  email: string
  user_metadata?: {
    displayName?: string
  }
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  created_by: string
  created_at: string
  updated_at: string
}

export interface Column {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
  tasks: Task[]
}
