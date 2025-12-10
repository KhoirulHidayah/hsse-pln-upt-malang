<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApdSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('apds')->insert([

            // ============================================================
            // 🟦 HELM SAFETY (SPLN U2.006:2023)
            // ============================================================

            [
                'jenis_id'        => 1,
                'nama_apd'        => 'Helm Safety Putih (Manajemen, Engineer, Visitor)',
                'kode_apd'        => 'APD-001-PTH',
                'deskripsi'       => 'Helm standar SPLN digunakan oleh manajemen, engineer dan visitor. Melindungi kepala dari benturan dan kontak listrik hingga 20 kV. Dilengkapi suspensi 6 titik dan chin strap.',
                'gambar'          => 'apd/helm_putih.png',
                'bahan'           => 'ABS',
                'warna'           => 'Putih',
                'ukuran'          => 'Universal (Adjustable)',
                'kemampuan'       => 'Tahan benturan vertikal dan listrik hingga 20 kV',
                'fungsi'          => 'Identifikasi personel manajemen, engineer, dan pengunjung',
                'standar'         => 'SPLN U2.006:2023; EN 397; ANSI Z89.1',
                'masa_penggunaan' => '4 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            [
                'jenis_id'        => 1,
                'nama_apd'        => 'Helm Safety Merah (Pengawas K3 / Pekerjaan)',
                'kode_apd'        => 'APD-001-MRH',
                'deskripsi'       => 'Helm merah untuk pengawas K3 dan pengawas pekerjaan. Memudahkan identifikasi di lapangan dan tahan panas serta benturan berat.',
                'gambar'          => 'apd/helm_merah.png',
                'bahan'           => 'ABS',
                'warna'           => 'Merah',
                'ukuran'          => 'Universal (Adjustable)',
                'kemampuan'       => 'Tahan panas dan benturan berat',
                'fungsi'          => 'Identifikasi pengawas K3 dan pengawas pekerjaan',
                'standar'         => 'SPLN U2.006:2023; EN 397; ANSI Z89.1',
                'masa_penggunaan' => '4 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            [
                'jenis_id'        => 1,
                'nama_apd'        => 'Helm Safety Biru (Pelaksana Pekerjaan)',
                'kode_apd'        => 'APD-001-BIR',
                'deskripsi'       => 'Helm biru untuk pelaksana pekerjaan di lapangan. Tahan benturan dan suhu tinggi, sesuai standar SPLN.',
                'gambar'          => 'apd/helm_biru.png',
                'bahan'           => 'HDPE',
                'warna'           => 'Biru',
                'ukuran'          => 'Universal (Adjustable)',
                'kemampuan'       => 'Tahan benturan dan suhu tinggi',
                'fungsi'          => 'Identifikasi pelaksana pekerjaan',
                'standar'         => 'SPLN U2.006:2023; EN 397; ANSI Z89.1',
                'masa_penggunaan' => '4 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            [
                'jenis_id'        => 1,
                'nama_apd'        => 'Helm Safety Kuning (Mitra Kerja & Magang)',
                'kode_apd'        => 'APD-001-KNG',
                'deskripsi'       => 'Helm kuning dipakai oleh kontraktor, pekerja eksternal, dan peserta magang. Tahan benturan ringan dan panas sedang.',
                'gambar'          => 'apd/helm_kuning.png',
                'bahan'           => 'HDPE',
                'warna'           => 'Kuning',
                'ukuran'          => 'Universal (Adjustable)',
                'kemampuan'       => 'Tahan benturan ringan',
                'fungsi'          => 'Identifikasi mitra kerja / kontraktor',
                'standar'         => 'SPLN U2.006:2023; EN 397; ANSI Z89.1',
                'masa_penggunaan' => '4 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],


            // ============================================================
            // 🟦 SEPATU SAFETY (SPLN)
            // ============================================================

            [
                'jenis_id'        => 6,
                'nama_apd'        => 'Sepatu Safety S3 SRC (Anti Slip & Anti Tusuk)',
                'kode_apd'        => 'APD-003-S3',
                'deskripsi'       => 'Sepatu safety S3 untuk area kerja industri. Anti slip, anti tusuk, dan tahan benturan 200 joule.',
                'gambar'          => 'apd/safety_shoes_s3.png',
                'bahan'           => 'Kulit + PU/TPU',
                'warna'           => 'Hitam',
                'ukuran'          => '39–45',
                'kemampuan'       => 'Toe cap 200J, anti slip, anti tusuk',
                'fungsi'          => 'Melindungi kaki dari bahaya mekanis',
                'standar'         => 'EN ISO 20345; SPLN U2.006:2023',
                'masa_penggunaan' => '2 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            [
                'jenis_id'        => 6,
                'nama_apd'        => 'Sepatu Safety Dielectric (Tahan Listrik)',
                'kode_apd'        => 'APD-003-DLC',
                'deskripsi'       => 'Sepatu dielectric untuk pekerjaan bertegangan tinggi. Tidak mengandung logam dan tahan listrik hingga 18 kV.',
                'gambar'          => 'apd/safety_shoes_dielectric.png',
                'bahan'           => 'Rubber Insulating',
                'warna'           => 'Kuning',
                'ukuran'          => '39–44',
                'kemampuan'       => 'Tahan listrik 18.000 Volt',
                'fungsi'          => 'Perlindungan kaki dari listrik',
                'standar'         => 'EN ISO 20345; SPLN U2.006:2023',
                'masa_penggunaan' => '2 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],


            // ============================================================
            // 🟦 FULL BODY HARNESS (SPLN U2.006:2023)
            // ============================================================

            [
                'jenis_id'        => 8,
                'nama_apd'        => 'Full Body Harness (Standar SPLN U2.006:2023)',
                'kode_apd'        => 'APD-004-FBH',
                'deskripsi'       => 'Full Body Harness (FBH) berfungsi mencegah pekerja jatuh dengan menjaga posisi kerja, membatasi pergerakan, dan menahan energi jatuh agar pekerja tidak membentur dasar. Wajib digunakan pada seluruh pekerjaan di ketinggian sesuai SPLN U2.006:2023 dan Permenaker No. 8 Tahun 2010. FBH terdiri dari shoulder straps, restrainer, buckles, thigh straps, fall arrest attachment, dan sub pelvic strap. Dilengkapi lanyard sebagai konektor antara body harness dan anchor.',
                'gambar'          => 'apd/harness_default.png',

                // BAHAN (sesuai tabel 20 SPLN)
                'bahan'           => 'Polyester webbing; metal stainless steel; reinforced plastic; nylon; lanyard polyester + stainless steel hook + shock absorber polyester/metal/rubber',

                'warna'           => 'Kuning & Hitam',
                'ukuran'          => 'All Size (Adjustable)',

                // KEMAMPUAN MEKANIS
                'kemampuan'       => 'Safety Working Load (SWL) hingga 140 kg; fall arrest force < 6 kN; tahan beban jatuh vertikal.',

                // FUNGSI & APLIKASI (berdasarkan 6 kelas ANSI Z359.11)
                'fungsi'          => 'Personal fall arrest, controlled descent, rescue, ladder climbing, work positioning, restraint system.',

                'standar'         => 'SPLN U2.006:2023; ANSI Z359.11; CSA Z259.10; EN 361',

                // MASA PENGGUNAAN
                'masa_penggunaan' => '10 tahun',

                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            [
                'jenis_id'        => 8,
                'nama_apd'        => 'Full Body Harness 5 Titik (Sesuai SPLN)',
                'kode_apd'        => 'APD-004-5T',
                'deskripsi'       => 'Full Body Harness (FBH) berfungsi mencegah pekerja jatuh, menjaga posisi kerja, dan menahan energi jatuh agar tidak melebihi 6 kN. Komponen: shoulder straps, restrainer, buckles, thigh straps, dorsal/side D-ring, sub pelvic strap. Digunakan pada sistem fall arrest, work positioning, rescue, controlled descent, ladder climbing, dan restraint.',
                'gambar'          => 'apd/full_body_harness_5titik.png',
                'bahan'           => 'Polyester webbing; alloy steel/stainless steel D-ring; metal buckles; reinforced plastic; lanyard polyester + metal + rubber shock absorber.',
                'warna'           => 'Kuning & Hitam',
                'ukuran'          => 'All Size (Adjustable)',
                'kemampuan'       => 'SWL hingga 140 kg; fall arrest force < 6 kN; dilengkapi shock absorber.',
                'fungsi'          => 'Fall arrest, rescue, work positioning, controlled descent, restraint.',
                'standar'         => 'SPLN U2.006:2023; ANSI Z359.11; EN 361',
                'masa_penggunaan' => '10 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            [
                'jenis_id'        => 8,
                'nama_apd'        => 'Full Body Harness Double Lanyard Shock Absorber (Sesuai SPLN)',
                'kode_apd'        => 'APD-004-DLY',
                'deskripsi'       => 'Double lanyard dengan shock absorber untuk perpindahan titik anchor yang aman. Shock absorber meredam gaya jatuh agar tidak melebihi 6 kN. FBH wajib digunakan untuk pekerjaan ketinggian.',
                'gambar'          => 'apd/harness_double_lanyard.png',
                'bahan'           => 'Lanyard polyester; hook stainless steel; shock absorber polyester/metal/rubber; webbing polyester + alloy steel ring.',
                'warna'           => 'Kuning',
                'ukuran'          => 'All Size (Adjustable)',
                'kemampuan'       => 'Fall arrest force < 6 kN; panjang 2m; SWL 140 kg.',
                'fungsi'          => 'Fall arrest, moving anchor point, work positioning, ladder climbing, restraint.',
                'standar'         => 'SPLN U2.006:2023; ANSI Z359.11; EN 361',
                'masa_penggunaan' => '10 tahun',
                'created_by'      => 1,
                'updated_by'      => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

        ]);
    }
}
