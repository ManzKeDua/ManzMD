import { createHash } from 'crypto';

let handler = async function (m, { conn, command, args }) {
    switch (command) {
        case 'grouplist':
            let groups = Object.entries(conn.chats)
                .filter(([jid, chat]) => 
                    jid.endsWith('@g.us') && 
                    chat.isChats && 
                    !chat.metadata?.read_only && 
                    !chat.metadata?.announce
                )
                .map(async ([jid, chat]) => {
                    try {
                        let groupMetadata = await conn.groupMetadata(jid);
                        let groupName = groupMetadata.subject || '(Nama tidak tersedia)';
                        let memberCount = groupMetadata.participants?.length || 0;
                        return { jid, groupName, memberCount };
                    } catch {
                        return null; // Abaikan grup yang tidak bisa diakses
                    }
                });

            // Tunggu semua informasi grup selesai diambil
            groups = await Promise.all(groups);
            groups = groups.filter(group => group !== null); // Hapus grup yang gagal diambil datanya

            let txt = '';
            groups.forEach((group, i) => {
                txt += `${i + 1}. ${group.groupName}\nID: ${group.jid}\nJumlah Anggota: ${group.memberCount}\n\n`;
            });

            m.reply(`List Groups:\nTotal Group: ${groups.length}\n\n${txt}`);
            break;

        case 'comotid':
            if (args.length !== 1 || isNaN(args[0])) 
                return m.reply('Format pesan salah. Gunakan: .comotid <nomor_urutan>');
            
            let index = parseInt(args[0]);
            let groupId = getGroupIdByIndex(conn, index);
            if (!groupId) return m.reply('Nomor urutan grup tidak valid.');

            // Kirimkan ID grup secara langsung
            m.reply(`ID Grup:\n${groupId}`);
            break;
    }
}

handler.help = ['grouplist'];
handler.tags = ['group'];
handler.command = /^(grouplist|comotid)$/i;
handler.owner = true;
export default handler;

// Fungsi untuk mengambil ID grup berdasarkan nomor urutan
function getGroupIdByIndex(conn, index) {
    let groups = Object.entries(conn.chats)
        .filter(([jid, chat]) => 
            jid.endsWith('@g.us') && 
            chat.isChats && 
            !chat.metadata?.read_only && 
            !chat.metadata?.announce
        )
        .map(([jid]) => jid);
    if (index < 1 || index > groups.length) return null;
    return groups[index - 1];
}