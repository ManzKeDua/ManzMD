import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        let usageMessage = `⚠️ *Penggunaan perintah yang benar:* ⚠️\n\n`;
        usageMessage += `• *${command} <query atau URL>*\n`;
        usageMessage += `Misalnya:\n`;
        usageMessage += `• *!${command} angkasa*\n`;
        usageMessage += `• *!${command} https://www.youtube.com/watch?v=Xu1wA7CfhQg*`;

        await conn.sendMessage(m.chat, { text: usageMessage }, { quoted: m });
        return;
    }

    await conn.sendMessage(m.chat, { text: '⏳ Sedang diproses... Mohon jangan spam, tunggu proses selesai.' }, { quoted: m });

    try {
        switch (command) {
            case 'ytmp3':
                let mp3Res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=${global.api.btch}`);
                let mp3Json = await mp3Res.json();

                if (!mp3Json.status) throw 'Gagal mengunduh audio dari YouTube!';

                await conn.sendFile(m.chat, mp3Json.result.mp3, 'audio.mp3', '', m, { mimetype: 'audio/mp3' });
                break;

            case 'ytmp4':
                let mp4Res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=${global.api.btch}`);
                let mp4Json = await mp4Res.json();

                if (!mp4Json.status) throw 'Gagal mengunduh video dari YouTube!';

                await conn.sendFile(m.chat, mp4Json.result.mp4, 'video.mp4', '', m, { mimetype: 'video/mp4' });
                break;

            default:
                throw `Perintah tidak valid: ${command}`;
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat memproses perintah!' }, { quoted: m });
    }
};

handler.help = ['ytmp3', 'ytmp4'];
handler.tags = ['main'];
handler.command = /^(ytmp3|ytmp4)$/i;

export default handler;