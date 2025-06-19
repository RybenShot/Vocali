<template>
  <!-- Navegación fija superior -->
  <nav class="fixed top-0 left-0 right-0 bg-green-600 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Botón de menú (izquierda) -->
        <button
          @click="toggleMenu"
          class="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
        >
          <span class="sr-only">Open menu</span>
          <!-- Icono de hamburguesa -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo centrado -->
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-center">
          <p class="text-xl font-bold">Vocalid</p>
        </div>

        <!-- Botón de login (derecha) -->
        <div class="flex items-center">
          <button
            class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-medium rounded-md transition"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'navegacion',
  data() {
    return {
      menuOpen: false,
    }
  },
  emits: ['toggle-sidebar'],
  methods: {
    toggleMenu() {
        this.$emit('toggle-sidebar')
        console.log('Menu abierto:', this.menuOpen)
        
    }
  }
}
</script>
