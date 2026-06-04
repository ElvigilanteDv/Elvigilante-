export default {
  command: ['rt', 'roulette', 'ruleta'],
  category: 'economy',
  description: 'Apostar coins en una ruleta.',
  run: async (client, m, args, usedPrefix, command) => {
    const chatData = global.db.data.chats[m.chat];
    if (chatData.adminonly || !chatData.economy) {
      return m.reply(`🐉🌀 Los comandos de *Economía* están desactivados en este grupo.\n\n⚡ Un *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = global.db.data.settings[botId];
    const currency = botSettings.currency || 'Monedas';
    
    const user = global.db.data.chats[m.chat].users[m.sender];
    if (!user.lastroulette) user.lastroulette = 0;
    
    const cooldown = 30 * 1000;
    
    if (Date.now() < user.lastroulette) {
      const restante = user.lastroulette - Date.now();
      return m.reply(`🐉🌀 Debes esperar *${msToTime(restante)}* antes de volver a usar rt.`);
    }
    
    if (args.length < 2) {
      return m.reply(`🐉🌀 Debes ingresar una cantidad y apostar a un color.\n⚡ Ejemplo: *${usedPrefix}rt 2000 black*`);
    }
    
    let amount, color;
    
    if (!isNaN(parseInt(args[0]))) {
      amount = parseInt(args[0]);
      color = args[1].toLowerCase();
    } else if (!isNaN(parseInt(args[1]))) {
      color = args[0].toLowerCase();
      amount = parseInt(args[1]);
    } else {
      return m.reply(`🐉🌀 Formato inválido.\n⚡ Ejemplo: *${usedPrefix}rt 2000 black*`);
    }
    
    const validColors = ['red', 'black', 'green'];
    if (isNaN(amount) || amount < 200) {
      return m.reply(`🐉🌀 La cantidad mínima es 200 ${currency}.`);
    }
    if (!validColors.includes(color)) {
      return m.reply(`🐉🌀 Colores válidos: red, black, green.`);
    }
    
    if (user.coins < amount) {
      return m.reply(`🐉🌀 No tienes suficientes *${currency}* para esta apuesta.`);
    }
    
    user.lastroulette = Date.now() + cooldown;
    
    const random = Math.floor(Math.random() * 37);
    let resultColor;
    
    if (random < 9) {
      resultColor = 'green';
    } else if (random < 23) {
      resultColor = 'red';
    } else {
      resultColor = 'black';
    }
    
    if (resultColor === color) {
      const reward = amount * (resultColor === 'green' ? 5 : 2);
      user.coins = (user.coins || 0) + reward;
      m.reply(`🐉 *GOTENKS V1 ROULETTE* 🌀\n\n⚡ La ruleta salió en *${resultColor}*\n🎉 Has ganado *${reward.toLocaleString()} ${currency}* 🎉`);
    } else {
      user.coins = (user.coins || 0) - amount;
      m.reply(`🐉 *GOTENKS V1 ROULETTE* 🌀\n\n⚡ La ruleta salió en *${resultColor}*\n💔 Has perdido *${amount.toLocaleString()} ${currency}* 💔`);
    }
  }
};

function msToTime(duration) {
  const seconds = Math.floor(duration / 1000);
  return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
}