import fs from 'fs';

let handler = async (m, { conn, text }) => {
    m.reply('Tunggu sebentar, sedang mengambil file database...');
    let sesi = await fs.readFileSync('./system/database.json');
    
    return await conn.sendMessage(
        m.chat, 
        { 
            document: sesi, 
            mimetype: 'application/json', 
            fileName: 'database.json' 
        }, 
        { quoted: m }
    );
};

handler.help = ['getdb'];
handler.tags = ['owner'];
handler.command = /^(getdb)$/i;

handler.rowner = true;

export default handler;

/* JANGAN HAPUS INI
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/