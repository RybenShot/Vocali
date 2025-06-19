<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-8 px-6">
    <div class="max-w-4xl mx-auto">
      
      <!-- Header -->
      <section class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Historial de Transcripciones</h1>
        <p class="text-gray-600">Revisa tus transcripciones anteriores</p>
      </section>

      <!-- Tabla de historial -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <!-- Header de la tabla -->
            <thead class="bg-green-600 text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Transcripciones
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            
            <!-- Cuerpo de la tabla -->
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="(item, index) in historial" 
                :key="index"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Columna Fecha -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ item.fecha }}</div>
                      <div class="text-sm text-gray-500">{{ item.hora }}</div>
                    </div>
                  </div>
                </td>
                
                <!-- Columna Transcripciones -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 leading-relaxed">
                    {{ item.transcripcion }}
                  </div>
                  <div class="mt-2 flex items-center text-xs text-gray-500">
                    <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duración: {{ item.duracion }}
                  </div>
                </td>
                
                <!-- Columna Acciones -->
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button 
                      @click="verDetalle(item)"
                      class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                    >
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
                    <button 
                      @click="eliminar(index)"
                      class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Estado vacío -->
        <div v-if="historial.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay transcripciones</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza grabando tu primera transcripción.</p>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Transcripciones</p>
              <p class="text-2xl font-semibold text-gray-900">{{ historial.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tiempo Total</p>
              <p class="text-2xl font-semibold text-gray-900">{{ tiempoTotal }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Esta Semana</p>
              <p class="text-2xl font-semibold text-gray-900">{{ transcripcionesSemana }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Historial',
  data() {
    return {
      // Base de datos improvisada
      historial: [
        {
          fecha: '19 Jun 2025',
          hora: '14:30',
          transcripcion: 'Reunión con el equipo de desarrollo para revisar las nuevas funcionalidades del sistema de transcripción automática.',
          duracion: '5:23 min'
        },
        {
          fecha: '18 Jun 2025', 
          hora: '09:15',
          transcripcion: 'Conferencia sobre inteligencia artificial aplicada al procesamiento de lenguaje natural. Muy interesante.',
          duracion: '12:45 min'
        },
        {
          fecha: '17 Jun 2025',
          hora: '16:45', 
          transcripcion: 'Notas personales sobre el proyecto Vocalid. Recordar implementar la función de exportar transcripciones.',
          duracion: '3:12 min'
        },
        {
          fecha: '16 Jun 2025',
          hora: '11:20',
          transcripcion: 'Entrevista telefónica con cliente potencial. Interesado en nuestros servicios de transcripción en tiempo real.',
          duracion: '8:37 min'
        }
      ]
    }
  },
  computed: {
    // Calcular tiempo total aproximado
    tiempoTotal() {
      const totalMinutos = this.historial.reduce((total, item) => {
        const minutos = parseInt(item.duracion.split(':')[0]) * 60 + parseInt(item.duracion.split(':')[1])
        return total + minutos
      }, 0)
      const horas = Math.floor(totalMinutos / 60)
      const mins = totalMinutos % 60
      return `${horas}h ${mins}m`
    },
    
    // Transcripciones de esta semana (simulado)
    transcripcionesSemana() {
      return 3
    }
  },
  methods: {
    verDetalle(item) {
      alert(`Transcripción del ${item.fecha}:\n\n"${item.transcripcion}"`)
      // Aquí podrías abrir un modal o navegar a una página de detalle
    },
    
    eliminar(index) {
      if (confirm('¿Estás seguro de que quieres eliminar esta transcripción?')) {
        this.historial.splice(index, 1)
      }
    }
  }
}
</script>