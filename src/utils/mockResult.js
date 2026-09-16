const angles = [
  'Produk jadi pusat cerita',
  'Sudut lifestyle & keseharian',
  'Fokus promo & value',
  'Behind the scenes produksi',
  'Testimoni & bukti sosial',
  'Tips singkat untuk audiens',
  'Keunggulan produk vs kompetitor',
  'Ajakan interaksi (QnA / polling)',
  'Inspirasi pemakaian produk',
  'Mini-thread edukasi brand',
]

const captionStarters = [
  'Halo! Kali ini kita kenalan lebih dekat dengan',
  'Satu hal yang bikin ini beda adalah',
  'Jangan lewatkan kabar spesial tentang',
  'Kalau kamu mencari solusi simpel, jawabannya ada di',
  'Menikmati momen harimu bersama',
  'Rahasia kecil di balik produk favoritmu:',
]

const ctas = [
  'Tap tombol untuk info selengkapnya, tag temanmu, dan simpan postingan ini.',
  'Komentar "Mau" dan DM kami untuk detailnya!',
  'Kunjungi link di bio, jangan sampai kehabisan!',
  'Pilih emoji 🔥 kalau suka, dan bagikan ke temanmu.',
]

function extractCount(title, description) {
  const text = `${title} ${description ?? ''}`
  const match = text.match(/(\d{1,2})\s*(feed|konten|postingan|post|caption|kulit)/i)
  const n = match ? Number.parseInt(match[1], 10) : 3
  return Math.min(Math.max(n, 1), 12)
}

export function buildMockResult(employeeId, title, refCount = 0, description = '') {
  if (employeeId === 'content-creator') {
    const count = extractCount(title, description)
    const refNote =
      refCount > 0
        ? ` menggunakan ${refCount} referensi foto sebagai acuan visual`
        : ' menggunakan konsep visual standar brand'
    const outputs = Array.from({ length: count }, (_, i) => ({
      title: `Feed ${i + 1} — ${angles[i % angles.length]}`,
      caption: `${captionStarters[i % captionStarters.length]} "${title}". ${ctas[i % ctas.length]}`,
    }))
    return {
      summary: `Siap! ${count} konsep feed Instagram + caption sudah dibuat${refNote}. Setiap feed punya sudut konsep unik dan caption dengan CTA siap tempel.`,
      outputs,
      notes:
        'Hasil ini berupa konsep teks & arahan desain (mock data). Integrasi AI untuk pembuatan gambar feed menyusul pada tahap berikutnya.',
    }
  }

  if (employeeId === 'admin-stok') {
    return {
      summary: `Tugas "${title}" selesai. Data stok diproses dan laporan ringkas sudah disusun.`,
      outputs: [
        'Total SKU terpantau: 42 SKU.',
        'Item di bawah reorder point: 3 item (butuh reorder).',
        'Selisih sistem vs catatan gudang: tidak ada selisih signifikan.',
        'Rekomendasi penambahan stok untuk 3 SKU paling cepat bergerak.',
      ],
      notes: 'Laporan ini berdasar data mock pada Knowledge Base. Hubungkan data real di tahap berikutnya.',
    }
  }

  return {
    summary: `Analisis untuk "${title}" selesai. Ringkasan dan rekomendasi berbasis data sudah disusun.`,
    outputs: [
      'Ringkasan performa periode berjalan.',
      '3 insight utama yang perlu menjadi perhatian.',
      'Proyeksi sederhana 3 bulan ke depan.',
      'Rekomendasi tindakan prioritas.',
    ],
    notes: 'Hasil berbasis mock data. Integrasi API analitik akan menyusul.',
  }
}

export function categoryFor(employeeId) {
  if (employeeId === 'content-creator') return 'Konten'
  if (employeeId === 'admin-stok') return 'Operasional'
  return 'Analisis'
}