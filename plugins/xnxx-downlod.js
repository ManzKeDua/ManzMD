/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
  if (!text) throw `Linknya Mana?\nExample: *.xnxxvideo https://www.xnxx.com/video-141ewlbb/free_use_anytime_sex_big_ass_latina_milf_step_mom_after_deal_with_step_son*`
  m.reply('Please wait...')
  
  try {
    let res = await fetch(`https://api.agatz.xyz/api/xnxxdown?url=${encodeURIComponent(text)}`)
    let json = await res.json()
    
    if (json.status !== 200 || !json.data.status) throw 'Failed to fetch data from API'

    let videoUrl = json.data.files.high || json.data.files.low || json.data.files.HLS
    let caption = `Title: ${json.data.title}\nDuration: ${json.data.duration}\nInfo: ${json.data.info}`
    let thumbnailUrl = json.data.image

    await conn.sendMessage(m.chat, { 
      video: { url: videoUrl }, 
      caption: caption 
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      image: { url: thumbnailUrl },
      caption: `Thumbnail`
    }, { quoted: m })
    
  } catch (e) {
    m.reply(`Terjadi Kesalahan, Tidak Dapat Mengambil Data Dari Url/Link Yang Kamu Masukan`)
  }
}

handler.help = ['xnxxvideo']
handler.tags = ['premium']
handler.command = /^xnxxvideo|xnxxdl$/i
handler.limit = false
handler.premium = true

export default handler