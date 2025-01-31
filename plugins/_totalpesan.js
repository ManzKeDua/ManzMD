import fs from 'fs';
import path from 'path';

const dbPath = path.join('lib', 'pesan.json');

// Memastikan file database ada
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}), 'utf-8');
}

export async function before(m) {
  if (m.isBaileys && m.fromMe) return true;

  // Load database
  let pesanData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Inisialisasi database untuk pengguna jika belum ada
  if (!pesanData[m.sender]) {
    pesanData[m.sender] = { totalPesan: 0 };
  }

  // Tambahkan hitungan pesan
  pesanData[m.sender].totalPesan += 1;

  // Simpan kembali database
  fs.writeFileSync(dbPath, JSON.stringify(pesanData, null, 2), 'utf-8');

  return true;
}