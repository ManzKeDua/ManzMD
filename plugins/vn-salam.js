import util from "util";
import path from "path";

let handler = async (m, { conn }) => {
    // Pilih file audio secara acak dari daftar salam
    conn.sendFile(m.chat, salam.getRandom(), "salam.mp3", null, m, true, {
        type: "audioMessage",
        ptt: true,
    });
};
handler.customPrefix =
    /^(assalamualaikum|assalamu'alaikum|salam|asalamualaikum|assalam|asalam|salam|salom|shalom|Assalamualaikum)$/i;
handler.command = new RegExp();

export default handler;

// Daftar file audio untuk salam
const salam = [
    "https://8030.us.kg/file/WQXGajOeJbJy.mp3",
    "https://8030.us.kg/file/cQqs1CkmjZqU.mp3",
    "https://8030.us.kg/file/fyYDP0OCgFJp.mp3",
];

// Fungsi untuk memilih elemen acak dari array
Array.prototype.getRandom = function () {
    return this[Math.floor(Math.random() * this.length)];
};