import fetch from "node-fetch";

const handler = async (m, { conn, command, usedPrefix }) => {
  // Ambil soal dari API
  const response = await fetch(
    "https://api.botcahx.eu.org/api/game/tebakjkt48?apikey=5zaBL9qq"
  );
  const soal = await response.json();

  if (!conn.tebakJKT48) conn.tebakJKT48 = {};

  if (m.sender in conn.tebakJKT48) {
    m.reply("Kamu masih punya pertanyaan yang belum selesai!");
    return;
  }

  // Ambil soal acak
  const randomSoal = soal[0];
  const imgUrl = randomSoal.img;
  const jawaban = randomSoal.jawaban.toLowerCase();

  conn.tebakJKT48[m.sender] = {
    answer: jawaban,
    timeout: setTimeout(() => {
      delete conn.tebakJKT48[m.sender];
      m.reply(`Waktu habis! Jawabannya adalah *${randomSoal.jawaban}*.`);
    }, 120 * 1000), // 2 menit
  };

  m.reply(
    `*Tebak JKT48*\n\nPetunjuk: Lihat gambar di bawah ini dan ketik jawabanmu dalam waktu 2 menit!`
  );
  conn.sendFile(m.chat, imgUrl, "jkt48.jpg", "Siapa dia?", m);
};

handler.before = async (m, { conn }) => {
  if (!conn.tebakJKT48 || !(m.sender in conn.tebakJKT48)) return;

  const game = conn.tebakJKT48[m.sender];
  if (m.text.toLowerCase() === game.answer) {
    clearTimeout(game.timeout);
    delete conn.tebakJKT48[m.sender];

    // Pastikan data user ada
    if (!conn.user) conn.user = {};
    if (!conn.user[m.sender]) conn.user[m.sender] = { money: 0, limit: 0 };

    // Tambahkan hadiah
    conn.user[m.sender].money += 30; // Tambah uang 30
    conn.user[m.sender].limit += 2; // Tambah limit 2

    m.reply(
      `Selamat! Jawaban kamu benar: *${game.answer.toUpperCase()}*.\n\nKamu mendapatkan:\n💰 30 uang\n📈 2 limit.\n\n💵 Total uang: ${conn.user[m.sender].money}\n📊 Total limit: ${conn.user[m.sender].limit}`
    );
  } else {
    m.reply("Jawaban salah! Coba lagi.");
  }
};

handler.help = ["tebakjkt48"];
handler.tags = ["game"];
handler.command = /^(tebakjkt48|tebak jkt48)$/i;
handler.limit = false;

export default handler;