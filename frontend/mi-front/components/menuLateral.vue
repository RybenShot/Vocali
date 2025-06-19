<template>
  <transition name="slide">
    <aside
      v-if="visible"
      class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 flex flex-col"
    >
      <!-- Header -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Menú</h2>
          <!-- Botón X para cerrar -->
          <button
            @click="closeSidebar"
            class="p-1 rounded hover:bg-gray-100"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 p-4 overflow-y-auto">
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/"
              class="flex items-center px-3 py-2 rounded hover:bg-green-100 transition-colors"
              @click="closeSidebar"
            >
              <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/historial"
              class="flex items-center px-3 py-2 rounded hover:bg-green-100 transition-colors"
              @click="closeSidebar"
            >
              <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historial
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Footer con cerrar -->
      <div class="p-4 border-t">
        <button
          @click="closeSidebar"
          class="flex items-center w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesion
        </button>
      </div>
    </aside>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sidebar',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    closeSidebar() {
      this.$emit('close')
    }
  }
})
</script>

<style scoped>
/* Transición slide-in desde la izquierda */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Asegurar que el sidebar esté por encima del contenido */
aside {
  top: 0;
  bottom: 0;
}
</style>