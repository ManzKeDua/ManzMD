import got from 'got';
import fetch from 'node-fetch';
import axios from 'axios';
import { format } from 'util';

const MAX_CONTENT_SIZE = 100 * 1024 * 1024 * 1024; // 100GB
const REQUEST_TIMEOUT = 15000; // 15 detik

let handler = async (m, { text }) => {
  if (!text) throw '*Masukkan Link*\n*Ex:* https://example.com';

  text = addHttpsIfNeeded(text);
  let url, origin;

  try {
    ({ href: url, origin } = new URL(text));
  } catch {
    throw 'URL tidak valid. Pastikan formatnya benar.';
  }

  let response, txt;

  try {
    response = await fetchData(url, origin);
    txt = response.body;
  } catch (error) {
    throw `Gagal mengambil data: ${error.message || error}`;
  }

  const contentLength = response.headers['content-length'] || 0;
  if (contentLength > MAX_CONTENT_SIZE) {
    return m.reply(`File terlalu besar. Ukuran maksimum adalah ${formatSize(MAX_CONTENT_SIZE)}`);
  }

  const contentType = response.headers['content-type'] || '';
  if (/image|audio|video|application\/octet-stream/.test(contentType)) {
    // Kirim file biner
    return conn.sendFile(m.chat, url, `file_${Date.now()}`, 'Berikut file yang Anda minta', m);
  }

  if (/text|json/.test(contentType)) {
    try {
      txt = format(JSON.parse(txt + ''));
    } catch {
      txt = txt + '';
    } finally {
      m.reply(txt.slice(0, 65536) + '');
    }
  } else {
    m.reply('Jenis konten tidak didukung untuk pratinjau.');
  }
};

async function fetchData(url, referer) {
  try {
    return await got(url, { headers: { referer }, timeout: REQUEST_TIMEOUT });
  } catch {
    try {
      return await fetch(url, { headers: { referer }, timeout: REQUEST_TIMEOUT }).then((res) => ({
        body: res.text(),
        headers: res.headers.raw(),
      }));
    } catch {
      return await axios.get(url, {
        headers: { referer },
        timeout: REQUEST_TIMEOUT,
        responseType: 'arraybuffer',
      });
    }
  }
}

function addHttpsIfNeeded(link) {
  if (!/^https?:\/\//i.test(link)) {
    link = 'https://' + link;
  }
  return link;
}

function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

handler.help = ['fetch'];
handler.tags = ['main'];
handler.alias = ['get', 'fetch'];
handler.command = /^(fetch|get)$/i;

export default handler;