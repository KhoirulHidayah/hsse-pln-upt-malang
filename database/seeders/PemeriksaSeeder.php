<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PemeriksaSeeder extends Seeder
{
    public function run(): void
    {
        $gardus = DB::table('gardu_induks')->orderBy('gardu_induk_id')->get();

        // Map nama gardu → username pendek & nama lengkap
        $pemeriksa = [
            // ULTG Krian
            'Kantor ULTG Krian'     => ['name' => 'Pemeriksa ULTG Krian',       'username' => 'pemeriksa_ultg_krian'],
            'GI BAMBE'              => ['name' => 'Pemeriksa GI Bambe',          'username' => 'pemeriksa_bambe'],
            'GI DRIYO'              => ['name' => 'Pemeriksa GI Driyo',          'username' => 'pemeriksa_driyo'],
            'GI KASHJATIM'          => ['name' => 'Pemeriksa GI Kashjatim',      'username' => 'pemeriksa_kashjatim'],
            'GI GITET'              => ['name' => 'Pemeriksa GI Gitet',          'username' => 'pemeriksa_gitet'],
            'GI KARPIL'             => ['name' => 'Pemeriksa GI Karpil',         'username' => 'pemeriksa_karpil'],

            // ULTG Malang
            'Kantor ULTG Malang'    => ['name' => 'Pemeriksa ULTG Malang',       'username' => 'pemeriksa_ultg_malang'],
            'GI SENGGURUH'          => ['name' => 'Pemeriksa GI Sengguruh',      'username' => 'pemeriksa_sengguruh'],
            'GI LAWANG'             => ['name' => 'Pemeriksa GI Lawang',         'username' => 'pemeriksa_lawang'],
            'GI SENGKALING'         => ['name' => 'Pemeriksa GI Sengkaling',     'username' => 'pemeriksa_sengkaling'],
            'GI BLIMBING'           => ['name' => 'Pemeriksa GI Blimbing',       'username' => 'pemeriksa_blimbing'],
            'GI POLEHAN'            => ['name' => 'Pemeriksa GI Polehan',        'username' => 'pemeriksa_polehan'],
            'GI PAKIS'              => ['name' => 'Pemeriksa GI Pakis',          'username' => 'pemeriksa_pakis'],
            'GI TUREN'              => ['name' => 'Pemeriksa GI Turen',          'username' => 'pemeriksa_turen'],
            'GI WLINGI'             => ['name' => 'Pemeriksa GI Wlingi',         'username' => 'pemeriksa_wlingi'],
            'GI KEBONAGUNG'         => ['name' => 'Pemeriksa GI Kebonagung',     'username' => 'pemeriksa_kebonagung'],
            'GI KARANGKATES'        => ['name' => 'Pemeriksa GI Karangkates',    'username' => 'pemeriksa_karangkates'],
            'GI NEW WLINGI'         => ['name' => 'Pemeriksa GI New Wlingi',     'username' => 'pemeriksa_newwlingi'],
            'GI GAMPINGAN'          => ['name' => 'Pemeriksa GI Gampingan',      'username' => 'pemeriksa_gampingan'],

            // ULTG Mojokerto
            'Kantor ULTG Mojokerto' => ['name' => 'Pemeriksa ULTG Mojokerto',    'username' => 'pemeriksa_ultg_mojokerto'],
            'GI BALONGBENDO'        => ['name' => 'Pemeriksa GI Balongbendo',    'username' => 'pemeriksa_balongbendo'],
            'GI MOJOAGUNG'          => ['name' => 'Pemeriksa GI Mojoagung',      'username' => 'pemeriksa_mojoagung'],
            'GI NGORO'              => ['name' => 'Pemeriksa GI Ngoro',          'username' => 'pemeriksa_ngoro'],
            'GI PLOSO'              => ['name' => 'Pemeriksa GI Ploso',          'username' => 'pemeriksa_ploso'],
            'GI SEKARPUTIH'         => ['name' => 'Pemeriksa GI Sekarputih',     'username' => 'pemeriksa_sekarputih'],
            'GI TJIWIKIMIA'         => ['name' => 'Pemeriksa GI Tjiwikimia',     'username' => 'pemeriksa_tjiwikimia'],
            'GI AJINOMOTO'          => ['name' => 'Pemeriksa GI Ajinomoto',      'username' => 'pemeriksa_ajinomoto'],
            'GI SIMAN'              => ['name' => 'Pemeriksa GI Siman',          'username' => 'pemeriksa_siman'],
            'GI TARIK'              => ['name' => 'Pemeriksa GI Tarik',          'username' => 'pemeriksa_tarik'],
            'GI MENDALAN'           => ['name' => 'Pemeriksa GI Mendalan',       'username' => 'pemeriksa_mendalan'],
        ];

        foreach ($gardus as $gardu) {
            $data = $pemeriksa[$gardu->nama_gardu_induk] ?? null;
            if (!$data) continue;

            $exists = DB::table('users')->where('username', $data['username'])->exists();
            if ($exists) continue;

            DB::table('users')->insert([
                'name'              => $data['name'],
                'username'          => $data['username'],
                'email'             => null,               // pemeriksa tidak perlu email
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
                'role'              => 'pemeriksa',
                'gardu_induk_id'    => $gardu->gardu_induk_id,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }

        $this->command->info('✅ ' . count($pemeriksa) . ' user pemeriksa berhasil dibuat.');
        $this->command->info('   Password default : password123');
        $this->command->info('   Contoh login     : pemeriksa_bambe');
    }
}
