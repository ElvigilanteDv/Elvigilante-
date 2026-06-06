export default {
  command: ['adventure', 'aventura'],
  category: 'economy',
  description: 'Ir de aventuras para ganar coins.',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat];
    if (chat.adminonly || !chat.economy) {
      return m.reply(`🐉🌀 Los comandos de *Economía* están desactivados en este grupo.\n\n⚡ Un *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = global.db.data.settings[botId];
    const currency = settings.currency;
    
    let user = global.db.data.chats[m.chat].users[m.sender];
    if (!user) {
      return m.reply(`🐉🌀 No estás registrado. Usa *${usedPrefix}work* para comenzar.`);
    }
    if (!user.weapons) user.weapons = {};
    if (typeof user.weapons === 'string') {
      try { user.weapons = JSON.parse(user.weapons); } catch { user.weapons = {}; }
    }
    if (!user.lastadventure) user.lastadventure = 0;
    if (!user.stamina) user.stamina = 100;
    if (!user.health) user.health = 100;
    if (!user.magic) user.magic = 100;
    if (!user.coins) user.coins = 0;
    if (!user.bank) user.bank = 0;
    
    const staminaConsumed = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    if (user.stamina < staminaConsumed) {
      return m.reply(`🐉🌀 No tienes suficiente stamina.\n⚡ Usa *${usedPrefix}heal* para curarte.`);
    }
    
    let usingMagic = false;
    let usingWeapon = false;
    
    if (user.weapons?.espada) {
      if (user.weapons.espada.durability <= 10) {
        delete user.weapons.espada;
        return m.reply(`🐉🌀 Tu Espada se ha roto.\n⚡ Compra una nueva con: *${usedPrefix}buy espada*`);
      }
      usingWeapon = true;
    } else {
      const magicConsumed = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
      if (user.magic < magicConsumed) {
        return m.reply(`🐉🌀 Magia agotada y sin arma.\n⚡ Compra un arma con: *${usedPrefix}buy espada*`);
      }
      usingMagic = true;
      user.magic -= magicConsumed;
    }
    
    if (user.health < 5) {
      return m.reply(`🐉🌀 No tienes suficiente salud.\n⚡ Usa *${usedPrefix}heal* para curarte.`);
    }
    
    const remainingTime = user.lastadventure - Date.now();
    if (remainingTime > 0) {
      return m.reply(`🐉🌀 Debes esperar *${msToTime(remainingTime)}* para usar *${usedPrefix + command}* de nuevo.`);
    }
    
    user.stamina -= staminaConsumed;
    
    const rand = Math.random();
    let cantidad = 0;
    let salud = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    let durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let message;
    
    if (rand < 0.4) {
      if (usingWeapon) {
        user.weapons.espada.durability -= durabilityConsumed;
        if (user.weapons.espada.durability <= 10) {
          delete user.weapons.espada;
        }
      }
      cantidad = Math.floor(Math.random() * (18000 - 14000 + 1)) + 14000;
      user.coins += cantidad;
      user.health -= salud;
      if (user.health < 0) user.health = 0;
      
      const successMessages = [
        `🐉 Derrotaste a un ogro, ganaste *${cantidad.toLocaleString()} ${currency}* ⚡`,
        `🌀 Te conviertes en campeón, ganaste *${cantidad.toLocaleString()} ${currency}* 🐉`,
        `⚡ Rescatas un tesoro legendario, ganaste *${cantidad.toLocaleString()} ${currency}* 🌀`
      ];
      message = pickRandom(successMessages);
    } else if (rand < 0.7) {
      if (usingWeapon) {
        user.weapons.espada.durability -= durabilityConsumed;
        if (user.weapons.espada.durability <= 10) {
          delete user.weapons.espada;
        }
      }
      cantidad = Math.floor(Math.random() * (11000 - 9000 + 1)) + 9000;
      const total = (user.coins || 0) + (user.bank || 0);
      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          user.coins -= cantidad;
        } else {
          const restante = cantidad - user.coins;
          user.coins = 0;
          user.bank -= restante;
        }
      } else {
        cantidad = total;
        user.coins = 0;
        user.bank = 0;
      }
      user.health -= salud;
      if (user.health < 0) user.health = 0;
      
      const failMessages = [
        `🐉 Un hechicero te maldijo, perdiste *${cantidad.toLocaleString()} ${currency}* ⚡`,
        `🌀 Bandidos te asaltaron, perdiste *${cantidad.toLocaleString()} ${currency}* 🐉`,
        `⚡ Caíste en una trampa, perdiste *${cantidad.toLocaleString()} ${currency}* 🌀`
      ];
      message = pickRandom(failMessages);
    } else {
      const neutralMessages = [
        `🐉 Exploraste ruinas antiguas sin contratiempos.`,
        `🌀 Descubriste nuevas rutas en el bosque.`,
        `⚡ Escuchaste relatos de viejas batallas.`
      ];
      message = pickRandom(neutralMessages);
    }
    
    user.lastadventure = Date.now() + 20 * 60 * 1000;
    await m.reply(`🐉 ${message} 🌀`);
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