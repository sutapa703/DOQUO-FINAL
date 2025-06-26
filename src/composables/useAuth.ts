import type { User } from '@/types'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
supabase.auth.onAuthStateChange(() => {
  // remove unused event/session if not used
})

const user = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    try {
      error.value = null
      loading.value = true
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError
      
      user.value = data.user
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    try {
      error.value = null
      loading.value = true
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError
      
      user.value = data.user
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError
      
      user.value = null
    } catch (err: any) {
      error.value = err.message || 'Logout failed'
      throw err
    }
  }

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
      
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
        loading.value = false
      })
    } catch (err: any) {
      console.error('Auth initialization error:', err)
      loading.value = false
    }
  }

  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isAuthenticated,
    login,
    register,
    logout,
    initAuth
  }
}
