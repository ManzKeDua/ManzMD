import fs from 'fs';

let handler = async (m, { conn, args, command }) => {
  // Ambil semua plugin
  let plugins = Object.values(global.plugins);

  // Kategorikan fitur berdasarkan tags
  let categories = {};
  plugins.forEach((plugin) => {
    if (plugin.help && plugin.tags) {
      plugin.tags.forEach((tag) => {
        if (!categories[tag]) categories[tag] = [];
        categories[tag] = categories[tag].concat(plugin.help);
      });
    }
  });

  // Hitung total fitur berdasarkan kategori
  let totalText = 'Total Fitur Berdasarkan Kategori:\n';
  Object.keys(categories).forEach((tag) => {
    totalText += `- ${tag} = ${categories[tag].length} fitur\n`;
  });

  // Hitung total semua fitur
  let totalFeatures = plugins
    .filter((plugin) => plugin.help && plugin.tags)
    .map((plugin) => plugin.help)
    .flat(1).length;

  totalText += `\nTotal Keseluruhan: ${totalFeatures} fitur`;

  // Kirim hasil ke pengguna
  await m.reply(totalText);
};

// Metadata handler
handler.help = ['totalfitur'];
handler.tags = ['info'];
handler.command = ['totalfitur'];

export default handler;