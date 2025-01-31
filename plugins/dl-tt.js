/* JANGAN HAPUS INI
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://vt.tiktok.com/xxxxxxx`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        let url = encodeURIComponent(text);
        const apiRes = await fetch(`https://api.botcahx.eu.org/api/dowloader/tiktok?url=${url}&apikey=${global.api.btch}`);
        const apiData = await apiRes.json();

        if (!apiData.status) throw 'Gagal mendownload video TikTok.';

        const { video, audio, title } = apiData.result;

        // Kirim video ke pengguna
        if (video && video.length > 0) {
            await conn.sendFile(m.chat, video[0], 'tiktok.mp4', `🎬 ${title || 'Video TikTok'}`, m);
        }

        // Kirim audio sebagai VN
        if (audio && audio.length > 0) {
            await conn.sendFile(m.chat, audio[0], 'audio.mp3', null, m, { ptt: true });
        }

    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(tt|ttdl|tiktok)$/i;
handler.premium = false;

export default handler;