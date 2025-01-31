import { watchFile, unwatchFile } from 'fs';
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Global Settings
global.setting = {
  autoclear: false,
  addReply: true, // Tambahkan balasan dengan thumbnail di pesan
};

// Owner Information
global.owner = [
  ['6288989721627', 'manx', true],
];

// Bot Information
global.info = {
  nomerbot: '6285829304548',
  pairingNumber: '6285829304548',
  nameown: 'manz',
  nomerown: '6288989721627',
  packname: 'sticker by ',
  author: 'manx',
  namebot: 'Takatou Yogiri',
  wm: 'simple whatsapp bot by manx',
  stickpack: 'mans',
  stickauth: 'yogiri',
};

// URLs
global.url = {
  profil: 'https://files.catbox.moe/ijeati.jpg',
  did: 'https://telegra.ph/file/fdc1a8b08fe63520f4339.jpg',
  rules: 'https://telegra.ph/file/afcfa712bd09f4fcf027a.jpg',
  thumbnail: 'https://files.catbox.moe/ijeati.jpg',
  thumb: 'https://files.catbox.moe/ijeati.jpg',
  logo: 'https://telegra.ph/file/07428fea2fd4dccaab65f.jpg',
  unReg: 'https://telegra.ph/file/ef02d1fdd59082d05f08d.jpg',
  registrasi: 'https://itzpire.com/file/6ead5b50254b.jpg',
  confess: 'https://telegra.ph/file/03cabea082a122abfa5be.jpg',
  akses: 'https://telegra.ph/file/6c7b9ffbdfb0096e1db3e.jpg',
  wel: 'https://telegra.ph/file/9dbc9c39084df8691ebdd.mp4', // Welcome GIF
  bye: 'https://telegra.ph/file/1c05b8c019fa525567d01.mp4', // Goodbye GIF
  sound: 'https://media.vocaroo.com/mp3/1awgSZYHXP3B', // Audio menu
  sig: '',
  sgh: '',
  sgc: 'https://whatsapp.com/channel/0029VaHPYh6LNSa81M9Xcq1K',
};

// Payment Information
global.payment = {
  psaweria: 'https://saweria.co/',
  ptrakterr: '-',
  pdana: '',
};

// Tokopay Integration
global.tokopay = {
  merchantID: '-',
  secretKey: '-',
  link: 'https://api.tokopay.id',
};

// SMM Information
global.smm = {
  apiKey: '-',
  apiId: '-',
  link: 'https://valerieconnect.shop',
};

// Messages
global.msg = {
  wait: '⏱️ *Mohon bersabar*\n\> Sedang menjalankan perintah dari *User*!',
  eror: '🤖 *Information Bot*\n\> Mohon maaf atas ketidaknyamanan dalam menggunakan *Nightmare Bot* . Ada kesalahan dalam sistem saat menjalankan perintah.',
};

// RPG Configuration
global.multiplier = 69;
global.rpg = {
  emoticon(string) {
    const emot = {
      agility: '🤸‍♂️',
      arc: '🏹',
      armor: '🥼',
      bank: '🏦',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      bow: '🏹',
      bull: '🐃',
      cat: '🐈',
      chicken: '🐓',
      common: '📦',
      cow: '🐄',
      crystal: '🔮',
      darkcrystal: '♠️',
      diamond: '💎',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      emerald: '💚',
      exp: '✉️',
      fishingrod: '🎣',
      fox: '🦊',
      gems: '🍀',
      giraffe: '🦒',
      gold: '👑',
      health: '❤️',
      horse: '🐎',
      intelligence: '🧠',
      iron: '⛓️',
      keygold: '🔑',
      keyiron: '🗝️',
      knife: '🔪',
      legendary: '🗃️',
      level: '🧬',
      limit: '🌌',
      lion: '🦁',
      magicwand: '⚕️',
      mana: '🪄',
      money: '💵',
      mythic: '🗳️',
      pet: '🎁',
      petFood: '🍖',
      pickaxe: '⛏️',
      pointxp: '📧',
      potion: '🥤',
      rock: '🪨',
      snake: '🐍',
      stamina: '⚡',
      strength: '🦹‍♀️',
      string: '🕸️',
      superior: '💼',
      sword: '⚔️',
      tiger: '🐅',
      trash: '🗑',
      uncommon: '🎁',
      upgrader: '🧰',
      wood: '🪵',
    };
    const result = Object.keys(emot).find((key) => string.toLowerCase().includes(key));
    return result ? emot[result] : '';
  },
};

// API Configuration
global.api = {
  btch: '-',
};
global.APIs = {
  btch: 'https://api.botcahx.eu.org',
};
global.APIKeys = {
  'https://api.botcahx.eu.org': '-',
};

// Watch for File Changes
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'settings.js'"));
  import(`${file}?update=${Date.now()}`);
});
