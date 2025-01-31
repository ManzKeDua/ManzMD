
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
                ? m.quoted.sender 
                : args[0] 
                    ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
                    : false
    } else {
        who = m.chat
    }
    if (!who) throw `Siapa Yg Mau Di Jadiin Premium Sayang?!`
    
    let user = db.data.users[who]
    if (!user) throw `Pengguna tidak ditemukan di database. Pastikan pengguna sudah terdaftar.`

    if (!args[1]) throw `Mau Berapa Hari??`

    if (args[1].toLowerCase() === 'permanen') {
        user.premium = true
        user.premiumTime = 0
        m.reply(`Success
*Nama:* ${user.name || 'Tidak diketahui'}
*Selama:* Permanen`)
    } else {
        if (isNaN(args[1])) return m.reply(`Hanya Nomor!\n\nExample:\n${usedPrefix + command} @${m.sender.split`@`[0]} 7`)
        let jumlahHari = 86400000 * parseInt(args[1])
        let now = Date.now()
        user.premiumTime = user.premiumTime && user.premiumTime > now 
            ? user.premiumTime + jumlahHari 
            : now + jumlahHari
        user.premium = true
        m.reply(`Success
*Nama:* ${user.name || 'Tidak diketahui'}
*Selama:* ${args[1]} Hari`)
    }
}

handler.help = ['addprem']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)p(rem)?$/i

handler.group = true 
handler.owner = true

export default handler