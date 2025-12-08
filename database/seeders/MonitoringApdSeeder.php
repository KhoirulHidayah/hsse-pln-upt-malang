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
                'user_id'           => 1, // contoh user admin/petugas
                'lokasi_id'         => 1, // misal ULTG Krian
                'gardu_induk_id'    => 1, // contoh Kantor ULTG Krian
                'stok'              => 5,
                'tanggal_distribusi'=> now()->subMonths(3),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'  => now()->addYears(3),
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Active',
                'catatan'           => 'Semua helm dalam kondisi baik dan bersih.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🪖 Helm Safety Warna Merah
            [
                'apd_id'            => 2,
                'user_id'           => 1,
                'lokasi_id'         => 1,
                'gardu_induk_id'    => 2,
                'stok'              => 8,
                'tanggal_distribusi'=> now()->subMonths(5),
                'tanggal_pemeriksaan'=> now()->subWeeks(3),
                'tanggal_berakhir'  => now()->addYears(2)->addMonths(6),
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Active',
                'catatan'           => 'Helm pengawas K3 dalam kondisi prima.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🪖 Helm Safety Warna Biru - Status Warning (< 6 bulan)
            [
                'apd_id'            => 3,
                'user_id'           => 1,
                'lokasi_id'         => 2,
                'gardu_induk_id'    => 7,
                'stok'              => 12,
                'tanggal_distribusi'=> now()->subYears(3)->subMonths(6),
                'tanggal_pemeriksaan'=> now()->subMonth(),
                'tanggal_berakhir'  => now()->addMonths(4), // Warning zone
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Warning',
                'catatan'           => 'Perlu dipersiapkan penggantian dalam 4 bulan.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 👓 Kacamata Pengaman
            [
                'apd_id'            => 5,
                'user_id'           => 1,
                'lokasi_id'         => 1,
                'gardu_induk_id'    => 3,
                'stok'              => 20,
                'tanggal_distribusi'=> now()->subMonths(8),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'  => now()->addYears(1)->addMonths(4),
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Active',
                'catatan'           => 'Stok cukup, kondisi lensa masih jernih.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 👢 Sepatu Safety S3 SRC (Anti Slip & Anti Tusuk)
            [
                'apd_id'            => 6,
                'user_id'           => 1, 
                'lokasi_id'         => 2, // misal ULTG Malang
                'gardu_induk_id'    => 7,
                'stok'              => 10,
                'tanggal_distribusi'=> now()->subMonths(18),
                'tanggal_pemeriksaan'=> now()->subWeeks(1),
                'tanggal_berakhir'  => now()->addMonths(6),
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Active',
                'catatan'           => 'Perlu pemeriksaan ulang sol sepatu bulan depan.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 👢 Sepatu Safety Dielectric (Tahan Listrik) - Status Expired
            [
                'apd_id'            => 7,
                'user_id'           => 1,
                'lokasi_id'         => 3, // misal ULTG Mojokerto
                'gardu_induk_id'    => 21,
                'stok'              => 5,
                'tanggal_distribusi'=> now()->subYears(2)->subMonths(2),
                'tanggal_pemeriksaan'=> now()->subDays(20),
                'tanggal_berakhir'  => now()->subMonths(2), // Sudah lewat masa pakai
                'kondisi'           => 'Perlu Diganti',
                'status_notifikasi' => 'Expired',
                'catatan'           => 'Beberapa sepatu menunjukkan retak pada permukaan karet. SEGERA DIGANTI!',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🧗 Full Body Harness 5 Titik
            [
                'apd_id'            => 8,
                'user_id'           => 1,
                'lokasi_id'         => 1,
                'gardu_induk_id'    => 1,
                'stok'              => 10,
                'tanggal_distribusi'=> now()->subYears(1),
                'tanggal_pemeriksaan'=> now()->subDays(7),
                'tanggal_berakhir'  => now()->addYears(9),
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Active',
                'catatan'           => 'Harness dalam kondisi sangat baik, digunakan untuk pekerjaan ketinggian.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🧗 Full Body Harness Double Lanyard - Status Warning
            [
                'apd_id'            => 9,
                'user_id'           => 1,
                'lokasi_id'         => 2,
                'gardu_induk_id'    => 8,
                'stok'              => 10,
                'tanggal_distribusi'=> now()->subYears(9)->subMonths(8),
                'tanggal_pemeriksaan'=> now()->subDays(15),
                'tanggal_berakhir'  => now()->addMonths(3), // Warning (< 6 bulan)
                'kondisi'           => 'Perlu Diganti',
                'status_notifikasi' => 'Warning',
                'catatan'           => 'Tali harness mulai aus dan perlu penggantian segera.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🦺 Life Jacket
            [
                'apd_id'            => 10,
                'user_id'           => 1,
                'lokasi_id'         => 1,
                'gardu_induk_id'    => 4,
                'stok'              => 15,
                'tanggal_distribusi'=> now()->subYears(2),
                'tanggal_pemeriksaan'=> now()->subWeeks(2),
                'tanggal_berakhir'  => now()->addYears(3),
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Active',
                'catatan'           => 'Life jacket untuk pekerjaan area crossing sungai.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],

            // 🪖 Helm Safety Kuning - Status Warning
            [
                'apd_id'            => 4,
                'user_id'           => 1,
                'lokasi_id'         => 3,
                'gardu_induk_id'    => 15,
                'stok'              => 6,
                'tanggal_distribusi'=> now()->subYears(3)->subMonths(7),
                'tanggal_pemeriksaan'=> now()->subWeeks(4),
                'tanggal_berakhir'  => now()->addMonths(5), // Warning
                'kondisi'           => 'Baik',
                'status_notifikasi' => 'Warning',
                'catatan'           => 'Helm untuk mitra kerja, segera persiapkan penggantian.',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);
    }
}