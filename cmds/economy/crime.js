export default {
  command: ['crime', 'crimen'],
  category: 'economy',
  description: 'Ganar coins rápido.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chatId = msg.key.remoteJid;
    const chat = global.db.data.chats[chatId];
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`🐉🌀 Los comandos de *Economía* están desactivados en este grupo.\n\n⚡ Un *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`);
    }
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const monedas = (global.db.data.settings[botId]).currency;
    
    if (!global.db.data.chats[chatId]?.users?.[msg.key.remoteJid]) {
      global.db.data.chats[chatId].users[msg.key.remoteJid] = {};
    }
    if (!global.db.data.chats[chatId].users[msg.key.remoteJid].lastcrime) {
      global.db.data.chats[chatId].users[msg.key.remoteJid].lastcrime = 0;
    }
    
    const user = global.db.data.chats[chatId]?.users?.[msg.key.remoteJid];
    const remainingTime = user.lastcrime - Date.now();
    if (remainingTime > 0) {
      return msg.reply(`🐉🌀 Debes esperar *${msToTime(remainingTime)}* antes de intentar nuevamente.`);
    }
    const éxito = Math.random() < 0.4;
    let cantidad;
    if (éxito) {
      cantidad = Math.floor(Math.random() * (7500 - 5500 + 1)) + 5500;
      user.coins = (user.coins || 0) + cantidad;
    } else {
      cantidad = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;
      const total = (user.coins || 0) + (user.bank || 0);
      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          user.coins = (user.coins || 0) - cantidad;
        } else {
          const restante = cantidad - (user.coins || 0);
          user.coins = 0;
          user.bank = (user.bank || 0) - restante;
        }
      } else {
        cantidad = total;
        user.coins = 0;
        user.bank = 0;
      }
    }        
    user.lastcrime = Date.now() + (7 * 60 * 1000);
    
    const successMessages = [
      `🐉 Hackeaste un cajero automático, ganaste *${cantidad.toLocaleString()} ${monedas}* ⚡`,
      `🌀 Te infiltraste en una mansión y robaste joyas, ganaste *${cantidad.toLocaleString()} ${monedas}* ⚡`,
      `🐉 Simulaste una transferencia falsa, ganaste *${cantidad.toLocaleString()} ${monedas}* ⚡`,
      `⚡ Interceptaste un paquete de lujo, ganaste *${cantidad.toLocaleString()} ${monedas}* 🌀`,
      `🐉 Vaciaste una cartera olvidada, ganaste *${cantidad.toLocaleString()} ${monedas}* ⚡`
    ];
    const failMessages = [
      `🐉 Intentaste vender un reloj falso y te atraparon, perdiste *${cantidad.toLocaleString()} ${monedas}* ⚡`,
      `🌀 Hackeaste una cuenta pero te rastrearon, perdiste *${cantidad.toLocaleString()} ${monedas}* 🐉`,
      `⚡ Robaste una mochila pero una cámara te capturó, perdiste *${cantidad.toLocaleString()} ${monedas}* 🌀`
    ];
    const message = éxito ? pickRandom(successMessages) : pickRandom(failMessages);
    await sock.sendMessage(chatId, { text: `🐉 ${message} 🌀` }, { quoted: msg });
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const min = minutes < 10 ? '0' + minutes : minutes;
  const sec = seconds < 10 ? '0' + seconds : seconds;
  return min === '00' ? `${sec} segundo${sec > 1 ? 's' : ''}` : `${min} minuto${min > 1 ? 's' : ''}, ${sec} segundo${sec > 1 ? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}