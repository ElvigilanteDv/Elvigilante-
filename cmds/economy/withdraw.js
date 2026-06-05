export default {
  command: ['withdraw', 'with', 'retirar'],
  category: 'economy',
  description: 'Retirar tus coins del banco.',
  run: async (client, m, args, usedPrefix, command) => {
    const chatId = m.chat;
    const senderId = m.sender;
    const chatData = global.db.data.chats[chatId];
    
    if (chatData.adminonly || !chatData.economy) {
      return m.reply(`🐉🌀 Los comandos de *Economía* están desactivados en este grupo.\n\n⚡ Un *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = global.db.data.settings[botId];
    const currency = botSettings.currency;
    const user = global.db.data.chats[chatId].users[senderId];
    
    if (!user) {
      return m.reply(`🐉🌀 No estás registrado. Usa *${usedPrefix}work* para comenzar.`);
    }
    
    if (!args[0]) {
      return m.reply(`🐉🌀 Ingresa la cantidad de *${currency}* que quieras retirar.\n⚡ Ejemplo: *${usedPrefix + command} 1000* o *${usedPrefix + command} all*`);
    }
    
    if (args[0].toLowerCase() === 'all') {
      if ((user.bank || 0) <= 0) {
        return m.reply(`🐉🌀 No tienes suficientes *${currency}* en tu Banco para retirar.`);
      }
      const amount = user.bank;
      user.bank = 0;
      user.coins = (user.coins || 0) + amount;
      return m.reply(`🐉 Has retirado *${amount.toLocaleString()} ${currency}* del banco ⚡\n🌀 Ahora puedes usarlo pero también podrán robártelo.`);
    }
    
    const count = parseInt(args[0]);
    if (isNaN(count) || count < 1) {
      return m.reply(`🐉🌀 Cantidad inválida.\n⚡ Ejemplo: *${usedPrefix + command} 1000* o *${usedPrefix + command} all*`);
    }
    
    if ((user.bank || 0) < count) {
      return m.reply(`🐉🌀 No tienes suficientes *${currency}* en tu banco.\n⚡ Solo tienes *${user.bank.toLocaleString()} ${currency}* en tu cuenta.`);
    }
    
    user.bank -= count;
    user.coins = (user.coins || 0) + count;
    
    await m.reply(`🐉 Has retirado *${count.toLocaleString()} ${currency}* del banco ⚡\n🌀 Ahora puedes usarlo pero también podrán robártelo.`);
  }
};