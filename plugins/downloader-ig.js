import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Gunakan format: .igdl <url Instagram>");
  }
  if (!text.includes("instagram.com")) {
    return m.reply("Pastikan URL berasal dari Instagram!");
  }

  const apiUrl = `https://aemt.uk.to/download/igdl?url=${encodeURIComponent(text)}`;

  try {
    // Fetch data dari API
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Gagal mengambil data dari API.");
    const json = await res.json();

    // Cek status API
    if (!json.status || json.code !== 200 || !json.result || !json.result[0]) {
      throw new Error("API tidak mengembalikan data yang valid.");
    }

    // Ekstrak data
    const videoUrl = json.result[0].url;
    const thumbnail = json.result[0].thumbnail || null;
    const wm = json.result[0].wm || "Tanpa Watermark";

    // Kirim video ke pengguna
    await conn.sendFile(
      m.chat,
      videoUrl, // URL video dari API
      'instagram.mp4', // Nama file video
      `🎥 Video berhasil diunduh!\n\n🌟 Instagram @vynaa_valerie}\n\n💌 Terima kasih telah menggunakan layanan kami.`,
      m // Pesan yang dikutip
    );

    // Jika ada thumbnail, kirim sebagai preview
    if (thumbnail) {
      await conn.sendFile(
        m.chat,
        thumbnail,
        'thumbnail.jpg',
        '🖼️ Berikut adalah thumbnail dari video.',
        m
      );
    }
  } catch (err) {
    console.error(err);
    m.reply("Terjadi kesalahan saat mencoba memproses permintaan. Pastikan URL valid dan coba lagi.");
  }
};

handler.help = ['igdl'];
handler.tags = ['main'];
handler.command = /^(igdl|instagramdl)$/i;
handler.limit = true;

export default handler;