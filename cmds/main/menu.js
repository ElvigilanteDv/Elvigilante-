import fs from 'fs';
import { join } from 'path';
import { xpRange } from '../lib/levelling.js';

const tags = {
  jadibot: '🐉 SUB BOTS GOTENKS',
  eco: '⚡ ECONOMÍA SAIYAN',
  descargas: '🌀 DESCARGAS',
  tools: '🔧 HERRAMIENTAS',
  owner: '👑 MAESTRO GOTENKS',
  info: 'ℹ️ INFORMACIÓN',
  game: '🎮 ENTRENAMIENTO',
  gacha: '🎲 GACHA GOTENKS',
  reacciones: '💥 REACCIONES',
  group: '👥 DOJO GOTENKS',
  search: '🔎 BUSCADOR KAME',
  sticker: '📌 STICKERS',
  ia: '🤖 ANDROID 16',
  channel: '📺 CASA GOTENKS',
  fun: '😂 DIVERSIÓN',
};

const defaultMenu = {
  before: `
╔══════════════════╗
║🐉 𝙶𝙾𝚃𝙴𝙽𝙺𝚂 𝚅𝟷 𝙱𝙾𝚃 🌀  ║
╠══════════════════╣
║ Hola~ soy %botname 🐉
║ *%name*, %greeting
║ 
║ 🐉 *Tipo:* %tipo
║ ⚡ *Nivel:* *100%*
║ 📅 *Fecha:* %date
║ 🕐 *Hora:* %time
║ ⏱️ *Activo:* %uptime
╠═════════════════╣
║      🌀 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙶𝙾𝚃𝙴𝙽𝙺𝚂       
%readmore
`.trimStart(),
  header: '\n╠═ %category ═╣\n',
  body: '║ 🌀 *%cmd* %islimit %isPremium',
  footer: '',
  after: `
╠════════════════╣
║🐉 *Gotenks V1 Bot* 
║🌀 Fusión: Goten + Trunks
╚════════════════╝

*¡Que la fuerza Gotenks te acompañe!* 🌀🐉
`.trim(),
};

export default {
  command: ['menu', 'help', 'menú', 'ayuda', 'comandos', 'gotenksmenu'],
  category: 'main',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const { exp, limit, level } = global.db.data.users[m.sender] || {};
      const { min, xp, max } = xpRange(level, global.multiplier);
      const name = m.pushName || 'Usuario';

      const ahora = new Date();
      const horaVenezuela = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Caracas' }));

      const date = horaVenezuela.toLocaleDateString('es', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        weekday: 'long'
      });

      const time = horaVenezuela.toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const help = Object.values(global.plugins || {})
        .filter(p => p && !p.disabled)
        .map(p => ({
          help: Array.isArray(p.command) ? p.command : [p.command],
          tags: Array.isArray(p.category) ? p.category : [p.category],
          prefix: 'customPrefix' in p,
          limit: p.limit,
          premium: p.premium,
        }));

      let nombreBot = global.db.data.settings?.[client.user.id.split(':')[0] + '@s.whatsapp.net']?.namebot || 'Gotenks V1';

      const imagePath = join(process.cwd(), 'lib', 'gotenks.jpg');
      let bannerFinal = null;
      if (fs.existsSync(imagePath)) {
        bannerFinal = fs.readFileSync(imagePath);
      }

      const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
      const isOficialBot = botJid === global.client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const tipo = isOficialBot ? '🐉 GOTENKS PRINCIPAL' : '🌀 SUB GOTENKS';

      const menuConfig = defaultMenu;

      const _text = [
        menuConfig.before,
        ...Object.keys(tags).map(tag => {
          const cmds = help
            .filter(menu => menu.tags?.includes(tag))
            .map(menu => menu.help.map(h => 
              menuConfig.body
                .replace(/%cmd/g, menu.prefix ? h : `${usedPrefix}${h}`)
                .replace(/%islimit/g, menu.limit ? '🔒' : '')
                .replace(/%isPremium/g, menu.premium ? '💎' : '🌀')
            ).join('\n')).join('\n');
          return cmds ? [menuConfig.header.replace(/%category/g, tags[tag]), cmds, menuConfig.footer].join('\n') : '';
        }).filter(Boolean),
        menuConfig.after
      ].join('\n');

      const replace = {
        '%': '%',
        p: usedPrefix,
        botname: nombreBot,
        taguser: '@' + m.sender.split('@')[0],
        exp: (exp || 0) - (min || 0),
        maxexp: xp || 0,
        totalexp: exp || 0,
        xp4levelup: (max || 0) - (exp || 0),
        level: level || 0,
        limit: limit || 0,
        name: name,
        date: date,
        time: time,
        uptime: clockString(client.uptime || 0),
        tipo: tipo,
        readmore: readMore,
        greeting: getUwUGreeting(horaVenezuela.getHours()),
      };

      let text = _text.replace(
        new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
        (_, name) => String(replace[name])
      );

      if (bannerFinal) {
        await client.sendMessage(m.chat, {
          image: bannerFinal,
          caption: text.trim(),
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
          }
        }, { quoted: m });
      } else {
        await client.reply(m.chat, text.trim(), m);
      }

    } catch (e) {
      console.error('Error en menu Gotenks:', e);
      await client.reply(m.chat, 
        `🐉🌀 *¡Ups! Algo salió mal*\n\n⚡ Error: ${e.message}\n\n*Usa:* ${usedPrefix}help simple`, 
        m
      );
    }
  }
};

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

function getUwUGreeting(hour) {
  const greetings = {
    0: 'una noche mágica bajo las estrellas 🌙✨',
    1: 'una noche de sueños Saiyan 💤🌀',
    2: 'una noche llena de energía Ki 🌌⚡',
    3: 'un amanecer en la Sala del Tiempo 🌅⏳',
    4: 'un amanecer de meditación 🧘🌀',
    5: 'un entrenamiento con King Kai 👑🌅',
    6: 'una mañana de Kamehameha en la playa 🏖️🌀',
    7: 'una mañana en Kame House 🏠🐢',
    8: 'una mañana volando en Nimbus ☁️🌀',
    9: 'una mañana en el Tenkaichi Budokai 🥋🎯',
    10: 'un día de batalla en Cell Games ⚔️💥',
    11: 'un día de Torneo del Poder 💪🌟',
    12: 'un día soleado en Namek 🌍☀️',
    13: 'una tarde de entrenamiento con Whis 🥛🌀',
    14: 'una tarde en la Cámara Hipertérmica ⏱️✨',
    15: 'una tarde de fusiones en el dojo 🔄🌸',
    16: 'una tarde de transformaciones Saiyan 🌀💫',
    17: 'un atardecer después del Genkidama 🌇⚡',
    18: 'una noche de recuperación en la cápsula 💊🏥',
    19: 'una noche viendo las estrellas Saiyan 🌠🐉',
    20: 'una noche de cuentos del Planeta Vegeta 🪐📖',
    21: 'una noche preparando Semillas Senzu 🌱🍡',
    22: 'una noche protegiendo la Tierra 🌎🛡️',
    23: 'una noche de vigilia Saiyan 🌃🌸',
  };
  return 'Espero que tengas ' + (greetings[hour] || 'un día increíble lleno de poder Saiyan~ 🌸✨');
}