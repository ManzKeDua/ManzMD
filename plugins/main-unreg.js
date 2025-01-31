import { createHash } from 'crypto'
let handler = async function (m, {text, conn, command, usedPrefix, args }) {
  if (!args[0]) throw 'Masukan Serial Nomor, Kalau Gatau Ketik .ceksn'
  
  let nama = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://i.ibb.co/3Fh9V6p/avatar-contact.png")
 let age = user.age
  let sn = createHash('md5').update(m.sender).digest('hex')
  let cap = `
╭━━「 *Information*
│• *Name:* ${nama}
│• *Age:* ${age} Years
│• *Status:* _unRegistration_
│• *Serial Number:* ${text}
╰╾»
`
  if (args[0] !== sn) throw 'Serial Nomor Salah'
  
conn.sendMessage(m.chat, {image: {url: pp}, caption: cap, contextInfo:
					{
						"externalAdReply": {
							"title": namebot,
							"body": '',
							"showAdAttribution": true,
							"mediaType": 1,
							"sourceUrl": '',
							"thumbnailUrl": unReg,
							"renderLargerThumbnail": true

						}
					}}, {quoted: m})
					
					  user.registered = false
					  
}
handler.help = ['unregister']
handler.tags = ['main']

handler.command = /^unreg(ister)?$/i
handler.register = true

export default handler