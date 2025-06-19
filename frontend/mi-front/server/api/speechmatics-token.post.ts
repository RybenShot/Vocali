// @ts-nocheck
// server/api/speechmatics-token.ts
export default defineEventHandler(async (event) => {
  try {
    const apiKey = useRuntimeConfig().speechmaticsApiKey
    
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API Key no configurada'
      })
    }

    console.log('API Key disponible:', !!apiKey, 'Longitud:', apiKey?.length)
    
    // Generar JWT para Real-time API
    const response = await $fetch('https://mp.speechmatics.com/v1/api_keys', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: {
        type: 'rt', // Debe ser 'rt' para Real-time API
        ttl: 3600   // 1 hora de validez
      }
    })

    console.log('Token response:', response) // Para debug

    return {
      success: true,
      data: {
        token: response.key_value
      }
    }
  } catch (error) {
    console.error('Error generando token:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error generando token de autenticación'
    })
  }
})