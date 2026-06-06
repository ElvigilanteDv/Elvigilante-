export default {
  command: ['shop', 'tienda', 'buy', 'comprar', 'inventory', 'inv', 'inventario'],
  category: 'economy',
  description: 'Ver la tienda del bot.',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat];
    if (chat.adminonly || !chat.economy) {
      return m.reply(`🐉🌀 Los comandos de *Economía* están desactivados en este grupo.\n\n⚡ Un *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = global.db.data.settings[botId];
    const currency = settings?.currency || 'Coins';
    
    if (!global.db.data.chats[m.chat].users[m.sender]) {
      global.db.data.chats[m.chat].users[m.sender] = {};
    }
    if (!global.db.data.chats[m.chat].users[m.sender].inventory) {
      global.db.data.chats[m.chat].users[m.sender].inventory = {};
    }
    if (!global.db.data.chats[m.chat].users[m.sender].weapons) {
      global.db.data.chats[m.chat].users[m.sender].weapons = {};
    }
    if (!global.db.data.chats[m.chat].users[m.sender].tools) {
      global.db.data.chats[m.chat].users[m.sender].tools = {};
    }
    
    let user = global.db.data.chats[m.chat].users[m.sender];
    const users = global.db.data.users[m.sender];
    
    if (user.weapons && typeof user.weapons === 'string') {
      try { user.weapons = JSON.parse(user.weapons); } catch { user.weapons = {}; }
    }
    if (user.tools && typeof user.tools === 'string') {
      try { user.tools = JSON.parse(user.tools); } catch { user.tools = {}; }
    }
    if (user.inventory && typeof user.inventory === 'string') {
      try { user.inventory = JSON.parse(user.inventory); } catch { user.inventory = {}; }
    }
    
    const armas = [{ id: 'espada', name: 'Espada', price: 8000, durability: 100, description: 'Para aventura', tipo: 'Combate' }, { id: 'hacha', name: 'Hacha', price: 7500, durability: 100, description: 'Para mazmorra', tipo: 'Combate' }, { id: 'arco', name: 'Arco', price: 7000, durability: 100, description: 'Para cazar', tipo: 'Combate' }];
    const herramientas = [{ id: 'pico', name: 'Pico', price: 6500, durability: 100, description: 'Para minar', tipo: 'Equipo' }, { id: 'caña', name: 'Caña de pescar', price: 6000, durability: 100, description: 'Para pescar', tipo: 'Equipo' }, { id: 'totem', name: 'Totem', price: 4000, durability: 3, description: 'Para ritual', tipo: 'Consumible' }, { id: 'pocion', name: 'Pocion', price: 1500, durability: 1, description: 'Restaura magia', tipo: 'Consumible' }];
    
    const commandType = command.toLowerCase();
    
    if (commandType === 'inventory' || commandType === 'inv' || commandType === 'inventario') {
      const userName = users?.name || m.pushName || 'Usuario';
      let invMessage = `
◤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◥
│  🐉 𝙶𝙾𝚃𝙴𝙽𝙺𝚂 𝚅𝟷 𝙸𝙽𝚅𝙴𝙽𝚃𝙾𝚁𝚈 🌀   │
├──────────────────────────────┤
│ ✦ 𝕌𝕤𝕦𝕒𝕣𝕚𝕠: *${userName}*
├──────────────────────────────┤
│ 💰 ℂ𝕠𝕚𝕟𝕤: *${((user.coins || 0) + (user.bank || 0)).toLocaleString()} ${currency}*
│ ❤️ 𝕊𝕒𝕝𝕦𝕕: *${user.health || 0}/100*
│ ⚡ 𝕊𝕥𝕒𝕞𝕚𝕟𝕒: *${user.stamina || 0}/100*
│ 🌀 𝕄𝕒𝕘𝕚𝕒: *${user.magic || 0}/100*
├──────────────────────────────┤`;
      
      let hasItems = false;
      
      if (user.weapons && Object.keys(user.weapons).length > 0) {
        hasItems = true;
        const weaponCount = Object.keys(user.weapons).length;
        invMessage += `\n│ 🗡️ 𝔸𝕣𝕞𝕒𝕤: *${weaponCount}*`;
        for (const [id, weapon] of Object.entries(user.weapons)) {
          const armaInfo = armas.find(a => a.id === id);
          if (armaInfo) {
            invMessage += `\n│   🌀 ${armaInfo.name}: *${weapon.durability}/${weapon.maxDurability}*`;
          }
        }
      }
      
      if (user.tools && Object.keys(user.tools).length > 0) {
        hasItems = true;
        const toolCount = Object.keys(user.tools).length;
        invMessage += `\n│\n│ 🔧 𝔼𝕢𝕦𝕚𝕡𝕠: *${toolCount}*`;
        for (const [id, tool] of Object.entries(user.tools)) {
          const toolInfo = herramientas.find(t => t.id === id);
          if (toolInfo) {
            invMessage += `\n│   🐉 ${toolInfo.name}: *${tool.durability}/${tool.maxDurability}*`;
          }
        }
      }
      
      const tieneTotem = (user.inventory?.totem || 0) > 0;
      const tienePocion = (user.inventory?.pocion || 0) > 0;
      
      if (tieneTotem || tienePocion) {
        hasItems = true;
        invMessage += `\n│\n│ 🧪 ℂ𝕠𝕟𝕤𝕦𝕞𝕚𝕓𝕝𝕖𝕤`;
        if (tieneTotem) {
          invMessage += `\n│   ⚡ Totem: *${user.inventory.totem}*`;
        }
        if (tienePocion) {
          invMessage += `\n│   🌀 Pocion: *${user.inventory.pocion}*`;
        }
      }
      
      if (!hasItems) {
        invMessage += `\n│\n│ 🐉 𝕀𝕟𝕧𝕖𝕟𝕥𝕒𝕣𝕚𝕠 𝕧𝕒𝕔í𝕠`;
        invMessage += `\n│ ⚡ 𝕌𝕤𝕒: *${usedPrefix}shop*`;
      }
      
      invMessage += `
├──────────────────────────────┤
│ 🐉 𝐺𝑜𝑡𝑒𝑛𝑘𝑠 𝑉1 𝐵𝑜𝑡
◣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◢
*𝐹𝑢𝑠𝑖𝑜𝑛 𝐻𝑎!* 🌀🐉`;
      await m.reply(invMessage);
      return;
    }
    
    if (commandType === 'shop' || commandType === 'tienda') {
      try {
        const armasDisponibles = armas.filter(item => !user.weapons?.[item.id]);
        const herramientasDisponibles = herramientas.filter(item => {
          if (item.id === 'totem' || item.id === 'pocion') {
            return true;
          }
          return !user.tools?.[item.id];
        });
        const itemsDisponibles = [...armasDisponibles, ...herramientasDisponibles];
        
        if (itemsDisponibles.length === 0) {
          return m.reply(`🐉🌀 La tienda está cerrada por reabastecimiento.\n⚡ Has comprado todos los objetos disponibles.`);
        }
        
        const page = parseInt(args[0]) || 1;
        const porPagina = 10;
        const totalPaginas = Math.ceil(itemsDisponibles.length / porPagina);
        
        if (page < 1 || page > totalPaginas) {
          return m.reply(`🐉🌀 Página inválida. Solo hay *${totalPaginas}* disponible${totalPaginas > 1 ? 's' : ''}.`);
        }
        
        const itemsPaginados = itemsDisponibles.slice((page - 1) * porPagina, page * porPagina);
        
        let listado = '';
        for (const item of itemsPaginados) {
          let descripcion = item.description;
          if (item.id === 'pocion') {
            const magiaActual = user.magic || 0;
            const magiaFaltante = 100 - magiaActual;
            const efecto = magiaFaltante > 0 ? Math.min(magiaFaltante, 100) : 0;
            if (efecto === 0) {
              descripcion = 'Poción mágica';
            } else {
              descripcion = `Restaura ${efecto} pts de magia`;
            }
          }
          let durabilidadText = item.tipo === 'Consumible' ? `⚡ Usos: *${item.durability}*` : `🌀 Durabilidad: *${item.durability}*`;
          listado += `
│
│ 🐉 *${item.name}* (${item.tipo})
│   💰 Precio: *${item.price.toLocaleString()} ${currency}*
│   📝 ${descripcion}
│   ${durabilidadText}`;
        }
        
        const mensaje = `
◤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◥
│  🐉 𝙶𝙾𝚃𝙴𝙽𝙺𝚂 𝚅𝟷 𝚂𝙷𝙾𝙿 🌀   │
├──────────────────────────────┤
│ ⚡ 𝕆𝕓𝕛𝕖𝕥𝕠𝕤: *${itemsDisponibles.length}*
├──────────────────────────────┤${listado}
├──────────────────────────────┤
│ 📄 ℙá𝕘𝕚𝕟𝕒 *${page}* 𝕕𝕖 *${totalPaginas}*
│ 🌀 𝕌𝕤𝕒 *${usedPrefix}buy <item>* 𝕡𝕒𝕣𝕒 𝕔𝕠𝕞𝕡𝕣𝕒𝕣
├──────────────────────────────┤
│ 🐉 𝐺𝑜𝑡𝑒𝑛𝑘𝑠 𝑉1 𝐵𝑜𝑡
◣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◢
*𝐹𝑢𝑠𝑖𝑜𝑛 𝐻𝑎!* 🌀🐉`;
        await m.reply(mensaje);
      } catch (e) {
        await m.reply(`🐉🌀 Error: ${e.message}`);
      }
      return;
    }
    
    if (commandType === 'buy' || commandType === 'comprar') {
      const itemArg = args[0];
      if (!itemArg) {
        return m.reply(`🐉🌀 Especifica qué quieres comprar.\n⚡ Ejemplo: *${usedPrefix}buy espada*\n🌀 Ver tienda: *${usedPrefix}shop*`);
      }
      
      if (itemArg.toLowerCase() === 'all') {
        let totalCosto = 0;
        const itemsAComprar = [];
        const allItems = [...armas, ...herramientas];
        
        for (const item of allItems) {
          const categoria = armas.some(a => a.id === item.id) ? 'arma' : 'herramienta';
          let puedeComprar = true;
          if (categoria === 'arma') {
            if (user.weapons?.[item.id]) puedeComprar = false;
          } else if (categoria === 'herramienta' && item.id !== 'totem' && item.id !== 'pocion') {
            if (user.tools?.[item.id]) puedeComprar = false;
          }
          if (puedeComprar) {
            itemsAComprar.push(item);
            totalCosto += item.price;
          }
        }
        
        if (itemsAComprar.length === 0) {
          return m.reply(`🐉🌀 Ya tienes todos los items disponibles.`);
        }
        
        if ((user.coins || 0) < totalCosto) {
          return m.reply(`🐉🌀 No tienes suficientes ${currency}.\n⚡ Necesitas: *${totalCosto.toLocaleString()}*\n💰 Tienes: *${(user.coins || 0).toLocaleString()}*`);
        }
        
        for (const item of itemsAComprar) {
          const categoria = armas.some(a => a.id === item.id) ? 'arma' : 'herramienta';
          if (categoria === 'arma') {
            user.weapons[item.id] = { durability: item.durability, maxDurability: item.durability };
          } else if (categoria === 'herramienta') {
            if (item.id === 'totem' || item.id === 'pocion') {
              user.inventory[item.id] = (user.inventory[item.id] || 0) + 1;
            } else {
              user.tools[item.id] = { durability: item.durability, maxDurability: item.durability };
            }
          }
        }
        
        user.coins = (user.coins || 0) - totalCosto;
        
        const mensaje = `
◤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◥
│  🐉 𝙲𝙾𝙼𝙿𝚁𝙰 𝙴𝚇𝙸𝚃𝙾𝚂𝙰 🌀   │
├──────────────────────────────┤
│ ⚡ 𝙸𝚝𝚎𝚖𝚜: *${itemsAComprar.length}*
│ 💰 𝚃𝚘𝚝𝚊𝚕: *${totalCosto.toLocaleString()} ${currency}*
├──────────────────────────────┤
│ 🐉 𝐺𝑜𝑡𝑒𝑛𝑘𝑠 𝑉1 𝐵𝑜𝑡
◣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◢
*𝐹𝑢𝑠𝑖𝑜𝑛 𝐻𝑎!* 🌀🐉`;
        return m.reply(mensaje);
      }
      
      const itemsInput = args.join(' ').split(',').map(item => item.trim().toLowerCase());
      const itemsToBuy = [];
      const itemsNoEncontrados = [];
      const itemsYaTiene = [];
      
      for (const itemInput of itemsInput) {
        let item = null;
        let categoria = null;
        item = armas.find(i => i.id === itemInput);
        if (item) categoria = 'arma';
        if (!item) {
          item = herramientas.find(i => i.id === itemInput);
          if (item) categoria = 'herramienta';
        }
        if (!item) {
          const allItems = [...armas, ...herramientas];
          const num = parseInt(itemInput);
          if (num >= 1 && num <= allItems.length) {
            item = allItems[num - 1];
            categoria = armas.some(a => a.id === item.id) ? 'arma' : 'herramienta';
          }
        }
        if (!item) {
          itemsNoEncontrados.push(itemInput);
          continue;
        }
        if (categoria === 'arma') {
          if (user.weapons?.[item.id]) {
            itemsYaTiene.push(item.name);
            continue;
          }
        } else if (categoria === 'herramienta' && item.id !== 'totem' && item.id !== 'pocion') {
          if (user.tools?.[item.id]) {
            itemsYaTiene.push(item.name);
            continue;
          }
        }
        itemsToBuy.push({ item, categoria });
      }
      
      if (itemsToBuy.length === 0) {
        let mensajeError = `🐉🌀 No se pudo comprar ningún item.`;
        if (itemsNoEncontrados.length > 0) {
          mensajeError += `\n⚡ No encontrados: *${itemsNoEncontrados.join(', ')}*`;
        }
        if (itemsYaTiene.length > 0) {
          mensajeError += `\n🌀 Ya tienes: *${itemsYaTiene.join(', ')}*`;
        }
        return m.reply(mensajeError);
      }
      
      let costoTotal = 0;
      for (const { item } of itemsToBuy) {
        costoTotal += item.price;
      }
      
      if ((user.coins || 0) < costoTotal) {
        return m.reply(`🐉🌀 No tienes suficientes ${currency}.\n⚡ Necesitas: *${costoTotal.toLocaleString()}*\n💰 Tienes: *${(user.coins || 0).toLocaleString()}*`);
      }
      
      const itemsComprados = [];
      for (const { item, categoria } of itemsToBuy) {
        if (categoria === 'arma') {
          user.weapons[item.id] = { durability: item.durability, maxDurability: item.durability };
          itemsComprados.push(item.name);
        } else if (categoria === 'herramienta') {
          if (item.id === 'totem' || item.id === 'pocion') {
            user.inventory[item.id] = (user.inventory[item.id] || 0) + 1;
            itemsComprados.push(item.name);
          } else {
            user.tools[item.id] = { durability: item.durability, maxDurability: item.durability };
            itemsComprados.push(item.name);
          }
        }
      }
      
      user.coins = (user.coins || 0) - costoTotal;
      
      let mensajeFinal = `
◤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◥
│  🐉 𝙲𝙾𝙼𝙿𝚁𝙰 𝙴𝚇𝙸𝚃𝙾𝚂𝙰 🌀   │
├──────────────────────────────┤
│ ⚡ 𝙸𝚝𝚎𝚖𝚜: *${itemsComprados.join(', ')}*
│ 💰 𝚃𝚘𝚝𝚊𝚕: *${costoTotal.toLocaleString()} ${currency}*`;
      
      if (itemsNoEncontrados.length > 0 || itemsYaTiene.length > 0) {
        mensajeFinal += `\n├──────────────────────────────┤`;
        if (itemsNoEncontrados.length > 0) {
          mensajeFinal += `\n│ ⚠️ 𝙽𝚘 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚍𝚘𝚜: *${itemsNoEncontrados.join(', ')}*`;
        }
        if (itemsYaTiene.length > 0) {
          mensajeFinal += `\n│ ⚠️ 𝚈𝚊 𝚝𝚎𝚗í𝚊𝚜: *${itemsYaTiene.join(', ')}*`;
        }
      }
      
      mensajeFinal += `
├──────────────────────────────┤
│ 🐉 𝐺𝑜𝑡𝑒𝑛𝑘𝑠 𝑉1 𝐵𝑜𝑡
◣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◢
*𝐹𝑢𝑠𝑖𝑜𝑛 𝐻𝑎!* 🌀🐉`;
      
      return m.reply(mensajeFinal);
    }
  }
};