<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
        {{ task.title }}
      </h3>
      <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="$emit('edit', task)"
          class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <PencilIcon class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <p class="text-xs text-gray-600 mb-3 line-clamp-2">
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="priorityClasses[task.priority]"
        >
          {{ task.priority }}
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <UserIcon class="w-4 h-4 text-gray-500" />
        </div>
        <span class="text-xs text-gray-500">
          {{ formatDate(task.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/vue/24/outline'
import type { Task } from '@/types'

interface Props {
  task: Task
}

defineProps<Props>()
defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
}>()

const priorityClasses = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>