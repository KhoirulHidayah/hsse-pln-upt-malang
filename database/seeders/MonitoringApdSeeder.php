<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MonitoringApdSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('monitoring_apds')->insert([
            // 🪖 1. Helm Safety Putih - ULTG Krian
            [
                'apd_id'             => 1,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 1, // Kantor ULTG Krian
                'stok'               => 15,
                'tanggal_distribusi' => now()->subMonths(6),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'   => now()->addYears(3)->addMonths(6),
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm putih untuk manajemen dan engineer dalam kondisi sangat baik.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 2. Helm Safety Merah - ULTG Krian
            [
                'apd_id'             => 2,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 2, // GI BAMBE
                'stok'               => 10,
                'tanggal_distribusi' => now()->subMonths(8),
                'tanggal_pemeriksaan'=> now()->subWeeks(3),
                'tanggal_berakhir'   => now()->addYears(3)->addMonths(4),
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm merah pengawas K3 di GI Bambe dalam kondisi prima.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 3. Helm Safety Biru - ULTG Malang (WARNING)
            [
                'apd_id'             => 3,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 7, // Kantor ULTG Malang
                'stok'               => 20,
                'tanggal_distribusi' => now()->subYears(3)->subMonths(7),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'   => now()->addDays(65), // Warning: 65 hari
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm biru pelaksana pekerjaan, perlu persiapan penggantian dalam 2 bulan.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 4. Helm Safety Kuning - ULTG Mojokerto
            [
                'apd_id'             => 4,
                'user_id'            => 1,
                'lokasi_id'          => 3,
                'gardu_induk_id'     => 21, // Kantor ULTG Mojokerto
                'stok'               => 25,
                'tanggal_distribusi' => now()->subMonths(10),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'   => now()->addYears(3)->addMonths(2),
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm kuning untuk mitra kerja dan magang, stok mencukupi.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 👢 5. Sepatu Safety S3 SRC - ULTG Krian
            [
                'apd_id'             => 5,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 3, // GI DRIYO
                'stok'               => 12,
                'tanggal_distribusi' => now()->subMonths(15),
                'tanggal_pemeriksaan'=> now()->subDays(10),
                'tanggal_berakhir'   => now()->addMonths(9),
                'kondisi'            => 'Baik',
                'catatan'            => 'Sepatu safety S3 untuk area industri, kondisi sol masih bagus.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 👢 6. Sepatu Safety Dielectric - ULTG Malang (EXPIRED)
            [
                'apd_id'             => 6,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 8, // GI SENGGURUH
                'stok'               => 8,
                'tanggal_distribusi' => now()->subYears(2)->subMonths(3),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'   => now()->subDays(10), // Expired: -10 hari
                'kondisi'            => 'Perlu Diganti',
                'catatan'            => 'URGENT! Sepatu dielectric sudah melewati masa pakai, ditemukan retak pada karet insulasi. SEGERA GANTI!',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🧗 7. Full Body Harness Standar - ULTG Krian
            [
                'apd_id'             => 7,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 4, // GI KASHJATIM
                'stok'               => 8,
                'tanggal_distribusi' => now()->subYears(1)->subMonths(6),
                'tanggal_pemeriksaan'=> now()->subDays(5),
                'tanggal_berakhir'   => now()->addYears(8)->addMonths(6),
                'kondisi'            => 'Baik',
                'catatan'            => 'Full Body Harness standar SPLN, digunakan untuk pekerjaan ketinggian di tower transmisi.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🧗 8. Full Body Harness 5 Titik - ULTG Malang
            [
                'apd_id'             => 8,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 9, // GI LAWANG
                'stok'               => 10,
                'tanggal_distribusi' => now()->subYears(2),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'   => now()->addYears(8),
                'kondisi'            => 'Baik',
                'catatan'            => 'Harness 5 titik untuk pekerjaan pemeliharaan bay 150 kV, kondisi webbing bagus.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🧗 9. Full Body Harness Double Lanyard - ULTG Mojokerto (WARNING)
            [
                'apd_id'             => 9,
                'user_id'            => 1,
                'lokasi_id'          => 3,
                'gardu_induk_id'     => 22, // GI BALONGBENDO
                'stok'               => 6,
                'tanggal_distribusi' => now()->subYears(9)->subMonths(8),
                'tanggal_pemeriksaan'=> now()->subDays(7),
                'tanggal_berakhir'   => now()->addDays(45), // Warning: 45 hari
                'kondisi'            => 'Perlu Diganti',
                'catatan'            => 'Double lanyard dengan shock absorber mulai menunjukkan tanda aus pada webbing. Perlu penggantian segera.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 10. Helm Safety Putih - ULTG Malang
            [
                'apd_id'             => 1,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 10, // GI SENGKALING
                'stok'               => 8,
                'tanggal_distribusi' => now()->subMonths(12),
                'tanggal_pemeriksaan'=> now()->subWeeks(3),
                'tanggal_berakhir'   => now()->addYears(3),
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm putih untuk visitor dan engineer site visit di GI Sengkaling.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 11. Helm Safety Merah - ULTG Mojokerto
            [
                'apd_id'             => 2,
                'user_id'            => 1,
                'lokasi_id'          => 3,
                'gardu_induk_id'     => 23, // GI MOJOAGUNG
                'stok'               => 7,
                'tanggal_distribusi' => now()->subMonths(18),
                'tanggal_pemeriksaan'=> now()->subWeeks(4),
                'tanggal_berakhir'   => now()->addYears(2)->addMonths(6),
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm merah pengawas pekerjaan di GI Mojoagung, dilengkapi reflective sticker.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 👢 12. Sepatu Safety S3 SRC - ULTG Malang (WARNING)
            [
                'apd_id'             => 5,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 11, // GI BLIMBING
                'stok'               => 15,
                'tanggal_distribusi' => now()->subYears(1)->subMonths(7),
                'tanggal_pemeriksaan'=> now()->subDays(14),
                'tanggal_berakhir'   => now()->addDays(55), // Warning: 55 hari
                'kondisi'            => 'Baik',
                'catatan'            => 'Sepatu safety untuk teknisi lapangan, beberapa unit mulai aus pada bagian toe cap.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 13. Helm Safety Biru - ULTG Mojokerto
            [
                'apd_id'             => 3,
                'user_id'            => 1,
                'lokasi_id'          => 3,
                'gardu_induk_id'     => 24, // GI NGORO
                'stok'               => 18,
                'tanggal_distribusi' => now()->subMonths(14),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'   => now()->addYears(2)->addMonths(10),
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm biru untuk pelaksana pekerjaan maintenance rutin di GI Ngoro.',
                'is_read'            => true,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🧗 14. Full Body Harness 5 Titik - ULTG Krian
            [
                'apd_id'             => 8,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 5, // GI GITET
                'stok'               => 5,
                'tanggal_distribusi' => now()->subYears(3),
                'tanggal_pemeriksaan'=> now()->subDays(3),
                'tanggal_berakhir'   => now()->addYears(7),
                'kondisi'            => 'Baik',
                'catatan'            => 'Harness khusus untuk pekerjaan di GITET 500 kV, inspeksi berkala ketat.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 👢 15. Sepatu Safety Dielectric - ULTG Mojokerto (WARNING)
            [
                'apd_id'             => 6,
                'user_id'            => 1,
                'lokasi_id'          => 3,
                'gardu_induk_id'     => 25, // GI PLOSO
                'stok'               => 10,
                'tanggal_distribusi' => now()->subMonths(20),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'   => now()->addDays(75), // Warning: 75 hari
                'kondisi'            => 'Baik',
                'catatan'            => 'Sepatu dielectric untuk pekerjaan bertegangan tinggi, perlu testing ulang insulasi.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // ========== 5 DATA BARU ==========

            // 🪖 16. Helm Safety Putih - ULTG Krian (EXPIRED)
            [
                'apd_id'             => 1,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 6, // GI WARU
                'stok'               => 5,
                'tanggal_distribusi' => now()->subYears(4)->subMonths(2),
                'tanggal_pemeriksaan'=> now()->subDays(20),
                'tanggal_berakhir'   => now()->addDays(15), // Expired: 15 hari (< 30)
                'kondisi'            => 'Perlu Diganti',
                'catatan'            => 'URGENT! Helm putih di GI Waru mendekati masa kadaluarsa, sudah terlihat goresan dan retakan pada cangkang luar.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 👢 17. Sepatu Safety S3 SRC - ULTG Malang (EXPIRED)
            [
                'apd_id'             => 5,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 12, // GI DINOYO
                'stok'               => 8,
                'tanggal_distribusi' => now()->subYears(2)->subMonths(1),
                'tanggal_pemeriksaan'=> now()->subDays(5),
                'tanggal_berakhir'   => now()->subDays(5), // Expired: -5 hari (sudah lewat)
                'kondisi'            => 'Perlu Diganti',
                'catatan'            => 'KRITIS! Sepatu safety S3 SRC sudah melewati masa pakai. Sol dalam mulai mengelupas dan toe cap aus.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🧗 18. Full Body Harness Double Lanyard - ULTG Mojokerto (EXPIRED)
            [
                'apd_id'             => 9,
                'user_id'            => 1,
                'lokasi_id'          => 3,
                'gardu_induk_id'     => 26, // GI MOJOAGUNG 2
                'stok'               => 4,
                'tanggal_distribusi' => now()->subYears(10)->subDays(15),
                'tanggal_pemeriksaan'=> now()->subDays(3),
                'tanggal_berakhir'   => now()->addDays(20), // Expired: 20 hari (< 30)
                'kondisi'            => 'Perlu Diganti',
                'catatan'            => 'BAHAYA! Harness double lanyard hampir habis masa pakai. Webbing menunjukkan tanda degradasi UV dan jahitan mulai longgar.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 🪖 19. Helm Safety Kuning - ULTG Krian (WARNING)
            [
                'apd_id'             => 4,
                'user_id'            => 1,
                'lokasi_id'          => 1,
                'gardu_induk_id'     => 2, // GI BAMBE
                'stok'               => 12,
                'tanggal_distribusi' => now()->subYears(3)->subMonths(8),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'   => now()->addDays(50), // Warning: 50 hari
                'kondisi'            => 'Baik',
                'catatan'            => 'Helm kuning untuk mitra kerja di GI Bambe. Masa pakai tersisa 50 hari, rencanakan penggantian.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // 👢 20. Sepatu Safety Dielectric - ULTG Malang (WARNING)
            [
                'apd_id'             => 6,
                'user_id'            => 1,
                'lokasi_id'          => 2,
                'gardu_induk_id'     => 13, // GI SUKOREJO
                'stok'               => 6,
                'tanggal_distribusi' => now()->subYears(1)->subMonths(10),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'   => now()->addDays(85), // Warning: 85 hari
                'kondisi'            => 'Baik',
                'catatan'            => 'Sepatu dielectric di GI Sukorejo perlu monitoring. Tersisa 85 hari, jadwalkan testing insulasi ulang.',
                'is_read'            => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
        ]);
    }
}