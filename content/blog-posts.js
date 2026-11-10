/* Artikel blog Bimbel Infinity.
   Sumber fakta: arsip Infinity (sejarah, program, daftar lulusan 2018) dan format SKD yang umum dipakai.
   Hal yang berubah tiap tahun (jadwal, kuota, nilai ambang batas) TIDAK ditulis angkanya; pembaca diarahkan
   ke pengumuman resmi. Edit artikel di sini, lalu jalankan: node tools/build-blog.js */

module.exports = [
  {
    slug: 'apa-itu-skd-pkn-stan',
    title: 'Apa itu SKD PKN STAN? Penjelasan TWK, TIU, dan TKP untuk orang tua',
    description: 'SKD adalah tes berbasis komputer dalam seleksi PKN STAN. Isinya tiga tes: TWK, TIU, dan TKP. Begini cara kerjanya, cara penilaiannya, dan cara menyiapkannya.',
    category: 'Seleksi PKN STAN',
    date: '2026-11-10',
    minutes: 6,
    summary: 'SKD (Seleksi Kompetensi Dasar) adalah tes berbasis komputer dalam seleksi PKN STAN. Isinya tiga tes: TWK (Tes Wawasan Kebangsaan), TIU (Tes Intelegensia Umum), dan TKP (Tes Karakteristik Pribadi). Peserta harus lolos nilai ambang batas di setiap tes, lalu bersaing dengan peserta lain di jurusan pilihannya.',
    body: `
<h2>SKD itu apa?</h2>
<p>SKD adalah singkatan dari <strong>Seleksi Kompetensi Dasar</strong>. Dalam beberapa tahun terakhir, seleksi masuk PKN STAN memakai SKD yang dikerjakan di komputer dengan sistem CAT (<em>computer assisted test</em>). Nilai muncul di layar begitu tes selesai, jadi peserta dan orang tua bisa langsung melihat hasilnya.</p>
<p>SKD bukan satu-satunya tahap. Setelah SKD biasanya ada tahap lanjutan yang ditetapkan panitia setiap tahun. Jadwal, jumlah kursi, dan nilai ambang batas juga diumumkan ulang setiap tahun, jadi selalu cek pengumuman resmi di situs PKN STAN.</p>

<h2>Apa saja isi TWK, TIU, dan TKP?</h2>
<table>
  <thead><tr><th>Tes</th><th>Yang diukur</th><th>Contoh materi</th></tr></thead>
  <tbody>
    <tr><td><strong>TWK</strong><br>Tes Wawasan Kebangsaan</td><td>Pemahaman tentang negara dan nilai kebangsaan</td><td>Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, nasionalisme, integritas, bela negara</td></tr>
    <tr><td><strong>TIU</strong><br>Tes Intelegensia Umum</td><td>Kemampuan berpikir logis dan berhitung</td><td>Analogi dan silogisme (verbal), deret dan hitungan (numerik), pola gambar (figural)</td></tr>
    <tr><td><strong>TKP</strong><br>Tes Karakteristik Pribadi</td><td>Sikap dan cara mengambil keputusan dalam situasi kerja</td><td>Pelayanan publik, kerja sama, profesionalisme, sikap terhadap perbedaan</td></tr>
  </tbody>
</table>
<p>Rincian kisi-kisi bisa berubah dari tahun ke tahun, jadi pakai daftar di atas sebagai gambaran, bukan patokan pasti.</p>

<h2>Bagaimana cara penilaiannya?</h2>
<ul>
  <li><strong>TWK dan TIU</strong>: jawaban benar mendapat nilai, jawaban salah atau kosong bernilai nol. Tidak ada pengurangan nilai, jadi tidak ada alasan untuk mengosongkan jawaban.</li>
  <li><strong>TKP</strong>: tidak ada jawaban yang benar-salah mutlak. Setiap pilihan punya bobot berbeda, dan pilihan yang paling sesuai dengan sikap kerja aparatur mendapat bobot tertinggi.</li>
  <li><strong>Nilai ambang batas</strong>: peserta harus mencapai batas minimal di <em>setiap</em> tes. Nilai total tinggi tidak cukup kalau salah satu tes berada di bawah batasnya.</li>
</ul>

<h2>Kenapa banyak yang gagal di SKD?</h2>
<p>Persaingannya ketat. Pada seleksi 2018, tercatat <strong>147.702 pendaftar</strong> memperebutkan <strong>7.301 kursi</strong> (data Panselnas 2018), atau kira-kira satu dari dua puluh pendaftar yang lolos. Dari pengalaman kami mendampingi siswa sejak 2013, kegagalan paling sering datang dari dua hal:</p>
<ol>
  <li><strong>Waktu habis di TIU.</strong> Soal hitungan dan deret bisa dikerjakan, tapi memakan waktu kalau tidak terbiasa dengan cara cepatnya.</li>
  <li><strong>Satu tes di bawah ambang batas.</strong> Siswa yang kuat di TIU kadang lengah di TWK atau TKP, padahal semua tes harus lolos.</li>
</ol>

<h2>Bagaimana menyiapkannya?</h2>
<ul>
  <li><strong>Latihan dalam kondisi tes.</strong> Kerjakan try out dengan batas waktu sungguhan, di komputer kalau bisa, lalu bahas setiap soal yang salah.</li>
  <li><strong>Pelajari pola soal, bukan hanya teori.</strong> TIU dan TWK punya pola yang berulang. Di kelas Infinity, pola ini dibedah soal per soal bersama trik cepat mengerjakannya.</li>
  <li><strong>Pantau nilai per tes, bukan hanya total.</strong> Evaluasi skor TWK, TIU, dan TKP secara terpisah supaya tidak ada yang tertinggal.</li>
  <li><strong>Belajar dari yang sudah lolos.</strong> Tentor Infinity adalah mahasiswa dan alumni PKN STAN yang sudah melewati seleksi yang sama.</li>
</ul>
`,
    faq: [
      ['Apa kepanjangan SKD?', 'SKD adalah Seleksi Kompetensi Dasar, tes berbasis komputer (CAT) dalam seleksi PKN STAN yang terdiri dari TWK, TIU, dan TKP.'],
      ['Apakah jawaban salah di SKD mengurangi nilai?', 'Tidak. Di TWK dan TIU jawaban salah atau kosong bernilai nol tanpa pengurangan. Di TKP setiap pilihan punya bobot berbeda.'],
      ['Berapa nilai ambang batas SKD PKN STAN?', 'Nilai ambang batas ditetapkan setiap tahun. Cek pengumuman resmi PKN STAN untuk tahun seleksi Anda.'],
      ['Apakah lolos SKD berarti pasti diterima?', 'Belum tentu. Peserta yang lolos ambang batas masih bersaing dengan peserta lain di jurusan pilihannya, dan biasanya ada tahap lanjutan setelah SKD.'],
    ],
  },
  {
    slug: 'memilih-program-bimbel-pkn-stan',
    title: 'Reguler, Karantina, atau cabang daerah: cara memilih program persiapan PKN STAN',
    description: 'Tiga program Bimbel Infinity memakai modul dan tentor yang sama. Bedanya ada di intensitas dan tempat belajar. Panduan singkat untuk orang tua memilih yang paling pas.',
    category: 'Program',
    date: '2026-11-10',
    minutes: 4,
    summary: 'Pilih Reguler Bintaro kalau anak tinggal di sekitar Bintaro dan Tangerang Selatan dan bisa pulang setiap hari. Pilih Karantina kalau anak ingin belajar penuh waktu dan menginap menjelang SKD. Pilih cabang daerah kalau anak tinggal di luar Jabodetabek. Ketiganya memakai modul dan standar tentor yang sama.',
    body: `
<h2>Apa yang sama di semua program?</h2>
<p>Semua program Bimbel Infinity memakai standar yang sama:</p>
<ul>
  <li>Tentor mahasiswa dan alumni PKN STAN.</li>
  <li>Modul SKD yang mencakup TWK, TIU, dan TKP.</li>
  <li>Try Out Akbar dengan pembahasan, diadakan serentak di Bintaro dan kota cabang.</li>
  <li>Pendampingan sampai pengumuman.</li>
</ul>
<p>Jadi pertanyaannya bukan "mana yang lebih bagus", melainkan "mana yang paling cocok dengan kondisi anak".</p>

<h2>Perbandingan singkat</h2>
<table>
  <thead><tr><th></th><th>Reguler Bintaro</th><th>Karantina</th><th>Cabang daerah</th></tr></thead>
  <tbody>
    <tr><th>Cocok untuk</th><td>Siswa di sekitar Bintaro dan Tangerang Selatan</td><td>Siswa yang ingin fokus penuh menjelang SKD</td><td>Siswa di luar Jabodetabek</td></tr>
    <tr><th>Tempat</th><td>Gedung kelas Jl. Pisok I, di depan kampus PKN STAN</td><td>Dekat kampus PKN STAN</td><td>Kota cabang Infinity</td></tr>
    <tr><th>Format</th><td>Kelas diskusi kecil, tatap muka, pulang setiap hari</td><td>Penuh waktu dan menginap</td><td>Kelas periodik, tatap muka</td></tr>
    <tr><th>Ciri khas</th><td>Bedah soal bersama tentor, kelas motivasi berkala</td><td>Tryout rutin dan evaluasi skor tiap siswa</td><td>Try Out Akbar serentak dengan Bintaro</td></tr>
  </tbody>
</table>

<h2>Kapan Karantina masuk akal?</h2>
<p>Karantina berarti siswa belajar penuh waktu dan menginap bersama siswa lain di dekat kampus PKN STAN. Program ini cocok untuk anak yang:</p>
<ul>
  <li>butuh lingkungan yang membuatnya fokus, jauh dari gangguan di rumah;</li>
  <li>ingin latihan dan evaluasi skor yang rapat menjelang SKD;</li>
  <li>siap tinggal jauh dari rumah untuk sementara.</li>
</ul>
<p>Program karantina dikelola bersama mahasiswa berprestasi STAN melalui karantinastan.com, yang diluncurkan pada Maret 2016.</p>

<h2>Bagaimana dengan biaya dan jadwal?</h2>
<p>Biaya dan jadwal berbeda untuk tiap program, kota, dan lama belajar, serta mengikuti jadwal seleksi tahun berjalan. Karena itu kami tidak menuliskan angkanya di sini. Konsultan Infinity menjelaskan rinciannya lewat telepon <a href="tel:02122733744">021-22733744</a> atau formulir di beranda, gratis.</p>
`,
    faq: [
      ['Apa beda kelas reguler dan Karantina di Bimbel Infinity?', 'Di kelas reguler siswa belajar di gedung kelas Bintaro lalu pulang. Di Karantina siswa belajar penuh waktu dan menginap dekat kampus PKN STAN menjelang SKD.'],
      ['Apakah tentor di cabang daerah sama dengan di Bintaro?', 'Semua cabang memakai modul dan standar tentor yang sama dengan Bintaro, dan Try Out Akbar diadakan serentak.'],
      ['Berapa biaya bimbel PKN STAN di Infinity?', 'Biaya berbeda per program, kota, dan lama belajar. Konsultan menjelaskan rinciannya gratis lewat telepon 021-22733744.'],
    ],
  },
  {
    slug: 'cerita-38-lulusan-infinity-2018',
    title: '38 siswa Infinity lulus PKN STAN 2018: siapa mereka dan apa kata mereka',
    description: 'Pada seleksi 2018, 147.702 orang mendaftar PKN STAN untuk 7.301 kursi. 38 di antaranya siswa Bimbel Infinity dari Depok, Jember, Lombok, dan Sukabumi.',
    category: 'Cerita alumni',
    date: '2026-11-10',
    minutes: 5,
    summary: 'Pada seleksi PKN STAN 2018 (147.702 pendaftar, 7.301 kursi menurut data Panselnas), 38 siswa Bimbel Infinity dari cabang Depok, Jember, Lombok, dan Sukabumi diterima. Mereka berasal dari 18 sekolah, diterima di delapan program studi, dan yang paling banyak di jurusan Pajak (15 siswa).',
    body: `
<h2>Dari mana saja mereka?</h2>
<table>
  <thead><tr><th>Cabang</th><th>Jumlah lulusan</th></tr></thead>
  <tbody>
    <tr><td>Lombok</td><td>16</td></tr>
    <tr><td>Jember</td><td>13</td></tr>
    <tr><td>Depok</td><td>6</td></tr>
    <tr><td>Sukabumi</td><td>3</td></tr>
    <tr><th>Total</th><th>38</th></tr>
  </tbody>
</table>
<p>Ke-38 siswa ini berasal dari 18 sekolah, di antaranya SMAN 1 Mataram, SMAN 5 Mataram, SMAN 1 Genteng, SMA Unggulan Nuris, dan SMAN 2 Depok. Lima di antaranya mengikuti bimbel lewat program beasiswa Infinity.</p>

<h2>Jurusan apa yang mereka masuki?</h2>
<ul>
  <li><strong>Pajak</strong>: 15 siswa (D3 Pajak 10, D1 Pajak 5)</li>
  <li><strong>Akuntansi</strong>: 9 siswa (D3 Akuntansi)</li>
  <li><strong>Kebendaharaan Negara</strong>: 9 siswa (D3 4, D1 5)</li>
  <li><strong>Kepabeanan dan Cukai</strong>: 3 siswa (D1 2, D3 1)</li>
  <li><strong>Penilai/PBB</strong>: 2 siswa (D3)</li>
</ul>

<h2>Apa yang paling sering mereka ceritakan?</h2>
<p>Dari 38 lulusan, 19 menulis testimoni sendiri. Dua hal paling sering muncul: tentor yang mudah ditanya dan trik cepat mengerjakan soal. Beberapa kutipan, ejaannya tidak kami ubah:</p>
<blockquote><p>"Banyak trik cepat yang diajarkan para tentor sehingga mempermudah kita dalam mengerjakan soal-soal yang sering keluar dalam SPMB PKN STAN."</p><cite>Muhammad Yoga Andromeda, D3 Pajak, Infinity Jember</cite></blockquote>
<blockquote><p>"Tentor yang friendly dan asik diajak sharing membuat Saya mengerti materi terutama bahasa inggris yang sebelumnya saya sama sekali tidak bisa."</p><cite>Nafira Iftitah Maulidya Yanuar, D3 Akuntansi, Infinity Jember</cite></blockquote>
<blockquote><p>"Mendapatkan kesempatan beasiswa les di Bimbel Infinity Sukabumi sangat membantu saya untuk menggapai cita - cita saya untuk masuk di PKN STAN."</p><cite>Dennis Gibrail, D3 Akuntansi, Infinity Sukabumi</cite></blockquote>

<h2>Di mana daftar lengkapnya?</h2>
<p>Nama, jurusan, asal sekolah, foto, dan testimoni lengkap ke-38 lulusan ada di halaman <a href="../testimoni.html">Testimoni alumni</a>, bisa disaring per cabang.</p>
`,
    faq: [
      ['Berapa siswa Bimbel Infinity yang lulus PKN STAN 2018?', '38 siswa dari cabang Depok, Jember, Lombok, dan Sukabumi, menurut arsip kelulusan Bimbel Infinity.'],
      ['Berapa pendaftar PKN STAN 2018?', 'Menurut data Panselnas 2018, ada 147.702 pendaftar untuk 7.301 kursi.'],
      ['Jurusan apa yang paling banyak dimasuki lulusan Infinity 2018?', 'Pajak, dengan 15 siswa (D3 Pajak 10 dan D1 Pajak 5).'],
    ],
  },
  {
    slug: 'perjalanan-bimbel-infinity-2013-2018',
    title: 'Perjalanan Bimbel Infinity: dari satu gedung di Pondok Aren, 2013',
    description: 'Bimbel Infinity didirikan mahasiswa PKN STAN pada 17 April 2013 di Pondok Aren, lalu membuka kelas di 14 kota. Ini catatan perjalanannya, tahun demi tahun.',
    category: 'Tentang Infinity',
    date: '2026-11-10',
    minutes: 4,
    summary: 'Bimbel Infinity didirikan pada 17 April 2013 oleh sekumpulan mahasiswa PKN STAN di Jl. Sejahtera A 15/16 PJMI, Pondok Aren. Lulusan pertamanya diterima di STAN pada Juli 2013. PT Infinity Global Inspiratif berdiri pada 2015, gedung kelas di depan kampus STAN dibuka pada Oktober 2016, dan pada 2018 Infinity pernah membuka kelas di 14 kota.',
    body: `
<h2>2013: dimulai oleh mahasiswa PKN STAN</h2>
<p>Pada <strong>17 April 2013</strong>, sekumpulan mahasiswa PKN STAN membuka kelas pertama Infinity di gedung Jl. Sejahtera A 15/16 PJMI, Pondok Aren, Tangerang Selatan: Riandi Ahmad bersama Sabrina Hakim, Muhammad Sopyan, Ferdian Jati Permana, Dwi Widiatmoko, dan Fachri Ahmad. Tiga bulan kemudian, pada <strong>Juli 2013</strong>, siswa angkatan pertamanya diterima di STAN.</p>

<h2>2014–2015: keluar Pulau Jawa, lalu berbadan hukum</h2>
<ul>
  <li><strong>Februari 2014</strong>: cabang periodik pertama di luar Jawa dibuka di Medan.</li>
  <li><strong>Februari 2015</strong>: cabang periodik di Palembang dan Bandung.</li>
  <li><strong>2015</strong>: PT Infinity Global Inspiratif didirikan, tercatat dalam Akta Notaris Nomor 06 tanggal 19 Oktober 2015.</li>
  <li><strong>Desember 2015</strong>: cabang periodik di Lombok, Nusa Tenggara Barat.</li>
</ul>

<h2>2016: karantina dan gedung di depan kampus</h2>
<ul>
  <li><strong>Februari 2016</strong>: cabang periodik di Yogyakarta.</li>
  <li><strong>Maret 2016</strong>: program karantina diluncurkan lewat karantinastan.com bersama mahasiswa berprestasi STAN.</li>
  <li><strong>Oktober 2016</strong>: cabang mitra di Pekanbaru, Makassar, Balikpapan, dan Banjarmasin; kantor utama pindah ke Jl. Pisok I Blok EA 15 No. 1, tepat di depan kampus STAN.</li>
</ul>

<h2>2017–2018: Jawa Tengah, Jawa Timur, dan 14 kota</h2>
<ul>
  <li><strong>Agustus 2017</strong>: cabang di Jember dan Purwokerto.</li>
  <li><strong>Januari 2018</strong>: cabang mitra di Sukabumi.</li>
  <li><strong>Juli 2018</strong>: cabang mitra di Surabaya.</li>
  <li><strong>Agustus 2018</strong>: kantor utama pindah ke Jl. Porselin E6/11, Perumahan Pondok Jaya, Bintaro; gedung lainnya dipakai penuh untuk ruang kelas.</li>
</ul>
<p>Pada seleksi 2018, 38 siswa Infinity dari Depok, Jember, Lombok, dan Sukabumi diterima di PKN STAN. Ceritanya ada di artikel <a href="./cerita-38-lulusan-infinity-2018.html">38 siswa Infinity lulus PKN STAN 2018</a>.</p>
`,
    faq: [
      ['Kapan Bimbel Infinity didirikan?', 'Pada 17 April 2013, oleh sekumpulan mahasiswa PKN STAN di Pondok Aren, Tangerang Selatan.'],
      ['Siapa pendiri Bimbel Infinity?', 'Riandi Ahmad, bersama Sabrina Hakim, Muhammad Sopyan, Ferdian Jati Permana, Dwi Widiatmoko, dan Fachri Ahmad.'],
      ['Di mana lokasi Bimbel Infinity?', 'Kantor utama di Jl. Porselin No. 11 Blok E6, Pondok Jaya, Bintaro Sektor 3A, Tangerang Selatan; gedung kelas di Jl. Pisok I Blok EA 15 No. 1, tepat di depan kampus PKN STAN.'],
    ],
  },
];
