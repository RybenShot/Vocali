// server/api/test-speechmatics.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  if (!config.speechmaticsApiKey) {
    return { error: 'API Key no configurada' }
  }
  
  try {
    // Probar con un endpoint más simple primero
    const response = await $fetch('https://mp.speechmatics.com/v2/api_keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.speechmaticsApiKey}`
      }
    })
    
    return { 
      success: true, 
      message: 'API Key válida',
      keys: response 
    }
  } catch (error: any) {
    return { 
      error: true, 
      status: error.status,
      message: error.message,
      details: error
    }
  }
})