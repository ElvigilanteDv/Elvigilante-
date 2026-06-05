import db from '#db';

export default {
  command: ['mine', 'minar'],
  category: 'economy',
  description: 'Realizar trabajos de minería y ganar coins.',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = db.getChat(m.chat);
    if (chat.adminonly || !chat.economy) {
      return m.reply(`🐉🌀 Los comandos de *Economía* están desactivados en este grupo.\n\n⚡ Un *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`);
    }
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const monedas = botSettings?.currency || 'Coins';
    
    db.setCreate('chat_users', [m.chat, m.sender], 'tools', {});
    db.setCreate('chat_users', [m.chat, m.sender], 'lastmine', 0);    
    let user = db.getChatUser(m.chat, m.sender);
    
    if (user.tools && typeof user.tools === 'string') {
      try { user.tools = JSON.parse(user.tools); } catch { user.tools = {}; }
    }    
    
    const staminaConsumed = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    if (user.stamina < staminaConsumed) {
      return m.reply(`🐉🌀 No tienes suficiente energía para minar.\n⚡ Usa *${usedPrefix}heal* para curarte.`);
    }    
    
    if (!user.tools?.pico) {
      return m.reply(`🐉🌀 Necesitas un Pico para minar.\n⚡ Compra uno con: *${usedPrefix}buy pico*`);
    }    
    
    if (user.tools.pico.durability <= 10) {
      delete user.tools.pico;
      db.setChatUser(m.chat, m.sender, 'tools', user.tools);
      return m.reply(`🐉🌀 Tu Pico se ha roto.\n⚡ Compra uno nuevo con: *${usedPrefix}buy pico*`);
    }    
    
    const remaining = user.lastmine - Date.now();
    if (remaining > 0) {
      return m.reply(`🐉🌀 Debes esperar *${msToTime(remaining)}* para minar de nuevo.`);
    }    
    
    user.stamina -= staminaConsumed;
    db.setChatUser(m.chat, m.sender, 'stamina', user.stamina);    
    
    const durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    user.tools.pico.durability -= durabilityConsumed;    
    
    if (user.tools.pico.durability <= 10) {
      delete user.tools.pico;
    }
    db.setChatUser(m.chat, m.sender, 'tools', user.tools);    
    
    user.lastmine = Date.now() + 10 * 60 * 1000;
    db.setChatUser(m.chat, m.sender, 'lastmine', user.lastmine);    
    
    let isLegendary = Math.random() < 0.02;
    let reward, narration, bonusMsg = '';    
    
    if (isLegendary) {
      reward = Math.floor(Math.random() * (13000 - 11000 + 1)) + 11000;
      narration = '🐉 ¡DESCUBRISTE UN TESORO LEGENDARIO! ⚡\n\n';
      bonusMsg = '\n🌀 Recompensa ÉPICA obtenida!';
    } else {
      reward = Math.floor(Math.random() * (9500 - 7000 + 1)) + 7000;
      const scenario = pickRandom(escenarios);
      narration = `🐉 En ${scenario}, ${pickRandom(mineria)}`;
      if (Math.random() < 0.1) {
        const bonus = Math.floor(Math.random() * (4500 - 2500 + 1)) + 2500;
        reward += bonus;
        bonusMsg = `\n⚡ ¡Bonus de minería! Ganaste *${bonus.toLocaleString()}* ${monedas} extra 🌀`;
      }
    }    
    
    user.coins += reward;
    db.setChatUser(m.chat, m.sender, 'coins', user.coins);    
    
    let caption = `${narration} *${reward.toLocaleString()} ${monedas}*`;
    if (bonusMsg) caption += `\n${bonusMsg}`;
    await m.reply(`🐉 ${caption} 🌀`);
  }
};

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  if (minutes === '00') return `${seconds} segundo${seconds > 1 ? 's' : ''}`;
  return `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const escenarios = [
  'una cueva oscura y húmeda',
  'la cima de una montaña nevada',
  'un bosque misterioso lleno de raíces',
  'un río cristalino y caudaloso',
  'una mina abandonada de carbón',
  'las ruinas de un antiguo castillo',
  'una playa desierta con arena dorada',
  'un valle escondido entre colinas',
  'un arbusto espinoso al borde del camino',
  'un tronco hueco en medio del bosque',
];

const mineria = [
  'encontraste un antiguo cofre con',
  'hallaste una bolsa llena de',
  'descubriste un saco de',
  'desenterraste monedas antiguas que contienen',
  'rompiste una roca y adentro estaba',
  'cavando profundo, hallaste',
  'entre las raíces, encontraste',
  'dentro de una caja olvidada, hallaste',
  'bajo unas piedras, descubriste',
  'entre los escombros de un lugar viejo, encontraste',
];