/* Isi konten MeowCare. Ditulis ulang dengan kata sendiri dari rujukan umum
   (lihat daftar sumber di bawah). Informasi bersifat umum, bukan pengganti dokter hewan. */
window.MEOW_DATA = {
  breeds: ['Domestik / Kampung', 'Persia', 'Anggora', 'Maine Coon', 'British Shorthair', 'Bengal',
           'Ragdoll', 'Scottish Fold', 'Siamese', 'Munchkin', 'Sphynx', 'Lainnya'],

  tips: [
    'Ganti air minum kucing minimal sekali sehari dan pakai wadah yang bersih.',
    'Timbang kucing tiap bulan. Naik atau turun mendadak patut dicurigai.',
    'Bersihkan pasir setiap hari. Pasir kotor bisa membuat kucing menolak buang air di tempatnya.',
    'Ganti jenis makanan pelan-pelan selama 5-7 hari supaya perutnya tidak kaget.',
    'Sediakan tempat tinggi dan tempat bersembunyi. Kucing merasa aman kalau bisa mengamati dari atas.',
    'Cek kuku tiap 2-3 minggu dan sediakan garukan supaya sofa selamat.',
    'Jangan pernah memberi obat manusia (misalnya paracetamol). Bisa sangat berbahaya untuk kucing.',
    'Catat tanggal vaksin dan obat cacing di MeowCare supaya tidak terlewat.',
    'Kedipan pelan dari kucing biasanya tanda nyaman. Coba balas dengan kedipan pelan juga.',
    'Kucing steril lebih mudah gemuk, jadi sesuaikan porsi makannya.',
    'Bermain 10-15 menit sehari membantu kucing tetap aktif dan tidak stres.',
    'Bulu rontok berlebihan bisa tanda stres, kutu, atau jamur. Periksa kulitnya.'
  ],

  feedFreq: {
    kitten: 'Anak kucing di bawah 4 bulan biasanya makan 3-4 kali sehari.',
    junior: 'Kucing 4-12 bulan biasanya makan 2-3 kali sehari.',
    dewasa: 'Kucing dewasa umumnya makan 2 kali sehari.',
    senior: 'Kucing senior biasanya lebih cocok makan 2-3 kali dengan porsi kecil.'
  },

  ages: [
    { key: 'kitten', icon: '🍼', title: 'Anak kucing', range: 'di bawah 4 bulan', freq: '3-4 kali sehari',
      food: 'Makanan khusus anak kucing (kitten) karena kebutuhan protein dan energinya tinggi.',
      note: 'Penyapihan biasanya sekitar usia 8 minggu. Kalau anak kucing belum bisa makan padat, tanyakan ke dokter hewan soal susu pengganti khusus kucing.' },
    { key: 'junior', icon: '🐱', title: 'Remaja', range: '4-12 bulan', freq: '2-3 kali sehari',
      food: 'Tetap makanan kitten sampai sekitar 12 bulan, lalu beralih bertahap ke makanan dewasa.',
      note: 'Masa tumbuh cepat. Pantau berat badan supaya tidak terlalu kurus atau gemuk.' },
    { key: 'dewasa', icon: '😺', title: 'Dewasa', range: '1-7 tahun', freq: '2 kali sehari',
      food: 'Makanan lengkap dan seimbang untuk kucing dewasa, kering, basah, atau campuran.',
      note: 'Kucing steril cenderung lebih mudah gemuk, jadi porsi perlu disesuaikan.' },
    { key: 'senior', icon: '👵', title: 'Senior', range: 'di atas 7 tahun', freq: '2-3 kali sehari, porsi kecil',
      food: 'Makanan yang mudah dikunyah dan dicerna. Dokter hewan bisa menyarankan diet khusus.',
      note: 'Cek gigi, berat badan, dan fungsi ginjal secara berkala, karena masalah ini lebih sering muncul di usia senior.' }
  ],

  foodTypes: [
    { name: 'Makanan kering (dry food)', icon: '🥣',
      pros: ['Praktis dan tahan lama', 'Relatif murah', 'Membantu menjaga kebersihan gigi sedikit'],
      cons: ['Kadar air rendah, kucing harus cukup minum', 'Mudah overfeeding kalau tidak diukur'] },
    { name: 'Makanan basah (wet food)', icon: '🥫',
      pros: ['Kadar air tinggi, membantu asupan cairan', 'Biasanya lebih disukai kucing'],
      cons: ['Lebih mahal', 'Cepat basi setelah dibuka, simpan di kulkas dan habiskan dalam 1-2 hari'] },
    { name: 'Makanan rumahan', icon: '🍗',
      pros: ['Bahan bisa dikontrol'],
      cons: ['Sulit seimbang. Kucing butuh nutrisi khusus seperti taurin', 'Tidak disarankan sebagai makanan utama tanpa resep dari dokter hewan atau ahli gizi hewan'] },
    { name: 'Makanan mentah (raw)', icon: '🥩',
      pros: ['Sebagian pemilik menyukainya'],
      cons: ['Risiko bakteri dan parasit', 'Sulit seimbang. Diskusikan dulu dengan dokter hewan'] }
  ],

  water: [
    'Sediakan air bersih dan segar setiap saat, ganti minimal sekali sehari.',
    'Letakkan beberapa wadah di tempat berbeda, jauh dari wadah makan dan pasir.',
    'Banyak kucing suka air mengalir. Pancuran minum (fountain) bisa membantu.',
    'Menambahkan makanan basah membantu kucing yang malas minum.',
    'Kucing yang tiba-tiba minum jauh lebih banyak dari biasanya perlu diperiksa dokter hewan.'
  ],

  danger: [
    { name: 'Bawang merah dan bawang putih', icon: '🧅', why: 'Merusak sel darah merah dan bisa menyebabkan anemia. Termasuk makanan manusia yang diberi bumbu bawang.' },
    { name: 'Cokelat', icon: '🍫', why: 'Mengandung teobromin dan kafein yang bisa menyerang jantung dan saraf.' },
    { name: 'Anggur dan kismis', icon: '🍇', why: 'Bisa merusak ginjal. Jangan beri meski sedikit.' },
    { name: 'Kopi, teh, dan minuman berkafein', icon: '☕', why: 'Kafein membuat jantung berdebar dan gelisah.' },
    { name: 'Alkohol', icon: '🍺', why: 'Sangat berbahaya, sedikit saja bisa fatal untuk tubuh sekecil kucing.' },
    { name: 'Tulang ayam matang', icon: '🦴', why: 'Mudah patah dan runcing sehingga bisa melukai tenggorokan atau usus.' },
    { name: 'Bunga lily', icon: '🌷', why: 'Tanaman (bukan makanan), tapi sangat beracun untuk ginjal kucing, bahkan serbuk sarinya.' },
    { name: 'Adonan mentah beragi', icon: '🍞', why: 'Mengembang di perut dan menghasilkan alkohol.' }
  ],

  safe: [
    { name: 'Ayam atau ikan rebus polos', icon: '🍗', note: 'Tanpa garam, bumbu, dan tulang. Sebagai tambahan, bukan makanan utama.' },
    { name: 'Telur matang', icon: '🥚', note: 'Dimasak matang tanpa bumbu, dalam jumlah kecil.' },
    { name: 'Makanan kucing komersial lengkap', icon: '🥫', note: 'Cari yang tertulis lengkap dan seimbang (complete and balanced).' },
    { name: 'Rumput kucing (cat grass)', icon: '🌱', note: 'Aman dan membantu kucing yang suka mengunyah rumput.' }
  ],

  myths: [
    { myth: 'Kucing harus minum susu sapi.', fact: 'Banyak kucing dewasa sulit mencerna laktosa dan bisa diare. Air putih sudah cukup. Ada susu khusus kucing kalau mau.' },
    { myth: 'Ikan mentah bagus untuk kucing.', fact: 'Ikan mentah berisiko parasit dan bisa mengganggu penyerapan vitamin tertentu. Lebih aman dimasak.' },
    { myth: 'Kucing gendut itu sehat dan lucu.', fact: 'Kelebihan berat badan meningkatkan risiko diabetes, masalah sendi, dan penyakit lain.' },
    { myth: 'Kucing makan rumput berarti sedang sakit.', fact: 'Sering kali normal. Perlu dicek hanya kalau disertai muntah berulang atau lemas.' },
    { myth: 'Kucing boleh makan makanan anjing.', fact: 'Kebutuhan nutrisinya berbeda. Kucing butuh taurin dan protein lebih tinggi.' }
  ],

  quiz: [
    { food: 'Ayam rebus polos tanpa bumbu', icon: '🍗', safe: true, why: 'Aman dalam jumlah kecil sebagai tambahan, asal tanpa bumbu dan tulang.' },
    { food: 'Cokelat', icon: '🍫', safe: false, why: 'Cokelat mengandung teobromin yang beracun untuk kucing.' },
    { food: 'Bawang putih', icon: '🧄', safe: false, why: 'Bawang merusak sel darah merah dan bisa menyebabkan anemia.' },
    { food: 'Telur matang', icon: '🥚', safe: true, why: 'Telur matang tanpa bumbu aman dalam jumlah kecil.' },
    { food: 'Anggur', icon: '🍇', safe: false, why: 'Anggur dan kismis bisa merusak ginjal kucing.' },
    { food: 'Tulang ayam matang', icon: '🦴', safe: false, why: 'Tulang matang mudah patah dan bisa melukai saluran cerna.' },
    { food: 'Ikan rebus tanpa tulang dan bumbu', icon: '🐟', safe: true, why: 'Aman sebagai tambahan, pastikan matang dan bebas tulang.' },
    { food: 'Bunga lily', icon: '🌷', safe: false, why: 'Semua bagian bunga lily sangat beracun untuk ginjal kucing.' }
  ],

  vaccine: [
    { when: '6-8 minggu', title: 'Vaksin inti pertama', detail: 'Vaksin kombinasi (F3/FVRCP) melindungi dari panleukopenia, flu kucing (herpesvirus dan calicivirus).' },
    { when: '9-12 minggu', title: 'Booster kedua', detail: 'Pengulangan vaksin kombinasi, jarak sekitar 3-4 minggu dari dosis sebelumnya.' },
    { when: '12 minggu ke atas', title: 'Vaksin rabies', detail: 'Rabies umumnya mulai sekitar usia 12 minggu. Ikuti aturan setempat dan saran dokter hewan.' },
    { when: 'sekitar 16 minggu', title: 'Booster akhir seri anak kucing', detail: 'Dosis terakhir seri vaksin kombinasi biasanya diberikan pada usia 16 minggu atau lebih.' },
    { when: '1 tahun', title: 'Booster pertama', detail: 'Booster vaksin kombinasi dan rabies setelah satu tahun.' },
    { when: 'Tiap 1-3 tahun', title: 'Booster lanjutan', detail: 'Interval tergantung jenis vaksin, gaya hidup kucing, dan anjuran dokter hewan.' }
  ],

  deworm: [
    { when: '2-8 minggu', text: 'Anak kucing biasanya diberi obat cacing tiap 2 minggu.' },
    { when: '2-6 bulan', text: 'Dilanjutkan tiap bulan sampai sekitar usia 6 bulan.' },
    { when: 'Dewasa', text: 'Umumnya tiap 3 bulan, atau sesuai saran dokter hewan, tergantung apakah kucing keluar rumah.' },
    { when: 'Kutu', text: 'Obat anti kutu diberikan rutin (biasanya tiap bulan) sesuai produk dan petunjuk dokter hewan.' }
  ],

  signs: [
    { part: 'Mata', healthy: 'Jernih, terbuka lebar, tidak berair', sick: 'Berair, belekan, merah, sering menyipit' },
    { part: 'Hidung', healthy: 'Bersih, sedikit lembap', sick: 'Ingus kental, sering bersin, tersumbat' },
    { part: 'Bulu dan kulit', healthy: 'Mengilap, halus, tidak ada kutu', sick: 'Kusam, rontok berlebihan, botak, ada kerak atau kutu' },
    { part: 'Nafsu makan', healthy: 'Makan teratur dengan lahap', sick: 'Tidak mau makan atau minum, atau minum berlebihan' },
    { part: 'Buang air', healthy: 'Feses padat, pipis lancar', sick: 'Diare, sembelit, darah, atau sulit pipis' },
    { part: 'Perilaku', healthy: 'Aktif, penasaran, suka bermain', sick: 'Lemas, bersembunyi, agresif tidak biasa, mengeong kesakitan' }
  ],

  diseases: [
    { name: 'Flu kucing', icon: '🤧',
      symptoms: 'Bersin, ingus, mata berair, demam ringan, nafsu makan turun.',
      cause: 'Biasanya virus (herpesvirus dan calicivirus), menular antar kucing.',
      firstAid: 'Pisahkan dari kucing lain, bersihkan mata dan hidung dengan kapas lembap, jaga ruangan hangat dan tenang, pastikan tetap makan dan minum.',
      vet: 'Kalau tidak membaik 2-3 hari, tidak mau makan, atau sulit bernapas.' },
    { name: 'Cacingan', icon: '🪱',
      symptoms: 'Perut buncit, bulu kusam, diare, berat badan turun, kadang terlihat cacing di feses.',
      cause: 'Telur cacing dari lingkungan, kutu, atau dari induk.',
      firstAid: 'Jaga kebersihan pasir dan tempat makan. Obat cacing diberikan sesuai jadwal.',
      vet: 'Pada anak kucing yang lemas, kurus, atau diare parah.' },
    { name: 'Jamur kulit (ringworm)', icon: '🍄',
      symptoms: 'Bercak bulat botak, kulit bersisik atau berkerak, gatal.',
      cause: 'Infeksi jamur. Bisa menular ke manusia.',
      firstAid: 'Batasi kontak, cuci tangan setelah memegang, bersihkan lingkungan.',
      vet: 'Segera periksakan karena butuh obat khusus dan bisa menular ke manusia.' },
    { name: 'Kutu dan tungau telinga', icon: '🦟',
      symptoms: 'Menggaruk berlebihan, telinga berkerak hitam seperti ampas kopi, bulu rontok.',
      cause: 'Parasit luar yang menular lewat kontak atau lingkungan.',
      firstAid: 'Jangan menyemprot atau meneteskan obat sembarangan. Bersihkan kandang dan kain tidur.',
      vet: 'Untuk obat yang tepat dan aman sesuai usia kucing.' },
    { name: 'Diare', icon: '💩',
      symptoms: 'Feses cair atau lembek, buang air lebih sering.',
      cause: 'Ganti makanan mendadak, makan sesuatu yang salah, parasit, atau infeksi.',
      firstAid: 'Pastikan minum cukup, kembalikan ke makanan biasa yang ringan, amati 24 jam.',
      vet: 'Kalau ada darah, lebih dari 24-48 jam, kucing lemas, atau anak kucing.' },
    { name: 'Gangguan saluran kemih', icon: '🚽',
      symptoms: 'Bolak-balik ke pasir, mengejan, pipis sedikit atau berdarah, sering menjilat area kelamin.',
      cause: 'Batu, infeksi, stres, atau kurang minum. Kucing jantan lebih berisiko tersumbat.',
      firstAid: 'Tidak ada pertolongan rumahan yang aman.',
      vet: 'Segera. Kucing yang tidak bisa pipis bisa membahayakan nyawa dalam hitungan jam.' }
  ],

  emergency: [
    { icon: '🚫', text: 'Tidak makan lebih dari 24 jam (anak kucing: lebih cepat dari itu)' },
    { icon: '🤮', text: 'Muntah terus-menerus atau muntah darah' },
    { icon: '😮‍💨', text: 'Sulit bernapas, bernapas dengan mulut terbuka' },
    { icon: '🚽', text: 'Mengejan tapi tidak bisa pipis' },
    { icon: '⚡', text: 'Kejang atau pingsan' },
    { icon: '☠️', text: 'Diduga makan racun atau tanaman beracun' },
    { icon: '🩸', text: 'Luka dalam, perdarahan yang tidak berhenti, atau habis kecelakaan' },
    { icon: '🥶', text: 'Sangat lemas, gusi pucat, atau badan terasa sangat panas atau dingin' }
  ],

  care: [
    { icon: '🪮', title: 'Grooming', text: 'Sikat bulu 1-3 kali seminggu (tiap hari untuk bulu panjang) untuk mengurangi bulu rontok dan bola bulu.' },
    { icon: '✂️', title: 'Potong kuku', text: 'Sekitar tiap 2-3 minggu. Potong ujung putihnya saja, hindari bagian merah muda.' },
    { icon: '👂', title: 'Telinga', text: 'Cek tiap minggu. Telinga bersih berwarna pink pucat. Kerak hitam atau bau perlu diperiksa.' },
    { icon: '🦷', title: 'Gigi', text: 'Sikat gigi dengan pasta khusus hewan kalau kucing mau, dan cek gigi saat kontrol.' },
    { icon: '🧼', title: 'Mandi', text: 'Tidak perlu sering. Kalau perlu, pakai sampo khusus kucing, keringkan sampai benar-benar kering.' },
    { icon: '🧹', title: 'Pasir', text: 'Bersihkan kotoran tiap hari dan ganti total pasir secara berkala.' },
    { icon: '⚖️', title: 'Timbang berat', text: 'Sebulan sekali. Perubahan berat yang mendadak bisa jadi tanda masalah.' },
    { icon: '🏥', title: 'Steril', text: 'Umumnya dilakukan sekitar usia 5-6 bulan, konsultasikan waktu yang tepat dengan dokter hewan. Mengurangi risiko beberapa penyakit dan perilaku menandai wilayah.' }
  ],

  firstAid: [
    { title: 'Luka kecil', steps: ['Tenangkan kucing dan jaga agar tidak menjilat luka.', 'Bilas dengan air bersih atau larutan NaCl 0,9%.', 'Tekan dengan kain bersih kalau berdarah.', 'Bawa ke dokter hewan kalau dalam, lebar, atau tidak berhenti berdarah.'] },
    { title: 'Diduga keracunan', steps: ['Jangan memaksa kucing muntah.', 'Singkirkan sumber racun dari jangkauan.', 'Simpan kemasan atau sampel bahan yang dimakan.', 'Segera bawa ke dokter hewan.'] },
    { title: 'Kepanasan', steps: ['Pindahkan ke tempat sejuk dan berventilasi.', 'Basahi bulu dengan air suhu ruang (bukan air es).', 'Beri air minum, jangan dipaksa.', 'Tetap bawa ke dokter hewan.'] },
    { title: 'Patah tulang atau jatuh', steps: ['Jangan diluruskan atau ditarik.', 'Letakkan dalam kardus atau kandang dengan alas lembut.', 'Bawa ke dokter hewan secepatnya.'] }
  ],

  sources: [
    'AAHA/AAFP Feline Life Stage Guidelines',
    'WSAVA Global Vaccination Guidelines',
    'ESCCAP Guideline: Worm Control in Dogs and Cats',
    'Cornell Feline Health Center (Cornell University)',
    'ASPCA Animal Poison Control: daftar tanaman dan makanan beracun',
    'Merck Veterinary Manual (bagian kucing)'
  ]
};
