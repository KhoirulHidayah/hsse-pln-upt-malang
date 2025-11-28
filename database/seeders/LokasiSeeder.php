<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LokasiSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel lokasis.
     */
    public function run(): void
    {
        DB::table('lokasis')->insert([
            [
                'lokasi_id'   => 1,
                'nama_lokasi' => 'ULTG Krian',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'lokasi_id'   => 2,
                'nama_lokasi' => 'ULTG Malang',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'lokasi_id'   => 3,
                'nama_lokasi' => 'ULTG Mojokerto',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
