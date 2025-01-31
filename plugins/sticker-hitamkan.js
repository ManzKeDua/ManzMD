import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Fetch random sticker from API
    const randomPage = Math.floor(Math.random() * 4) + 1; // Random page (1 to 4)
    const apiUrl = `https://api.siputzx.my.id/api/s/combot?q=jomok%20nye&page=${randomPage}`;

    // Fetch sticker data
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status && data.data.results.length > 0) {
        const stickers = data.data.results;
        
        // Send 20 random stickers
        let sentStickers = 0;
        while (sentStickers < 20) {
            const randomSticker = stickers[Math.floor(Math.random() * stickers.length)].sticker_urls[0];
            
            // Send the sticker
            let stiker = await sticker(false, randomSticker, global.packname, global.author);
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
                sentStickers++;
            }
        }
    } else {
        throw "No stickers found.";
    }
}

handler.customPrefix = /^(jawirkan|hitamkan)$/i;
handler.command = new RegExp();
handler.premium = true;

export default handler;