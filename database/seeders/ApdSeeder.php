<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('apds')->insert([
            [
                'jenis_id'   => 1, // Alat Pelindung Kepala
                'nama_apd'   => 'Helm Pengaman (Safety Helmet)',
                'kode_apd'   => 'APD-001',
                'deskripsi'  => 'Helm digunakan untuk melindungi kepala dari benturan, kejatuhan benda, dan paparan listrik hingga 20.000V sesuai standar EN 397 / ANSI Z89.1.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'jenis_id'   => 2, // Alat Pelindung Mata dan Muka
                'nama_apd'   => 'Kacamata Pengaman (Safety Glasses)',
                'kode_apd'   => 'APD-002',
                'deskripsi'  => 'Kacamata pelindung digunakan untuk melindungi mata dari partikel, radiasi UV, dan percikan bahan kimia sesuai standar ANSI Z87.1.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'jenis_id'   => 6, // Alat Pelindung Kaki
                'nama_apd'   => 'Sepatu Pengaman (Safety Shoes)',
                'kode_apd'   => 'APD-003',
                'deskripsi'  => 'Sepatu pengaman digunakan untuk melindungi kaki dari benda berat, bahan kimia, dan bahaya listrik hingga 1000V sesuai standar EN ISO 20345.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'jenis_id'   => 8, // Alat Pelindung Jatuh Perorangan
                'nama_apd'   => 'Full Body Harness',
                'kode_apd'   => 'APD-004',
                'deskripsi'  => 'Full body harness digunakan untuk mencegah jatuh dari ketinggian, dilengkapi tali pengaman sesuai standar ANSI Z359.11.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'jenis_id'   => 9, // Pelampung
                'nama_apd'   => 'Life Jacket (Pelampung Keselamatan)',
                'kode_apd'   => 'APD-005',
                'deskripsi'  => 'Pelampung digunakan untuk keselamatan di air, memberikan daya apung sesuai standar ISO 12402-5:2020.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
