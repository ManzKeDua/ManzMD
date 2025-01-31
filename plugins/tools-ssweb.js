/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://google.com`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        // Encode URL
        let url = encodeURIComponent(text);

        // API Request
        const apiURL = `https://api.siputzx.my.id/api/tools/ssweb?url=${url}&theme=light&device=desktop`;
        const apiRes = await fetch(apiURL);
        if (!apiRes.ok) throw `Error ${apiRes.status}: ${apiRes.statusText}`;

        const buffer = await apiRes.buffer();

        // Kirim hasil screenshot ke pengguna
        await conn.sendFile(m.chat, buffer, 'screenshot.jpg', `📸 Berikut screenshot dari:\n${text}`, m);

    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message || error}`, m);
    }
};

handler.help = ['ssweb'];
handler.tags = ['tools'];
handler.command = /^(ssweb|webss|ss)$/i;
handler.premium = false;

export default handler;