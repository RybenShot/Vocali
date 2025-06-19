// @ts-nocheck
// composables/useSpeechmaticsRealTime.ts
export const useSpeechmaticsRealTime = () => {
  let socket: WebSocket | null = null
  let mediaRecorder: MediaRecorder | null = null
  let audioContext: AudioContext | null = null
  let processor: ScriptProcessorNode | null = null
  let mediaStream: MediaStream | null = null

  const getToken = async () => {
    try {
      const response = await $fetch('/api/speechmatics-token', {
        method: 'POST'
      })
      return response.data.token
    } catch (error) {
      console.error('Error obteniendo token:', error)
      throw new Error('No se pudo obtener el token de autenticación')
    }
  }

  const startRealTimeTranscription = async (
    onTranscript: (text: string, isFinal: boolean) => void,
    onError?: (error: any) => void
  ) => {
    try {
      // 1. Obtener token JWT
      const token = await getToken()
      
      // 2. Establecer conexión WebSocket
      const wsUrl = `wss://eu2.rt.speechmatics.com/v2/es`
      socket = new WebSocket(wsUrl)
      
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('No se pudo crear la conexión WebSocket'))
          return
        }

        socket.onopen = () => {
          console.log('WebSocket conectado')
          
          // Enviar mensaje de autenticación
          const authMessage = {
            message: 'Authenticate',
            jwt: token
          }
          socket?.send(JSON.stringify(authMessage))
        }
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log('Mensaje recibido:', data.message)
            
            switch (data.message) {
              case 'Authenticated':
                console.log('Autenticado correctamente')
                startRecognition()
                resolve(true)
                break
                
              case 'AddPartialTranscript':
                // Transcripción parcial (mientras hablas)
                if (data.transcript && data.transcript.length > 0) {
                  onTranscript(data.transcript, false)
                }
                break
                
              case 'AddTranscript':
                // Transcripción final (cuando terminas de hablar)
                if (data.transcript && data.transcript.length > 0) {
                  onTranscript(data.transcript, true)
                }
                break
                
              case 'Error':
                console.error('Error de Speechmatics:', data)
                onError?.(new Error(data.reason || 'Error del servicio de transcripción'))
                break

              case 'Warning':
                console.warn('Advertencia de Speechmatics:', data)
                break
            }
          } catch (parseError) {
            console.error('Error parseando mensaje:', parseError)
          }
        }
        
        socket.onerror = (error) => {
          console.error('Error WebSocket:', error)
          const errorMsg = new Error('Error de conexión con el servicio de transcripción')
          onError?.(errorMsg)
          reject(errorMsg)
        }
        
        socket.onclose = (event) => {
          console.log('WebSocket desconectado:', event.code, event.reason)
          if (event.code !== 1000) { // 1000 es cierre normal
            const errorMsg = new Error('Conexión cerrada inesperadamente')
            onError?.(errorMsg)
          }
        }

        // Timeout para la conexión
        setTimeout(() => {
          if (socket && socket.readyState !== WebSocket.OPEN) {
            reject(new Error('Timeout conectando al servicio'))
          }
        }, 10000)
      })
      
    } catch (error) {
      console.error('Error iniciando transcripción:', error)
      onError?.(error)
      throw error
    }
  }

  const startRecognition = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket no está conectado')
    }

    const startMessage = {
      message: 'StartRecognition',
      audio_format: {
        type: 'raw',
        encoding: 'pcm_f32le',
        sample_rate: 16000
      },
      transcription_config: {
        language: 'es', // Cambiar a 'en' para inglés
        enable_partials: true,
        max_delay: 2,
        max_delay_mode: 'flexible'
      }
    }
    
    socket.send(JSON.stringify(startMessage))
    console.log('Reconocimiento iniciado')
  }

  const startAudioCapture = async () => {
    try {
      // Obtener acceso al micrófono
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      // Crear contexto de audio
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      })
      
      const source = audioContext.createMediaStreamSource(mediaStream)
      
      // Crear procesador para convertir audio
      processor = audioContext.createScriptProcessor(4096, 1, 1)
      
      processor.onaudioprocess = (event) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          const inputBuffer = event.inputBuffer.getChannelData(0)
          
          // Convertir a Float32Array y enviar
          const audioData = new Float32Array(inputBuffer)
          const buffer = audioData.buffer
          
          try {
            socket.send(buffer)
          } catch (error) {
            console.error('Error enviando datos de audio:', error)
          }
        }
      }
      
      source.connect(processor)
      processor.connect(audioContext.destination)
      
      console.log('Captura de audio iniciada')
      
    } catch (error) {
      console.error('Error accediendo al micrófono:', error)
      
      // Mejorar mensajes de error específicos
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Permiso de micrófono denegado')
        } else if (error.name === 'NotFoundError') {
          throw new Error('No se encontró micrófono')
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Navegador no compatible')
        }
      }
      
      throw error
    }
  }

  const stopTranscription = () => {
    console.log('Deteniendo transcripción...')
    
    // Detener procesamiento de audio
    if (processor) {
      processor.disconnect()
      processor = null
    }
    
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close()
      audioContext = null
    }

    // Detener stream de media
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      mediaStream = null
    }
    
    // Enviar mensaje de finalización y cerrar WebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const endMessage = {
          message: 'EndOfStream'
        }
        socket.send(JSON.stringify(endMessage))
        
        setTimeout(() => {
          if (socket) {
            socket.close(1000, 'Usuario detuvo transcripción')
            socket = null
          }
        }, 1000)
      } catch (error) {
        console.error('Error cerrando conexión:', error)
        socket.close()
        socket = null
      }
    } else if (socket) {
      socket.close()
      socket = null
    }
    
    console.log('Transcripción detenida')
  }

  return {
    startRealTimeTranscription,
    startAudioCapture,
    stopTranscription
  }
}