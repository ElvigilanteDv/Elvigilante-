export default {
  command: ['ping', 'p', 'speed'],
  category: 'info',
  description: 'Mide la velocidad de respuesta del bot.',
  run: async (client, m, args, usedPrefix, command) => {
    const start = Date.now()
    await m.reply('🏓 Calculando ping...')
    const end = Date.now()
    const ping = end - start
    const apiPing = Math.round(client.ws?.ping || 0)
    
    let emoji = '🟢'
    if (ping > 500) emoji = '🔴'
    else if (ping > 200) emoji = '🟡'
    
    const message = `
🐉 *GOTENKS V1 PING* 🌀

${emoji} *Velocidad del Bot*
⚡ ${ping}ms

📡 *Conexión WhatsApp*
🌀 ${apiPing}ms

*¡Fusion Ha!* 🐉⚡
`
    await m.reply(message)
  }
}