<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GarduIndukSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel gardu_induks.
     */
    public function run(): void
    {
        DB::table('gardu_induks')->insert([
            // 🔹 ULTG Krian (lokasi_id = 1)
            ['lokasi_id' => 1, 'nama_gardu_induk' => 'Kantor ULTG Krian', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 1, 'nama_gardu_induk' => 'GI BAMBE', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 1, 'nama_gardu_induk' => 'GI DRIYO', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 1, 'nama_gardu_induk' => 'GI KASHJATIM', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 1, 'nama_gardu_induk' => 'GI GITET', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 1, 'nama_gardu_induk' => 'GI KARPIL', 'created_at' => now(), 'updated_at' => now()],

            // 🔹 ULTG Malang (lokasi_id = 2)
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'Kantor ULTG Malang', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI SENGGURUH', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI LAWANG', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI SENGKALING', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI BLIMBING', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI POLEHAN', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI PAKIS', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI TUREN', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI WLINGI', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI KEBONAGUNG', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI KARANGKATES', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI NEW WLINGI', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 2, 'nama_gardu_induk' => 'GI GAMPINGAN', 'created_at' => now(), 'updated_at' => now()],

            // 🔹 ULTG Mojokerto (lokasi_id = 3)
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'Kantor ULTG Mojokerto', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI BALONGBENDO', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI MOJOAGUNG', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI NGORO', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI PLOSO', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI SEKARPUTIH', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI TJIWIKIMIA', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI AJINOMOTO', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI SIMAN', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI TARIK', 'created_at' => now(), 'updated_at' => now()],
            ['lokasi_id' => 3, 'nama_gardu_induk' => 'GI MENDALAN', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
