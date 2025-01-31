import fetch from 'node-fetch';
import { addExif } from '../lib/sticker.js';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  const { mtype } = m;

  if (!text) return m.reply('Teksnya Mana Sayang?');
  if (text.length > 30) return m.reply('Maksimal 30 Teks!');

  let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/a2ae6cbfa40f6eeea0cf1.jpg');

  if (m.quoted) {
    if (q.mtype == 'extendedTextMessage') {
      conn.sendMessage(m.chat, {
        react: {
          text: "🕛",
          key: m.key,
        },
      });

      let objj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#fffffffff",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
          "entities": [],
          "avatar": true,
          "from": {
            "id": 1,
            "name": m.name,
            "photo": { "url": pp }
          },
          "text": text,
          "replyMessage": {
            "name": await conn.getName(m.quoted.sender),
            "text": m.quoted.text || '',
            "chatId": m.chat.split('@')[0],
          }
        }]
      };

      const bufferr = await Quotly(objj);

      let stikerr = await createSticker(bufferr, false, global.packname, global.author);
      if (stikerr) return conn.sendFile(m.chat, stikerr, 'Quotly.webp', '', m);
      
      conn.sendMessage(m.chat, {
        react: {
          text: "✅",
          key: m.key,
        },
      });
    } else if (q.mtype == 'stickerMessage' || q.mtype == 'imageMessage') {
      let img = await q.download();

      conn.sendMessage(m.chat, {
        react: {
          text: "🕛",
          key: m.key,
        },
      });

      let up;
      if (/webp/g.test(mime)) {
        up = await webp2png(img);
      } else if (/image/g.test(mime)) {
        up = await uploadImage(img);
      }

      let obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#ffffffff",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
          "entities": [],
          "media": { "url": up },
          "avatar": true,
          "from": {
            "id": 1,
            "name": m.name,
            "photo": { "url": pp }
          },
          "text": text,
          "replyMessage": {}
        }]
      };

      const buffer = await Quotly(obj);

      let stiker = await createSticker(buffer, false, global.packname, global.author);
      if (stiker) return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m);

      conn.sendMessage(m.chat, {
        react: {
          text: "✅",
          key: m.key,
        },
      });
    }
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "🕛",
        key: m.key,
      },
    });

    let obj2 = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#ffffffff",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": m.name,
          "photo": { "url": pp }
        },
        "text": text,
        "replyMessage": {}
      }]
    };

    const buffer = await Quotly(obj2);

    let Sstiker = await createSticker(buffer, false, global.packname, global.author);
    if (Sstiker) return conn.sendFile(m.chat, Sstiker, 'Quotly.webp', '', m);

    conn.sendMessage(m.chat, {
      react: {
        text: "✅",
        key: m.key,
      },
    });
  }
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc|quoted|quotly)$/i;
handler.limit = true;

export default handler;

async function Quotly(obj) {
  let json;

  try {
    // Mengirim permintaan POST ke API
    json = await fetch("https://btzqc.betabotz.eu.org/generate", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    // Mengecek apakah respons API berhasil dan apakah data yang diperlukan ada
    const data = await json.json();
    if (data && data.result && data.result.image) {
      const results = data.result.image;
      const buffer = Buffer.from(results, "base64");
      return buffer;
    } else {
      throw new Error('Gagal mendapatkan gambar dari API');
    }
  } catch (e) {
    console.error('Error dalam pembuatan gambar:', e);
    return null;  // Mengembalikan null jika terjadi error
  }
}

async function createSticker(img, url, packName, authorName, quality = 20) {
  let stickerMetadata = {
    type: 'full',
    pack: global.info.stickpack,
    author: global.info.stickauth,
    quality
  };
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer();
}