const handler = async (m, { conn, command, usedPrefix, args }) => {
  if (!args[0]) throw `Ketik jumlah taruhan kamu! Contoh: ${usedPrefix + command} 10`;

  const taruhan = parseInt(args[0]);
  if (isNaN(taruhan) || taruhan <= 0) throw "Taruhan harus berupa angka dan lebih dari 0!";

  const user = db.data.users[m.sender];
  if (!user) throw "Kamu belum terdaftar! Silakan daftar terlebih dahulu.";

  if (user.coins < taruhan) throw "Koin kamu tidak cukup untuk bertaruh.";

  const hadiahPremium = Math.floor(Math.random() * (7 - 1 + 1)) + 1; // Hadiah antara 1 hingga 7 hari
  const hasil = Math.random() < 0.5; // 50% peluang menang atau kalah

  if (hasil) {
    // Pemain menang
    user.coins -= taruhan; // Kurangi taruhan
    user.premium = true;
    const now = Date.now();
    user.premiumTime = user.premiumTime && user.premiumTime > now 
      ? user.premiumTime + hadiahPremium * 86400000 
      : now + hadiahPremium * 86400000;

    m.reply(`🎉 Selamat! Kamu menang taruhan sebesar ${taruhan} koin.\n\n🎁 Hadiah: Premium selama ${hadiahPremium} hari!`);
  } else {
    // Pemain kalah
    user.coins -= taruhan; // Kurangi taruhan
    m.reply(`😢 Sayang sekali, kamu kalah taruhan sebesar ${taruhan} koin.\n\nCoba lagi untuk kesempatan menang berikutnya!`);
  }
};

handler.help = ["judi"];
handler.tags = ["game"];
handler.command = /^(judi)$/i;
handler.limit = true;

export default handler;