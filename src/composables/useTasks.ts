import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Task, Column } from '@/types'
import { useAuth } from './useAuth'

const tasks = ref<Task[]>([])
const loading = ref(false)

export const useTasks = () => {
  const { user } = useAuth()

  const columns = computed<Column[]>(() => [
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      tasks: tasks.value.filter((task: Task) => task.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      tasks: tasks.value.filter((task: Task) => task.status === 'in-progress')
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      tasks: tasks.value.filter((task: Task) => task.status === 'done')
    }
  ])

  const fetchTasks = async () => {
    if (!user.value) return

    try {
      loading.value = true
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('created_by', user.value.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      tasks.value = data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      // Fallback to demo data if database is not set up
      tasks.value = [
        {
          id: '1',
          title: 'Setup project structure',
          description: 'Create the basic project structure and components',
          status: 'done',
          priority: 'high',
          created_at: new Date('2024-01-01').toISOString(),
          updated_at: new Date('2024-01-01').toISOString(),
          created_by: user.value?.id || 'demo-user'
        },
        {
          id: '2',
          title: 'Implement authentication',
          description: 'Add Supabase authentication with login and register',
          status: 'done',
          priority: 'medium',
          created_at: new Date('2024-01-02').toISOString(),
          updated_at: new Date('2024-01-02').toISOString(),
          created_by: user.value?.id || 'demo-user'
        },
        {
          id: '3',
          title: 'Create Kanban board',
          description: 'Build the main Kanban board with drag and drop functionality',
          status: 'in-progress',
          priority: 'high',
          created_at: new Date('2024-01-03').toISOString(),
          updated_at: new Date('2024-01-03').toISOString(),
          created_by: user.value?.id || 'demo-user'
        },
        {
          id: '4',
          title: 'Add task management',
          description: 'Implement CRUD operations for tasks',
          status: 'in-progress',
          priority: 'medium',
          created_at: new Date('2024-01-04').toISOString(),
          updated_at: new Date('2024-01-04').toISOString(),
          created_by: user.value?.id || 'demo-user'
        },
        {
          id: '5',
          title: 'Responsive design',
          description: 'Make the app fully responsive for mobile and desktop',
          status: 'todo',
          priority: 'medium',
          created_at: new Date('2024-01-05').toISOString(),
          updated_at: new Date('2024-01-05').toISOString(),
          created_by: user.value?.id || 'demo-user'
        },
        {
          id: '6',
          title: 'Add team collaboration',
          description: 'Implement real-time updates and team member management',
          status: 'todo',
          priority: 'low',
          created_at: new Date('2024-01-06').toISOString(),
          updated_at: new Date('2024-01-06').toISOString(),
          created_by: user.value?.id || 'demo-user'
        }
      ]
    } finally {
      loading.value = false
    }
  }

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          created_by: user.value.id
        }])
        .select()
        .single()

      if (error) throw error
      
      if (data) {
        tasks.value.unshift(data)
      }
    } catch (error) {
      console.error('Error adding task:', error)
      // Fallback for demo mode
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user.value.id
      }
      tasks.value.unshift(newTask)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)

      if (error) throw error

      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = {
          ...tasks.value[taskIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error updating task:', error)
      // Fallback for demo mode
      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = {
          ...tasks.value[taskIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      // Fallback for demo mode
      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1)
      }
    }
  }

  const moveTask = async (taskId: string, newStatus: Task['status']) => {
    await updateTask(taskId, { status: newStatus })
  }

  return {
    tasks: computed(() => tasks.value),
    columns,
    loading: computed(() => loading.value),
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  }
}
