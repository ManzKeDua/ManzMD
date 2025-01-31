import fs from 'fs';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

// Ambil waktu di zona Asia/Jakarta
const waktu = moment().tz('Asia/Jakarta');

// Format tanggal dan waktu
const tampilTanggal = waktu.format('dddd, DD MMMM YYYY');
const tampilWaktu = waktu.format('HH:mm:ss');

// Tentukan waktu salam
const tampilHari = waktu.hours() >= 0 && waktu.hours() < 3
  ? 'Selamat Malam'
  : waktu.hours() < 12
  ? 'Selamat Pagi'
  : waktu.hours() < 18
  ? 'Selamat Siang'
  : 'Selamat Sore';

const handler = async (m, { conn, usedPrefix: _p, args, command, text }) => {
  let who;

  // Tentukan target pengguna
  if (m.isGroup) {
    who = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
  } else {
    who = m.chat;
  }

  if (!who) throw 'Balas pesan yang ingin diproses atau mention pengguna.';

  // Teks UI yang lebih menarik
  const replyMessage = `
  ╭━━━━━━━━━━━━━━━━━━━╮
  ┃     *TRANSAKSI BERHASIL*     ┃
  ┣━━━━━━━━━━━━━━━━━━━╯
  ┣➥ *Tanggal*: ${tampilTanggal}
  ┣➥ *Jam*: ${tampilWaktu} WIB
  ┣➥ *Salam*: ${tampilHari}
  ┣➥ *Status*: Berhasil ✅
  ┣━━━━━━━━━━━━━━━━━━━
  ┣ Pesanan @${who.split('@')[0]} telah berhasil diproses!
  ╰━━━━━━━━━━━━━━━━━━━╯
  `;

  m.reply(replyMessage.trim());
};

handler.help = ['done'];
handler.tags = ['store'];
handler.customPrefix = /^(done)$/i;
handler.group = true;
handler.admin = true;
handler.command = new RegExp();

export default handler;