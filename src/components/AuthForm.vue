<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900">
            {{ isLogin ? 'Welcome back' : 'Create account' }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ isLogin ? 'Sign in to your account' : 'Sign up for a new account' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>

          <div class="text-center">
            <button
              type="button"
              @click="isLogin = !isLogin"
              class="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {{ isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '@/composables/useAuth'

const { login, register, loading, error } = useAuth()

const isLogin = ref(true)
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
    } else {
      await register(email.value, password.value)
    }
  } catch (err) {
    // Error is handled by the composable
  }
}
</script>