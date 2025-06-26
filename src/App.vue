<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading...</p>
      </div>
    </div>
    
    <AuthForm v-else-if="!isAuthenticated" />
    
    <KanbanBoard v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthForm from '@/components/AuthForm.vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, loading, initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>