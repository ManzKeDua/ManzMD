let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i;

let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let teks = text.split(' ');
    if (!m.isGroup) {
        if (!teks[0]) throw `Masukkan Link Grup WhatsApp untuk menghapus sewa!\n*Contoh: ${usedPrefix + command} https://chat.whatsapp.com/Dw1R6DW8JoUCTLZQLEhq7A*`;

        let [_, code] = teks[0] ? teks[0].match(linkRegex) : [];
        if (!code) throw 'Link tidak valid!';
        let res = await conn.groupAcceptInvite(code);
        let who = teks[0] ? res : m.chat;

        if (!global.db.data.chats[who] || !global.db.data.chats[who].expired) throw 'Grup ini tidak memiliki masa sewa yang tercatat!';
        
        delete global.db.data.chats[who].expired;
        await conn.reply(m.chat, `Masa sewa grup berhasil dihapus untuk grup ini!`, m);
        await conn.reply(who, 'halo gaes, masa sewa grup telah dihapus!', null);

    } else if (m.isGroup) {
        if (!global.db.data.chats[m.chat] || !global.db.data.chats[m.chat].expired) throw 'Grup ini tidak memiliki masa sewa yang tercatat!';
        
        delete global.db.data.chats[m.chat].expired;
        await conn.reply(m.chat, `Masa sewa grup berhasil dihapus!`, m);
        await conn.reply(m.chat, 'halo gaes, masa sewa grup telah dihapus!', null);
    }
};

handler.help = ['delsewa'];
handler.tags = ['owner'];
handler.command = /^(delsewa)$/i;
handler.rowner = true;
handler.group = false;

export default handler;