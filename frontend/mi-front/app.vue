<!-- app.vue -->
<template>
  <div>
    <Navegacion @toggle-sidebar="toggleSidebar"/>
    <menuLateral :visible="sidebarVisible" @close="closeSidebar" />

    <!-- Overlay para cerrar el sidebar al hacer click fuera -->
    <div 
      v-if="sidebarVisible" 
      @click="closeSidebar"
      class="fixed inset-0 bg-gray-900 opacity-30 z-20"
    ></div>

    <NuxtPage />  <!-- aquí renderiza la página actual -->
    <PiePagina />
  </div>
</template>

<script lang="ts">

export default {
  name: 'App',
  data() {
    return {
      sidebarVisible: false
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible
      console.log('Sidebar visible:', this.sidebarVisible)
    },
    closeSidebar() {
      this.sidebarVisible = false
    }
  }
}
</script>
