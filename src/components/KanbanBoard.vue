<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">Task Board</h1>
          <span class="text-sm text-gray-500">{{ totalTasks }} tasks</span>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="showTaskModal = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Add Task
          </button>
          <button
            @click="handleLogout"
            class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Board -->
    <div class="flex-1 overflow-x-auto bg-gray-50">
      <div class="flex h-full min-w-max">
        <div
          v-for="column in columns"
          :key="column.id"
          class="flex-shrink-0 w-80 p-4"
        >
          <div class="bg-gray-100 rounded-lg h-full flex flex-col">
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="font-semibold text-gray-900">{{ column.title }}</h2>
                <span class="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {{ column.tasks.length }}
                </span>
              </div>
            </div>
            
            <div
              class="flex-1 p-4 space-y-3 overflow-y-auto"
              @dragover.prevent
              @drop="handleDrop($event, column.status)"
            >
              <TaskCard
                v-for="task in column.tasks"
                :key="task.id"
                :task="task"
                draggable="true"
                @dragstart="handleDragStart($event, task)"
                @edit="handleEditTask"
                @delete="handleDeleteTask"
                class="animate-fade-in"
              />
              
              <div
                v-if="column.tasks.length === 0"
                class="text-center py-8 text-gray-400"
              >
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <PlusIcon class="w-6 h-6" />
                </div>
                <p class="text-sm">No tasks yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :is-open="showTaskModal"
      :task="editingTask"
      @close="closeTaskModal"
      @save="handleSaveTask"
      @update="handleUpdateTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'
import { useTasks } from '@/composables/useTasks'
import { useAuth } from '@/composables/useAuth'
import type { Task } from '@/types'

const { columns, addTask, updateTask, deleteTask, moveTask, fetchTasks } = useTasks()
const { logout } = useAuth()

const showTaskModal = ref(false)
const editingTask = ref<Task | undefined>(undefined)
const draggedTask = ref<Task | null>(null)

const totalTasks = computed(() => {
  return columns.value.reduce((total, column) => total + column.tasks.length, 0)
})

onMounted(() => {
  fetchTasks()
})

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleSaveTask = (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
  addTask(taskData)
}

const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
  updateTask(taskId, updates)
}

const handleEditTask = (task: Task) => {
  editingTask.value = task
  showTaskModal.value = true
}

const handleDeleteTask = (taskId: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(taskId)
  }
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = undefined
}

const handleDragStart = (event: DragEvent, task: Task) => {
  draggedTask.value = task
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDrop = (event: DragEvent, newStatus: Task['status']) => {
  event.preventDefault()
  if (draggedTask.value && draggedTask.value.status !== newStatus) {
    moveTask(draggedTask.value.id, newStatus)
  }
  draggedTask.value = null
}
</script>