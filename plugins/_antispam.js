export async function all(m) {
    if (!m.message) return;

    this.spam = this.spam || {};

    if (m.sender in this.spam) {
        this.spam[m.sender].count++;

        // Cek apakah waktu pesan terakhir lebih dari 5 detik
        if (m.messageTimestamp.toNumber() - this.spam[m.sender].lastspam > 5) {
            // Jika pesan melebihi batas 5 dalam waktu 5 detik
            if (this.spam[m.sender].count > 5) {
                // Tambahkan peringatan pada database pengguna
                global.db.data.users[m.sender].warn = (global.db.data.users[m.sender].warn || 0) + 1;

                // Kirim peringatan teks
                conn.reply(m.chat, 'Jangan spam, beri jeda beberapa detik!', m);

                // Daftar audio untuk peringatan
                let audioLinks = [
                    "https://8030.us.kg/file/AdetXhJOoypT.mp3",
                    "https://8030.us.kg/file/aotFKFT4wQ6A.mp3"
                ];

                // Pilih audio secara acak
                let randomAudio = audioLinks[Math.floor(Math.random() * audioLinks.length)];

                // Kirim file audio
                conn.sendFile(m.chat, randomAudio, "spam.mp3", null, m, true, {
                    type: "audioMessage",
                    ptt: true,
                });
            }

            // Reset jumlah spam dan waktu terakhir
            this.spam[m.sender].count = 0;
            this.spam[m.sender].lastspam = m.messageTimestamp.toNumber();
        }
    } else {
        // Buat data baru untuk pengguna yang belum ada dalam objek spam
        this.spam[m.sender] = {
            jid: m.sender,
            count: 0,
            lastspam: 0
        };
    }
}

// Handler tambahan (opsional, jika ingin digunakan untuk fungsi lain)
let handler = async (m, { conn }) => {
    // Jika diperlukan, tambahkan fungsi di sini
};

export default handler;