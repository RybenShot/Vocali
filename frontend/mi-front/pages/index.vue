<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="text-center w-full max-w-md">
      <!-- Botón transcribir -->
      <section v-if="!isTranscribing">
        <p class="text-2xl text-gray-800 mb-6">Nueva transcripción</p>
        <button @click="startTranscribing"
          :disabled="isConnecting"
          class="inline-flex items-center justify-center p-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full shadow-lg transition-all duration-200">
          <span class="sr-only">Iniciar transcripción</span>
          <Icon v-if="!isConnecting" name="mdi:microphone" style="color: white" size="50px" class="h-10 w-10" />
          <div v-else class="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </button>
        <p v-if="isConnecting" class="text-sm text-gray-600 mt-2">Conectando...</p>
      </section>

      <!-- Transcripción -->
      <section v-else>
        <div class="flex items-center justify-between mb-4">
          <p class="text-2xl text-gray-800">Transcribiendo...</p>
          <button @click="stopTranscribing"
            class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200">
            <Icon name="mdi:stop" style="color: white" size="24px" />
          </button>
        </div>
        
        <!-- Indicador de escucha -->
        <div class="flex items-center justify-center mb-4">
          <div class="flex space-x-1">
            <div class="w-2 h-8 bg-green-400 rounded animate-pulse"></div>
            <div class="w-2 h-6 bg-green-400 rounded animate-pulse" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-10 bg-green-400 rounded animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-6 bg-green-400 rounded animate-pulse" style="animation-delay: 0.3s"></div>
            <div class="w-2 h-8 bg-green-400 rounded animate-pulse" style="animation-delay: 0.4s"></div>
          </div>
        </div>

        <!-- Transcripción parcial -->
        <div v-if="partialTranscript" class="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p class="text-sm text-yellow-700 mb-1">Transcribiendo:</p>
          <p class="text-gray-600 italic">{{ partialTranscript }}</p>
        </div>

        <!-- Área de transcripción final -->
        <textarea
          readonly
          v-model="transcriptionText"
          class="w-full h-40 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="Aquí aparecerá la transcripción..."
        />
        
        <!-- Botones de acción -->
        <div class="flex space-x-2 mt-4">
          <button @click="clearTranscription"
            class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-200">
            Limpiar
          </button>
          <button @click="copyToClipboard"
            :disabled="!transcriptionText"
            class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-all duration-200">
            Copiar
          </button>
        </div>
      </section>

      <!-- Mensajes de error -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
        <p class="text-red-700">{{ error }}</p>
        <button @click="error = ''" class="text-red-500 text-sm mt-2 hover:underline">
          Cerrar
        </button>
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
        <p class="text-green-700">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onUnmounted } from 'vue'

const { 
  startRealTimeTranscription, 
  startAudioCapture, 
  stopTranscription 
} = useSpeechmaticsRealTime()

// Estados reactivos
const isTranscribing = ref(false)
const isConnecting = ref(false)
const transcriptionText = ref('')
const partialTranscript = ref('')
const error = ref('')
const successMessage = ref('')

// Función para iniciar la transcripción
const startTranscribing = async () => {
  try {
    isConnecting.value = true
    error.value = ''
    transcriptionText.value = ''
    partialTranscript.value = ''
    
    // Verificar permisos del micrófono
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Tu navegador no soporta acceso al micrófono')
    }

    // Iniciar transcripción en tiempo real
    await startRealTimeTranscription(
      (text, isFinal) => {
        if (isFinal) {
          // Transcripción final - agregar al texto principal
          if (transcriptionText.value) {
            transcriptionText.value += ' ' + text
          } else {
            transcriptionText.value = text
          }
          partialTranscript.value = ''
        } else {
          // Transcripción parcial
          partialTranscript.value = text
        }
      },
      (err) => {
        console.error('Error en transcripción:', err)
        error.value = getErrorMessage(err)
        stopTranscribing()
      }
    )
    
    // Iniciar captura de audio
    await startAudioCapture()
    
    isTranscribing.value = true
    isConnecting.value = false
    
  } catch (err) {
    console.error('Error iniciando transcripción:', err)
    error.value = getErrorMessage(err)
    isConnecting.value = false
  }
}

// Función para detener la transcripción
const stopTranscribing = () => {
  stopTranscription()
  isTranscribing.value = false
  isConnecting.value = false
  partialTranscript.value = ''
}

// Función para limpiar la transcripción
const clearTranscription = () => {
  transcriptionText.value = ''
  partialTranscript.value = ''
}

// Función para copiar al portapapeles
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(transcriptionText.value)
    successMessage.value = 'Texto copiado al portapapeles'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = 'Error al copiar al portapapeles'
  }
}

// Función para obtener mensajes de error amigables
const getErrorMessage = (err: any): string => {
  if (typeof err === 'string') return err
  
  if (err.name === 'NotAllowedError') {
    return 'Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.'
  } else if (err.name === 'NotFoundError') {
    return 'No se encontró ningún micrófono en tu dispositivo.'
  } else if (err.name === 'NotSupportedError') {
    return 'Tu navegador no soporta la grabación de audio.'
  } else if (err.name === 'SecurityError') {
    return 'Error de seguridad. Asegúrate de estar usando HTTPS.'
  }
  
  return err.message || 'Error desconocido durante la transcripción.'
}

// Limpiar recursos al desmontar el componente
onUnmounted(() => {
  if (isTranscribing.value) {
    stopTranscribing()
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Personalizar el scrollbar del textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>