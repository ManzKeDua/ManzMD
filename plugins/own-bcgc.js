/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || q.mediaType || "";

  if (!mime && !text) {
    return conn.reply(
      m.chat,
      `Contoh: balas/kirim gambar dengan keterangan *${usedPrefix + command}*`,
      m
    );
  }

  // Mengunduh gambar jika ada
  const image = mime ? await uploadImage(await q.download()) : "";

  // Mengambil semua ID grup
  const groupIds = Object.keys(await conn.chats).filter(id => id.endsWith("@g.us"));
  conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groupIds.length} grup_`, m);

  for (const id of groupIds) {
    await delay(2000);
    const options = image
      ? { image: { url: image }, caption: text || '' } // Menambahkan teks sebagai caption
      : { text: text.trim() }; // Jika hanya teks yang ada, kirim teks saja

    try {
      await conn.sendMessage(id, options, { quoted: null });
    } catch (err) {
      console.error(`Gagal mengirim pesan ke grup ${id}:`, err);
    }
  }

  conn.reply(m.chat, "Broadcast selesai", m);
};

handler.help = ['jpm'];
handler.tags = ['owner'];
handler.command = /^(share|jpm|bcgc|broadcast)$/i;
handler.rowner = true

export default handler;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function uploadImage(content) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", new Blob([content.toArrayBuffer()], { type: "image/png" }), crypto.randomBytes(5).toString("hex") + ".png");

  const response = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: formData });
  return await response.text();
}