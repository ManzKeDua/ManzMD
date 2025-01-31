
import { createHash } from 'crypto'
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix, command }) {
// let idUser = await conn.groupMetadata(idgc)
    /*
if (Object.values(idUser.participants).find(user => user.id == m.sender)) {
*/
// nama
let namae = conn.getName(m.sender)
// database 
let user = global.db.data.users[m.sender]
// profile
const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
// checking user
  if (user.registered === true) throw `You Have Already Registered In The Database, Do You Want To Re-Register? *${usedPrefix}unreg*`
  // input 
  if (!Reg.test(text)) return m.reply(`Masukan Nama.Umur kamu\nContoh: .daftar Tio.17`)
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw 'Nama Tidak Boleh Kosong'
  if (!age) throw 'Umur Tidak Boleh Kosong'
  age = parseInt(age)
  if (age > 30) throw 'Tua Banget amjir -_-'
  if (age < 5) throw 'Terlalu bocil ;!'
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender
  let cap = `
╭━━「 *Information*
│• *Name:* ${name}
│• *Age:* ${age} Years
│• *Status:* _Success_
│• *Serial Number:* ${sn}
╰╾•••
`
await conn.sendMessage(m.chat, { text: cap,
contextInfo:
					{
						"externalAdReply": {
							"title": " ✔️ S U C C E S S  R E G I S T R A S I",
							"body": "",
							"showAdAttribution": true,
							"mediaType": 1,
							"sourceUrl": '',
							"thumbnailUrl": pp,
							"renderLargerThumbnail": true

						}
					}}, m)
}
handler.help = ['daftar']
handler.tags = ['main']

handler.command = /^(daftar|verify|reg(ister)?)$/i

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}