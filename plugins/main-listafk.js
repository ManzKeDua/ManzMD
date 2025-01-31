let handler = async (m, { conn }) => {
    let afkUsers = Object.entries(global.db.data.users)
        .filter(([_, data]) => data.afk)
        .map(([id, data]) => {
            let name = data.registered ? data.name : conn.getName(id)
            let reason = data.afkReason || 'Tanpa Alasan'
            let duration = (new Date() - data.afk) / 1000
            let time = duration > 3600 ? `${(duration / 3600).toFixed(1)} jam` :
                        duration > 60 ? `${(duration / 60).toFixed(1)} menit` : `${duration.toFixed(1)} detik`
            return `• ${name}\n  ➠ Alasan: ${reason}\n  ➠ Durasi: ${time}`
        })

    let message = afkUsers.length > 0 
        ? `*Daftar Pengguna AFK:*\n\n${afkUsers.join('\n\n')}`
        : `Tidak ada pengguna yang sedang AFK.`
    
    conn.sendMessage(m.chat, { text: message })
}

handler.help = ['listafk']
handler.tags = ['group']
handler.command = /^listafk$/i
handler.group = true
handler.premium = false

export default handler