<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisApdSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel jenis_apds.
     */
    public function run(): void
    {
        DB::table('jenis_apds')->insert([
            [
                'nama_jenis' => 'Alat Pelindung Kepala',
                'deskripsi'  => 'Melindungi kepala dari benturan, kejatuhan benda, paparan panas, api, dan bahaya listrik. Contoh: Helm pengaman (Safety Helmet).',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Alat Pelindung Mata dan Muka',
                'deskripsi'  => 'Melindungi mata dan muka dari partikel, bahan kimia, panas, dan radiasi optik. Contoh: Kacamata pengaman, Face Shield, Welding Shield.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Alat Pelindung Telinga',
                'deskripsi'  => 'Melindungi pendengaran dari kebisingan melebihi 85 dB. Contoh: Ear Plug, Ear Muff.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Alat Pelindung Pernapasan',
                'deskripsi'  => 'Melindungi sistem pernapasan dari gas, debu, uap, dan partikel berbahaya. Contoh: Masker N95, Respirator, SCBA.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Alat Pelindung Tangan',
                'deskripsi'  => 'Melindungi tangan dari panas, bahan kimia, arus listrik, goresan, atau benturan. Contoh: Sarung tangan kulit, butyl, nitril, atau isolasi listrik.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Alat Pelindung Kaki',
                'deskripsi'  => 'Melindungi kaki dari benturan, tusukan, bahan kimia, suhu ekstrem, dan bahaya listrik. Contoh: Safety Shoes S3, Sepatu Insulasi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Pakaian Pelindung',
                'deskripsi'  => 'Melindungi tubuh dari panas, percikan bahan kimia, dan api. Contoh: Wearpack, Baju tahan api, Rompi reflektif.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Alat Pelindung Jatuh Perorangan',
                'deskripsi'  => 'Mencegah cedera akibat jatuh dari ketinggian. Contoh: Full Body Harness, Safety Belt, Lanyard.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Pelampung',
                'deskripsi'  => 'Menjaga keselamatan di air dengan memberikan daya apung pada tubuh. Contoh: Life Jacket, Life Buoy.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
