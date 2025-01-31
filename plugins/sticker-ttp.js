import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, command, text }) => {
    try {
        if (!text) return conn.reply(m.chat, 'Masukkan teksnya!', m);

        // Format teks untuk API
        const apiUrl = `https://aemt.uk.to/ttp?text=${encodeURIComponent(text)}`;

        // Ambil gambar dari API
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Gagal mengambil gambar dari API.');

        const imageBuffer = await response.buffer();

        // Metadata stiker
        const stickerMetadata = {
            type: 'full',
            pack: 'Sticker Pack', // Nama pack (ubah sesuai kebutuhan)
            author: 'Vynaa',      // Nama pembuat (ubah sesuai kebutuhan)
            quality: 70           // Kualitas stiker (nilai default)
        };

        // Buat stiker dari gambar
        const stiker = await new Sticker(imageBuffer, stickerMetadata).toBuffer();

        // Kirim stiker ke pengguna
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true });
    } catch (e) {
        console.error(e);
        throw 'Terjadi kesalahan saat memproses permintaan!';
    }
};

handler.command = /^(ttp)$/i;
handler.tags = ['main'];
handler.help = ['ttp'];

handler.limit = true;

export default handler;