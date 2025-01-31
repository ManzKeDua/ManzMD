import fetch from "node-fetch";

const handler = async (m, { conn, command, usedPrefix }) => {
  // Ambil soal dari GitHub
  const response = await fetch(
    "https://raw.githubusercontent.com/VynaaValerie/database-game/main/Tebak-Kata.json"
  );
  const soal = await response.json();

  if (!conn.tebakKata) conn.tebakKata = {};

  if (m.sender in conn.tebakKata) {
    m.reply("Kamu masih punya pertanyaan yang belum selesai!");
    return;
  }

  // Pilih soal acak
  const randomSoal = soal[Math.floor(Math.random() * soal.length)];
  const word = randomSoal.kata;
  const clue = word.replace(/[a-zA-Z]/g, (char, i) =>
    i % 2 === 0 ? char : "_"
  ); // Pola acak untuk clue

  conn.tebakKata[m.sender] = {
    answer: word.toLowerCase(),
    timeout: setTimeout(() => {
      delete conn.tebakKata[m.sender];
      m.reply(`Waktu habis! Jawabannya adalah *${word}*.`);
    }, 120 * 1000), // 2 menit
  };

  m.reply(
    `*Tebak Kata*\n\nClue: ${clue}\nPetunjuk: ${randomSoal.petunjuk}\n\nKetik jawabanmu dalam waktu 2 menit!`
  );
};

handler.before = async (m, { conn }) => {
  if (!conn.tebakKata || !(m.sender in conn.tebakKata)) return;

  const game = conn.tebakKata[m.sender];
  if (m.text.toLowerCase() === game.answer) {
    clearTimeout(game.timeout);
    delete conn.tebakKata[m.sender];

    // Pastikan data user ada
    if (!conn.user) conn.user = {};
    if (!conn.user[m.sender]) conn.user[m.sender] = { money: 0, limit: 0 };

    // Tambahkan hadiah
    conn.user[m.sender].money += 10; // Tambah uang 10
    conn.user[m.sender].limit += 1; // Tambah limit 1

    m.reply(
      `Selamat! Jawaban kamu benar: *${game.answer.toUpperCase()}*.\n\nKamu mendapatkan:\n💰 10 uang\n📈 1 limit.\n\n💵 Total uang: ${conn.user[m.sender].money}\n📊 Total limit: ${conn.user[m.sender].limit}`
    );
  } else {
    m.reply("Jawaban salah! Coba lagi.");
  }
};

handler.help = ["tebakkata"];
handler.tags = ["game"];
handler.command = /^(tebakkata|tebak kata)$/i;
handler.limit = false;

export default handler;