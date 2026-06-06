import fetch from 'node-fetch'

export default {
  command: ['gotenks', 'gotenksai', 'ia', 'bot'],
  category: 'ia',
  description: 'Habla con Gotenks V1 Bot 🐉🌀',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args.join(' ').trim()
    
    if (!text) {
      return m.reply(`🐉🌀 ¡Ja! ¿Qué quieres, tipo?\n⚡ Escribe *${usedPrefix}gotenks <mensaje>* y te contesto.`)
    }

    await client.sendPresenceUpdate('composing', m.chat)

    const prompt = `Eres Gotenks. Responde como el guerrero Saiyan arrogante, divertido y presumido. Usa emojis 🐉🌀⚡. Responde corto. Pregunta: ${text}`

    try {
      const url = `https://api-gohan-v1.onrender.com/ai/gemini?text=${encodeURIComponent(prompt)}`
      const res = await fetch(url)
      const data = await res.json()
      
      let respuesta = ''
      
      if (typeof data === 'string') {
        respuesta = data
      } else if (data && typeof data === 'object') {
        respuesta = data.text || data.result || data.response || data.message || JSON.stringify(data)
      }
      
      if (!respuesta || respuesta === '[object Object]') {
        respuesta = "🐉🌀 ¡Soy Gotenks! No entendí eso, tipo. ¡Pregunta de nuevo!"
      }

      await client.sendPresenceUpdate('paused', m.chat)
      await m.reply(`🐉 ${respuesta} 🌀`)

    } catch (e) {
      console.error('[GOTENKS V1 ERROR]', e.message)
      await client.sendPresenceUpdate('paused', m.chat).catch(() => {})
      await m.reply(`🐉🌀 Error: ${e.message}`)
    }
  }
}