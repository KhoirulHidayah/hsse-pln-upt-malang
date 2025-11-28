<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MonitoringApdSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('monitoring_apds')->insert([
            // 🪖 Helm Safety Warna Putih
            [
                'apd_id'            => 1,
                'apd_detail_id'     => 1,
                'user_id'           => 1, // contoh user admin/petugas
                'lokasi_id'         => 1, // misal ULTG Krian
                'gardu_induk_id'    => 1, // contoh Kantor ULTG Krian
                'stok'              => 5,
                'tanggal_distribusi'=> now()->subMonths(3),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'  => now()->addYears(3),
                'kondisi'           => 'Baik',
                'catatan'           => 'Semua helm dalam kondisi baik dan bersih.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 👢 Sepatu Safety S3 SRC (Anti Slip & Anti Tusuk)
            [
                'apd_id'            => 3,
                'apd_detail_id'     => 5,
                'user_id'           => 1, 
                'lokasi_id'         => 2, // misal ULTG Malang
                'gardu_induk_id'    => 7,
                'stok'              => 10,
                'tanggal_distribusi'=> now()->subMonths(6),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'  => now()->addMonths(18),
                'kondisi'           => 'Baik',
                'catatan'           => 'Perlu pemeriksaan ulang sol sepatu bulan depan.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 👢 Sepatu Safety Dielectric (Tahan Listrik)
            [
                'apd_id'            => 3,
                'apd_detail_id'     => 6,
                'user_id'           => 1,
                'lokasi_id'         => 3, // misal ULTG Mojokerto
                'gardu_induk_id'    => 21,
                'stok'              => 5,
                'tanggal_distribusi'=> now()->subMonths(10),
                'tanggal_pemeriksaan'=> now()->subDays(20),
                'tanggal_berakhir'  => now()->addMonths(2), // hampir habis masa pakai
                'kondisi'           => 'Perlu Diganti',
                'catatan'           => 'Beberapa sepatu menunjukkan retak pada permukaan karet.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🧍 Full Body Harness 5 Titik
            [
                'apd_id'            => 4,
                'apd_detail_id'     => 7,
                'user_id'           => 1,
                'lokasi_id'         => 1,
                'gardu_induk_id'    => 1,
                'stok'              => 10,
                'tanggal_distribusi'=> now()->subYears(1),
                'tanggal_pemeriksaan'=> now()->subDays(7),
                'tanggal_berakhir'  => now()->addYears(9),
                'kondisi'           => 'Baik',
                'catatan'           => 'Harness dalam kondisi sangat baik, digunakan untuk pekerjaan ketinggian.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🧍 Full Body Harness Double Lanyard Shock Absorber
            [
                'apd_id'            => 4,
                'apd_detail_id'     => 8,
                'user_id'           => 1,
                'lokasi_id'         => 2,
                'gardu_induk_id'    => 8,
                'stok'              => 10,
                'tanggal_distribusi'=> now()->subYears(2),
                'tanggal_pemeriksaan'=> now()->subDays(15),
                'tanggal_berakhir'  => now()->addMonths(1), // hampir expired → notifikasi merah
                'kondisi'           => 'Perlu Diganti',
                'catatan'           => 'Tali harness mulai aus dan perlu penggantian segera.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);
    }
}
