/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://www.instagram.com/p/xxxxxxx`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        let url = encodeURIComponent(text);
        const igRes = await fetch(`https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${url}&apikey=${global.api.btch}`);
        const igData = await igRes.json();

        if (!igData.status) throw 'Gagal mendownload video Instagram.';

        // Mendapatkan data video
        const videoData = igData.result[0];
        const { url: igVideo, thumbnail } = videoData;

        // Mengirim video ke pengguna
        await conn.sendFile(
            m.chat, 
            igVideo, 
            'instagram.mp4', 
            `📸 Video dari Instagram\n@vynaa_valerie`, 
            m, 
            { thumbnail: await fetch(thumbnail).then(res => res.buffer()) }
        );
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(ig|igdl|instagram)$/i;
handler.premium = false;

export default handler;