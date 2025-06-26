<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="handleBackdropClick"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-up" @click.stop>
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Edit Task' : 'Create New Task' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              v-model="formData.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div v-if="!isEdit">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { Task } from '@/types'

interface Props {
  isOpen: boolean
  task?: Task
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>]
  update: [taskId: string, updates: Partial<Task>]
}>()

const isEdit = computed(() => !!props.task)

const formData = ref({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  status: 'todo' as Task['status']
})

watch(() => props.task, (task) => {
  if (task) {
    formData.value = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo'
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (isEdit.value && props.task) {
    emit('update', props.task.id, formData.value)
  } else {
    emit('save', formData.value)
  }
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>