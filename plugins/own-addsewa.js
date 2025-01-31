let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let teks = text.split(' ')
    if (!m.isGroup) {
        if (!teks[0] || isNaN(teks[0])) throw `Masukkan Angka Mewakili Jumlah Hari !\n*Misal : ${usedPrefix + command} 1 https://chat.whatsapp.com/Dw1R6DW8JoUCTLZQLEhq7A*`

        let [_, code, expired] = teks[1] ? teks[1].match(linkRegex) : []
        if (!code) throw 'Link invalid'
        let res = await conn.groupAcceptInvite(code)
        let res2 = await conn.groupAcceptInvite(code)
        let who = teks[1] ? res2 : m.chat

        var jumlahHari = 86400000 * teks[0]
        var now = new Date() * 1
        if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired += jumlahHari
        else global.db.data.chats[who].expired += now + jumlahHari
        await conn.reply(m.chat, `Berhasil Menetapkan Hari Kadaluarsa Untuk Grup Ini Selama ${teks[0]} Hari.\n\nHitung Mundur : ${msToDate(global.db.data.chats[who].expired - now)}`, m)
        await conn.reply(who, 'halo gaes', null)

    } else if (m.isGroup) {
        if (!teks[0] || isNaN(teks[0])) throw `Masukkan Angka Mewakili Jumlah Hari !\n*Misal : ${usedPrefix + command} 1*`

        var jumlahHari = 86400000 * teks[0]
        var now = new Date() * 1
        if (now < global.db.data.chats[m.chat].expired) global.db.data.chats[m.chat].expired += jumlahHari
        else global.db.data.chats[m.chat].expired += now + jumlahHari
        await conn.reply(m.chat, `Berhasil Menetapkan Hari Kadaluarsa Untuk Grup Ini Selama ${teks[0]} Hari.\n\nHitung Mundur : ${msToDate(global.db.data.chats[m.chat].expired - now)}`, m)
        await conn.reply(m.chat, 'halo gaes', null)
    }

}
handler.help = ['addsewa']
handler.tags = ['owner']
handler.command = /^(addsewa)$/i
handler.rowner = true
handler.group = false

export default handler

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari " + hours + " Jam " + minutes + " Menit";
    // +minutes+":"+sec;
}