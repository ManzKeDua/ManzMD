import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Gunakan format: .ttdl <url TikTok>");
  }
  if (!text.includes("tiktok.com")) {
    return m.reply("Pastikan URL berasal dari TikTok!");
  }

  const apiUrl = `https://aemt.uk.to/download/tikdl?url=${encodeURIComponent(text)}`;

  try {
    // Fetch data dari API
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Gagal mengambil data dari API.");
    const json = await res.json();

    // Cek status API
    if (!json.status || json.code !== 200 || !json.result) {
      throw new Error("API tidak mengembalikan data yang valid.");
    }

    // Ekstrak data
    const { title, thumbnail, audio } = json.result;

    // Kirim informasi ke pengguna
    const caption = `🎥 **Judul Video**: ${title || "Tidak tersedia"}\n\n🎵 **Audio**: [Unduh Audio]( ${audio[0] || "Tidak tersedia"})`;
    await conn.sendMessage(m.chat, { 
      image: { url: thumbnail || "https://via.placeholder.com/150" }, 
      caption 
    });

  } catch (err) {
    console.error(err);
    m.reply("Terjadi kesalahan saat mencoba memproses permintaan. Pastikan URL valid dan coba lagi.");
  }
};

handler.help = ['ttdl'];
handler.tags = ['main'];
handler.command = /^(ttdl|tiktokdl)$/i;
handler.limit = true;

export default handler;