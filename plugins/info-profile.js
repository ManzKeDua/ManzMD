import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
let handler = async (m, { conn }) => {
  let user = db.data.users[m.sender]
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/f1ed66b7930885e565d2a.jpg')
    let { premium, owner, level, limit, exp, lastclaim, registered, regTime, age, pasangan, name } = global.db.data.users[m.sender]
    let username = conn.getName(who)
    var now = new Date() * 1
        
    let fkon = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
    let str = `乂 P R O F I L E
    
*⛌Nama:* ${username}
*⛌Username:* ${registered ? name : ''}
*⛌Tag:* @${who.replace(/@.+/, '')}
*⛌Nomor:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
*⛌Link:* https://wa.me/${who.split`@`[0]}
*⛌Umur:* ${registered ? age : ''} Tahun
*⛌Pasangan:*  ${pasangan ? `@${pasangan.split("@")[0]}` : `Tidak Punya`}
${readMore}
<❲ *Y O U R  S T A T U S* ❳>

*⛌Register:* ${registered ? 'Terdaftar': 'Tidak'}
*⛌Premium:* ${premium ? "Aktif" :"Tidak"}
*⛌PremiumTime:* 
${msToDate(user.premiumTime - now)}

*⛌Owner:* ${owner ? "Aktif" :"Tidak"}
*⛌OwnerTime:* 
${msToDate(user.ownerTime - now)}
`.trim()
   //await conn.sendFile(m.chat, pp, '', str, fkon)
   conn.sendMessage(m.chat, {text: str, contextInfo: {
   "externalAdReply": {
   "title": "Y O U R  P R O F I L E",
   "body": global.info.namebot,
   "showAdAttribution": true,
   "mediaType": 1,
   "sourceUrl": "https://wa.me/" + who.split`@`[0],
   "thumbnailUrl": pp,
   "renderLargerThumbnail": true
   }
   }}, {quoted: fkon})
}
handler.help = ['profile']
handler.tags = ['rpg']
handler.command = /^(profile|profil|me)$/i
handler.banned = false
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari\n" + hours + " Jam\n" + minutes + " Menit";
    // +minutes+":"+sec;
}