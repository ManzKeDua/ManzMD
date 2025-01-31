import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, command, text }) => {
    try {
        if (!text) return conn.reply(m.chat, 'Masukkan teksnya!', m);

        // Format teks untuk API
        const apiUrl = `https://aemt.uk.to/attp?text=${encodeURIComponent(text)}`;

        // Ambil GIF dari API
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Gagal mengambil GIF dari API.');

        const gifBuffer = await response.buffer();

        // Metadata stiker animasi
        const stickerMetadata = {
            type: 'full',                 // Jenis stiker (full atau crop)
            pack: 'Animated Sticker Pack', // Nama pack stiker
            author: 'Vynaa',              // Nama pembuat stiker
            quality: 70                   // Kualitas stiker
        };

        // Buat stiker animasi dari GIF
        const stiker = await new Sticker(gifBuffer, stickerMetadata).toBuffer();

        // Kirim stiker animasi ke pengguna
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true });
    } catch (e) {
        console.error(e);
        throw 'Terjadi kesalahan saat memproses permintaan!';
    }
};

handler.command = /^(attp)$/i;
handler.tags = ['main'];
handler.help = ['attp'];

handler.limit = true;

export default handler;