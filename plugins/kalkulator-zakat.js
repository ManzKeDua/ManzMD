/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply(`Penggunaan: 
.zakatfitrah <jumlah anggota keluarga>
.zakatmaal <total penghasilan per tahun>

Contoh:
.zakatfitrah 4
.zakatmaal 60000000`);
  }

  let command = m.text.split(' ')[0].slice(1); // Ambil perintah (zakatfitrah atau zakatmaal)
  let jumlah = parseInt(args[0]);

  if (isNaN(jumlah) || jumlah <= 0) {
    return m.reply('Masukkan angka yang valid untuk perhitungan.');
  }

  let hasil;
  switch (command) {
    case 'zakat-fitrah':
      let hargaBeras = 15000; // Harga beras per kg (bisa disesuaikan)
      let zakatFitrah = 2.5 * hargaBeras; // Zakat fitrah per orang
      hasil = `💰 *Perhitungan Zakat Fitrah:*
Jumlah anggota keluarga: ${jumlah}
Zakat per orang: Rp ${zakatFitrah.toLocaleString()}
Total zakat fitrah: Rp ${(jumlah * zakatFitrah).toLocaleString()}`;
      break;

    case 'zakat-mal':
      let nisab = 520 * 15000; // Nisab zakat maal (harga emas 520 gram)
      if (jumlah >= nisab) {
        let zakatMaal = jumlah * 0.025; // 2.5% dari total penghasilan
        hasil = `💰 *Perhitungan Zakat Maal:*
Total penghasilan: Rp ${jumlah.toLocaleString()}
Nisab zakat maal: Rp ${nisab.toLocaleString()}
Zakat yang harus dibayarkan: Rp ${zakatMaal.toLocaleString()}`;
      } else {
        hasil = `💰 *Perhitungan Zakat Maal:*
Total penghasilan: Rp ${jumlah.toLocaleString()}
Nisab zakat maal: Rp ${nisab.toLocaleString()}
Status: Tidak memenuhi nisab, tidak wajib zakat maal.`;
      }
      break;

    default:
      return m.reply('Perintah tidak dikenal. Gunakan .zakatfitrah atau .zakatmaal.');
  }

  m.reply(hasil);
};

handler.help = ['zakat-fitrah', 'zakat-mal'];
handler.tags = ['general'];
handler.command = /^(zakat-fitrah|zakat-mal)$/i;

export default handler;